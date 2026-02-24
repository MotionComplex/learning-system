/**
 * Storage layer for managing LEARNING.json file
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import type { LearningData, LearningEntry } from '../types/learning.js';

const LEARNING_FILE_PATH = join(homedir(), 'LEARNING.json');

/**
 * Get the path to the learning data file
 */
export function getLearningFilePath(): string {
  return LEARNING_FILE_PATH;
}

/**
 * Check if LEARNING.json exists
 */
export function learningFileExists(): boolean {
  return existsSync(LEARNING_FILE_PATH);
}

/**
 * Initialize LEARNING.json with default structure
 */
export function initializeLearningFile(): LearningData {
  const initialData: LearningData = {
    version: '1.0',
    lastUpdated: new Date().toISOString(),
    totalEntries: 0,
    entries: []
  };

  writeFileSync(LEARNING_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
  return initialData;
}

/**
 * Read learning data from file
 */
export function readLearningData(): LearningData {
  if (!learningFileExists()) {
    return initializeLearningFile();
  }

  try {
    const content = readFileSync(LEARNING_FILE_PATH, 'utf-8');
    const data = JSON.parse(content) as LearningData;
    return data;
  } catch (error) {
    throw new Error(`Failed to read learning data: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Write learning data to file
 */
export function writeLearningData(data: LearningData): void {
  try {
    data.lastUpdated = new Date().toISOString();
    data.totalEntries = data.entries.length;
    writeFileSync(LEARNING_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    throw new Error(`Failed to write learning data: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Add a new learning entry (prepends to array)
 */
export function addEntry(entry: LearningEntry): void {
  const data = readLearningData();
  data.entries.unshift(entry); // Add to beginning
  writeLearningData(data);
}

/**
 * Get entry by ID
 */
export function getEntryById(id: string): LearningEntry | undefined {
  const data = readLearningData();
  return data.entries.find(entry => entry.id === id);
}

/**
 * Update an existing entry
 */
export function updateEntry(id: string, updates: Partial<LearningEntry>): void {
  const data = readLearningData();
  const index = data.entries.findIndex(entry => entry.id === id);
  
  if (index === -1) {
    throw new Error(`Entry with ID ${id} not found`);
  }

  data.entries[index] = { ...data.entries[index], ...updates };
  writeLearningData(data);
}

/**
 * Delete an entry by ID
 */
export function deleteEntry(id: string): void {
  const data = readLearningData();
  data.entries = data.entries.filter(entry => entry.id !== id);
  writeLearningData(data);
}

/**
 * Get all entries
 */
export function getAllEntries(): LearningEntry[] {
  const data = readLearningData();
  return data.entries;
}

/**
 * Get statistics about the learning data
 */
export function getStats() {
  const data = readLearningData();
  const categories = new Set(data.entries.map(e => e.category));
  const tags = new Set(data.entries.flatMap(e => e.tags));
  
  const byDifficulty = {
    beginner: data.entries.filter(e => e.difficulty === 'beginner').length,
    intermediate: data.entries.filter(e => e.difficulty === 'intermediate').length,
    advanced: data.entries.filter(e => e.difficulty === 'advanced').length
  };

  const byCategory: Record<string, number> = {};
  data.entries.forEach(entry => {
    byCategory[entry.category] = (byCategory[entry.category] || 0) + 1;
  });

  return {
    total: data.totalEntries,
    categories: Array.from(categories),
    tags: Array.from(tags),
    byDifficulty,
    byCategory,
    lastUpdated: data.lastUpdated
  };
}
