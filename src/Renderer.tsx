import { useContext, useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { MapboxGLMap, Tasker as TaskerClass, ThreeJSManager } from '@core';
import { BasicPlane } from '@planes';
import { HeadsUp, Compass, DirectionArrow } from '@components';
import styled from 'styled-components';
import { StoreContext } from '@providers';

interface RendererProps {
  ThreeJS: ThreeJSManager;
  Plane: BasicPlane;
  Map: MapboxGLMap;
  Tasker: TaskerClass;
}

export const Renderer = (props: RendererProps) => {
  const FramerRef = useRef<number>(0);
  const { setVelocity, setBearing, addDistance } = useContext(StoreContext);
  const { ThreeJS, Map, Plane, Tasker } = props;
  let LastFrameTime = new Date();

  let mapBearing = Map._getBearing()
  let position = Map.position

  function rerender() {
    Plane.planeMovementFraming();
    const velocity = Plane.velocity;
    const planeBearing = Plane.bearing;
    position = Map.position;
    mapBearing = Map._getBearing()

    // Plane handling
    // TODO: Implement as map layer instead of separated threejs scene
    ThreeJS._changeModelRotation({ x: 10, y: 0, z: planeBearing * 3 });
    ThreeJS._rerender();

    // Task Handling
    if (!Tasker.currentTask) {
      Tasker.availableTasks.forEach((task) => {
        const isInRange = MapboxGLMap._isInRange([position.lng, position.lat], task.coordinates, 100);
        if (isInRange) {
          Tasker._beginTask(task.id)
          if (Tasker.currentTask) {
            const currentTaskStep = Tasker._getCurrentTaskActiveStep();
            const nextDestination = Tasker.currentTask.steps[currentTaskStep].coordinates

            Map._removeMarkers(`img[${TaskerClass._markerType}]`);
            const taskMarker= TaskerClass._createHTMLTaskMarker(TaskerClass._markerClassName, `${task.id}`);
            Map._addMarker(taskMarker, nextDestination)
          }
        }
      })
    } else {
      const currentTaskStep = Tasker._getCurrentTaskActiveStep();
      const taskCords = Tasker.currentTask.steps[currentTaskStep].coordinates

      const isInRange = MapboxGLMap._isInRange([position.lng, position.lat], taskCords, 100);
      if (isInRange) {
        Map._removeMarkers(`img[${TaskerClass._markerType}="${Tasker.currentTask.id}"]`)
        const isNextStep = Tasker._isNextTaskStepAvailable();

        if (isNextStep) {
          Tasker._setNewStep();
          const step = Tasker._getCurrentTaskActiveStep();
          const id = Tasker.currentTask.id
          const cords = Tasker.currentTask.steps[step].coordinates
          Map._addMarker(TaskerClass._createHTMLTaskMarker(TaskerClass._markerClassName, `${id}`), cords)
        } else {
          Tasker._taskCompleted()

          Tasker.availableTasks.forEach((task) => {
            Map._addMarker(TaskerClass._createHTMLTaskMarker(TaskerClass._markerClassName, `${task.id}`), task.coordinates)
          })
        }
      }
    }

    // Map and values updates
    Map._setBearing(mapBearing + planeBearing);
    setVelocity(velocity);
    setBearing(planeBearing);
    const timeFromLastFrame = (new Date().getTime() - LastFrameTime.getTime()) * 0.001;
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
      <CompassWrapper>
      <CompassInnerWrapper>
        <Compass deg={mapBearing} />
      </CompassInnerWrapper>
      </CompassWrapper>
      { Tasker.currentTask && (
        <DirectionArrowWrapper>
          <DirectionArrow angle={MapboxGLMap._calculateAngleBetweenCoordinates(
            [Map.position.lng, Map.position.lat], Tasker.currentTask.steps[Tasker.currentTask.activeStep].coordinates, mapBearing
          )
          } />
        </DirectionArrowWrapper>
      )}
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

const CompassWrapper = styled('div')`
  z-index: 100;
  position: absolute;
  right: 5px;
  top: 45px;
`

const CompassInnerWrapper = styled('div')`
  transform: scale(.2);
  position: relative;
  top: -150px;
  right: -150px;
`

const DirectionArrowWrapper = styled('div')`
  position: absolute;
  z-index: 100;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
`