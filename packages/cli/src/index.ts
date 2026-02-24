#!/usr/bin/env node

/**
 * Learning System CLI
 * Universal tool for managing learning entries
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init.js';
import { addCommand } from './commands/add.js';
import { listCommand } from './commands/list.js';
import { searchCommand } from './commands/search.js';
import { quizCommand } from './commands/quiz.js';
import { syncCommand } from './commands/sync.js';
import { getStats } from './lib/storage.js';

const program = new Command();

program
  .name('learning')
  .description('Universal learning system - Track and quiz your knowledge')
  .version('1.0.0');

// Init command
program
  .command('init')
  .description('Initialize LEARNING.json in your home directory')
  .action(async () => {
    await initCommand();
  });

// Add command
program
  .command('add')
  .description('Add a new learning entry')
  .option('--json <json>', 'Add entry from JSON string')
  .action(async (options) => {
    await addCommand(options);
  });

// List command
program
  .command('list')
  .description('List learning entries')
  .option('-r, --recent <count>', 'Number of recent entries to show', '10')
  .option('-c, --category <category>', 'Filter by category')
  .option('-t, --tag <tag>', 'Filter by tag')
  .option('-d, --difficulty <level>', 'Filter by difficulty (beginner, intermediate, advanced)')
  .action(async (options) => {
    await listCommand({
      recent: parseInt(options.recent),
      category: options.category,
      tag: options.tag,
      difficulty: options.difficulty
    });
  });

// Search command
program
  .command('search <query>')
  .description('Search learning entries')
  .option('-c, --category <category>', 'Filter by category')
  .option('-t, --tag <tag>', 'Filter by tag')
  .option('-d, --difficulty <level>', 'Filter by difficulty')
  .action(async (query, options) => {
    await searchCommand(query, options);
  });

// Quiz command
program
  .command('quiz')
  .description('Take a quiz from your learning entries')
  .option('-c, --category <category>', 'Quiz on specific category')
  .option('-t, --tag <tag>', 'Quiz on specific tag')
  .option('-d, --difficulty <level>', 'Quiz on specific difficulty')
  .option('-n, --count <number>', 'Number of questions', '5')
  .action(async (options) => {
    await quizCommand({
      category: options.category,
      tag: options.tag,
      difficulty: options.difficulty,
      count: parseInt(options.count)
    });
  });

// Sync commands
program
  .command('sync <action>')
  .description('Sync learning data via git (actions: init, push, pull, status, remote)')
  .option('-r, --remote <url>', 'Git remote URL (for init/remote)')
  .option('-m, --message <message>', 'Commit message (for push)')
  .action(async (action, options) => {
    await syncCommand(action, options);
  });

// Stats command
program
  .command('stats')
  .description('Show statistics about your learning data')
  .action(() => {
    try {
      const stats = getStats();
      
      console.log(chalk.blue('\n=== Learning Statistics ===\n'));
      console.log(chalk.bold('Total Entries:'), chalk.green(stats.total));
      console.log(chalk.bold('Last Updated:'), chalk.gray(new Date(stats.lastUpdated).toLocaleString()));
      
      console.log(chalk.bold('\nBy Difficulty:'));
      console.log(chalk.green(`  Beginner:     ${stats.byDifficulty.beginner}`));
      console.log(chalk.yellow(`  Intermediate: ${stats.byDifficulty.intermediate}`));
      console.log(chalk.red(`  Advanced:     ${stats.byDifficulty.advanced}`));
      
      console.log(chalk.bold('\nCategories:'), chalk.gray(stats.categories.length));
      stats.categories.slice(0, 10).forEach(cat => {
        console.log(chalk.gray(`  • ${cat} (${stats.byCategory[cat]})`));
      });
      if (stats.categories.length > 10) {
        console.log(chalk.gray(`  ... and ${stats.categories.length - 10} more`));
      }
      
      console.log(chalk.bold('\nTags:'), chalk.gray(stats.tags.length));
      stats.tags.slice(0, 15).forEach(tag => {
        console.log(chalk.gray(`  • ${tag}`));
      });
      if (stats.tags.length > 15) {
        console.log(chalk.gray(`  ... and ${stats.tags.length - 15} more`));
      }
      
      console.log('');
    } catch (error) {
      console.error(chalk.red('Failed to get stats:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// Parse arguments
program.parse();
