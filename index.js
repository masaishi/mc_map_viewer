import * as maplibregl from 'maplibre-gl';

var map = new maplibregl.Map({
	container: 'map',
	style: {
		version: 8,
		sources: {
			'minecraft-tiles': {
				type: 'raster',
				tiles: ['./data/tiles/{z}/{x}/{y}.png'],
				tileSize: 256,
				zoom: 12,
				minZoom: 12,
				maxZoom: 12,
			}
		},
		layers: [{
			id: 'minecraft-tiles',
			type: 'raster',
			source: 'minecraft-tiles'
		}]
	},
	center: [0, 0],
	zoom: 12,
	maxZoom: 14,
	minZoom: 0,
});
