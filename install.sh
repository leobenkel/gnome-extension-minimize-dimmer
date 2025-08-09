#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

EXTENSION_UUID="minimize-dimmer@leobenkel.com"
EXTENSION_DIR="$HOME/.local/share/gnome-shell/extensions/$EXTENSION_UUID"
CURRENT_DIR="$(pwd)"

echo -e "${GREEN}Installing Minimize Dimmer GNOME Extension${NC}"
echo "======================================"

# Compile schemas
echo -e "\n${YELLOW}Compiling GSettings schemas...${NC}"
glib-compile-schemas ./schemas/

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to compile schemas${NC}"
    exit 1
fi

# Create extension directory if it doesn't exist
mkdir -p "$HOME/.local/share/gnome-shell/extensions/"

# Remove old symlink/directory if it exists
if [ -e "$EXTENSION_DIR" ]; then
    echo -e "${YELLOW}Removing old installation...${NC}"
    rm -rf "$EXTENSION_DIR"
fi

# Create symlink to development directory
echo -e "${YELLOW}Creating symlink to extension...${NC}"
ln -s "$CURRENT_DIR" "$EXTENSION_DIR"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Extension installed successfully!${NC}"
    echo
    echo "Next steps:"
    echo "1. Restart GNOME Shell:"
    echo "   - On X11: Press Alt+F2, type 'r', press Enter"
    echo "   - On Wayland: Log out and log back in"
    echo "   - Or test in nested session: dbus-run-session -- gnome-shell --nested --wayland"
    echo
    echo "2. Enable the extension:"
    echo "   gnome-extensions enable $EXTENSION_UUID"
    echo
    echo "3. Configure settings (after enabling):"
    echo "   gnome-extensions prefs $EXTENSION_UUID"
    echo
    echo "To monitor logs:"
    echo "   journalctl -f -o cat /usr/bin/gnome-shell | grep -i dimmer"
else
    echo -e "${RED}✗ Failed to create symlink${NC}"
    exit 1
fi