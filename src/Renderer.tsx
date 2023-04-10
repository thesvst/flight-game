import { useContext, useEffect, useRef, useState } from 'react';
import { MapboxGLMap, MapboxGLMapConfig, Plane } from '@core';
import { ThreeJSManager } from '@core';
import { BasicPlane } from '@planes';
import { HeadsUp } from '@components';
import styled from 'styled-components';
import { StoreContext } from '@providers';
import { CONTAINER_ID, initialLngLat } from '@core/MapboxGLMap/MapboxGLMap.types';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

const accessToken = import.meta.env.KMB_IT_MAPBOX_GL_API_KEY;

export const MAP_CONFIG: MapboxGLMapConfig = {
  mapOptions: {
    container: CONTAINER_ID,
    center: initialLngLat,
    zoom: 18,
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

  const { setVelocity, setBearing, setPitch, addDistance } = useContext(StoreContext);

  useEffect(() => {
    if (ThreeJSRef.current === undefined) {
      ThreeJSRef.current = new ThreeJSManager();
      ThreeJSRef.current._loadGLTFModel(PlaneRef.current.modelPath);
      PlaneRef.current.turnOnKeyboardControls();
    }

    if (MapRef.current === undefined) {
      MapRef.current = new MapboxGLMap(accessToken, MAP_CONFIG);
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
      const angle = PlaneRef.current.pitch;
      setVelocity(velocity);
      setBearing(planeBearing);
      setPitch(angle);
      if (modelRotation && PlaneRef.current)
        ThreeJSRef.current?._changeModelRotation({
          x: PlaneRef.current.pitch,
          y: modelRotation.y,
          z: planeBearing,
        });
      if (cameraPosition)
        ThreeJSRef.current?._changeCameraPosition({
          x: cameraPosition.x,
          y: PlaneRef.current.pitch * 2,
          z: cameraPosition.z,
        });
      ThreeJSRef.current?._rerender();

      const mapBearing = MapRef.current?._getBearing();
      if (LastFrameTimeRef.current && mapBearing !== undefined) {
        const timeFromLastFrame = (new Date().getTime() - LastFrameTimeRef.current.getTime()) * 0.001;
        MapRef.current?._setBearing(mapBearing + planeBearing);

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
