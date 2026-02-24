#!/bin/bash
set -e

echo "========================================="
echo "Universal Learning System Installer"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo -e "${RED}Error: Node.js is not installed${NC}"
  echo "Please install Node.js from https://nodejs.org/"
  exit 1
fi

echo -e "${BLUE}Node.js version:${NC} $(node --version)"
echo ""

# Step 1: Install CLI globally
echo -e "${BLUE}[1/4] Installing CLI tool...${NC}"
cd packages/cli
npm install
npm run build || tsc
npm link
cd ../..
echo -e "${GREEN}✓ CLI tool installed${NC}"
echo ""

# Step 2: Install Cursor integration (if Cursor exists)
echo -e "${BLUE}[2/4] Installing Cursor integration...${NC}"
if [ -d ~/.cursor ]; then
  cd packages/integrations/cursor
  ./install.sh
  cd ../../..
  echo -e "${GREEN}✓ Cursor integration installed${NC}"
else
  echo -e "${RED}Skipped: ~/.cursor directory not found${NC}"
  echo "Install Cursor from https://cursor.sh/ if you want this integration"
fi
echo ""

# Step 3: Install VS Code integration (if code command exists)
echo -e "${BLUE}[3/4] Installing VS Code integration...${NC}"
if command -v code &> /dev/null; then
  cd packages/integrations/vscode
  ./install.sh
  cd ../../..
  echo -e "${GREEN}✓ VS Code integration installed${NC}"
else
  echo -e "${RED}Skipped: VS Code 'code' command not found${NC}"
  echo "Install VS Code from https://code.visualstudio.com/ if you want this integration"
fi
echo ""

# Step 4: Initialize LEARNING.json
echo -e "${BLUE}[4/4] Initializing LEARNING.json...${NC}"
if [ -f ~/LEARNING.json ]; then
  echo -e "${GREEN}✓ LEARNING.json already exists${NC}"
else
  learning init
  echo -e "${GREEN}✓ Created ~/LEARNING.json${NC}"
fi
echo ""

# Step 5: Install quiz app dependencies
echo -e "${BLUE}Installing quiz app dependencies...${NC}"
cd packages/quiz-app
npm install
cd ../..
echo -e "${GREEN}✓ Quiz app ready${NC}"
echo ""

echo "========================================="
echo -e "${GREEN}Installation Complete!${NC}"
echo "========================================="
echo ""
echo "Quick start guide:"
echo ""
echo "1. Add a learning entry:"
echo "   ${BLUE}learning add${NC}"
echo ""
echo "2. List your entries:"
echo "   ${BLUE}learning list${NC}"
echo ""
echo "3. Take a quiz:"
echo "   ${BLUE}learning quiz${NC}"
echo ""
echo "4. Start the quiz web app:"
echo "   ${BLUE}cd packages/quiz-app && npm run dev${NC}"
echo ""
echo "5. View all commands:"
echo "   ${BLUE}learning --help${NC}"
echo ""
echo "6. Set up git sync (optional):"
echo "   ${BLUE}learning sync init${NC}"
echo ""
echo "Your learning data is stored at: ~/LEARNING.json"
echo ""
