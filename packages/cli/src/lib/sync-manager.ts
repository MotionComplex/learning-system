/**
 * Git-based synchronization for LEARNING.json
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';

const SYNC_DIR = join(homedir(), 'learning-data');
const LEARNING_FILE = join(homedir(), 'LEARNING.json');

export interface SyncStatus {
  initialized: boolean;
  hasChanges: boolean;
  lastCommit?: string;
  remote?: string;
  branch: string;
}

/**
 * Execute a git command in the sync directory
 */
function execGit(command: string): string {
  try {
    return execSync(command, {
      cwd: SYNC_DIR,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim();
  } catch (error: any) {
    throw new Error(`Git command failed: ${error.message}`);
  }
}

/**
 * Check if git is available
 */
export function isGitAvailable(): boolean {
  try {
    execSync('git --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if sync is initialized
 */
export function isSyncInitialized(): boolean {
  return existsSync(join(SYNC_DIR, '.git'));
}

/**
 * Initialize git repository for sync
 */
export function initSync(remote?: string): void {
  if (!isGitAvailable()) {
    throw new Error('Git is not installed. Please install git to use sync features.');
  }

  if (isSyncInitialized()) {
    throw new Error('Sync is already initialized');
  }

  // Create sync directory
  if (!existsSync(SYNC_DIR)) {
    mkdirSync(SYNC_DIR, { recursive: true });
  }

  // Initialize git repo
  execGit('git init');
  execGit('git config user.name "Learning System"');
  execGit('git config user.email "learning@local"');

  // Create gitignore
  const gitignorePath = join(SYNC_DIR, '.gitignore');
  if (!existsSync(gitignorePath)) {
    require('fs').writeFileSync(gitignorePath, 'node_modules/\n.DS_Store\n');
  }

  // Add remote if provided
  if (remote) {
    execGit(`git remote add origin ${remote}`);
  }

  // Create README
  const readmePath = join(SYNC_DIR, 'README.md');
  if (!existsSync(readmePath)) {
    require('fs').writeFileSync(
      readmePath,
      '# Learning Data\n\nThis repository contains your learning entries.\n'
    );
  }

  console.log('Sync initialized successfully');
  if (remote) {
    console.log(`Remote configured: ${remote}`);
  }
}

/**
 * Get sync status
 */
export function getSyncStatus(): SyncStatus {
  if (!isSyncInitialized()) {
    return {
      initialized: false,
      hasChanges: false,
      branch: 'main'
    };
  }

  try {
    const status = execGit('git status --porcelain');
    const hasChanges = status.length > 0;

    let lastCommit: string | undefined;
    try {
      lastCommit = execGit('git log -1 --format="%h - %s (%cr)"');
    } catch {
      // No commits yet
    }

    let remote: string | undefined;
    try {
      remote = execGit('git remote get-url origin');
    } catch {
      // No remote configured
    }

    const branch = execGit('git branch --show-current') || 'main';

    return {
      initialized: true,
      hasChanges,
      lastCommit,
      remote,
      branch
    };
  } catch (error) {
    throw new Error(`Failed to get sync status: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Copy LEARNING.json to sync directory
 */
function copyLearningFile(): void {
  if (!existsSync(LEARNING_FILE)) {
    throw new Error('LEARNING.json not found in home directory');
  }

  const targetPath = join(SYNC_DIR, 'LEARNING.json');
  require('fs').copyFileSync(LEARNING_FILE, targetPath);
}

/**
 * Copy LEARNING.json from sync directory to home
 */
function restoreLearningFile(): void {
  const sourcePath = join(SYNC_DIR, 'LEARNING.json');
  if (!existsSync(sourcePath)) {
    throw new Error('LEARNING.json not found in sync directory');
  }

  require('fs').copyFileSync(sourcePath, LEARNING_FILE);
}

/**
 * Push changes to remote
 */
export function pushSync(message?: string): void {
  if (!isSyncInitialized()) {
    throw new Error('Sync not initialized. Run: learning sync init');
  }

  // Copy current LEARNING.json to sync dir
  copyLearningFile();

  const status = getSyncStatus();
  if (!status.hasChanges) {
    console.log('No changes to push');
    return;
  }

  try {
    // Add and commit
    execGit('git add LEARNING.json');
    const commitMessage = message || `Update learning data - ${new Date().toLocaleString()}`;
    execGit(`git commit -m "${commitMessage}"`);

    // Push if remote is configured
    if (status.remote) {
      execGit(`git push origin ${status.branch}`);
      console.log('Successfully pushed to remote');
    } else {
      console.log('Changes committed locally (no remote configured)');
    }
  } catch (error) {
    throw new Error(`Failed to push: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Pull changes from remote
 */
export function pullSync(): void {
  if (!isSyncInitialized()) {
    throw new Error('Sync not initialized. Run: learning sync init');
  }

  const status = getSyncStatus();
  if (!status.remote) {
    throw new Error('No remote configured');
  }

  try {
    // Pull from remote
    execGit(`git pull origin ${status.branch}`);

    // Copy updated file to home directory
    restoreLearningFile();

    console.log('Successfully pulled from remote');
  } catch (error) {
    throw new Error(`Failed to pull: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Add remote repository
 */
export function addRemote(url: string): void {
  if (!isSyncInitialized()) {
    throw new Error('Sync not initialized. Run: learning sync init');
  }

  try {
    execGit(`git remote add origin ${url}`);
    console.log(`Remote added: ${url}`);
  } catch (error) {
    // Try updating if already exists
    try {
      execGit(`git remote set-url origin ${url}`);
      console.log(`Remote updated: ${url}`);
    } catch {
      throw new Error(`Failed to add remote: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
