#!/bin/bash

# TQCC Website - Setup Script for macOS and Linux
# This script automates the installation of all required tools

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    echo -e "${2}${1}${NC}"
}

print_header() {
    echo ""
    print_message "========================================" "$BLUE"
    print_message "$1" "$BLUE"
    print_message "========================================" "$BLUE"
    echo ""
}

print_success() {
    print_message "✓ $1" "$GREEN"
}

print_error() {
    print_message "✗ $1" "$RED"
}

print_warning() {
    print_message "! $1" "$YELLOW"
}

# Welcome message
clear
print_header "TQCC Website Setup"
print_message "This script will install everything you need to work on the TQCC website." "$BLUE"
echo ""
print_message "This includes:" "$BLUE"
print_message "  • Homebrew (macOS package manager)" "$BLUE"
print_message "  • Node.js (JavaScript runtime)" "$BLUE"
print_message "  • Visual Studio Code (code editor)" "$BLUE"
print_message "  • VS Code extensions (Astro, Tailwind, etc.)" "$BLUE"
print_message "  • Project dependencies" "$BLUE"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

# Check if running on macOS or Linux
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macOS"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="Linux"
else
    print_error "This script only supports macOS and Linux"
    exit 1
fi

print_message "Detected OS: $OS" "$GREEN"
echo ""

# 1. Install Homebrew (macOS) or check for package manager (Linux)
print_header "Step 1: Package Manager"

if [[ "$OS" == "macOS" ]]; then
    if command -v brew &> /dev/null; then
        print_success "Homebrew is already installed"
    else
        print_message "Installing Homebrew..." "$YELLOW"
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

        # Add Homebrew to PATH
        if [[ -f "/opt/homebrew/bin/brew" ]]; then
            echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
            eval "$(/opt/homebrew/bin/brew shellenv)"
        fi

        print_success "Homebrew installed successfully"
    fi
else
    print_warning "On Linux, please ensure you have apt, yum, or another package manager"
fi

# 2. Install Node.js
print_header "Step 2: Node.js"

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js is already installed: $NODE_VERSION"

    # Check if version is acceptable (v18 or higher)
    MAJOR_VERSION=$(node --version | cut -d. -f1 | sed 's/v//')
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        print_warning "Node.js version is old. Recommend upgrading to v20 or higher."
        read -p "Would you like to upgrade Node.js? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            if [[ "$OS" == "macOS" ]]; then
                brew upgrade node
            else
                print_warning "Please upgrade Node.js manually"
            fi
        fi
    fi
else
    print_message "Installing Node.js..." "$YELLOW"
    if [[ "$OS" == "macOS" ]]; then
        brew install node
    else
        print_warning "Please install Node.js manually from https://nodejs.org/"
        exit 1
    fi
    print_success "Node.js installed successfully"
fi

# 3. Install Visual Studio Code
print_header "Step 3: Visual Studio Code"

if command -v code &> /dev/null; then
    print_success "Visual Studio Code is already installed"
else
    print_message "Installing Visual Studio Code..." "$YELLOW"
    if [[ "$OS" == "macOS" ]]; then
        brew install --cask visual-studio-code
        print_success "Visual Studio Code installed successfully"
        print_warning "You may need to restart your terminal for the 'code' command to work"
    else
        print_warning "Please install Visual Studio Code manually from https://code.visualstudio.com/"
        print_warning "After installation, continue with this script"
        read -p "Press Enter when VS Code is installed..."
    fi
fi

# 4. Install VS Code Extensions
print_header "Step 4: VS Code Extensions"

if command -v code &> /dev/null; then
    print_message "Installing VS Code extensions..." "$YELLOW"

    # List of extensions to install
    extensions=(
        "astro-build.astro-vscode"
        "bradlc.vscode-tailwindcss"
        "esbenp.prettier-vscode"
        "dbaeumer.vscode-eslint"
        "eamodio.gitlens"
    )

    for extension in "${extensions[@]}"; do
        if code --list-extensions | grep -q "$extension"; then
            print_success "$extension is already installed"
        else
            code --install-extension "$extension" --force
            print_success "Installed $extension"
        fi
    done
else
    print_warning "Could not find 'code' command. Please install extensions manually:"
    print_message "  1. Open VS Code" "$YELLOW"
    print_message "  2. Press Cmd+Shift+P (macOS) or Ctrl+Shift+P (Linux)" "$YELLOW"
    print_message "  3. Type 'Install Extensions' and select the command" "$YELLOW"
    print_message "  4. The recommended extensions will appear" "$YELLOW"
fi

# 5. Install Project Dependencies
print_header "Step 5: Project Dependencies"

if [ -f "package.json" ]; then
    print_message "Installing project dependencies..." "$YELLOW"
    npm install
    print_success "Dependencies installed successfully"
else
    print_error "package.json not found. Are you in the correct directory?"
    exit 1
fi

# 6. Final Instructions
print_header "Setup Complete!"

print_success "All tools have been installed successfully!"
echo ""
print_message "Next Steps:" "$GREEN"
print_message "  1. Open VS Code: code ." "$BLUE"
print_message "  2. Start the dev server: npm run dev" "$BLUE"
print_message "  3. Open browser: http://localhost:4321" "$BLUE"
echo ""
print_message "For more information, see GETTING_STARTED.md" "$YELLOW"
echo ""
print_message "Happy coding! 🚴‍♀️" "$GREEN"
echo ""

# Ask if user wants to open VS Code now
read -p "Would you like to open VS Code now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    code .
fi
