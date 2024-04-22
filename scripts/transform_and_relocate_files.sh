#!/bin/bash

# Check if sufficient arguments are provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <source_directory> <target_directory>"
    exit 1
fi

source_directory=$1
target_directory=$2
z=16

# Create or clean target directory
if [ -d "$target_directory" ]; then
    rm -r "$target_directory"
fi
mkdir -p "$target_directory"

# Read directory contents and process files
for path in "$source_directory"/*; do
    filename=$(basename -- "$path")
    IFS='.' read -ra PARTS <<< "$filename"
    if [ ${#PARTS[@]} -lt 3 ]; then
        continue
    fi

    x=${PARTS[0]}
    y=${PARTS[1]}
    extension=${PARTS[2]}

    new_x=$(( (2**($z - 1)) + x ))
    new_y=$(( (2**($z - 1)) + y ))

    new_path="$target_directory/$z/$new_x/$new_y.$extension"
    mkdir -p "$(dirname "$new_path")"
    cp "$path" "$new_path"
    echo "$path -> $new_path"
done
