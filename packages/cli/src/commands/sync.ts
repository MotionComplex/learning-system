/**
 * Sync command - Git-based synchronization
 */

import chalk from 'chalk';
import {
  isGitAvailable,
  isSyncInitialized,
  initSync,
  getSyncStatus,
  pushSync,
  pullSync,
  addRemote
} from '../lib/sync-manager.js';

export async function syncCommand(
  action: 'init' | 'push' | 'pull' | 'status' | 'remote',
  options: { remote?: string; message?: string } = {}
): Promise<void> {
  try {
    switch (action) {
      case 'init':
        await handleInit(options.remote);
        break;

      case 'push':
        await handlePush(options.message);
        break;

      case 'pull':
        await handlePull();
        break;

      case 'status':
        await handleStatus();
        break;

      case 'remote':
        await handleRemote(options.remote);
        break;

      default:
        console.log(chalk.yellow('Unknown sync action'));
        console.log(chalk.blue('Available actions: init, push, pull, status, remote'));
        process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red('Sync failed:'), error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

async function handleInit(remote?: string): Promise<void> {
  if (!isGitAvailable()) {
    console.error(chalk.red('Git is not installed'));
    console.log(chalk.blue('Please install git to use sync features'));
    process.exit(1);
  }

  if (isSyncInitialized()) {
    console.log(chalk.yellow('Sync is already initialized'));
    const status = getSyncStatus();
    if (status.remote) {
      console.log(chalk.gray(`Remote: ${status.remote}`));
    }
    return;
  }

  console.log(chalk.blue('Initializing sync...'));
  initSync(remote);
  
  console.log(chalk.green('✓ Sync initialized'));
  console.log(chalk.blue('\nNext steps:'));
  console.log('  learning sync push   - Push your learning data');
  
  if (!remote) {
    console.log('  learning sync remote <url> - Add a remote repository');
  }
}

async function handlePush(message?: string): Promise<void> {
  if (!isSyncInitialized()) {
    console.error(chalk.red('Sync not initialized'));
    console.log(chalk.blue('Run: learning sync init'));
    process.exit(1);
  }

  console.log(chalk.blue('Pushing changes...'));
  pushSync(message);
  console.log(chalk.green('✓ Successfully pushed'));
}

async function handlePull(): Promise<void> {
  if (!isSyncInitialized()) {
    console.error(chalk.red('Sync not initialized'));
    console.log(chalk.blue('Run: learning sync init'));
    process.exit(1);
  }

  const status = getSyncStatus();
  if (!status.remote) {
    console.error(chalk.red('No remote configured'));
    console.log(chalk.blue('Run: learning sync remote <url>'));
    process.exit(1);
  }

  console.log(chalk.blue('Pulling changes...'));
  pullSync();
  console.log(chalk.green('✓ Successfully pulled'));
}

async function handleStatus(): Promise<void> {
  if (!isSyncInitialized()) {
    console.log(chalk.yellow('Sync not initialized'));
    console.log(chalk.blue('Run: learning sync init'));
    return;
  }

  const status = getSyncStatus();

  console.log(chalk.blue('\n=== Sync Status ==='));
  console.log(chalk.gray(`Branch: ${status.branch}`));
  
  if (status.remote) {
    console.log(chalk.gray(`Remote: ${status.remote}`));
  } else {
    console.log(chalk.yellow('No remote configured'));
  }

  if (status.lastCommit) {
    console.log(chalk.gray(`Last commit: ${status.lastCommit}`));
  } else {
    console.log(chalk.gray('No commits yet'));
  }

  if (status.hasChanges) {
    console.log(chalk.yellow('\n⚠ You have uncommitted changes'));
    console.log(chalk.blue('Run: learning sync push'));
  } else {
    console.log(chalk.green('\n✓ No pending changes'));
  }
}

async function handleRemote(url?: string): Promise<void> {
  if (!isSyncInitialized()) {
    console.error(chalk.red('Sync not initialized'));
    console.log(chalk.blue('Run: learning sync init'));
    process.exit(1);
  }

  if (!url) {
    const status = getSyncStatus();
    if (status.remote) {
      console.log(chalk.blue('Current remote:'));
      console.log(chalk.gray(status.remote));
    } else {
      console.log(chalk.yellow('No remote configured'));
      console.log(chalk.blue('Usage: learning sync remote <url>'));
    }
    return;
  }

  console.log(chalk.blue('Adding remote...'));
  addRemote(url);
  console.log(chalk.green('✓ Remote configured'));
}
