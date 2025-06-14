
import { useState } from 'react';
import PDFUploader from '../components/PDFUploader';
import SummaryViewer from '../components/SummaryViewer';
import QuizGenerator from '../components/QuizGenerator';
import { FileText, Brain, HelpCircle } from 'lucide-react';

export interface PDFData {
  text: string;
  summary: string;
  quiz?: Quiz;
}

export interface Quiz {
  title: string;
  levels: {
    easy: Question[];
    medium: Question[];
    hard: Question[];
  };
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'summary' | 'quiz'>('upload');
  const [pdfData, setPdfData] = useState<PDFData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePDFProcessed = (data: PDFData) => {
    setPdfData(data);
    setCurrentStep('summary');
  };

  const handleGenerateQuiz = async (quiz: Quiz) => {
    if (pdfData) {
      setPdfData({ ...pdfData, quiz });
      setCurrentStep('quiz');
    }
  };

  const resetApp = () => {
    setPdfData(null);
    setCurrentStep('upload');
    setIsProcessing(false);
  };

  const steps = [
    { id: 'upload', label: 'Télécharger PDF', icon: FileText, active: currentStep === 'upload' },
    { id: 'summary', label: 'Résumé IA', icon: Brain, active: currentStep === 'summary' },
    { id: 'quiz', label: 'QCM Génératif', icon: HelpCircle, active: currentStep === 'quiz' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-indigo-100">
      {/* Header avec navigation */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-violet-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-violet-500 to-blue-500 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                PDF Pulse Quizzer
              </h1>
            </div>
            {pdfData && (
              <button
                onClick={resetApp}
                className="px-4 py-2 text-sm text-violet-600 hover:text-violet-800 transition-colors"
              >
                Nouveau PDF
              </button>
            )}
          </div>
          
          {/* Barre de progression */}
          <div className="mt-4 flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                  step.active 
                    ? 'bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-lg' 
                    : 'bg-white/60 text-gray-600'
                }`}>
                  <step.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`mx-2 h-0.5 w-8 transition-colors ${
                    index < steps.findIndex(s => s.active) ? 'bg-violet-300' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto px-6 py-8">
        {currentStep === 'upload' && (
          <PDFUploader 
            onPDFProcessed={handlePDFProcessed}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        )}
        
        {currentStep === 'summary' && pdfData && (
          <SummaryViewer 
            pdfData={pdfData}
            onGenerateQuiz={handleGenerateQuiz}
          />
        )}
        
        {currentStep === 'quiz' && pdfData?.quiz && (
          <QuizGenerator 
            quiz={pdfData.quiz}
            onBack={() => setCurrentStep('summary')}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
