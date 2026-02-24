/**
 * Types for learning data (matching CLI types)
 */

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface QuizQuestion {
  question: string;
  correctAnswer: string;
  wrongAnswers: string[];
  explanation: string;
}

export interface LearningEntry {
  id: string;
  timestamp: string;
  topic: string;
  category: string;
  tags: string[];
  difficulty: DifficultyLevel;
  context: string;
  conceptLearned: string;
  whyItMatters: string;
  futureApplication: string;
  relatedConcepts: string[];
  quizQuestions: QuizQuestion[];
  revisitCount?: number;
  lastRevisited?: string;
}

export interface LearningData {
  version: string;
  lastUpdated: string;
  totalEntries: number;
  entries: LearningEntry[];
}

export interface QuizState {
  questions: Array<{ question: QuizQuestion; entry: LearningEntry }>;
  currentIndex: number;
  answers: Array<{
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }>;
  isComplete: boolean;
}
