# Platform Integrations

Guide for setting up learning system integrations with different IDEs and tools.

## Cursor IDE Integration

### Installation

```bash
cd packages/integrations/cursor
./install.sh
```

Or manually:

```bash
cp rules/knowledge-gap-detector.mdc ~/.cursor/rules/
cp -r skills/learning-tracker ~/.cursor/skills/
```

Restart Cursor after installation.

### Features

- **Automatic Detection**: Cursor detects when you learn fundamental concepts
- **Smart Suggestions**: Only suggests for general, transferable knowledge
- **Quality Filters**: Rejects project-specific debugging notes
- **CLI Integration**: Can use CLI tool as alternative

### Usage

During conversations, Cursor will suggest:

```
Would you like me to add this to your learning log? 
I noticed you learned about React dependency comparison.
```

You can also explicitly request:

```
"Add this to my learning log"
"Save this learning"
```

Cursor will:
1. Extract the general principle
2. Validate it's not too specific
3. Format the entry with all required fields
4. Generate quiz questions
5. Add to ~/LEARNING.json

### Configuration

Files installed:
- `~/.cursor/rules/knowledge-gap-detector.mdc` - Detection rule
- `~/.cursor/skills/learning-tracker/SKILL.md` - Management skill

See [packages/integrations/cursor/README.md](../packages/integrations/cursor/README.md)

## VS Code Copilot Integration

### Installation

```bash
cd packages/integrations/vscode
./install.sh
```

This adds custom Copilot instructions to your VS Code settings.

### Manual Installation

1. Open VS Code Settings (Cmd/Ctrl + ,)
2. Search for "copilot instructions"
3. Click "Edit in settings.json"
4. Add content from `settings-template.json`

### Features

- **Learning Detection**: Copilot watches for learning moments
- **CLI Suggestions**: Recommends using the CLI tool
- **Quality Standards**: Focuses on general principles
- **JSON Formatting**: Helps format entries for CLI

### Usage

Copilot will suggest during conversations:

```
This seems like an important principle! 
Would you like to add this to your learning log?

You can use: learning add
Or I can format it as JSON for you.
```

To add an entry:

```bash
learning add  # Interactive
learning add --json '{...}'  # With Copilot's formatted JSON
```

### Configuration

Settings added to `~/.vscode/settings.json`:

```json
{
  "github.copilot.chat.instructions": "...",
  "github.copilot.chat.codeGeneration.instructions": [...]
}
```

See [packages/integrations/vscode/README.md](../packages/integrations/vscode/README.md)

## CLI Integration (All Platforms)

Works everywhere the CLI is installed.

```bash
learning add              # Add entry
learning list             # View entries
learning quiz             # Test knowledge
learning search "query"   # Search
learning stats            # Statistics
```

See [CLI.md](CLI.md) for complete reference.

## Comparison

| Feature | Cursor | VS Code Copilot | CLI |
|---------|--------|-----------------|-----|
| Auto-detect learnings | ✓ | ✓ | - |
| Interactive prompts | ✓ | - | ✓ |
| Terminal quiz | - | - | ✓ |
| Quality validation | ✓ | ✓ | ✓ |
| JSON import | ✓ | ✓ | ✓ |
| Works offline | ✓ | Needs GitHub | ✓ |

## Troubleshooting

### Cursor Not Detecting

1. Check rule is installed: `ls ~/.cursor/rules/`
2. Check skill is installed: `ls ~/.cursor/skills/learning-tracker/`
3. Restart Cursor
4. Try explicit: "Add this to my learning log"

### VS Code Copilot Not Suggesting

1. Check settings.json has instructions
2. Restart VS Code
3. Clear Copilot cache: Cmd/Ctrl+Shift+P → "Clear Copilot Cache"
4. Ensure Copilot is active

### CLI Not Found

```bash
cd packages/cli
npm link
```

### Integration Not Installing

Check permissions:

```bash
chmod +x packages/integrations/*/install.sh
```

## Uninstalling

### Cursor

```bash
rm ~/.cursor/rules/knowledge-gap-detector.mdc
rm -rf ~/.cursor/skills/learning-tracker
```

### VS Code

1. Open settings.json
2. Remove `github.copilot.chat.instructions`
3. Remove `github.copilot.chat.codeGeneration.instructions`

### CLI

```bash
npm unlink -g @learning-system/cli
```

Or use master uninstaller:

```bash
./uninstall.sh
```

## Best Practices

1. **Use Multiple Integrations**: Cursor for IDE work, CLI for terminal, quiz app for review

2. **Consistent Quality**: All integrations enforce the same quality standards

3. **Sync Regularly**: Use `learning sync` to keep data synchronized

4. **Review Weekly**: Use any interface to review and test your knowledge

5. **Custom Workflows**: Combine integrations in scripts

Example workflow:

```bash
# Morning: Review recent learnings in terminal
learning list --recent 10

# During work: Cursor detects and adds learnings automatically

# Evening: Test knowledge with quiz app
cd packages/quiz-app && npm run dev

# Before bed: Sync
learning sync push
```

## Creating Custom Integrations

Want to integrate with another tool? The system is extensible:

1. **Data Format**: Use the `~/LEARNING.json` schema
2. **CLI Tool**: Call `learning` commands from your integration
3. **Quality Validation**: Use the validation rules in `packages/cli/src/lib/validation.ts`
4. **Quiz Generation**: Import quiz logic from `packages/cli/src/lib/quiz-engine.ts`

Example Python integration:

```python
import subprocess
import json

def add_learning(entry):
    subprocess.run([
        'learning', 'add', '--json',
        json.dumps(entry)
    ])

# Use in your tool
add_learning({
    "topic": "Python decorators",
    "category": "python",
    ...
})
```

## Support

- File issues: GitHub Issues
- Feature requests: GitHub Discussions
- Integration help: See platform-specific READMEs
