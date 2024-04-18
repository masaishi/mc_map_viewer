#!/bin/bash

# Check if sufficient arguments are provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <world_backup_directory> <tile_size>"
    exit 1
fi

# Assign arguments to variables
WORLD_BACKUP_DIR=$1
TILE_SIZE=$2

# Set paths
DATA_DIR="./data"
TILES_PNG_DIR="$DATA_DIR/tiles_png"
TILES_DIR="$DATA_DIR/tiles"

# Ensure the output directories exist
mkdir -p $TILES_PNG_DIR
mkdir -p $TILES_DIR

# Step 1: Convert Minecraft region data to PNG using provided world backup and size
echo "Converting Minecraft region files to PNG..."
./rust_scripts/anvil tiles $WORLD_BACKUP_DIR --palette $DATA_DIR/palette.tar.gz --calculate-heights --out $TILES_PNG_DIR --size "$TILE_SIZE"

# Step 2: Convert the PNG tiles to server-ready tiles
echo "Converting PNG tiles to server-ready tiles..."
./scripts/transform_and_relocate_files.sh $TILES_PNG_DIR $TILES_DIR

# Step 3: Build and prepare assets with webpack
echo "Building web assets..."
rm -rf dist
npm run build

# Step 4: Deploy to GitHub Pages or any other hosting
echo "Deploying to hosting..."
npm run deploy

echo "Deployment completed successfully."
