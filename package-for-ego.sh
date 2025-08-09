#!/bin/bash

# Package extension for extensions.gnome.org submission

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

EXTENSION_UUID="minimize-dimmer@leobenkel.com"
OUTPUT_FILE="${EXTENSION_UUID}.zip"

echo -e "${GREEN}Packaging for extensions.gnome.org${NC}"
echo "===================================="

# Clean console.log statements for production
echo -e "${YELLOW}Removing debug console.log statements...${NC}"
cp extension.js extension.js.bak
sed -i "s/console\.log/\/\/ console\.log/g" extension.js

# Compile schemas
echo -e "${YELLOW}Compiling schemas...${NC}"
glib-compile-schemas ./schemas/

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to compile schemas${NC}"
    mv extension.js.bak extension.js
    exit 1
fi

# Create package
echo -e "${YELLOW}Creating package...${NC}"
zip -r "${OUTPUT_FILE}" \
    metadata.json \
    extension.js \
    prefs.js \
    schemas/ \
    LICENSE \
    -x "*.git*" \
    -x "*.github*" \
    -x "*test*" \
    -x "*.sh" \
    -x "*.md" \
    -x "*.bak" \
    -x "*~" \
    -x "Dockerfile*" \
    -x "package*.json" \
    -x "node_modules/*" \
    -x ".eslintrc*"

# Restore original extension.js
mv extension.js.bak extension.js

if [ -f "${OUTPUT_FILE}" ]; then
    SIZE=$(du -h "${OUTPUT_FILE}" | cut -f1)
    echo -e "${GREEN}✓ Package created successfully!${NC}"
    echo -e "  File: ${OUTPUT_FILE}"
    echo -e "  Size: ${SIZE}"
    echo
    echo "Next steps:"
    echo "1. Test the package locally:"
    echo "   gnome-extensions install --force ${OUTPUT_FILE}"
    echo
    echo "2. Submit to extensions.gnome.org:"
    echo "   https://extensions.gnome.org/upload/"
    echo
    echo "3. Required for submission:"
    echo "   - Screenshot showing the dimming effect"
    echo "   - GPL-3.0 license (already included)"
else
    echo -e "${RED}✗ Failed to create package${NC}"
    exit 1
fi

# Validate package
echo -e "\n${YELLOW}Validating package...${NC}"
unzip -l "${OUTPUT_FILE}" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Package is valid${NC}"
    echo
    echo "Package contents:"
    unzip -l "${OUTPUT_FILE}" | grep -E "Name|metadata\.json|extension\.js|prefs\.js|LICENSE|gschema\.xml" | head -20
else
    echo -e "${RED}✗ Package validation failed${NC}"
    exit 1
fi