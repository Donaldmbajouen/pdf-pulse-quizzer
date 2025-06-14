
import { useState } from 'react';
import { FileText, Clock, ArrowRight, Sparkles, BarChart3 } from 'lucide-react';
import { PDFData, Quiz } from '../pages/Index';
import { generateQuiz } from '../utils/quizGenerator';

interface SummaryViewerProps {
  pdfData: PDFData;
  onGenerateQuiz: (quiz: Quiz) => void;
}

const SummaryViewer = ({ pdfData, onGenerateQuiz }: SummaryViewerProps) => {
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  const handleGenerateQuiz = async () => {
    setIsGeneratingQuiz(true);
    try {
      const quiz = await generateQuiz(pdfData.summary);
      onGenerateQuiz(quiz);
    } catch (error) {
      console.error('Erreur lors de la génération du quiz:', error);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const wordCount = pdfData.text.split(/\s+/).length;
  const summaryWordCount = pdfData.summary.split(/\s+/).length;
  const compressionRatio = Math.round((summaryWordCount / wordCount) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* En-tête avec statistiques */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-violet-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Résumé Intelligent
            </h2>
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <FileText className="w-4 h-4" />
              <span>{wordCount.toLocaleString()} mots originaux</span>
            </div>
            <div className="flex items-center space-x-2 text-violet-600">
              <BarChart3 className="w-4 h-4" />
              <span>{compressionRatio}% de compression</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-600">
              <Clock className="w-4 h-4" />
              <span>~{Math.ceil(summaryWordCount / 200)} min de lecture</span>
            </div>
          </div>
        </div>

        {/* Barre de progression de compression */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Texte original</span>
            <span>Résumé IA ({compressionRatio}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-violet-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${compressionRatio}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Contenu du résumé */}
      <div className="bg-white rounded-2xl shadow-xl border border-violet-100 overflow-hidden">
        <div className="bg-gradient-to-r from-violet-50 to-blue-50 px-6 py-4 border-b border-violet-100">
          <h3 className="text-lg font-semibold text-gray-800">
            Contenu résumé par IA
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Version condensée générée automatiquement
          </p>
        </div>
        
        <div className="p-6">
          <div className="prose prose-lg max-w-none">
            {pdfData.summary.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed mb-4 text-justify">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center">
        <button
          onClick={handleGenerateQuiz}
          disabled={isGeneratingQuiz}
          className="group relative px-8 py-4 bg-gradient-to-r from-violet-500 to-blue-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:from-violet-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <div className="flex items-center space-x-3">
            {isGeneratingQuiz ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Génération du Quiz...</span>
              </>
            ) : (
              <>
                <span>Créer le Quiz Intelligent</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </div>
          
          {!isGeneratingQuiz && (
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
          )}
        </button>
      </div>

      {/* Aperçu des fonctionnalités du quiz */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-green-100">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">F</span>
            </div>
          </div>
          <h4 className="font-semibold text-gray-800 mb-2">Niveau Facile</h4>
          <p className="text-gray-600 text-sm">Questions de compréhension générale</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-md border border-yellow-100">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
          </div>
          <h4 className="font-semibold text-gray-800 mb-2">Niveau Moyen</h4>
          <p className="text-gray-600 text-sm">Questions d'analyse et de connexion</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-md border border-red-100">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">D</span>
            </div>
          </div>
          <h4 className="font-semibold text-gray-800 mb-2">Niveau Difficile</h4>
          <p className="text-gray-600 text-sm">Questions de synthèse et d'évaluation</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryViewer;
