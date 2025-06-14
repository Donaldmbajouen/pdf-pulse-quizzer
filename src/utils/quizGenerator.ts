
import { pipeline } from '@huggingface/transformers';
import { Quiz, Question } from '../pages/Index';

let questionGenerator: any = null;

// Initialisation du modèle de génération de questions
const initQuestionGenerator = async () => {
  if (!questionGenerator) {
    console.log('Initialisation du modèle de génération de questions...');
    try {
      questionGenerator = await pipeline(
        'text2text-generation',
        'Xenova/flan-t5-small',
        { device: 'webgpu' }
      );
    } catch (error) {
      console.warn('WebGPU non disponible, utilisation du CPU:', error);
      questionGenerator = await pipeline(
        'text2text-generation',
        'Xenova/flan-t5-small'
      );
    }
  }
  return questionGenerator;
};

// Templates de questions par niveau de difficulté
const questionTemplates = {
  easy: [
    "Qu'est-ce que",
    "Qui est",
    "Où se trouve",
    "Quand a eu lieu",
    "Combien de",
    "Quel est le nom de"
  ],
  medium: [
    "Pourquoi",
    "Comment",
    "Quelles sont les causes de",
    "Quels sont les effets de",
    "Quelle est la relation entre",
    "Compare"
  ],
  hard: [
    "Analysez",
    "Évaluez",
    "Critiquez",
    "Synthétisez",
    "Quelle serait l'impact de",
    "Si... alors"
  ]
};

// Fonction pour extraire les concepts clés du texte
const extractKeyConcepts = (text: string): string[] => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const concepts: string[] = [];
  
  // Extraction simple basée sur les mots-clés importants
  const keywords = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 4)
    .filter((word, index, arr) => arr.indexOf(word) === index)
    .slice(0, 20);
  
  // Sélectionner des phrases contenant des mots-clés importants
  sentences.forEach(sentence => {
    const sentenceLower = sentence.toLowerCase();
    const keywordCount = keywords.filter(keyword => 
      sentenceLower.includes(keyword)
    ).length;
    
    if (keywordCount >= 2) {
      concepts.push(sentence.trim());
    }
  });
  
  return concepts.slice(0, 15);
};

// Génération de distracteurs (mauvaises réponses)
const generateDistractors = (correctAnswer: string, context: string): string[] => {
  const distractors: string[] = [];
  
  // Techniques de génération de distracteurs
  const techniques = [
    // Variation numérique
    (answer: string) => {
      const numbers = answer.match(/\d+/g);
      if (numbers) {
        const num = parseInt(numbers[0]);
        return answer.replace(numbers[0], (num + Math.floor(Math.random() * 10) + 1).toString());
      }
      return null;
    },
    
    // Concepts similaires du contexte
    (answer: string) => {
      const words = context.toLowerCase().split(/\s+/);
      const answerWords = answer.toLowerCase().split(/\s+/);
      const contextWords = words.filter(word => 
        word.length > 4 && 
        !answerWords.includes(word) &&
        /^[a-zA-Z]+$/.test(word)
      );
      
      if (contextWords.length > 0) {
        const randomWord = contextWords[Math.floor(Math.random() * contextWords.length)];
        return randomWord.charAt(0).toUpperCase() + randomWord.slice(1);
      }
      return null;
    },
    
    // Négation ou contraire
    (answer: string) => {
      const opposites: Record<string, string> = {
        'oui': 'non',
        'vrai': 'faux',
        'augmente': 'diminue',
        'plus': 'moins',
        'avant': 'après',
        'positif': 'négatif'
      };
      
      for (const [word, opposite] of Object.entries(opposites)) {
        if (answer.toLowerCase().includes(word)) {
          return answer.toLowerCase().replace(word, opposite);
        }
      }
      return null;
    }
  ];
  
  // Appliquer les techniques
  techniques.forEach(technique => {
    const distractor = technique(correctAnswer);
    if (distractor && distractor !== correctAnswer && !distractors.includes(distractor)) {
      distractors.push(distractor);
    }
  });
  
  // Compléter avec des distracteurs génériques si nécessaire
  const genericDistractors = [
    "Aucune des réponses ci-dessus",
    "Toutes les réponses ci-dessus",
    "Impossible à déterminer",
    "Données insuffisantes"
  ];
  
  while (distractors.length < 3) {
    const generic = genericDistractors[distractors.length % genericDistractors.length];
    if (!distractors.includes(generic)) {
      distractors.push(generic);
    }
  }
  
  return distractors.slice(0, 3);
};

// Génération d'une question basée sur un concept
const generateQuestionFromConcept = async (
  concept: string, 
  difficulty: 'easy' | 'medium' | 'hard',
  context: string
): Promise<Question | null> => {
  try {
    const templates = questionTemplates[difficulty];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // Création de la question basée sur le concept
    let question = '';
    let correctAnswer = '';
    let explanation = '';
    
    if (difficulty === 'easy') {
      // Questions faciles - compréhension directe
      if (concept.includes('est') || concept.includes('sont')) {
        const parts = concept.split(/\s+est\s+|\s+sont\s+/);
        if (parts.length >= 2) {
          question = `${template} ${parts[0].trim()} ?`;
          correctAnswer = parts[1].trim();
          explanation = `D'après le texte : ${concept}`;
        }
      } else {
        question = `${template} mentionné dans le passage suivant : "${concept.substring(0, 100)}..." ?`;
        const words = concept.split(' ');
        correctAnswer = words[Math.floor(words.length / 2)];
        explanation = `Cette information est directement mentionnée dans le texte.`;
      }
    } else if (difficulty === 'medium') {
      // Questions moyennes - analyse et connexions
      question = `${template} selon le contexte présenté ?`;
      correctAnswer = concept.split(' ').slice(0, 5).join(' ');
      explanation = `Cette réponse peut être déduite en analysant le contexte fourni.`;
    } else {
      // Questions difficiles - synthèse et évaluation
      question = `${template} l'impact de ce qui est décrit : "${concept.substring(0, 80)}..." ?`;
      correctAnswer = "Impact significatif sur le domaine étudié";
      explanation = `Cette question nécessite une analyse approfondie des implications présentées.`;
    }
    
    if (!question || !correctAnswer) {
      return null;
    }
    
    // Génération des distracteurs
    const distractors = generateDistractors(correctAnswer, context);
    const options = [correctAnswer, ...distractors].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(correctAnswer);
    
    return {
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question,
      options,
      correctAnswer: correctIndex,
      explanation
    };
    
  } catch (error) {
    console.error('Erreur lors de la génération de question:', error);
    return null;
  }
};

export const generateQuiz = async (summaryText: string): Promise<Quiz> => {
  console.log('Génération du quiz à partir du résumé...');
  
  try {
    // Extraction des concepts clés
    const concepts = extractKeyConcepts(summaryText);
    console.log(`${concepts.length} concepts extraits pour le quiz`);
    
    const quiz: Quiz = {
      title: "Quiz basé sur le résumé IA",
      levels: {
        easy: [],
        medium: [],
        hard: []
      }
    };
    
    // Génération des questions par niveau
    const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];
    const questionsPerLevel = Math.min(5, Math.ceil(concepts.length / 3));
    
    for (const difficulty of difficulties) {
      console.log(`Génération des questions de niveau ${difficulty}...`);
      
      const conceptsForLevel = concepts.slice(
        difficulties.indexOf(difficulty) * questionsPerLevel,
        (difficulties.indexOf(difficulty) + 1) * questionsPerLevel
      );
      
      for (const concept of conceptsForLevel) {
        const question = await generateQuestionFromConcept(concept, difficulty, summaryText);
        if (question) {
          quiz.levels[difficulty].push(question);
        }
        
        // Limite de sécurité
        if (quiz.levels[difficulty].length >= questionsPerLevel) {
          break;
        }
      }
      
      // S'assurer qu'il y a au moins 3 questions par niveau
      while (quiz.levels[difficulty].length < 3 && concepts.length > 0) {
        const randomConcept = concepts[Math.floor(Math.random() * concepts.length)];
        const question = await generateQuestionFromConcept(randomConcept, difficulty, summaryText);
        if (question && !quiz.levels[difficulty].find(q => q.question === question.question)) {
          quiz.levels[difficulty].push(question);
        }
      }
    }
    
    console.log('Quiz généré avec succès:', {
      easy: quiz.levels.easy.length,
      medium: quiz.levels.medium.length,
      hard: quiz.levels.hard.length
    });
    
    return quiz;
    
  } catch (error) {
    console.error('Erreur lors de la génération du quiz:', error);
    
    // Fallback : quiz basique
    return {
      title: "Quiz de compréhension",
      levels: {
        easy: [
          {
            id: 'fallback_1',
            question: "Quel est le sujet principal du document ?",
            options: ["Sujet technique", "Sujet général", "Sujet spécialisé", "Autre sujet"],
            correctAnswer: 0,
            explanation: "Basé sur l'analyse du contenu du document."
          },
          {
            id: 'fallback_2',
            question: "Le document présente-t-il des informations détaillées ?",
            options: ["Oui, très détaillées", "Partiellement", "Non, superficielles", "Impossible à dire"],
            correctAnswer: 0,
            explanation: "Le résumé indique un contenu riche en informations."
          },
          {
            id: 'fallback_3',
            question: "Quelle est la structure du document ?",
            options: ["Bien structuré", "Moyennement structuré", "Peu structuré", "Sans structure"],
            correctAnswer: 0,
            explanation: "D'après l'analyse automatique de la structure."
          }
        ],
        medium: [
          {
            id: 'fallback_4',
            question: "Quelles sont les implications principales du contenu ?",
            options: ["Implications pratiques", "Implications théoriques", "Implications mixtes", "Aucune implication"],
            correctAnswer: 2,
            explanation: "Le contenu présente généralement des aspects pratiques et théoriques."
          },
          {
            id: 'fallback_5',
            question: "Comment les concepts sont-ils reliés entre eux ?",
            options: ["Liens logiques clairs", "Liens partiels", "Liens faibles", "Aucun lien"],
            correctAnswer: 0,
            explanation: "Un document bien structuré présente des liens logiques entre concepts."
          },
          {
            id: 'fallback_6',
            question: "Quel niveau de complexité présente le document ?",
            options: ["Complexité élevée", "Complexité modérée", "Complexité faible", "Variable"],
            correctAnswer: 3,
            explanation: "La complexité peut varier selon les sections du document."
          }
        ],
        hard: [
          {
            id: 'fallback_7',
            question: "Quelle serait l'application pratique de ces informations ?",
            options: ["Applications multiples", "Application spécifique", "Application limitée", "Aucune application"],
            correctAnswer: 0,
            explanation: "Un contenu riche offre généralement de multiples possibilités d'application."
          },
          {
            id: 'fallback_8',
            question: "Comment évalueriez-vous la pertinence du contenu ?",
            options: ["Très pertinent", "Moyennement pertinent", "Peu pertinent", "Non pertinent"],
            correctAnswer: 0,
            explanation: "Un document analysé en détail est généralement pertinent pour son domaine."
          },
          {
            id: 'fallback_9',
            question: "Quelles seraient les limitations de cette approche ?",
            options: ["Limitations contextuelles", "Limitations techniques", "Limitations méthodologiques", "Toutes les précédentes"],
            correctAnswer: 3,
            explanation: "Toute approche présente différents types de limitations qu'il faut considérer."
          }
        ]
      }
    };
  }
};
