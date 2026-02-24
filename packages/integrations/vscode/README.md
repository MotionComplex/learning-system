# VS Code Copilot Integration

Integration for GitHub Copilot in VS Code to automatically detect knowledge gaps and suggest adding learnings.

## What's Included

- **Copilot Instructions** - Detailed guidelines for detecting learning moments
- **Settings Template** - VS Code settings for Copilot integration
- **Install Script** - Automated installation

## Prerequisites

- VS Code installed
- GitHub Copilot extension installed
- `learning-cli` tool installed globally

## Installation

### Automatic

From the repository root:

```bash
cd packages/integrations/vscode
./install.sh
```

### Manual

1. Open VS Code Settings (Cmd/Ctrl + ,)
2. Search for "copilot instructions"
3. Click "Edit in settings.json"
4. Merge the content from `settings-template.json`

Or copy directly:

```bash
# Mac
cat settings-template.json | pbcopy

# Linux
cat settings-template.json | xclip -selection clipboard
```

Then paste into your `settings.json`.

## How It Works

### Knowledge Gap Detection

GitHub Copilot will:
- Monitor conversations for significant learning moments
- Detect fundamental concepts and principles
- Suggest adding general knowledge to your learning log

It will **NOT** suggest for:
- Simple debugging notes
- Project-specific configurations  
- Trivial syntax questions
- One-time fixes

### Adding Entries

When Copilot suggests adding a learning, you can:

```bash
learning add              # Interactive prompt
learning add --json '{...}'  # Direct JSON input
```

Copilot will help format the entry correctly.

### Quality Standards

The integration enforces that entries contain:
- General, transferable principles
- Fundamental concepts
- Best practices applicable across projects
- Core misunderstandings corrected

## Example Interaction

**You:** "Why does my useEffect keep running?"

**Copilot:** "The issue is that objects in dependency arrays are compared by reference. When your component re-renders, the config object is recreated, so React sees it as a new value and re-runs the effect.

This is an important React concept! Would you like to add this to your learning log? You can run `learning add`."

## CLI Commands

Available commands:
- `learning add` - Add new entry
- `learning list` - View recent entries
- `learning search <query>` - Search entries
- `learning quiz` - Test knowledge
- `learning stats` - View statistics
- `learning sync` - Sync across machines

## Settings Reference

The integration adds these Copilot settings:

```json
{
  "github.copilot.chat.instructions": "Custom instruction for learning detection",
  "github.copilot.chat.codeGeneration.instructions": [
    "Individual instruction 1",
    "Individual instruction 2"
  ]
}
```

See `copilot-instructions.md` for the complete instruction set.

## Troubleshooting

### Copilot Not Detecting Learnings

1. Make sure GitHub Copilot is enabled
2. Verify settings.json contains the instructions
3. Restart VS Code
4. Try explicitly asking: "Should I add this to my learning log?"

### Settings Not Taking Effect

1. Check JSON syntax in settings.json
2. Restart VS Code
3. Clear Copilot cache: Cmd/Ctrl + Shift + P → "Clear Copilot Cache"

## Uninstall

Remove the added settings from your VS Code `settings.json`:
- Delete the `github.copilot.chat.instructions` field
- Delete the `github.copilot.chat.codeGeneration.instructions` field

Or restore from backup if you created one during installation.

## File Structure

```
vscode/
├── copilot-instructions.md        # Full instruction set
├── settings-template.json         # Settings to merge
├── install.sh                     # Installation script
└── README.md                      # This file
```

## Additional Resources

- [GitHub Copilot Docs](https://docs.github.com/en/copilot)
- [VS Code Settings](https://code.visualstudio.com/docs/getstarted/settings)
- Main repository README for CLI usage
