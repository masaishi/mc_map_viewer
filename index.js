import * as maplibregl from 'maplibre-gl';

var map = new maplibregl.Map({
  container: 'map',
  style: {
    version: 8,
    sources: {
      'minecraft-tiles': {
        type: 'raster',
        tiles: ['./data/tiles/12/{x}/{y}.png'],
        tileSize: 256,
        zoom: 12,
        minzoom: 0,
        maxzoom: 22,
      }
    },
    layers: [{
      id: 'minecraft-tiles',
      type: 'raster',
      source: 'minecraft-tiles',
      minzoom: 0,
      maxzoom: 22,
      paint: {
        'raster-opacity': 1,
      }
    }]
  },
  center: [0, 0],
  zoom: 12,
  maxZoom: 16,
  minZoom: 8,
});

// Wait until the map and its styles are fully loaded
map.on('load', function() {
  map.on('mousemove', function(e) {
    const {
      lng,
      lat
    } = e.lngLat;
    const metersPerPixel = calculateMetersPerPixel(12, lat);
    const {
      lngDist,
      latDist
    } = getTileCoordinates(lng, lat);

    const mcX = Math.floor(lngDist / metersPerPixel);
    const mcZ = Math.floor(latDist / metersPerPixel) * -1;

    document.getElementById('info').innerHTML = `Minecraft coordinates: [x: ${mcX}, z: ${mcZ}]`;
  });
});

function calculateMetersPerPixel(zoom, latitude, tileSize = 512) {
  const earthCircumference = 40075000; // In meters
  const latitudeRadians = latitude * Math.PI / 180;
  const cosLatitude = Math.cos(latitudeRadians);
  const scale = Math.pow(2, zoom);

  const metersPerPixel = (earthCircumference * cosLatitude) / (tileSize * scale);
  return metersPerPixel;
}

function getTileCoordinates(lng, lat) {
  const earthRadius = 6378137; // In meters
  const lngDist = lng * (Math.PI / 180) * Math.cos(lat * Math.PI / 180) * earthRadius;
  const latDist = lat * (Math.PI / 180) * earthRadius;
  return {
    lngDist,
    latDist
  };
}