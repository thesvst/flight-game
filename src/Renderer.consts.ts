import { AirspaceIntelligenceGdanskCords, initialLngLat, MapboxGLMapConfig, Task } from '@core';

export const CONTAINER_ID = 'mapboxElement';
export const AirSpaceElement = document.createElement('img');
AirSpaceElement.src = '/airspace.jpeg';
AirSpaceElement.width = 60;
AirSpaceElement.height = 60;

export const MAP_CONFIG: MapboxGLMapConfig = {
  mapOptions: {
    container: CONTAINER_ID,
    center: initialLngLat,
    zoom: 15,
    maxZoom: 20,
    bearing: 0,
    pitch: 0,
    interactive: false,
    antialias: false,
    attributionControl: false,
    style: 'mapbox://styles/mapbox/satellite-streets-v12',
    logoPosition: 'top-right',
    optimizeForTerrain: true,
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
    name: 'Deliver a package to the Airspace Intelligence!',
    rewards: [],
    activeStep: 0,
    steps: [
      {
        id: 1,
        coordinates: AirspaceIntelligenceGdanskCords,
        name: 'Drop a package to AirspaceIntelligence Gdańsk',
      },
      {
        id: 2,
        coordinates: initialLngLat,
        name: 'Go back to the beach'
      }
    ],
  },
];
