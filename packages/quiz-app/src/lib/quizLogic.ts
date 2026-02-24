/**
 * Quiz generation and state management
 */

import type { LearningEntry, QuizQuestion, QuizState } from './types';

/**
 * Generate a quiz from learning entries
 */
export function generateQuiz(
  entries: LearningEntry[],
  options: {
    count?: number;
    category?: string;
    tag?: string;
    difficulty?: string;
  } = {}
): QuizState {
  // Filter entries
  let filtered = entries.filter(entry => {
    if (options.category && entry.category !== options.category) return false;
    if (options.tag && !entry.tags.includes(options.tag)) return false;
    if (options.difficulty && entry.difficulty !== options.difficulty) return false;
    return entry.quizQuestions && entry.quizQuestions.length > 0;
  });

  // Collect all questions with their entries
  const questionsWithEntries = filtered.flatMap(entry =>
    entry.quizQuestions.map(question => ({ question, entry }))
  );

  // Shuffle and limit
  const shuffled = shuffleArray(questionsWithEntries);
  const count = options.count || 5;
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return {
    questions: selected,
    currentIndex: 0,
    answers: [],
    isComplete: false
  };
}

/**
 * Shuffle array (Fisher-Yates)
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Submit an answer
 */
export function submitAnswer(
  state: QuizState,
  answer: string
): QuizState {
  const current = state.questions[state.currentIndex];
  const isCorrect = answer === current.question.correctAnswer;

  const newAnswers = [
    ...state.answers,
    {
      question: current.question.question,
      userAnswer: answer,
      correctAnswer: current.question.correctAnswer,
      isCorrect,
      explanation: current.question.explanation
    }
  ];

  const nextIndex = state.currentIndex + 1;
  const isComplete = nextIndex >= state.questions.length;

  return {
    ...state,
    currentIndex: nextIndex,
    answers: newAnswers,
    isComplete
  };
}

/**
 * Calculate quiz score
 */
export function calculateScore(state: QuizState) {
  const correct = state.answers.filter(a => a.isCorrect).length;
  const total = state.answers.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return {
    correct,
    total,
    percentage
  };
}

/**
 * Get all answer options for a question (shuffled)
 */
export function getAnswerOptions(question: QuizQuestion): string[] {
  const options = [question.correctAnswer, ...question.wrongAnswers];
  return shuffleArray(options);
}
