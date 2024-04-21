import * as maplibregl from 'maplibre-gl';

class MapState {
  constructor(zoom, center) {
    this.zoom = zoom; // number
    this.center = center; // {lat, lng}
  }
  
  static fromHash(hash) {
    const parts = hash.slice(1).split('/');
    if (parts.length === 3) {
      const zoom = parseFloat(parts[0]);
      const [x, z] = parts.slice(1).map(x => parseInt(x));
      const {lat, lng} = toLatLng({x, z});
      return new MapState(
        zoom,
        {lat, lng}
      );
    }
    return null;
  }

  encode() {
    const {x, z} = toMinecraftCoords(this.center);
    return `${this.zoom}/${x}/${z}`;
  }
  
}

const mapState = MapState.fromHash(window.location.hash);

var map = new maplibregl.Map({
  container: 'map',
  style: {
    version: 8,
    sources: {
      'minecraft-tiles': {
        type: 'raster',
        tiles: ['./tiles/16/{x}/{y}.png'],
        tileSize: 256,
        zoom: 16,
        minzoom: 16,
        maxzoom: 16,
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
  center: mapState ? [mapState.center.lat, mapState.center.lng] : [0, 0],
  zoom: mapState ? mapState.zoom : 16,
  maxZoom: 20,
  minZoom: 8,
});

// Wait until the map and its styles are fully loaded
map.on('load', function() {
  map.on('mousemove', function(e) {
    const {
      lng,
      lat
    } = e.lngLat;
    const {
      x: mcX,
      z: mcZ
    } = toMinecraftCoords({
      lng,
      lat
    });

    document.getElementById('info').innerHTML = `Minecraft coordinates: [x: ${mcX}, z: ${mcZ}]`;
  });

  map.on('move', function() {
    // encode the current map center coordinates to the URL hash
    const center = toMinecraftCoords(map.getCenter());
    const zoom = map.getZoom();
    window.location.hash = encodeMapState(zoom, center);
  });
});

function toMinecraftCoords({lat, lng}) {
  const metersPerPixel = calculateMetersPerPixel(12, 0);
  const {
    lngDist,
    latDist
  } = getTileCoordinates(lng, lat);

  const mcX = Math.floor(lngDist / metersPerPixel);
  const mcZ = Math.floor(latDist / metersPerPixel) * -1;

  return {
    x: mcX,
    z: mcZ
  };
}

function toLatLng({x, z}) {
  const metersPerPixel = calculateMetersPerPixel(12, 0);
  const latDist = x * metersPerPixel;
  const lngDist = z * metersPerPixel * -1;
  return getTileCoordinatesInverse(lngDist, latDist);
}

function encodeMapState(zoom, {x, z}) {
  return `${zoom}/${x}/${z}`;
}

function decodeMapState(hash) {
  const parts = hash.slice(1).split('/');
  if (parts.length === 3) {
    return {
      zoom: parseFloat(parts[0]),
      center: [
        parseInt(parts[1]),
        parseInt(parts[2])
      ]
    };
  }
  return null;
}

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
  const latDist = lat * (Math.PI / 180) * earthRadius;
  const lngDist = lng * (Math.PI / 180) * Math.cos(lat * Math.PI / 180) * earthRadius;
  return {
    lngDist,
    latDist
  };
}

function getTileCoordinatesInverse(lngDist, latDist) {
  const earthRadius = 6378137; // In meters
  const lat = latDist / earthRadius * (180 / Math.PI);
  const lng = lngDist / ((Math.PI / 180) * Math.cos(lat * Math.PI / 180) * earthRadius);
  return {
    lng,
    lat
  };
}
