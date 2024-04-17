# mc_map_viewer

**mc_map_viewer** is a Github template tool designed to display interactive maps of Minecraft world data through a web interface. It leverages maplibre-gl-js and fastnbt to convert Minecraft's NBT and Anvil formats into raster tiles, allowing for dynamic visualization and exploration of Minecraft worlds.

![mc_map_viewer](https://github.com/masaishi/mc_map_viewer/assets/1396267/6fe60b13-7d60-404f-abef-c2307d8a8d53)

## Technologies Used

- **[MapLibre GL JS](https://github.com/maplibre/maplibre-gl-js)**: Employs WebGL2 to generate interactive vector maps.
- **[fastnbt](https://github.com/owengage/fastnbt/tree/master)**: Streamlines the serialization and deserialization of Minecraft's data formats.

## Setup Instructions

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/masaishi/mc_map_viewer.git
   cd mc_map_viewer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Deployment

To deploy the interactive map:

1. Prepare your Minecraft world backup and decide on a tile size.
2. Execute the deployment script with specified parameters:
   ```bash
   ./scripts/deploy_map.sh <world_backup_directory> <tile_size>
   ```

This process converts the Minecraft data into tiles and deploys the map to your chosen hosting service, like GitHub Pages.

## Configuration and Data Processing

### Rust Scripts

For utilizing the included Rust scripts:

1. Clone and compile the `fastnbt` repository:
   ```bash
   git clone https://github.com/owengage/fastnbt.git
   cd fastnbt
   cargo build --release --bin anvil
   cargo build --release --bin anvil-palette
   ```

2. Move the compiled binaries to your project directory:
   ```bash
   cp target/release/anvil /path/to/your/mc_map_viewer/rust_scripts/anvil
   cp target/release/anvil-palette /path/to/your/mc_map_viewer/rust_scripts/anvil-palette
   ```

### Preparing the Minecraft Palette

Generate a `palette.tar.gz` for your Minecraft version:

1. Find the `[Version].jar` file. Example: `1.20.4.jar`. On Windows, it's often at `C:\Users\[YourUsername]\AppData\Roaming\.minecraft\versions\[Version]\[Version].jar`, and on Mac, at `~/Library/Application Support/minecraft/versions/[Version]/[Version].jar`.
2. Create a temporary directory and copy `version.jar` there:
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
   ./path/to/your/mc_map_viewer/rust_scripts/anvil-palette /tmp/minecraft
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

- **`rust_scripts/anvil`**: Transforms Minecraft region files into PNG format.
- **`rust_scripts/tiles2server`**: Converts PNG tiles to web-compatible formats.
- **`scripts/transform_and_relocate_files.sh`**: Transforms PNG files into raster tiles for `maplibre-gl-js`.
- **`scripts/deploy_map.sh`**: Handles the entire process from data transformation to web deployment.
