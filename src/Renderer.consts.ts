import { AirspaceIntelligenceGdanskCords, initialLngLat, MapboxGLMapConfig, Task } from '@core';

export const CONTAINER_ID = 'mapboxElement';
export const AirSpaceElement = document.createElement('img');
AirSpaceElement.src = '/airspace.jpeg';
AirSpaceElement.width = 60;
AirSpaceElement.height = 60;

export const maxZoom = 20;

export const MAP_CONFIG: MapboxGLMapConfig = {
  mapOptions: {
    container: CONTAINER_ID,
    center: initialLngLat,
    zoom: 12,
    maxZoom: 20,
    bearing: 0,
    pitch: 0,
    interactive: false,
    antialias: true,
    attributionControl: false,
    style: 'mapbox://styles/mapbox/satellite-streets-v12',
    logoPosition: 'top-right',
    optimizeForTerrain: false,
  },
  mapboxDem: {
    type: 'raster-dem',
    url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
    tileSize: 512,
    maxzoom: 14,
  },
  mapboxTerrain: { source: 'mapbox-dem', exaggeration: 1.5 },
};

export const tasks: Task[] = [
  {
    id: 1,
    coordinates: [18.658931053252115, 54.41619506500858],
    name: 'Collect a package!',
    rewards: [],
    activeStep: 0,
    steps: [
      {
        id: 1,
        coordinates: AirspaceIntelligenceGdanskCords,
        name: 'Drop a package to AirspaceIntelligence Gdańsk',
      },
    ],
  },
];
