#!/bin/bash
set -e

echo "Installing VS Code Copilot integration..."

# Check if VS Code is installed
if ! command -v code &> /dev/null; then
  echo "Warning: 'code' command not found in PATH"
  echo "VS Code may not be installed or not in PATH"
  echo ""
  echo "To add code to PATH:"
  echo "1. Open VS Code"
  echo "2. Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows/Linux)"
  echo "3. Type 'shell command' and select 'Install code command in PATH'"
  echo ""
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Determine VS Code settings file location
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  SETTINGS_FILE="$HOME/Library/Application Support/Code/User/settings.json"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  # Windows
  SETTINGS_FILE="$APPDATA/Code/User/settings.json"
else
  # Linux
  SETTINGS_FILE="$HOME/.config/Code/User/settings.json"
fi

echo "Settings file: $SETTINGS_FILE"

# Check if settings file exists
if [ ! -f "$SETTINGS_FILE" ]; then
  echo "Creating new settings file..."
  mkdir -p "$(dirname "$SETTINGS_FILE")"
  cp settings-template.json "$SETTINGS_FILE"
  echo "✓ Created settings with Copilot instructions"
else
  echo ""
  echo "VS Code settings.json already exists."
  echo ""
  echo "To add Copilot integration manually:"
  echo "1. Open VS Code settings (Cmd/Ctrl + ,)"
  echo "2. Search for 'copilot instructions'"
  echo "3. Click 'Edit in settings.json'"
  echo "4. Add the instructions from: $(pwd)/settings-template.json"
  echo ""
  echo "Or copy the template to your clipboard and merge manually:"
  echo "  cat $(pwd)/settings-template.json | pbcopy  # Mac"
  echo "  cat $(pwd)/settings-template.json | xclip    # Linux"
  echo ""
  
  read -p "Would you like to see the instructions to add? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    cat settings-template.json
    echo ""
  fi
fi

echo ""
echo "For reference, see: copilot-instructions.md"
echo ""
echo "✓ Installation complete!"
echo ""
echo "Restart VS Code for changes to take effect."
