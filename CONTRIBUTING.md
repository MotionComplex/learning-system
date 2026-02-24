# Contributing to Universal Learning System

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

Be respectful, constructive, and collaborative. We're all here to build better learning tools.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/learning-system.git
   cd learning-system
   ```
3. Install dependencies:
   ```bash
   npm install
   cd packages/cli && npm install
   cd ../quiz-app && npm install
   ```
4. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

### CLI Development

```bash
cd packages/cli
npm install
npm run build
npm link
```

Test your changes:

```bash
learning --help
learning add
```

### Quiz App Development

```bash
cd packages/quiz-app
npm install
npm run dev
```

Visit http://localhost:5173

### Integration Development

Test Cursor integration:

```bash
cd packages/integrations/cursor
./install.sh
# Restart Cursor and test
```

Test VS Code integration:

```bash
cd packages/integrations/vscode
./install.sh
# Restart VS Code and test
```

## Project Structure

```
learning-system/
├── packages/
│   ├── cli/                 # CLI tool
│   │   ├── src/
│   │   │   ├── commands/    # CLI commands
│   │   │   ├── lib/         # Core logic
│   │   │   └── types/       # TypeScript types
│   │   └── package.json
│   │
│   ├── quiz-app/            # Web quiz app
│   │   ├── src/
│   │   │   ├── components/  # React components
│   │   │   └── lib/         # Logic
│   │   └── package.json
│   │
│   └── integrations/        # Platform integrations
│       ├── cursor/          # Cursor IDE
│       └── vscode/          # VS Code
│
├── docs/                    # Documentation
├── install.sh              # Master installer
└── README.md              # Main readme
```

## Making Changes

### Code Style

- Use TypeScript for type safety
- Follow existing code style
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### CLI Commands

When adding a new command:

1. Create file in `packages/cli/src/commands/`
2. Implement command logic
3. Add to `packages/cli/src/index.ts`
4. Update documentation in `docs/CLI.md`

Example:

```typescript
// packages/cli/src/commands/export.ts
import chalk from 'chalk';
import { getAllEntries } from '../lib/storage.js';

export async function exportCommand(format: string): Promise<void> {
  const entries = getAllEntries();
  // Implementation...
}
```

### Quiz App Features

When adding a feature:

1. Create component in `packages/quiz-app/src/components/`
2. Add logic to `packages/quiz-app/src/lib/`
3. Update `App.tsx` if needed
4. Test responsiveness
5. Update `docs/QUIZ_APP.md`

### Integrations

When adding an integration:

1. Create directory in `packages/integrations/`
2. Add integration files
3. Create `install.sh` script
4. Write `README.md`
5. Update `docs/INTEGRATIONS.md`
6. Update master `install.sh`

## Testing

### Manual Testing

Test all affected features:

```bash
# CLI
learning add
learning list
learning quiz
learning search "test"
learning sync status

# Quiz app
cd packages/quiz-app && npm run dev
# Test all views and features

# Integrations
# Restart IDE and test detection
```

### Test Checklist

- [ ] CLI commands work
- [ ] Quiz app loads and displays correctly
- [ ] Integrations detect learnings
- [ ] Data syncs correctly
- [ ] Error handling works
- [ ] Documentation is updated

## Pull Request Process

1. Update documentation
2. Test your changes thoroughly
3. Commit with clear messages:
   ```bash
   git commit -m "feat: Add export command to CLI"
   git commit -m "fix: Handle empty quiz questions"
   git commit -m "docs: Update CLI documentation"
   ```
4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Create Pull Request:
   - Clear title and description
   - Reference any related issues
   - Include screenshots for UI changes
   - List what you tested

### Commit Message Format

Use conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance

Examples:

```
feat: Add CSV export for learning entries
fix: Handle quiz with zero questions
docs: Update sync guide with troubleshooting
```

## Areas for Contribution

### High Priority

- [ ] Unit tests for CLI commands
- [ ] Integration tests for sync
- [ ] Error boundary for quiz app
- [ ] Improved quiz question generation
- [ ] Windows install script
- [ ] Accessibility improvements

### Medium Priority

- [ ] Dark mode for quiz app
- [ ] Spaced repetition algorithm
- [ ] Performance optimizations
- [ ] Mobile app
- [ ] Browser extension
- [ ] Export to Anki/Obsidian

### Documentation

- [ ] Video tutorials
- [ ] More examples
- [ ] Troubleshooting guides
- [ ] Integration guides for other platforms

### Integrations

- [ ] JetBrains IDEs
- [ ] Vim/Neovim
- [ ] Emacs
- [ ] Claude desktop app
- [ ] ChatGPT

## Code Review

Pull requests will be reviewed for:

- Code quality and style
- Test coverage
- Documentation
- Performance
- Security
- User experience

## Questions?

- Open an issue for bugs
- Start a discussion for ideas
- Ask in pull request comments

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be added to:
- README.md acknowledgments
- CONTRIBUTORS.md file
- Release notes

Thank you for contributing! 🎉
