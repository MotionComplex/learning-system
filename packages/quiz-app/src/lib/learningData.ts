/**
 * Load and manage learning data
 */

import type { LearningData, LearningEntry } from './types';

const LEARNING_FILE_URL = 'http://localhost:3001/api/learning';

/**
 * Load learning data from local server
 * Note: This requires running a local dev server that can access ~/LEARNING.json
 */
export async function loadLearningData(): Promise<LearningData> {
  try {
    const response = await fetch(LEARNING_FILE_URL);
    if (!response.ok) {
      throw new Error('Failed to load learning data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading learning data:', error);
    // Return sample data for development
    return getSampleData();
  }
}

/**
 * Load learning data from file input
 */
export async function loadFromFile(file: File): Promise<LearningData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Get sample data for development/demo
 */
function getSampleData(): LearningData {
  return {
    version: '1.0',
    lastUpdated: new Date().toISOString(),
    totalEntries: 2,
    entries: [
      {
        id: 'sample-1',
        timestamp: new Date().toISOString(),
        topic: 'React useEffect Dependencies',
        category: 'react',
        tags: ['hooks', 'react', 'performance'],
        difficulty: 'intermediate',
        context: 'Working on a React application with data fetching',
        conceptLearned: 'React compares useEffect dependencies by reference, not by value. Objects and arrays are recreated on each render, causing infinite re-renders if used in dependencies.',
        whyItMatters: 'Understanding dependency comparison prevents infinite loops and performance issues in React applications.',
        futureApplication: 'Always use primitive values in dependency arrays, or memoize objects with useMemo.',
        relatedConcepts: ['useMemo', 'useCallback', 'React rendering'],
        quizQuestions: [
          {
            question: 'How does React compare values in the useEffect dependency array?',
            correctAnswer: 'By reference (===)',
            wrongAnswers: [
              'By deep equality',
              'By JSON.stringify comparison',
              'By shallow equality'
            ],
            explanation: 'React uses strict equality (===) to compare dependencies, which means objects are compared by reference, not by their contents.'
          },
          {
            question: 'What happens if you pass a newly created object in the dependency array on each render?',
            correctAnswer: 'The effect runs on every render, potentially causing infinite loops',
            wrongAnswers: [
              'React automatically memoizes the object',
              'React ignores the dependency',
              'React throws a warning but doesn\'t re-run'
            ],
            explanation: 'Since the object reference is different each time, React sees it as a new value and re-runs the effect, which can cause infinite loops if the effect updates state.'
          }
        ],
        revisitCount: 0
      },
      {
        id: 'sample-2',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        topic: 'TypeScript Generics',
        category: 'typescript',
        tags: ['typescript', 'types', 'generics'],
        difficulty: 'intermediate',
        context: 'Creating reusable utility functions',
        conceptLearned: 'TypeScript generics allow you to create type-safe reusable components and functions that work with multiple types while preserving type information.',
        whyItMatters: 'Generics enable code reuse without sacrificing type safety, making APIs more flexible and maintainable.',
        futureApplication: 'Use generics when creating utility functions, React components, or any code that should work with multiple types.',
        relatedConcepts: ['Type inference', 'Constraints', 'Default type parameters'],
        quizQuestions: [
          {
            question: 'What is the main benefit of using generics in TypeScript?',
            correctAnswer: 'Type-safe code reuse across multiple types',
            wrongAnswers: [
              'Faster runtime performance',
              'Smaller bundle size',
              'Backwards compatibility with JavaScript'
            ],
            explanation: 'Generics allow you to write functions and classes that work with any type while maintaining type safety, avoiding the need to use "any" or duplicate code.'
          },
          {
            question: 'How do you constrain a generic type parameter?',
            correctAnswer: 'Using the extends keyword: <T extends SomeType>',
            wrongAnswers: [
              'Using implements: <T implements SomeType>',
              'Using instanceof: <T instanceof SomeType>',
              'Using typeof: <T typeof SomeType>'
            ],
            explanation: 'The extends keyword allows you to specify that a generic type must satisfy certain constraints, ensuring the type has required properties or methods.'
          }
        ],
        revisitCount: 3,
        lastRevisited: new Date(Date.now() - 3600000).toISOString()
      }
    ]
  };
}

/**
 * Get statistics from learning data
 */
export function getStats(data: LearningData) {
  const byCategory: Record<string, number> = {};
  const byDifficulty = {
    beginner: 0,
    intermediate: 0,
    advanced: 0
  };

  data.entries.forEach(entry => {
    byCategory[entry.category] = (byCategory[entry.category] || 0) + 1;
    byDifficulty[entry.difficulty]++;
  });

  return {
    total: data.totalEntries,
    byCategory,
    byDifficulty,
    lastUpdated: data.lastUpdated
  };
}

/**
 * Filter entries by criteria
 */
export function filterEntries(
  entries: LearningEntry[],
  filters: {
    category?: string;
    tag?: string;
    difficulty?: string;
    search?: string;
  }
): LearningEntry[] {
  return entries.filter(entry => {
    if (filters.category && entry.category !== filters.category) return false;
    if (filters.tag && !entry.tags.includes(filters.tag)) return false;
    if (filters.difficulty && entry.difficulty !== filters.difficulty) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const searchable = [
        entry.topic,
        entry.context,
        entry.conceptLearned,
        ...entry.tags
      ].join(' ').toLowerCase();
      if (!searchable.includes(searchLower)) return false;
    }
    return true;
  });
}
