# Cursor Integration

Integration files for Cursor IDE to automatically detect knowledge gaps and manage learning entries.

## What's Included

- **Knowledge Gap Detector Rule** - Automatically detects learning moments during coding
- **Learning Tracker Skill** - Helps manage entries in `~/LEARNING.json`

## Installation

From the repository root:

```bash
cd packages/integrations/cursor
./install.sh
```

Or manually:

```bash
cp rules/knowledge-gap-detector.mdc ~/.cursor/rules/
cp skills/learning-tracker/SKILL.md ~/.cursor/skills/learning-tracker/
```

Restart Cursor after installation.

## How It Works

### Knowledge Gap Detection

The Cursor AI will automatically:
- Watch for significant learning moments during conversations
- Detect when you learn a fundamental concept
- Suggest adding general principles to your learning log

It will **NOT** suggest for:
- Simple debugging notes
- Project-specific configurations
- One-time fixes

### Adding Entries

When Cursor suggests adding a learning:
1. It evaluates if the knowledge is general enough
2. Extracts the core principle from specific situations
3. Asks you to confirm before adding
4. Adds the entry to `~/LEARNING.json` with quiz questions

You can also manually request:
- "Add this to my learning log"
- "Save this learning"
- "Track this knowledge"

### CLI Alternative

You can also use the CLI tool directly:
```bash
learning add              # Interactive prompt
learning list             # View entries
learning quiz             # Test knowledge
```

## File Structure

```
cursor/
├── rules/
│   └── knowledge-gap-detector.mdc    # Auto-detection rule
├── skills/
│   └── learning-tracker/
│       └── SKILL.md                  # Learning management skill
├── install.sh                        # Installation script
└── README.md                         # This file
```

## Quality Standards

The integration enforces quality standards:
- Entries must contain **general, transferable knowledge**
- Specific debugging notes are rejected or reframed
- Entries include quiz questions for retention
- Related concepts are linked

## Uninstall

```bash
rm ~/.cursor/rules/knowledge-gap-detector.mdc
rm -rf ~/.cursor/skills/learning-tracker
```

Restart Cursor after uninstalling.
