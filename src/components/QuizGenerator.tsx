
import { useState } from 'react';
import { Quiz, Question } from '../pages/Index';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Trophy, Target } from 'lucide-react';

interface QuizGeneratorProps {
  quiz: Quiz;
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';

const QuizGenerator = ({ quiz, onBack }: QuizGeneratorProps) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestions = quiz.levels[selectedDifficulty];
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const totalQuestions = currentQuestions.length;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerIndex
    }));
  };

  const handleNext = () => {
    if (!showExplanation) {
      setShowExplanation(true);
      return;
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    currentQuestions.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return { correct, total: totalQuestions, percentage: Math.round((correct / totalQuestions) * 100) };
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const changeDifficulty = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    resetQuiz();
  };

  const difficultyConfig = {
    easy: { label: 'Facile', color: 'green', bgColor: 'bg-green-500', borderColor: 'border-green-200' },
    medium: { label: 'Moyen', color: 'yellow', bgColor: 'bg-yellow-500', borderColor: 'border-yellow-200' },
    hard: { label: 'Difficile', color: 'red', bgColor: 'bg-red-500', borderColor: 'border-red-200' }
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-violet-100 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Terminé !</h2>
            <p className="text-gray-600">Niveau {difficultyConfig[selectedDifficulty].label}</p>
          </div>

          <div className="bg-gradient-to-r from-violet-50 to-blue-50 rounded-xl p-6 mb-6">
            <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text mb-2">
              {score.percentage}%
            </div>
            <p className="text-gray-700">
              {score.correct} bonnes réponses sur {score.total}
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={resetQuiz}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-blue-500 text-white rounded-lg hover:from-violet-600 hover:to-blue-600 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Recommencer</span>
            </button>
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour au résumé</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête avec sélecteur de difficulté */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-violet-100">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour au résumé</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-violet-600" />
            <span className="text-gray-600">Question {currentQuestionIndex + 1} / {totalQuestions}</span>
          </div>
        </div>

        <div className="flex space-x-4 mb-4">
          {(Object.keys(difficultyConfig) as Difficulty[]).map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => changeDifficulty(difficulty)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedDifficulty === difficulty
                  ? `${difficultyConfig[difficulty].bgColor} text-white shadow-lg`
                  : `bg-gray-100 text-gray-600 hover:bg-gray-200`
              }`}
            >
              {difficultyConfig[difficulty].label}
            </button>
          ))}
        </div>

        {/* Barre de progression */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-violet-500 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question actuelle */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-violet-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const showCorrectness = showExplanation;
            
            let buttonClass = "w-full p-4 text-left border-2 rounded-lg transition-all hover:shadow-md ";
            
            if (showCorrectness) {
              if (isCorrect) {
                buttonClass += "border-green-500 bg-green-50 text-green-800";
              } else if (isSelected && !isCorrect) {
                buttonClass += "border-red-500 bg-red-50 text-red-800";
              } else {
                buttonClass += "border-gray-200 bg-gray-50 text-gray-600";
              }
            } else {
              buttonClass += isSelected 
                ? "border-violet-500 bg-violet-50 text-violet-800"
                : "border-gray-200 hover:border-violet-300 text-gray-700";
            }

            return (
              <button
                key={index}
                onClick={() => !showExplanation && handleAnswerSelect(index)}
                disabled={showExplanation}
                className={buttonClass}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showCorrectness && (
                    <div className="flex-shrink-0 ml-2">
                      {isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Explication :</h4>
            <p className="text-blue-800">{currentQuestion.explanation}</p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="px-6 py-3 bg-gradient-to-r from-violet-500 to-blue-500 text-white rounded-lg font-medium hover:from-violet-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {showExplanation
              ? currentQuestionIndex === totalQuestions - 1
                ? "Voir les résultats"
                : "Question suivante"
              : "Valider la réponse"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizGenerator;
