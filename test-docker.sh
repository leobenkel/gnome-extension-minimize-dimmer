#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  Minimize Dimmer - Containerized Test${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    echo "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed${NC}"
    echo "Please install Docker Compose first"
    exit 1
fi

# Determine docker-compose command
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Parse arguments
MODE="auto"
if [ "$1" == "interactive" ] || [ "$1" == "-i" ]; then
    MODE="interactive"
fi

echo -e "${YELLOW}Mode: $MODE${NC}"
echo ""

if [ "$MODE" == "interactive" ]; then
    echo -e "${GREEN}Starting interactive test environment...${NC}"
    echo "This will allow you to manually test the extension in a containerized GNOME session."
    echo ""
    echo "Once started, you can:"
    echo "  1. Connect via VNC: localhost:5901 (password: testpass)"
    echo "  2. Connect via Web: http://localhost:6081/vnc.html"
    echo "  3. Use the terminal to run commands"
    echo ""
    echo -e "${YELLOW}Building container...${NC}"
    sudo $DOCKER_COMPOSE -f docker-compose.test.yml build test-interactive
    
    echo ""
    echo -e "${GREEN}Starting interactive container...${NC}"
    sudo $DOCKER_COMPOSE -f docker-compose.test.yml run --rm test-interactive
    
else
    echo -e "${GREEN}Running automated tests...${NC}"
    echo ""
    
    # Build the test container
    echo -e "${YELLOW}Building test container...${NC}"
    sudo $DOCKER_COMPOSE -f docker-compose.test.yml build test
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to build test container${NC}"
        exit 1
    fi
    
    echo ""
    echo -e "${YELLOW}Running tests...${NC}"
    echo ""
    
    # Run the tests
    sudo $DOCKER_COMPOSE -f docker-compose.test.yml up --abort-on-container-exit test
    
    # Capture exit code
    EXIT_CODE=$?
    
    # Clean up
    echo ""
    echo -e "${YELLOW}Cleaning up...${NC}"
    sudo $DOCKER_COMPOSE -f docker-compose.test.yml down
    
    if [ $EXIT_CODE -eq 0 ]; then
        echo ""
        echo -e "${GREEN}=========================================${NC}"
        echo -e "${GREEN}✓ All tests passed successfully!${NC}"
        echo -e "${GREEN}=========================================${NC}"
        echo ""
        echo "The extension is ready to be installed on your system."
        echo "Run './install.sh' to install it locally."
    else
        echo ""
        echo -e "${RED}=========================================${NC}"
        echo -e "${RED}✗ Tests failed${NC}"
        echo -e "${RED}=========================================${NC}"
        echo ""
        echo "Please fix the issues before installing the extension."
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}Test session complete.${NC}"