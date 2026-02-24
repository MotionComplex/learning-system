#!/bin/bash
set -e

echo "========================================="
echo "Universal Learning System Uninstaller"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Warning: This will remove all integrations.${NC}"
echo -e "${YELLOW}Your LEARNING.json file will NOT be deleted.${NC}"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled"
  exit 0
fi
echo ""

# Step 1: Unlink CLI tool
echo -e "${BLUE}[1/3] Removing CLI tool...${NC}"
bun unlink @learning-system/cli 2>/dev/null || echo "CLI not linked globally"
echo -e "${GREEN}✓ CLI tool removed${NC}"
echo ""

# Step 2: Remove Cursor integration
echo -e "${BLUE}[2/3] Removing Cursor integration...${NC}"
if [ -f ~/.cursor/rules/knowledge-gap-detector.mdc ]; then
  rm ~/.cursor/rules/knowledge-gap-detector.mdc
  echo "Removed rule file"
fi
if [ -d ~/.cursor/skills/learning-tracker ]; then
  rm -rf ~/.cursor/skills/learning-tracker
  echo "Removed skill files"
fi
echo -e "${GREEN}✓ Cursor integration removed${NC}"
echo ""

# Step 3: Note about VS Code settings
echo -e "${BLUE}[3/3] VS Code integration...${NC}"
echo "To remove VS Code integration:"
echo "1. Open VS Code settings (Cmd/Ctrl + ,)"
echo "2. Search for 'copilot instructions'"
echo "3. Remove the custom instructions manually"
echo -e "${GREEN}✓ Instructions provided${NC}"
echo ""

echo "========================================="
echo -e "${GREEN}Uninstall Complete${NC}"
echo "========================================="
echo ""
echo "Your learning data at ~/LEARNING.json was preserved."
echo ""
echo "To completely remove your data:"
echo "  ${RED}rm ~/LEARNING.json${NC}"
echo ""
echo "To remove sync data:"
echo "  ${RED}rm -rf ~/learning-data${NC}"
echo ""
