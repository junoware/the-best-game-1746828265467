#!/bin/bash

# Create a minimal distribution package for game-framework
echo "Creating distribution package..."

# Set output directory
OUTPUT_DIR="game-framework-dist"

# Clean previous output if it exists
if [ -d "$OUTPUT_DIR" ]; then
  rm -rf "$OUTPUT_DIR"
fi

# Create output directory structure
mkdir -p "$OUTPUT_DIR/src"

# Build the project
npm run build

# Copy essential files
cp -r dist "$OUTPUT_DIR/"
cp index.html "$OUTPUT_DIR/"
cp README.md "$OUTPUT_DIR/"
cp LICENSE "$OUTPUT_DIR/"
cp package.production.json "$OUTPUT_DIR/package.json"
cp vite.config.ts "$OUTPUT_DIR/"
cp tsconfig.json "$OUTPUT_DIR/"

# Copy source core files
cp -r src/core "$OUTPUT_DIR/src/"
cp -r src/render "$OUTPUT_DIR/src/"

# Copy example
mkdir -p "$OUTPUT_DIR/src/examples"
cp src/examples/example.ts "$OUTPUT_DIR/src/examples/"

# Create a ZIP file
zip -r "$OUTPUT_DIR.zip" "$OUTPUT_DIR"

echo "Distribution package created: $OUTPUT_DIR.zip"
echo "Size of distribution package:"
du -sh "$OUTPUT_DIR.zip"
