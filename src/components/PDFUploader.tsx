
import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, Loader2, AlertCircle, HelpCircle } from 'lucide-react';
import { PDFData } from '../pages/Index';
import { extractTextFromPDF, summarizeText } from '../utils/pdfProcessor';

interface PDFUploaderProps {
  onPDFProcessed: (data: PDFData) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const PDFUploader = ({ onPDFProcessed, isProcessing, setIsProcessing }: PDFUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Veuillez sélectionner un fichier PDF valide.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('Le fichier est trop volumineux. Limite : 10MB.');
      return;
    }

    setError(null);
    setIsProcessing(true);
    
    try {
      setProcessingStep('Extraction du texte...');
      const text = await extractTextFromPDF(file);
      
      if (!text.trim()) {
        throw new Error('Impossible d\'extraire le texte du PDF.');
      }

      setProcessingStep('Génération du résumé IA...');
      const summary = await summarizeText(text);
      
      onPDFProcessed({
        text,
        summary
      });
    } catch (err) {
      console.error('Erreur lors du traitement du PDF:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du traitement du fichier.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  }, [onPDFProcessed, setIsProcessing]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  if (isProcessing) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-violet-100">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full animate-spin opacity-20"></div>
                <div className="absolute inset-2 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Traitement en cours...
            </h3>
            <p className="text-gray-600 mb-4">{processingStep}</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-violet-500 to-blue-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Cela peut prendre quelques instants...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Téléchargez votre PDF
        </h2>
        <p className="text-gray-600 text-lg">
          Notre IA va analyser votre document et créer un résumé intelligent avec un quiz personnalisé
        </p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group ${
          isDragOver
            ? 'border-violet-400 bg-violet-50 scale-105'
            : 'border-gray-300 hover:border-violet-300 hover:bg-violet-25'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full transition-all duration-300 ${
            isDragOver 
              ? 'bg-violet-500 scale-110' 
              : 'bg-gradient-to-r from-violet-400 to-blue-400 group-hover:scale-110'
          }`}>
            {isDragOver ? (
              <FileText className="w-12 h-12 text-white" />
            ) : (
              <Upload className="w-12 h-12 text-white" />
            )}
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {isDragOver ? 'Déposez votre PDF ici' : 'Glissez-déposez votre PDF'}
            </h3>
            <p className="text-gray-600 mb-4">
              ou cliquez pour parcourir vos fichiers
            </p>
            <div className="text-sm text-gray-500">
              Formats supportés: PDF • Taille max: 10MB
            </div>
          </div>

          <button className="px-6 py-3 bg-gradient-to-r from-violet-500 to-blue-500 text-white rounded-lg font-medium hover:from-violet-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg">
            Choisir un fichier
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="mt-8 grid md:grid-cols-3 gap-6 text-center">
        <div className="p-6 bg-white rounded-xl shadow-md border border-violet-100">
          <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-violet-600" />
          </div>
          <h4 className="font-semibold text-gray-800 mb-2">Extraction Intelligente</h4>
          <p className="text-gray-600 text-sm">Analyse automatique du contenu de votre PDF</p>
        </div>
        
        <div className="p-6 bg-white rounded-xl shadow-md border border-blue-100">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h4 className="font-semibold text-gray-800 mb-2">Résumé IA</h4>
          <p className="text-gray-600 text-sm">Résumé automatique en 1/4 du texte original</p>
        </div>
        
        <div className="p-6 bg-white rounded-xl shadow-md border border-indigo-100">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-6 h-6 text-indigo-600" />
          </div>
          <h4 className="font-semibold text-gray-800 mb-2">Quiz Adaptatif</h4>
          <p className="text-gray-600 text-sm">QCM généré par niveaux de difficulté</p>
        </div>
      </div>
    </div>
  );
};

export default PDFUploader;
