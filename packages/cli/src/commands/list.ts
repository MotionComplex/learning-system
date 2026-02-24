/**
 * List command - List learning entries
 */

import chalk from 'chalk';
import { getAllEntries } from '../lib/storage.js';
import type { ListOptions } from '../types/learning.js';

export async function listCommand(options: ListOptions): Promise<void> {
  try {
    let entries = getAllEntries();

    // Apply filters
    if (options.category) {
      entries = entries.filter(e => e.category === options.category);
    }

    if (options.tag) {
      entries = entries.filter(e => e.tags.includes(options.tag));
    }

    if (options.difficulty) {
      entries = entries.filter(e => e.difficulty === options.difficulty);
    }

    // Limit to recent N
    const limit = options.recent || 10;
    entries = entries.slice(0, limit);

    if (entries.length === 0) {
      console.log(chalk.yellow('No entries found'));
      return;
    }

    console.log(chalk.blue(`\nShowing ${entries.length} entries:\n`));

    entries.forEach((entry, index) => {
      const date = new Date(entry.timestamp).toLocaleDateString();
      const difficultyColor = 
        entry.difficulty === 'beginner' ? chalk.green :
        entry.difficulty === 'intermediate' ? chalk.yellow :
        chalk.red;

      console.log(chalk.bold(`${index + 1}. ${entry.topic}`));
      console.log(chalk.gray(`   ${date} • ${entry.category} • ${difficultyColor(entry.difficulty)}`));
      if (entry.tags.length > 0) {
        console.log(chalk.gray(`   Tags: ${entry.tags.join(', ')}`));
      }
      console.log(chalk.white(`   ${entry.conceptLearned.substring(0, 100)}${entry.conceptLearned.length > 100 ? '...' : ''}`));
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
    console.error(chalk.red('Failed to list entries:'), error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
