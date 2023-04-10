import { useContext, useEffect, useRef } from 'react';
import { MapboxGLMap } from '@core';
import { ThreeJSManager } from '@core';
import { BasicPlane } from '@planes';
import { HeadsUp } from '@components';
import styled from 'styled-components';
import { StoreContext } from '@providers';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { maxZoom } from './Renderer.consts';

interface RendererProps {
  ThreeJS: ThreeJSManager;
  Plane: BasicPlane;
  Map: MapboxGLMap;
}

export const Renderer = (props: RendererProps) => {
  const FramerRef = useRef<number>(0);
  const { setVelocity, setBearing, setPitch, addDistance } = useContext(StoreContext);
  const { ThreeJS, Map, Plane } = props;
  let LastFrameTime = new Date();

  function rerender() {
    Plane.planeMovementFraming();
    const modelRotation = ThreeJS.modelRotation;
    const cameraPosition = ThreeJS.cameraPosition;
    const velocity = Plane.velocity;
    const planeBearing = Plane.bearing;
    const pitch = Plane.pitch;
    const mapZoom = Map._getZoom() ?? 0;
    setVelocity(velocity);
    setBearing(planeBearing);
    setPitch(pitch);
    ThreeJS._changeModelRotation({
      x: mapZoom === maxZoom ? 0 : Plane.pitch,
      y: modelRotation?.y ?? 0,
      z: planeBearing,
    });
    if (cameraPosition)
      ThreeJS._changeCameraPosition({
        x: cameraPosition.x,
        y: mapZoom === maxZoom ? 0 : Plane.pitch * 2,
        z: cameraPosition.z,
      });
    ThreeJS._rerender();

    const mapBearing = Map._getBearing();
    const timeFromLastFrame = (new Date().getTime() - LastFrameTime.getTime()) * 0.001;
    Map._setBearing(mapBearing + planeBearing);

    if (Math.sign(pitch) === 1) {
      Map._setZoom(mapZoom + pitch * 0.005);
    } else {
      Map._setZoom(mapZoom + pitch * 0.001);
    }

    const oldPos = Map.position;
    const newPos = Map._calculateNewPosition(mapBearing + planeBearing, timeFromLastFrame, velocity);

    const distanceTraveled = new mapboxgl.LngLat(...newPos).distanceTo(oldPos);
    Map._updateMapPosition(newPos);
    addDistance(distanceTraveled);

    LastFrameTime = new Date();

    FramerRef.current = requestAnimationFrame(rerender);
  }

  useEffect(() => {
    if (import.meta.env.DEV) Object.assign(window, { map: Map });
    rerender();

    return () => {
      cancelAnimationFrame(FramerRef.current);
      Object.assign(window, { map: undefined });
    };
  }, []);

  return (
    <Wrapper>
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

const Wrapper = styled('div')`
  width: 100vw;
  height: 100vh;
  position: relative;
`;
