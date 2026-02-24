#!/bin/bash
set -e

echo "Installing Cursor integration..."

# Check if ~/.cursor exists
if [ ! -d ~/.cursor ]; then
  echo "Error: ~/.cursor directory not found"
  echo "Please make sure Cursor is installed"
  exit 1
fi

# Create directories if they don't exist
mkdir -p ~/.cursor/rules
mkdir -p ~/.cursor/skills/learning-tracker

# Copy rule file
cp rules/knowledge-gap-detector.mdc ~/.cursor/rules/
echo "✓ Installed knowledge gap detector rule"

# Copy skill files
cp skills/learning-tracker/SKILL.md ~/.cursor/skills/learning-tracker/
echo "✓ Installed learning tracker skill"

echo ""
echo "✓ Cursor integration installed successfully!"
echo ""
echo "Restart Cursor to apply changes."
echo ""
echo "The AI will now:"
echo "  - Detect knowledge gaps during conversations"
echo "  - Suggest adding learnings to ~/LEARNING.json"
echo "  - Help manage your learning log"
