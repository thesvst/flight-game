import { useContext, useEffect, useRef, useState } from 'react';
import { AirspaceIntelligenceGdanskCords, MapboxGLMap, MapboxGLMapConfig, Plane, Task } from '@core';
import { ThreeJSManager } from '@core';
import { BasicPlane } from '@planes';
import { HeadsUp } from '@components';
import styled from 'styled-components';
import { StoreContext } from '@providers';
import { CONTAINER_ID, initialLngLat } from '@core';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { Tasker } from '@core';

const accessToken = import.meta.env.KMB_IT_MAPBOX_GL_API_KEY;

const markerClassName = 'cylinder';

const maxZoom = 20;

export const MAP_CONFIG: MapboxGLMapConfig = {
  mapOptions: {
    container: CONTAINER_ID,
    center: initialLngLat,
    zoom: 18,
    maxZoom: 20,
    bearing: 0,
    pitch: 80,
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

const tasks: Task[] = [
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

if (!accessToken)
  prompt(
    `Hey! I couldn't find MapboxGLJS API key in env variables. \nTo proceed please provide API key :) \n\nTo do so you need to register here \nhttps://www.mapbox.com/ \n\nand then claim your API key :)`,
  );

export const Renderer = () => {
  const [animationEnabled, setAnimationEnabled] = useState(false);
  const ThreeJSRef = useRef<ThreeJSManager>();
  const PlaneRef = useRef<Plane>(new BasicPlane());
  const MapRef = useRef<MapboxGLMap>();
  const LastFrameTimeRef = useRef<Date>();
  const TasksRef = useRef(new Tasker(tasks));

  const { setVelocity, setBearing, setPitch, addDistance } = useContext(StoreContext);

  useEffect(() => {
    if (ThreeJSRef.current === undefined) {
      ThreeJSRef.current = new ThreeJSManager(undefined, undefined, undefined, undefined);
      ThreeJSRef.current._loadGLTFModel(PlaneRef.current.modelPath);
      PlaneRef.current.turnOnKeyboardControls();
    }

    if (MapRef.current === undefined) {
      MapRef.current = new MapboxGLMap(accessToken, MAP_CONFIG, markerClassName);
      MapRef.current.onLoadCallbacks([
        () => {
          TasksRef.current.availableTasks.forEach((task) => {
            MapRef.current?._render3DModelOnMap(
              task.coordinates,
              0,
              [Math.PI / 2, 0, 0],
              `mission-${task.id}-cylinder`,
              '/cylinder/scene.gltf',
              100,
            );
          });
        },
      ]);
      if (import.meta.env.DEV) Object.assign(window, { map: MapRef.current });
    }

    window.addEventListener('resize', () => ThreeJSRef.current?._onWindowResize());
  }, []);

  useEffect(() => {
    function animate() {
      PlaneRef.current.planeMovementFraming();
      const modelRotation = ThreeJSRef.current?.modelRotation;
      const cameraPosition = ThreeJSRef.current?.cameraPosition;
      const velocity = PlaneRef.current.velocity;
      const planeBearing = PlaneRef.current.bearing;
      const pitch = PlaneRef.current.pitch;
      const mapZoom = MapRef.current?._getZoom() ?? 0;
      setVelocity(velocity);
      setBearing(planeBearing);
      setPitch(pitch);
      if (modelRotation && PlaneRef.current)
        ThreeJSRef.current?._changeModelRotation({
          x: mapZoom === maxZoom ? 0 : PlaneRef.current.pitch,
          y: modelRotation.y,
          z: planeBearing,
        });
      if (cameraPosition)
        ThreeJSRef.current?._changeCameraPosition({
          x: cameraPosition.x,
          y: mapZoom === maxZoom ? 0 : PlaneRef.current.pitch * 2,
          z: cameraPosition.z,
        });
      ThreeJSRef.current?._rerender();

      const mapBearing = MapRef.current?._getBearing();
      if (LastFrameTimeRef.current && mapBearing !== undefined) {
        const timeFromLastFrame = (new Date().getTime() - LastFrameTimeRef.current.getTime()) * 0.001;
        MapRef.current?._setBearing(mapBearing + planeBearing);

        if (Math.sign(pitch) === 1) {
          MapRef.current?._setZoom(mapZoom + pitch * 0.005);
        } else {
          MapRef.current?._setZoom(mapZoom + pitch * 0.001);
        }

        const oldPos = MapRef.current?.position;
        const newPos = MapRef.current?._calculateNewPosition(mapBearing + planeBearing, timeFromLastFrame, velocity);

        if (oldPos && newPos) {
          const distanceTraveled = new mapboxgl.LngLat(...newPos).distanceTo(oldPos);
          MapRef.current?._updateMapPosition(newPos);
          addDistance(distanceTraveled);

          LastFrameTimeRef.current = new Date();
        }
      }

      requestAnimationFrame(animate);
    }

    if (!animationEnabled) {
      LastFrameTimeRef.current = new Date();
      animate();
      setAnimationEnabled(true);
    }
  }, []);

  return (
    <Wrapper>
      <MapContainer id={CONTAINER_ID} />
      <HeadsUpWrapper>
        <HeadsUp />
      </HeadsUpWrapper>
    </Wrapper>
  );
};

const HeadsUpWrapper = styled('div')`
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 100;
  width: 300px;
  backdrop-filter: blur(5px);
  border: 1px solid #ccc;
`;

const MapContainer = styled('div')`
  height: 100%;
`;

const Wrapper = styled('div')`
  width: 100vw;
  height: 100vh;
  position: relative;
`;
