#!/bin/bash

# Clean script for game-framework repo
echo "Cleaning repository..."

# Remove node_modules
if [ -d "node_modules" ]; then
  echo "Removing node_modules directory..."
  rm -rf node_modules
fi

# Remove build artifacts
if [ -d "dist" ]; then
  echo "Removing dist directory..."
  rm -rf dist
fi

if [ -d "build" ]; then
  echo "Removing build directory..."
  rm -rf build
fi

# Remove docs
if [ -d "docs" ]; then
  echo "Removing docs directory..."
  rm -rf docs
fi

# Remove coverage reports
if [ -d "coverage" ]; then
  echo "Removing coverage directory..."
  rm -rf coverage
fi

# Remove TypeScript cache
find . -name "*.tsbuildinfo" -type f -delete

# Remove temporary files
find . -name "*.log" -type f -delete
find . -name "*.swp" -type f -delete
find . -name "*.swo" -type f -delete
find . -name ".DS_Store" -type f -delete

# Optional: Create a minimal repository
if [ "$1" == "--minimal" ]; then
  echo "Creating minimal repository..."

  # Create minimal package.json
  if [ -f "package.production.json" ]; then
    mv package.production.json package.json
  fi

  # Remove development files
  rm -f jest.config.js .eslintrc.json .prettierrc

  # Remove test directories
  rm -rf tests

  echo "Repository minimized!"
fi

echo "Repository cleaned!"
