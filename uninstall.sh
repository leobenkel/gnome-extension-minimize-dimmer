#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

EXTENSION_UUID="minimize-dimmer@leobenkel.com"
EXTENSION_DIR="$HOME/.local/share/gnome-shell/extensions/$EXTENSION_UUID"

echo -e "${YELLOW}Uninstalling Minimize Dimmer GNOME Extension${NC}"
echo "============================================"

# Disable the extension first
echo -e "\n${YELLOW}Disabling extension...${NC}"
gnome-extensions disable "$EXTENSION_UUID" 2>/dev/null

# Remove the extension directory/symlink
if [ -e "$EXTENSION_DIR" ]; then
    echo -e "${YELLOW}Removing extension files...${NC}"
    rm -rf "$EXTENSION_DIR"
    echo -e "${GREEN}✓ Extension removed successfully${NC}"
else
    echo -e "${YELLOW}Extension not found at $EXTENSION_DIR${NC}"
fi

echo
echo "The extension has been uninstalled."
echo "You may need to restart GNOME Shell for changes to take full effect:"
echo "  - On X11: Press Alt+F2, type 'r', press Enter"
echo "  - On Wayland: Log out and log back in"