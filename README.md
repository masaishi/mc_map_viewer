# mc_map_viewer

The **mc_map_viewer** GitHub template offers a solution for visualizing your Minecraft world. By running deploy script, you can effortlessly generate terrain images by using from your Minecraft region data by using **[fastnbt](https://github.com/owengage/fastnbt/tree/master)**. Then, publish them as an interactive map site on GitHub Pages by using **[MapLibre GL JS](https://github.com/maplibre/maplibre-gl-js)**

![mc_map_viewer](https://github.com/masaishi/mc_map_viewer/assets/1396267/75d92f76-1345-4a0b-9318-345bdf8a2345)

## Technologies Used

- **[MapLibre GL JS](https://github.com/maplibre/maplibre-gl-js)**: Employs WebGL2 to generate interactive vector maps.
- **[fastnbt](https://github.com/owengage/fastnbt/tree/master)**: Streamlines the serialization and deserialization of Minecraft's data formats.

## Setup Instructions

### Rust Installation

1. Install Rust using rustup (recommended method for managing Rust versions and associated tools):
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. Install mapback-rs, it is a tool to generate roughly images for unzoomed maps:

	```bash
	cargo install mapback-rs
	```

### Repository Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/masaishi/mc_map_viewer.git
   cd mc_map_viewer
   ```

2. Install JavaScript dependencies:
   ```bash
   npm install
   ```

### Compile Rust Programs

1. Navigate to the `fastnbt` directory inside `rust_src`:
   ```bash
   cd rust_src/fastnbt
   ```

2. Compile the `anvil` binary:
   ```bash
   cargo build --release --bin anvil
   ```

3. Move the compiled `anvil` executable to `rust_bin`:
   ```bash
   mv target/release/anvil ../../rust_bin/
   ```

### Deployment

To deploy the interactive map:

1. Prepare your Minecraft world backup and decide on a tile size.
2. Execute the deployment script with specified parameters:
   ```bash
   ./scripts/deploy_map.sh <world_backup_directory>
   ```

This process converts the Minecraft data into tiles and deploys the map to your chosen hosting service, like GitHub Pages.

## Developer Guide

### Convert Your Minecraft Map Data

Before deploying your map, convert your Minecraft data into usable tiles:

1. Run the conversion script:
   ```bash
   ./scripts/convert_tiles.sh <world_directory>
   ```

### Test the Interactive Map Locally

To check your site locally before deployment:

1. Start the development server:
   ```bash
   npm run serve
   ```

This command will host your site locally, allowing you to review changes in real-time.

### Palette Generation

#### Compiling the Palette Generator

1. Ensure you are in the `fastnbt` directory:
   ```bash
   # If not already in the fastnbt directory
   cd rust_scripts/fastnbt
   ```

2. Compile the `anvil-palette` tool:
   ```bash
   cargo build --release --bin anvil-palette
   ```

3. Move the compiled `anvil-palette` executable to the `rust_bin` directory: 
   ```bash
   mv target/release/anvil-palette ../../rust_bin/
   ```

#### Preparing the Minecraft Palette

Generate a `palette.tar.gz` for your Minecraft version:

1. Locate the `[Version].jar` file. Example: `1.20.4.jar`. On Windows, it's often at `C:\Users\[YourUsername]\AppData\Roaming\.minecraft\versions\[Version]\[Version].jar`, and on Mac, at `~/Library/Application Support/minecraft/versions/[Version]/[Version].jar`.
2. Create a temporary directory and copy the version jar there:
   ```bash
   mkdir /tmp/minecraft
   cp path/to/minecraft/versions/[Version]/[Version].jar /tmp/minecraft/version.jar
   ```

3. Open the JAR file:
   ```bash
   cd /tmp/minecraft
   jar xf version.jar
   ```

4. Run the `anvil-palette` script to create the palette file:
   ```bash
   ./path/to/your/mc_map_viewer/rust_scripts/fastnbt/target/release/anvil-palette /tmp/minecraft
   ```

5. Transfer `palette.tar.gz` to your project’s `data` directory:
   ```bash
   mv palette.tar.gz /path/to/your/mc_map_viewer/data/
   ```

## Server and Build Commands

- `npm start`: Launches the development server.
- `npm run build`: Compiles the project with Webpack.
- `npm run deploy`: Deploys the compiled project to GitHub Pages.

## Overview of Scripts
- **`rust_scripts/fastnbt`**: Fast serde serializer and deserializer for Minecraft's NBT and Anvil formats. Repository: [owengage/fastnbt](https://github.com/owengage/fastnbt/tree/master)
- **`scripts/transform_and_relocate_files.sh`**: Transforms PNG files into raster tiles suitable for use with the `maplibre-gl-js` mapping library, ensuring they are ready for web deployment.
- **`scripts/convert_tiles.sh`**: Converts Minecraft region data into PNG files and then transforms these PNG files into server-ready tiles. The `tile_size` parameter is optional; if not provided, default sizing is applied. To generate smaller tiles, you can specify the size, e.g., "5,5" for finer granularity.
   Usage:
   ```bash
   ./scripts/convert_tiles.sh <world_directory> [tile_size]
   ```
- **`scripts/deploy_map.sh`**: Orchestrates the entire deployment process, from data conversion to publishing on the web. It runs the `convert_tiles.sh` script to handle data conversion and then performs additional steps to build and deploy the web assets. The `tile_size` is optional and can be included if specific tile dimensions are needed.
   Usage:
   ```bash
   ./scripts/deploy_map.sh <world_directory> [tile_size]
   ```
