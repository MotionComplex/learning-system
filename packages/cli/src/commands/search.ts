/**
 * Search command - Search learning entries
 */

import chalk from 'chalk';
import Fuse from 'fuse.js';
import { getAllEntries } from '../lib/storage.js';
import type { SearchOptions } from '../types/learning.js';

export async function searchCommand(query: string, options: Partial<SearchOptions> = {}): Promise<void> {
  try {
    let entries = getAllEntries();

    // Apply pre-filters
    if (options.category) {
      entries = entries.filter(e => e.category === options.category);
    }

    if (options.tag) {
      entries = entries.filter(e => e.tags.includes(options.tag));
    }

    if (options.difficulty) {
      entries = entries.filter(e => e.difficulty === options.difficulty);
    }

    if (entries.length === 0) {
      console.log(chalk.yellow('No entries found matching filters'));
      return;
    }

    // Fuzzy search using Fuse.js
    const fuse = new Fuse(entries, {
      keys: [
        { name: 'topic', weight: 0.3 },
        { name: 'conceptLearned', weight: 0.3 },
        { name: 'context', weight: 0.2 },
        { name: 'whyItMatters', weight: 0.1 },
        { name: 'category', weight: 0.05 },
        { name: 'tags', weight: 0.05 }
      ],
      threshold: 0.4,
      includeScore: true
    });

    const results = fuse.search(query);

    if (results.length === 0) {
      console.log(chalk.yellow(`No results found for: ${query}`));
      console.log(chalk.gray('Try a different search term or check filters'));
      return;
    }

    console.log(chalk.blue(`\nFound ${results.length} results for: "${query}"\n`));

    results.forEach((result, index) => {
      const entry = result.item;
      const score = result.score ? Math.round((1 - result.score) * 100) : 0;
      const date = new Date(entry.timestamp).toLocaleDateString();
      const difficultyColor = 
        entry.difficulty === 'beginner' ? chalk.green :
        entry.difficulty === 'intermediate' ? chalk.yellow :
        chalk.red;

      console.log(chalk.bold(`${index + 1}. ${entry.topic}`));
      console.log(chalk.gray(`   ${date} • ${entry.category} • ${difficultyColor(entry.difficulty)} • Match: ${score}%`));
      if (entry.tags.length > 0) {
        console.log(chalk.gray(`   Tags: ${entry.tags.join(', ')}`));
      }
      console.log(chalk.white(`   ${entry.conceptLearned.substring(0, 120)}${entry.conceptLearned.length > 120 ? '...' : ''}`));
      console.log(chalk.gray(`   ID: ${entry.id}`));
      console.log('');
    });

    // Show filter info
    const filters = [];
    if (options.category) filters.push(`category: ${options.category}`);
    if (options.tag) filters.push(`tag: ${options.tag}`);
    if (options.difficulty) filters.push(`difficulty: ${options.difficulty}`);
    
    if (filters.length > 0) {
      console.log(chalk.gray(`Filtered by: ${filters.join(', ')}`));
    }

  } catch (error) {
    console.error(chalk.red('Failed to search:'), error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
