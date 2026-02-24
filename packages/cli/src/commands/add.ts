/**
 * Add command - Add a new learning entry
 */

import chalk from 'chalk';
import inquirer from 'inquirer';
import { addEntry } from '../lib/storage.js';
import { prepareEntry, validateEntry } from '../lib/validation.js';
import { autoGenerateQuestions } from '../lib/quiz-engine.js';
import type { LearningEntry, DifficultyLevel } from '../types/learning.js';

interface AddOptions {
  json?: string;
  interactive?: boolean;
}

export async function addCommand(options: AddOptions): Promise<void> {
  if (options.json) {
    await addFromJson(options.json);
  } else {
    await addInteractive();
  }
}

async function addFromJson(jsonString: string): Promise<void> {
  try {
    const data = JSON.parse(jsonString);
    
    // Validate
    const validation = validateEntry(data);
    
    if (!validation.isValid) {
      console.error(chalk.red('Validation failed:'));
      validation.errors.forEach(err => console.error(chalk.red('  ✗'), err));
      process.exit(1);
    }

    // Show warnings and suggestions
    if (validation.warnings.length > 0) {
      console.log(chalk.yellow('⚠ Warnings:'));
      validation.warnings.forEach(warn => console.log(chalk.yellow('  !'), warn));
    }

    if (validation.suggestions.length > 0) {
      console.log(chalk.blue('💡 Suggestions:'));
      validation.suggestions.forEach(sug => console.log(chalk.blue('  →'), sug));
    }

    // Auto-generate quiz questions if not provided
    if (!data.quizQuestions || data.quizQuestions.length === 0) {
      console.log(chalk.blue('Generating quiz questions...'));
      const tempEntry = prepareEntry(data);
      data.quizQuestions = autoGenerateQuestions(tempEntry);
    }

    const entry = prepareEntry(data);
    addEntry(entry);

    console.log(chalk.green('✓ Learning entry added successfully'));
    console.log(chalk.gray(`  ID: ${entry.id}`));
    console.log(chalk.gray(`  Topic: ${entry.topic}`));
    console.log(chalk.gray(`  Category: ${entry.category}`));
  } catch (error) {
    console.error(chalk.red('Failed to add entry:'), error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

async function addInteractive(): Promise<void> {
  console.log(chalk.blue('Add a new learning entry'));
  console.log(chalk.gray('Focus on general, transferable knowledge that applies across projects\n'));

  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'topic',
        message: 'What is the topic?',
        validate: (input: string) => input.trim().length > 0 || 'Topic is required'
      },
      {
        type: 'input',
        name: 'category',
        message: 'Category (e.g., react, typescript, git, architecture):',
        validate: (input: string) => input.trim().length > 0 || 'Category is required'
      },
      {
        type: 'input',
        name: 'tags',
        message: 'Tags (comma-separated):',
        filter: (input: string) => input.split(',').map(t => t.trim()).filter(t => t.length > 0)
      },
      {
        type: 'list',
        name: 'difficulty',
        message: 'Difficulty level:',
        choices: ['beginner', 'intermediate', 'advanced'],
        default: 'intermediate'
      },
      {
        type: 'input',
        name: 'context',
        message: 'What was the context? (What were you trying to do?)',
        validate: (input: string) => input.trim().length > 0 || 'Context is required'
      },
      {
        type: 'input',
        name: 'conceptLearned',
        message: 'What did you learn? (The general principle)',
        validate: (input: string) => input.trim().length > 0 || 'Concept learned is required'
      },
      {
        type: 'input',
        name: 'whyItMatters',
        message: 'Why does this matter?',
        default: ''
      },
      {
        type: 'input',
        name: 'futureApplication',
        message: 'How will you apply this in the future?',
        default: ''
      },
      {
        type: 'input',
        name: 'relatedConcepts',
        message: 'Related concepts (comma-separated):',
        filter: (input: string) => input.split(',').map(t => t.trim()).filter(t => t.length > 0)
      }
    ]);

    // Validate
    const validation = validateEntry(answers);

    if (validation.warnings.length > 0) {
      console.log(chalk.yellow('\n⚠ Warnings:'));
      validation.warnings.forEach(warn => console.log(chalk.yellow('  !'), warn));
      
      const { proceed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: 'Do you want to continue anyway?',
          default: true
        }
      ]);

      if (!proceed) {
        console.log(chalk.gray('Cancelled'));
        return;
      }
    }

    if (validation.suggestions.length > 0) {
      console.log(chalk.blue('\n💡 Suggestions for next time:'));
      validation.suggestions.forEach(sug => console.log(chalk.blue('  →'), sug));
    }

    // Auto-generate quiz questions
    console.log(chalk.blue('\nGenerating quiz questions...'));
    const tempEntry = prepareEntry(answers as Partial<LearningEntry>);
    const quizQuestions = autoGenerateQuestions(tempEntry);

    const entry = prepareEntry({
      ...answers,
      quizQuestions
    } as Partial<LearningEntry>);

    addEntry(entry);

    console.log(chalk.green('\n✓ Learning entry added successfully'));
    console.log(chalk.gray(`  ID: ${entry.id}`));
    console.log(chalk.gray(`  Topic: ${entry.topic}`));
    console.log(chalk.gray(`  Category: ${entry.category}`));
    console.log(chalk.gray(`  Generated ${quizQuestions.length} quiz questions`));
  } catch (error: any) {
    if (error.isTtyError) {
      console.error(chalk.red('Interactive prompts not supported in this environment'));
      console.log(chalk.blue('Try using: learning add --json \'{"topic": "...", ...}\''));
    } else {
      console.error(chalk.red('Failed to add entry:'), error.message);
    }
    process.exit(1);
  }
}
