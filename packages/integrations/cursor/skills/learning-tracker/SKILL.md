---
name: learning-tracker
description: ALWAYS use this skill when user mentions "learning log", "learnings", "add learning", "save learning", "track learning", or "learning.json". Manages the GLOBAL learning file at ~/LEARNING.json (in home directory). This skill integrates with the learning-cli tool for advanced features.
---

# Learning Tracker

## CRITICAL: File Location
- **ALWAYS use:** `~/LEARNING.json` (home directory)
- **NEVER create:** Local LEARNINGS.md, learning.md, or any markdown files in projects
- This is a GLOBAL learning log across all projects

Manage a structured learning log in `~/LEARNING.json` that tracks coding concepts, patterns, and principles learned during development.

## CLI Tool Integration

This skill works with the `learning-cli` command-line tool. Users can also use:
- `learning add` - Interactive prompt to add entries
- `learning list` - View recent entries
- `learning search <query>` - Search entries
- `learning quiz` - Test knowledge
- `learning sync` - Sync across machines via git

For manual entry management through Cursor, continue with the instructions below.

## JSON Schema

The file uses this structure (compatible with CLI tool):

```json
{
  "version": "1.0",
  "lastUpdated": "2026-02-24T18:30:00Z",
  "totalEntries": 0,
  "entries": [
    {
      "id": "entry_1234567890_abc123",
      "timestamp": "2026-02-24T18:30:00Z",
      "topic": "Descriptive title",
      "category": "react",
      "tags": ["tag1", "tag2"],
      "difficulty": "beginner|intermediate|advanced",
      "context": "What you were working on",
      "conceptLearned": "The principle/pattern explained",
      "whyItMatters": "Why this knowledge is important",
      "futureApplication": "How to apply this in the future",
      "relatedConcepts": ["concept1", "concept2"],
      "quizQuestions": [
        {
          "question": "Quiz question text",
          "correctAnswer": "The correct answer",
          "wrongAnswers": ["Wrong 1", "Wrong 2", "Wrong 3"],
          "explanation": "Why this is the answer"
        }
      ],
      "revisitCount": 0,
      "lastRevisited": null
    }
  ]
}
```

## CRITICAL: Quality Filter

Before adding an entry, ensure it meets these criteria:

### ✅ GOOD - Add These:
- **General principles** that apply across projects
- **Fundamental concepts** you'd teach to others
- **Best practices** with broad applicability
- **Patterns** you'll use repeatedly
- **Core misunderstandings** about how things work

**Examples:**
- "React hooks dependency arrays compare by reference"
- "TypeScript generics enable type-safe reusable functions"
- "CSS Grid excels at 2D layouts vs Flexbox for 1D"

### ❌ BAD - Don't Add These:
- **Debugging notes** for specific one-time issues
- **Project-specific** configurations or setups
- **Edge cases** that won't recur
- **Tool-specific quirks** (unless fundamental)
- **Overly detailed scenarios** without general principles

**Examples:**
- "CI snapshot test failed because of portal timing on line 47" ❌
- "Fixed build error by changing webpack config to X" ❌
- "React Modal portals need cleanup in this specific test suite" ❌

### Extracting General Principles

When you encounter a specific problem, extract the general learning:

**Specific situation:**
"My CI tests failed because React Modal portals were timing out"

**General principle:**
"React portals render outside the component tree and need explicit cleanup between tests to maintain test isolation"

## Adding a Learning Entry

When adding an entry:

1. Read `~/LEARNING.json`
2. **Evaluate if this is general knowledge** (use criteria above)
3. **Extract general principles** from specific situations
4. **Ask user** if the learning seems too specific
5. Generate a unique ID: `entry_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
6. Create ISO 8601 timestamp
7. Gather all required fields
8. **Generate 2-3 quiz questions** based on the concept
9. Prepend the new entry to the `entries` array (newest first)
10. Update `lastUpdated` and `totalEntries` fields
11. Write back to `~/LEARNING.json`

### Required Fields

- `id`: Generate using format above
- `timestamp`: Current time in ISO 8601 format
- `topic`: Short descriptive title
- `category`: High-level category (react, typescript, patterns, etc.)
- `tags`: Array of relevant tags
- `difficulty`: beginner, intermediate, or advanced
- `context`: What the user was working on
- `conceptLearned`: The concept/principle explained
- `whyItMatters`: Why this knowledge is important
- `futureApplication`: How to apply this
- `relatedConcepts`: Array of related concepts
- `quizQuestions`: Array of 2-3 quiz questions

### Generating Quiz Questions

Create 2-3 questions per entry:

```json
{
  "question": "Clear question based on conceptLearned",
  "correctAnswer": "The correct answer",
  "wrongAnswers": [
    "Plausible wrong answer 1",
    "Plausible wrong answer 2", 
    "Plausible wrong answer 3"
  ],
  "explanation": "Why this is correct, referencing the conceptLearned"
}
```

**Question Guidelines:**

1. **First question**: Direct concept test
   - "What happens when..."
   - "Why does..."

2. **Second question**: Application-based
   - "When should you..."
   - "How would you..."

3. **Third question**: Scenario-based (optional)
   - "In what situation..."

**Wrong Answer Guidelines:**

Create plausible wrong answers:
- Common misconceptions
- Partially correct but incomplete
- Opposite of the correct approach
- Related but incorrect concepts

## Example Interaction

**User:** "Add this to my learning log"

**Agent:**
1. Review conversation context
2. **Evaluate**: Is this general knowledge or a specific debugging note?
3. If too specific: "This seems like a specific debugging scenario. Can we extract a more general principle? The general learning might be: [general principle]. Should I add that instead?"
4. Extract the learning moment
5. Ask for any missing required fields
6. Confirm before adding
7. Add to JSON file with proper structure
8. Confirm: "Added to your learning log!"

## Important Notes

- Always read the file before modifying
- Preserve the existing JSON structure
- Keep entries in chronological order (newest first)
- Always update `lastUpdated` and `totalEntries`
- Validate JSON before writing
- The file location is: `/Users/elias.douglas/LEARNING.json`

## Common Categories

- `react` - React patterns and concepts
- `typescript` - TypeScript features
- `patterns` - Design patterns
- `performance` - Performance optimization
- `architecture` - Architectural decisions
- `testing` - Testing strategies
- `security` - Security best practices
- `git` - Version control
- `css` - Styling and layouts
- `async` - Asynchronous programming
