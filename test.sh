#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Testing Minimize Dimmer Extension in Nested Session${NC}"
echo "===================================================="
echo
echo -e "${YELLOW}This will open a nested GNOME Shell session for testing.${NC}"
echo "The extension will be automatically installed in the nested session."
echo
echo "To test:"
echo "1. Open some windows in the nested session"
echo "2. Minimize them to see the dimming effect"
echo "3. Close the nested window when done"
echo
echo "Press Enter to continue or Ctrl+C to cancel..."
read

# First install the extension
./install.sh

echo
echo -e "${YELLOW}Starting nested GNOME Shell session...${NC}"
echo "Close the window to exit the test session."
echo

# Run nested session
dbus-run-session -- gnome-shell --nested --wayland