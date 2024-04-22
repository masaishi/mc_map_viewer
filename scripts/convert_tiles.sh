#!/bin/bash

# Check if sufficient arguments are provided
if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <world_directory> [tile_size]"
    exit 1
fi

# Assign arguments to variables
WORLD_DIR=$1
TILE_SIZE=$2

# Set paths
DATA_DIR="./data"
PUBLIC_DIR="./public"
TILES_PNG_DIR="$DATA_DIR/tiles_png"
TILES_DIR="$PUBLIC_DIR/tiles"

# Ensure the output directories exist
mkdir -p $TILES_PNG_DIR
mkdir -p $TILES_DIR

# Step 1: Convert Minecraft region data to PNG
echo "Converting Minecraft region files to PNG..."
if [ -z "$TILE_SIZE" ]; then
    ./rust_bin/anvil tiles $WORLD_DIR --palette $DATA_DIR/palette.tar.gz --calculate-heights --out $TILES_PNG_DIR
else
    ./rust_bin/anvil tiles $WORLD_DIR --palette $DATA_DIR/palette.tar.gz --calculate-heights --out $TILES_PNG_DIR --size "$TILE_SIZE"
fi

# Step 2: Convert the PNG tiles to server-ready tiles
echo "Converting PNG tiles to server-ready tiles..."
./scripts/transform_and_relocate_files.sh $TILES_PNG_DIR $TILES_DIR
