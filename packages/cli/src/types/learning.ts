/**
 * Type definitions for the learning system
 * Matches the schema of ~/LEARNING.json
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

export interface LearningConfig {
  dataPath: string;
  defaultDifficulty: DifficultyLevel;
  autoGenerateQuestions: boolean;
  syncEnabled: boolean;
  syncRemote?: string;
}

export interface QuizOptions {
  category?: string;
  tag?: string;
  difficulty?: DifficultyLevel;
  count: number;
  random: boolean;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  score: number;
  details: QuizAnswerDetail[];
}

export interface QuizAnswerDetail {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  entry: LearningEntry;
}

export interface SearchOptions {
  query: string;
  category?: string;
  tag?: string;
  difficulty?: DifficultyLevel;
}

export interface ListOptions {
  recent?: number;
  category?: string;
  tag?: string;
  difficulty?: DifficultyLevel;
}
