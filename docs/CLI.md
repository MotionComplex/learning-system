# CLI Usage Guide

Complete reference for the `learning` command-line tool.

## Installation

```bash
cd packages/cli
npm install
npm run build
npm link
```

Or use the master installer from the repository root:

```bash
./install.sh
```

## Commands

### `learning init`

Initialize `~/LEARNING.json` file.

```bash
learning init
```

Creates the file with the proper structure if it doesn't exist. Safe to run multiple times.

### `learning add`

Add a new learning entry.

#### Interactive Mode (Default)

```bash
learning add
```

Prompts for all required fields:
- Topic
- Category
- Tags
- Difficulty
- Context
- Concept learned
- Why it matters
- Future application
- Related concepts

The CLI will:
- Validate the entry quality
- Warn if it seems too specific
- Auto-generate 2-3 quiz questions
- Add the entry to `~/LEARNING.json`

#### JSON Mode

```bash
learning add --json '{
  "topic": "React useEffect Dependencies",
  "category": "react",
  "tags": ["hooks", "performance"],
  "difficulty": "intermediate",
  "context": "Working on data fetching in React app",
  "conceptLearned": "React compares useEffect dependencies by reference, not value",
  "whyItMatters": "Understanding this prevents infinite loops",
  "futureApplication": "Always use primitive values in dependency arrays",
  "relatedConcepts": ["useMemo", "useCallback"]
}'
```

**Required fields:**
- `topic` - Short descriptive title
- `category` - High-level category (react, typescript, etc.)
- `tags` - Array of tags
- `difficulty` - beginner, intermediate, or advanced
- `context` - What you were working on
- `conceptLearned` - The general principle

**Optional fields:**
- `whyItMatters` - Why this knowledge is important
- `futureApplication` - How to apply in the future
- `relatedConcepts` - Array of related concepts
- `quizQuestions` - Array of quiz questions (auto-generated if omitted)

### `learning list`

List learning entries.

```bash
# List recent 10 (default)
learning list

# List recent 5
learning list --recent 5

# Filter by category
learning list --category react

# Filter by tag
learning list --tag hooks

# Filter by difficulty
learning list --difficulty intermediate

# Combine filters
learning list --category react --difficulty intermediate --recent 3
```

**Options:**
- `-r, --recent <count>` - Number of entries (default: 10)
- `-c, --category <name>` - Filter by category
- `-t, --tag <name>` - Filter by tag
- `-d, --difficulty <level>` - Filter by difficulty

### `learning search`

Search learning entries with fuzzy matching.

```bash
# Basic search
learning search "hooks"

# Search with filters
learning search "dependency" --category react
learning search "async" --difficulty advanced
learning search "state" --tag react --difficulty intermediate
```

The search looks through:
- Topic (highest weight)
- Concept learned (highest weight)
- Context
- Why it matters
- Category
- Tags

**Options:**
- `-c, --category <name>` - Filter by category
- `-t, --tag <name>` - Filter by tag
- `-d, --difficulty <level>` - Filter by difficulty

### `learning quiz`

Interactive terminal quiz.

```bash
# Random 5 questions (default)
learning quiz

# 10 questions
learning quiz --count 10

# Category-specific quiz
learning quiz --category react

# Tag-specific quiz
learning quiz --tag hooks

# Difficulty-specific quiz
learning quiz --difficulty intermediate

# Combine filters
learning quiz --category typescript --difficulty advanced --count 5
```

**Options:**
- `-c, --category <name>` - Quiz on specific category
- `-t, --tag <name>` - Quiz on specific tag
- `-d, --difficulty <level>` - Quiz on specific difficulty
- `-n, --count <number>` - Number of questions (default: 5)

**Features:**
- Shuffled answer options
- Immediate feedback
- Detailed explanations
- Final score and review
- Tracks revisit count for each entry

### `learning stats`

View statistics about your learning data.

```bash
learning stats
```

Shows:
- Total entries
- Last updated date
- Distribution by difficulty
- Entries per category
- All categories and tags

### `learning sync`

Git-based synchronization across machines.

#### Initialize Sync

```bash
# Local only
learning sync init

# With remote repository
learning sync init --remote git@github.com:username/learning-data.git
```

Creates a git repository at `~/learning-data/` and sets up tracking for `~/LEARNING.json`.

#### Check Status

```bash
learning sync status
```

Shows:
- Current branch
- Remote URL (if configured)
- Last commit
- Pending changes

#### Push Changes

```bash
# Push with auto-generated message
learning sync push

# Push with custom message
learning sync push --message "Added TypeScript learnings"
```

Commits and pushes your learning data to the remote repository.

#### Pull Changes

```bash
learning sync pull
```

Pulls the latest changes from the remote repository and updates `~/LEARNING.json`.

#### Configure Remote

```bash
# Add or update remote
learning sync remote <url>

# View current remote
learning sync remote
```

## Examples

### Daily Workflow

```bash
# Morning: Pull latest from other machines
learning sync pull

# During work: Add learnings as you discover them
learning add

# Evening: Review what you learned
learning list --recent 5

# Push changes
learning sync push

# Weekly: Test your knowledge
learning quiz --count 10
```

### By Category

```bash
# Working on React project
learning list --category react
learning quiz --category react --count 5

# Learning TypeScript
learning search "generics" --category typescript
learning quiz --category typescript --difficulty intermediate
```

### Quality Check

The CLI automatically validates entries:

```bash
learning add
# Enter: "Fixed CI test on line 47"
# Warning: Entry may be too specific to a single project
# Suggestion: Consider extracting the general principle

# Better: "Test isolation requires cleanup between tests"
```

## Configuration

The CLI stores configuration in:
- macOS: `~/Library/Preferences/learning-cli-nodejs/`
- Linux: `~/.config/learning-cli-nodejs/`
- Windows: `%APPDATA%\learning-cli-nodejs\`

No manual configuration needed - everything is automatic.

## Tips

1. **Be Specific in Searches**: Use meaningful keywords like "dependency array" instead of just "array"

2. **Use Tags Effectively**: Add multiple relevant tags to make entries easier to find
   ```bash
   learning add --json '{"tags": ["react", "hooks", "useEffect", "performance"]}'
   ```

3. **Regular Quizzes**: Test yourself weekly to reinforce learning
   ```bash
   learning quiz --count 20
   ```

4. **Sync Often**: Push after adding entries, pull before starting work
   ```bash
   # Add to your shell aliases
   alias lp="learning sync pull"
   alias ls="learning sync push"
   ```

5. **Review Recent**: List recent entries to see your progress
   ```bash
   learning list --recent 20
   ```

## Troubleshooting

### "Command not found: learning"

The CLI isn't linked globally. Run:

```bash
cd packages/cli
npm link
```

### "Failed to read learning data"

Your `~/LEARNING.json` file may be corrupted. Check for JSON syntax errors:

```bash
cat ~/LEARNING.json | python -m json.tool
```

### Sync Issues

If sync fails:

```bash
# Check git status
cd ~/learning-data
git status

# Force push (careful!)
git push -f origin main

# Reset to remote
git fetch origin
git reset --hard origin/main
```

### Quiz Has No Questions

Your entries don't have quiz questions. Add some:

```bash
learning add  # Quiz questions are auto-generated
```

Or regenerate for existing entries (future feature).

## Integration with Other Tools

### Cursor

Cursor integration automatically calls the CLI:

```bash
# Cursor runs this when you say "add to learning log"
learning add --json '{...}'
```

### VS Code Copilot

Copilot suggests using the CLI:

```
Use: learning add
```

### Custom Scripts

Use the CLI in your own scripts:

```bash
#!/bin/bash
# Add all learnings from today's notes

cat today.md | grep "Learned:" | while read line; do
  learning add --json "{\"topic\": \"$line\", ...}"
done
```

## Advanced Usage

### Programmatic Access

Access data directly in Node.js:

```javascript
import { readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const data = JSON.parse(
  readFileSync(join(homedir(), 'LEARNING.json'), 'utf-8')
);

console.log(`Total entries: ${data.totalEntries}`);
```

### Export Data

```bash
# Copy to clipboard (macOS)
cat ~/LEARNING.json | pbcopy

# Export specific category
learning list --category react --recent 100 > react-learnings.txt
```

### Backup

```bash
# Manual backup
cp ~/LEARNING.json ~/LEARNING.backup.json

# Automated backup (add to crontab)
0 0 * * * cp ~/LEARNING.json ~/LEARNING.backup.$(date +\%Y\%m\%d).json
```

## API Reference

For developers building on top of the CLI:

```typescript
// Import types
import type { LearningEntry, LearningData } from '@learning-system/cli/types';

// Import functions
import { 
  readLearningData,
  writeLearningData,
  addEntry,
  getAllEntries 
} from '@learning-system/cli/lib/storage';

// Use in your code
const data = readLearningData();
const entries = getAllEntries();
```

See the source code in `packages/cli/src/` for full API.
