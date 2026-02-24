/**
 * Quiz command - Interactive quiz from learning entries
 */

import chalk from 'chalk';
import inquirer from 'inquirer';
import { getAllEntries, updateEntry } from '../lib/storage.js';
import { getQuestionsWithContext, calculateScore } from '../lib/quiz-engine.js';
import type { QuizOptions, QuizAnswerDetail } from '../types/learning.js';

interface QuizCommandOptions {
  category?: string;
  tag?: string;
  difficulty?: string;
  count?: number;
}

export async function quizCommand(options: QuizCommandOptions): Promise<void> {
  try {
    const entries = getAllEntries();

    if (entries.length === 0) {
      console.log(chalk.yellow('No learning entries found'));
      console.log(chalk.blue('Add some entries first: learning add'));
      return;
    }

    const quizOptions: QuizOptions = {
      category: options.category,
      tag: options.tag,
      difficulty: options.difficulty as any,
      count: options.count || 5,
      random: true
    };

    const questionsWithContext = getQuestionsWithContext(entries, quizOptions);

    if (questionsWithContext.length === 0) {
      console.log(chalk.yellow('No quiz questions found'));
      if (options.category || options.tag || options.difficulty) {
        console.log(chalk.gray('Try removing some filters'));
      } else {
        console.log(chalk.gray('Make sure your entries have quiz questions'));
      }
      return;
    }

    console.log(chalk.blue('\n=== Knowledge Quiz ==='));
    console.log(chalk.gray(`${questionsWithContext.length} questions\n`));

    const answers: QuizAnswerDetail[] = [];

    for (let i = 0; i < questionsWithContext.length; i++) {
      const { question, entry } = questionsWithContext[i];
      
      console.log(chalk.bold(`\nQuestion ${i + 1}/${questionsWithContext.length}`));
      console.log(chalk.gray(`Topic: ${entry.topic} (${entry.category})\n`));
      console.log(chalk.white(question.question));

      // Shuffle answers
      const allAnswers = [question.correctAnswer, ...question.wrongAnswers];
      const shuffled = allAnswers.sort(() => Math.random() - 0.5);

      const { userAnswer } = await inquirer.prompt([
        {
          type: 'list',
          name: 'userAnswer',
          message: 'Select your answer:',
          choices: shuffled
        }
      ]);

      const isCorrect = userAnswer === question.correctAnswer;

      if (isCorrect) {
        console.log(chalk.green('✓ Correct!'));
      } else {
        console.log(chalk.red('✗ Incorrect'));
        console.log(chalk.yellow(`The correct answer is: ${question.correctAnswer}`));
      }

      if (question.explanation) {
        console.log(chalk.gray(`💡 ${question.explanation}`));
      }

      answers.push({
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
        entry
      });

      // Update revisit count
      try {
        updateEntry(entry.id, {
          revisitCount: (entry.revisitCount || 0) + 1,
          lastRevisited: new Date().toISOString()
        });
      } catch {
        // Ignore update errors
      }
    }

    // Show results
    const result = calculateScore(answers);

    console.log(chalk.blue('\n\n=== Quiz Results ==='));
    console.log(chalk.bold(`Score: ${result.score}%`));
    console.log(chalk.gray(`${result.correctAnswers} correct out of ${result.totalQuestions}`));

    if (result.score === 100) {
      console.log(chalk.green('\n🎉 Perfect score! You have mastered these concepts!'));
    } else if (result.score >= 80) {
      console.log(chalk.green('\n✨ Great job! You have a strong understanding.'));
    } else if (result.score >= 60) {
      console.log(chalk.yellow('\n👍 Good effort! Review the concepts you missed.'));
    } else {
      console.log(chalk.yellow('\n📚 Keep practicing! Review these topics.'));
    }

    if (result.wrongAnswers > 0) {
      console.log(chalk.blue('\n📝 Topics to review:'));
      const wrongTopics = new Set(
        answers
          .filter(a => !a.isCorrect)
          .map(a => `${a.entry.topic} (${a.entry.category})`)
      );
      wrongTopics.forEach(topic => {
        console.log(chalk.gray(`  • ${topic}`));
      });
    }

  } catch (error: any) {
    if (error.isTtyError) {
      console.error(chalk.red('Interactive prompts not supported in this environment'));
    } else {
      console.error(chalk.red('Quiz failed:'), error.message);
    }
    process.exit(1);
  }
}
