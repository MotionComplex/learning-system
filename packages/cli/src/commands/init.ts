/**
 * Initialize command - Set up LEARNING.json
 */

import chalk from 'chalk';
import { initializeLearningFile, learningFileExists, getLearningFilePath } from '../lib/storage.js';

export async function initCommand(): Promise<void> {
  console.log(chalk.blue('Initializing learning system...'));

  if (learningFileExists()) {
    console.log(chalk.yellow('LEARNING.json already exists at:'));
    console.log(chalk.gray(getLearningFilePath()));
    console.log(chalk.green('✓ System already initialized'));
    return;
  }

  try {
    initializeLearningFile();
    console.log(chalk.green('✓ Created LEARNING.json at:'));
    console.log(chalk.gray(getLearningFilePath()));
    console.log('');
    console.log(chalk.blue('Next steps:'));
    console.log('  learning add     - Add your first learning entry');
    console.log('  learning quiz    - Test your knowledge');
    console.log('  learning --help  - See all available commands');
  } catch (error) {
    console.error(chalk.red('Failed to initialize:'), error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
