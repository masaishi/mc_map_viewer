#!/bin/bash

# Check if there are too few arguments
if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <world_directory> [tile_size]"
    exit 1
fi

# Assign arguments to variables
WORLD_DIR=$1
TILE_SIZE=$2

# Run the conversion script to handle steps 1 and 2
if [ -z "$TILE_SIZE" ]; then
    ./scripts/convert_tiles.sh $WORLD_DIR
else
    ./scripts/convert_tiles.sh $WORLD_DIR $TILE_SIZE
fi

# Build and prepare assets with webpack
echo "Building web assets..."
rm -rf dist
npm run build

# Deploy to GitHub Pages or any other hosting
echo "Deploying to hosting..."
npm run deploy

echo "Deployment completed successfully."
