
import * as pdfjsLib from 'pdfjs-dist';
import { pipeline } from '@huggingface/transformers';

// Configuration de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

let summarizer: any = null;

// Initialisation du modèle de résumé
const initSummarizer = async () => {
  if (!summarizer) {
    console.log('Initialisation du modèle de résumé...');
    try {
      summarizer = await pipeline(
        'summarization',
        'Xenova/distilbart-cnn-12-6',
        { device: 'webgpu' }
      );
    } catch (error) {
      console.warn('WebGPU non disponible, utilisation du CPU:', error);
      summarizer = await pipeline(
        'summarization',
        'Xenova/distilbart-cnn-12-6'
      );
    }
  }
  return summarizer;
};

export const extractTextFromPDF = async (file: File): Promise<string> => {
  console.log('Extraction du texte du PDF...');
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    // Nettoyage du texte
    const cleanedText = fullText
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();
    
    console.log(`Texte extrait: ${cleanedText.length} caractères`);
    return cleanedText;
  } catch (error) {
    console.error('Erreur lors de l\'extraction du PDF:', error);
    throw new Error('Impossible d\'extraire le texte du PDF. Assurez-vous que le fichier n\'est pas protégé.');
  }
};

export const summarizeText = async (text: string): Promise<string> => {
  console.log('Génération du résumé...');
  
  try {
    const model = await initSummarizer();
    
    // Diviser le texte en chunks pour respecter les limites du modèle
    const maxChunkLength = 1000; // Longueur maximale par chunk
    const chunks = [];
    
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    let currentChunk = '';
    
    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > maxChunkLength && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += sentence + '. ';
      }
    }
    
    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }
    
    console.log(`Traitement de ${chunks.length} chunks de texte...`);
    
    // Résumer chaque chunk
    const summaries = await Promise.all(
      chunks.map(async (chunk, index) => {
        console.log(`Résumé du chunk ${index + 1}/${chunks.length}...`);
        const result = await model(chunk, {
          max_length: 150,
          min_length: 30,
          do_sample: false,
        });
        return result[0].summary_text;
      })
    );
    
    // Combiner les résumés
    let finalSummary = summaries.join(' ');
    
    // Si le résumé combiné est encore trop long, le résumer une dernière fois
    if (finalSummary.length > text.length / 2) {
      console.log('Résumé final...');
      const finalResult = await model(finalSummary, {
        max_length: Math.max(100, Math.floor(text.split(' ').length / 4)),
        min_length: 50,
        do_sample: false,
      });
      finalSummary = finalResult[0].summary_text;
    }
    
    console.log(`Résumé généré: ${finalSummary.length} caractères`);
    return finalSummary;
    
  } catch (error) {
    console.error('Erreur lors de la génération du résumé:', error);
    
    // Fallback: résumé basique en prenant les premières phrases importantes
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const targetLength = Math.floor(text.split(' ').length / 4);
    let summary = '';
    let wordCount = 0;
    
    for (const sentence of sentences) {
      const sentenceWords = sentence.split(' ').length;
      if (wordCount + sentenceWords <= targetLength) {
        summary += sentence.trim() + '. ';
        wordCount += sentenceWords;
      } else {
        break;
      }
    }
    
    return summary.trim() || 'Résumé automatique non disponible. Veuillez réessayer.';
  }
};
