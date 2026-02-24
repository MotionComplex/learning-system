/**
 * Validation logic for learning entries
 * Ensures entries contain general, transferable knowledge
 */

import type { LearningEntry, DifficultyLevel } from '../types/learning.js';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

/**
 * Validate a learning entry
 */
export function validateEntry(entry: Partial<LearningEntry>): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    suggestions: []
  };

  // Required fields
  if (!entry.topic || entry.topic.trim().length === 0) {
    result.errors.push('Topic is required');
    result.isValid = false;
  }

  if (!entry.category || entry.category.trim().length === 0) {
    result.errors.push('Category is required');
    result.isValid = false;
  }

  if (!entry.conceptLearned || entry.conceptLearned.trim().length === 0) {
    result.errors.push('Concept learned is required');
    result.isValid = false;
  }

  if (!entry.context || entry.context.trim().length === 0) {
    result.errors.push('Context is required');
    result.isValid = false;
  }

  // Check for general vs specific knowledge
  const qualityCheck = checkEntryQuality(entry);
  result.warnings.push(...qualityCheck.warnings);
  result.suggestions.push(...qualityCheck.suggestions);

  // Validate difficulty
  if (entry.difficulty && !['beginner', 'intermediate', 'advanced'].includes(entry.difficulty)) {
    result.errors.push('Difficulty must be: beginner, intermediate, or advanced');
    result.isValid = false;
  }

  // Validate quiz questions if present
  if (entry.quizQuestions && entry.quizQuestions.length > 0) {
    for (let i = 0; i < entry.quizQuestions.length; i++) {
      const q = entry.quizQuestions[i];
      if (!q.question || q.question.trim().length === 0) {
        result.errors.push(`Quiz question ${i + 1}: Question text is required`);
        result.isValid = false;
      }
      if (!q.correctAnswer || q.correctAnswer.trim().length === 0) {
        result.errors.push(`Quiz question ${i + 1}: Correct answer is required`);
        result.isValid = false;
      }
      if (!q.wrongAnswers || q.wrongAnswers.length < 2) {
        result.errors.push(`Quiz question ${i + 1}: At least 2 wrong answers are required`);
        result.isValid = false;
      }
    }
  }

  return result;
}

/**
 * Check if entry contains general, transferable knowledge
 */
function checkEntryQuality(entry: Partial<LearningEntry>): Pick<ValidationResult, 'warnings' | 'suggestions'> {
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Patterns that suggest too-specific knowledge
  const specificPatterns = [
    /file:\/\//i,
    /line \d+/i,
    /\.\/\w+/,
    /\/Users\//i,
    /\/home\//i,
    /C:\\/i,
    /this project/i,
    /our codebase/i,
    /the bug/i,
    /the error/i,
    /localhost/i,
    /127\.0\.0\.1/,
    /port \d+/i
  ];

  const contextText = [
    entry.topic || '',
    entry.context || '',
    entry.conceptLearned || ''
  ].join(' ').toLowerCase();

  for (const pattern of specificPatterns) {
    if (pattern.test(contextText)) {
      warnings.push('Entry may be too specific to a single project or debugging session');
      suggestions.push('Consider extracting the general principle that applies across projects');
      break;
    }
  }

  // Check length - too short might lack depth
  if (entry.conceptLearned && entry.conceptLearned.length < 30) {
    warnings.push('Concept learned seems brief - consider adding more depth');
  }

  // Check for "why it matters"
  if (!entry.whyItMatters || entry.whyItMatters.trim().length === 0) {
    suggestions.push('Adding "why it matters" helps reinforce the learning');
  }

  // Check for future application
  if (!entry.futureApplication || entry.futureApplication.trim().length === 0) {
    suggestions.push('Adding "future application" helps with retention');
  }

  // Check for related concepts
  if (!entry.relatedConcepts || entry.relatedConcepts.length === 0) {
    suggestions.push('Adding related concepts helps build connections');
  }

  return { warnings, suggestions };
}

/**
 * Validate difficulty level
 */
export function isValidDifficulty(difficulty: string): difficulty is DifficultyLevel {
  return ['beginner', 'intermediate', 'advanced'].includes(difficulty);
}

/**
 * Generate ID for a new entry
 */
export function generateEntryId(): string {
  return `entry_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Sanitize input text
 */
export function sanitizeText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

/**
 * Validate and prepare entry for storage
 */
export function prepareEntry(entry: Partial<LearningEntry>): LearningEntry {
  const validation = validateEntry(entry);
  
  if (!validation.isValid) {
    throw new Error(`Invalid entry: ${validation.errors.join(', ')}`);
  }

  return {
    id: entry.id || generateEntryId(),
    timestamp: entry.timestamp || new Date().toISOString(),
    topic: sanitizeText(entry.topic!),
    category: sanitizeText(entry.category!),
    tags: entry.tags || [],
    difficulty: entry.difficulty || 'intermediate',
    context: sanitizeText(entry.context!),
    conceptLearned: sanitizeText(entry.conceptLearned!),
    whyItMatters: sanitizeText(entry.whyItMatters || ''),
    futureApplication: sanitizeText(entry.futureApplication || ''),
    relatedConcepts: entry.relatedConcepts || [],
    quizQuestions: entry.quizQuestions || [],
    revisitCount: entry.revisitCount || 0,
    lastRevisited: entry.lastRevisited
  };
}
