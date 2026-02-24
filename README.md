# Universal Learning System

A complete learning system that works across multiple AI platforms (Cursor, VS Code Copilot) with a powerful CLI tool and web quiz app. Track coding concepts, principles, and patterns you learn - then test your knowledge with auto-generated quizzes.

## Features

- **Universal CLI Tool** - Manage learning entries from any terminal
- **Cursor Integration** - Automatic knowledge gap detection in Cursor IDE
- **VS Code Copilot Integration** - Learning suggestions from GitHub Copilot
- **Web Quiz App** - Beautiful React app for testing knowledge
- **Git Sync** - Synchronize learning data across machines
- **Quality Filters** - Ensures entries contain general, transferable knowledge

## Quick Start

### Installation

**Prerequisites**: [Bun](https://bun.sh/) must be installed.

```bash
# Install Bun if you haven't already
curl -fsSL https://bun.sh/install | bash

# Clone and install
git clone https://github.com/MotionComplex/learning-system
cd learning-system
./install.sh
```

The installer will:
1. Install the CLI tool globally
2. Set up Cursor integration (if Cursor is installed)
3. Set up VS Code integration (if VS Code is installed)
4. Initialize your `~/LEARNING.json` file
5. Install quiz app dependencies

### First Steps

```bash
# Add your first learning entry
learning add

# List recent entries
learning list

# Take a quiz
learning quiz

# View statistics
learning stats

# Start the web quiz app
cd packages/quiz-app
npm run dev
```

## Components

### 1. CLI Tool

Powerful command-line interface for managing learning entries.

```bash
learning add              # Add new entry (interactive)
learning add --json '{}'  # Add from JSON
learning list             # List recent entries
learning list --category react --recent 5
learning search "hooks"   # Search entries
learning quiz             # Terminal quiz
learning quiz --category typescript --count 10
learning stats            # View statistics
learning sync init        # Set up git sync
learning sync push        # Sync to remote
```

See [docs/CLI.md](docs/CLI.md) for detailed usage.

### 2. Cursor Integration

Automatic knowledge gap detection in Cursor IDE.

- Detects when you learn fundamental concepts
- Suggests adding learnings automatically
- Filters out project-specific debugging notes
- Enforces quality standards

See [packages/integrations/cursor/README.md](packages/integrations/cursor/README.md)

### 3. VS Code Copilot Integration

GitHub Copilot helps detect learning moments.

- Custom Copilot instructions
- Automatic learning suggestions
- Quality-filtered entries
- CLI integration

See [packages/integrations/vscode/README.md](packages/integrations/vscode/README.md)

### 4. Quiz Web App

Beautiful React app for testing your knowledge.

- Interactive quizzes by category/difficulty
- Progress tracking
- Detailed explanations
- Browse all learnings
- Search and filter

```bash
cd packages/quiz-app
bun dev
# Visit http://localhost:5173
```

See [docs/QUIZ_APP.md](docs/QUIZ_APP.md)

## Data Structure

All learning data is stored in `~/LEARNING.json`:

```json
{
  "version": "1.0",
  "lastUpdated": "2026-02-24T18:30:00Z",
  "totalEntries": 10,
  "entries": [
    {
      "id": "entry_1234567890_abc123",
      "timestamp": "2026-02-24T18:30:00Z",
      "topic": "React useEffect Dependencies",
      "category": "react",
      "tags": ["hooks", "performance"],
      "difficulty": "intermediate",
      "context": "Working on data fetching",
      "conceptLearned": "React compares dependencies by reference...",
      "whyItMatters": "Prevents infinite loops...",
      "futureApplication": "Always use primitive values...",
      "relatedConcepts": ["useMemo", "useCallback"],
      "quizQuestions": [
        {
          "question": "How does React compare dependencies?",
          "correctAnswer": "By reference (===)",
          "wrongAnswers": ["By value", "Deep equality", "Shallow"],
          "explanation": "React uses strict equality..."
        }
      ]
    }
  ]
}
```

## Quality Standards

The system enforces that entries contain **general, transferable knowledge**:

### ✅ Good Entries

- General principles applicable across projects
- Fundamental concepts
- Best practices
- Patterns you'll use repeatedly

**Examples:**
- "React hooks compare dependencies by reference"
- "TypeScript generics enable type-safe reusable functions"
- "CSS Grid excels at 2D layouts vs Flexbox for 1D"

### ❌ Bad Entries (Rejected)

- Debugging notes for specific issues
- Project-specific configurations
- One-time fixes
- Detailed debugging scenarios without general principles

**Examples:**
- "CI test failed on line 47" ❌
- "Fixed webpack config for project X" ❌
- "This specific error needs this fix" ❌

## Multi-Machine Sync

Synchronize your learning data across computers using git:

```bash
# On first machine
learning sync init --remote git@github.com:username/learning-data.git
learning sync push

# On second machine
learning sync init --remote git@github.com:username/learning-data.git
learning sync pull

# Regular sync
learning sync push  # After adding entries
learning sync pull  # Before working
```

See [docs/SYNC.md](docs/SYNC.md) for details.

## Project Structure

```
learning-system/
├── packages/
│   ├── cli/                    # CLI tool
│   │   ├── src/
│   │   │   ├── commands/       # CLI commands
│   │   │   ├── lib/            # Core logic
│   │   │   └── types/          # TypeScript types
│   │   └── package.json
│   │
│   ├── quiz-app/               # Web quiz app
│   │   ├── src/
│   │   │   ├── components/     # React components
│   │   │   └── lib/            # Data loading & quiz logic
│   │   └── package.json
│   │
│   └── integrations/           # Platform integrations
│       ├── cursor/             # Cursor IDE
│       └── vscode/             # VS Code Copilot
│
├── install.sh                  # Master installer
├── uninstall.sh               # Uninstaller
├── README.md                  # This file
└── docs/                      # Documentation
    ├── CLI.md
    ├── INTEGRATIONS.md
    ├── QUIZ_APP.md
    └── SYNC.md
```

## Development

### Building the CLI

```bash
cd packages/cli
bun install
bun run build
bun link
```

### Running the Quiz App in Development

```bash
cd packages/quiz-app
bun install
bun dev
```

### Running Tests

```bash
bun test
```

## Documentation

- [CLI Usage](docs/CLI.md) - Complete CLI reference
- [Integrations](docs/INTEGRATIONS.md) - Platform integration guides
- [Quiz App](docs/QUIZ_APP.md) - Web app usage
- [Sync Guide](docs/SYNC.md) - Multi-machine synchronization

## Uninstall

```bash
./uninstall.sh
```

This removes:
- CLI tool global link
- Cursor integration files
- VS Code integration (manual step)

Your `~/LEARNING.json` file is **preserved**. To delete it:

```bash
rm ~/LEARNING.json
rm -rf ~/learning-data  # Also remove sync data
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- Issues: [GitHub Issues](https://github.com/yourusername/learning-system/issues)
- Discussions: [GitHub Discussions](https://github.com/yourusername/learning-system/discussions)

## Roadmap

Future enhancements:
- [ ] Spaced repetition algorithm
- [ ] Desktop app (Tauri)
- [ ] Mobile app
- [ ] Cloud sync service
- [ ] Team collaboration features
- [ ] Export to Anki/Obsidian
- [ ] Browser extension
- [ ] Learning analytics dashboard

## Acknowledgments

Built to help developers build better mental models of the technologies they use.
