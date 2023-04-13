import { useContext, useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { MapboxGLMap, Tasker, ThreeJSManager } from '@core';
import { BasicPlane } from '@planes';
import { HeadsUp } from '@components';
import styled from 'styled-components';
import { StoreContext } from '@providers';

interface RendererProps {
  ThreeJS: ThreeJSManager;
  Plane: BasicPlane;
  Map: MapboxGLMap;
  Tasker: Tasker;
}

export const Renderer = (props: RendererProps) => {
  const FramerRef = useRef<number>(0);
  const { setVelocity, setBearing, addDistance } = useContext(StoreContext);
  const { ThreeJS, Map, Plane } = props;
  let LastFrameTime = new Date();

  function rerender() {
    Plane.planeMovementFraming();
    const position = Map.position;
    const velocity = Plane.velocity;
    const planeBearing = Plane.bearing;
    setVelocity(velocity);
    setBearing(planeBearing);
    // TODO: Implement as map layer instead of separated threejs scene
    ThreeJS._changeModelRotation({ x: 10, y: 0, z: planeBearing * 3 });
    ThreeJS._rerender();

    if (!props.Tasker.currentTask) {
      props.Tasker.availableTasks.forEach((task) => {
        const isInRange = Map._isInRange([position.lng, position.lat], task.coordinates, 100);
        if (!isInRange) return

        props.Tasker._beginTask(task.id)
        if (props.Tasker.currentTask) {
          const currentTaskStep = props.Tasker._getCurrentTaskActieStep();
          const nextDestination = props.Tasker.currentTask.steps[currentTaskStep].coordinates

          props.Map._removeMarkers(`img[${Tasker._markerType}]`);
          const taskMarker= Tasker._createHTMLTaskMarker(Tasker._markerClassName, `${task.id}`);
          props.Map._addMarker(taskMarker, nextDestination)

        }
      })
    }

    const mapBearing = Map._getBearing();
    const timeFromLastFrame = (new Date().getTime() - LastFrameTime.getTime()) * 0.001;
    Map._setBearing(mapBearing + planeBearing);

    const newPos = Map._calculateNewPosition(mapBearing + planeBearing, timeFromLastFrame, velocity);

    const distanceTraveled = new mapboxgl.LngLat(...newPos).distanceTo(position);
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
