/**
 * Quiz generation and management logic
 */

import type { LearningEntry, QuizQuestion, QuizOptions, QuizResult, QuizAnswerDetail } from '../types/learning.js';

/**
 * Generate quiz questions from learning entries
 */
export function generateQuiz(entries: LearningEntry[], options: QuizOptions): QuizQuestion[] {
  // Filter entries based on options
  let filtered = entries.filter(entry => {
    if (options.category && entry.category !== options.category) return false;
    if (options.tag && !entry.tags.includes(options.tag)) return false;
    if (options.difficulty && entry.difficulty !== options.difficulty) return false;
    return entry.quizQuestions && entry.quizQuestions.length > 0;
  });

  if (filtered.length === 0) {
    return [];
  }

  // Collect all questions
  const allQuestions = filtered.flatMap(entry => entry.quizQuestions || []);

  if (allQuestions.length === 0) {
    return [];
  }

  // Select questions
  if (options.random) {
    return shuffleArray(allQuestions).slice(0, options.count);
  } else {
    return allQuestions.slice(0, options.count);
  }
}

/**
 * Shuffle array using Fisher-Yates algorithm
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
 * Calculate quiz score
 */
export function calculateScore(answers: QuizAnswerDetail[]): QuizResult {
  const correctAnswers = answers.filter(a => a.isCorrect).length;
  const wrongAnswers = answers.length - correctAnswers;
  const score = answers.length > 0 ? (correctAnswers / answers.length) * 100 : 0;

  return {
    totalQuestions: answers.length,
    correctAnswers,
    wrongAnswers,
    score: Math.round(score),
    details: answers
  };
}

/**
 * Auto-generate quiz questions for a learning entry
 * This is a simple implementation - can be enhanced with AI
 */
export function autoGenerateQuestions(entry: LearningEntry): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  // Question 1: What is the concept?
  questions.push({
    question: `What is ${entry.topic}?`,
    correctAnswer: entry.conceptLearned,
    wrongAnswers: [
      'A legacy pattern that should be avoided',
      'A proprietary technology',
      'An outdated approach'
    ],
    explanation: entry.whyItMatters || entry.conceptLearned
  });

  // Question 2: Why does it matter?
  if (entry.whyItMatters) {
    questions.push({
      question: `Why is understanding ${entry.topic} important?`,
      correctAnswer: entry.whyItMatters,
      wrongAnswers: [
        'It is not particularly important',
        'Only for specific edge cases',
        'Just for backwards compatibility'
      ],
      explanation: `${entry.whyItMatters}. Context: ${entry.context}`
    });
  }

  // Question 3: Application
  if (entry.futureApplication) {
    questions.push({
      question: `When would you apply ${entry.topic}?`,
      correctAnswer: entry.futureApplication,
      wrongAnswers: [
        'Never, it is deprecated',
        'Only in legacy systems',
        'Only as a last resort'
      ],
      explanation: entry.futureApplication
    });
  }

  return questions;
}

/**
 * Get quiz questions with entry context
 */
export function getQuestionsWithContext(entries: LearningEntry[], options: QuizOptions): Array<{ question: QuizQuestion; entry: LearningEntry }> {
  let filtered = entries.filter(entry => {
    if (options.category && entry.category !== options.category) return false;
    if (options.tag && !entry.tags.includes(options.tag)) return false;
    if (options.difficulty && entry.difficulty !== options.difficulty) return false;
    return entry.quizQuestions && entry.quizQuestions.length > 0;
  });

  const questionsWithContext = filtered.flatMap(entry =>
    (entry.quizQuestions || []).map(question => ({ question, entry }))
  );

  if (options.random) {
    return shuffleArray(questionsWithContext).slice(0, options.count);
  }

  return questionsWithContext.slice(0, options.count);
}

/**
 * Format quiz results for display
 */
export function formatQuizResults(result: QuizResult): string {
  const lines: string[] = [];
  
  lines.push('\n=== Quiz Results ===');
  lines.push(`Score: ${result.score}% (${result.correctAnswers}/${result.totalQuestions})`);
  lines.push('');

  if (result.wrongAnswers > 0) {
    lines.push('Review these concepts:');
    result.details
      .filter(d => !d.isCorrect)
      .forEach((detail, index) => {
        lines.push(`\n${index + 1}. ${detail.question}`);
        lines.push(`   Your answer: ${detail.userAnswer}`);
        lines.push(`   Correct answer: ${detail.correctAnswer}`);
        lines.push(`   Explanation: ${detail.explanation}`);
        lines.push(`   Topic: ${detail.entry.topic} (${detail.entry.category})`);
      });
  } else {
    lines.push('Perfect score! You have mastered these concepts.');
  }

  return lines.join('\n');
}
