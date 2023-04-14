import { useContext, useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { MapboxGLMap, Tasker as TaskerClass, ThreeJSManager, UnitsConverter } from '@core';
import { BasicPlane } from '@planes';
import { HeadsUp, Compass, DirectionArrow } from '@components';
import styled from 'styled-components';
import { StoreContext, EstimatedArrival } from '@providers';
import { QuestLog } from '@components/QuestLog/QuestLog';

interface RendererProps {
  ThreeJS: ThreeJSManager;
  Plane: BasicPlane;
  Map: MapboxGLMap;
  Tasker: TaskerClass;
}

export const Renderer = (props: RendererProps) => {
  const FramerRef = useRef<number>(0);
  const { setVelocity, setBearing, addDistance, setEstimatedArrival } = useContext(StoreContext);
  const { ThreeJS, Map, Plane, Tasker } = props;
  let LastFrameTime = new Date();

  let mapBearing = Map._getBearing()
  let position = Map.position
  let estimatedArrival: EstimatedArrival = null;
  let positionAsNumArr: [number, number] = [position.lng, position.lat]

  function rerender() {
    Plane.planeMovementFraming();
    const velocity = Plane.velocity;
    const planeBearing = Plane.bearing;
    position = Map.position;
    positionAsNumArr = [position.lng, position.lat]
    mapBearing = Map._getBearing()


    // Plane handling
    // TODO: Implement as map layer instead of separated threejs scene
    ThreeJS._changeModelRotation({ x: 10, y: 0, z: planeBearing * 3 });
    ThreeJS._rerender();

    // Task Handling
    if (!Tasker.currentTask) {
      estimatedArrival = null;
      setEstimatedArrival(null);

      Tasker.availableTasks.forEach((task) => {
        const isInRange = MapboxGLMap._isInRange(positionAsNumArr, task.coordinates, 100);

        if (isInRange) {
          Tasker._beginTask(task.id)
          if (Tasker.currentTask) {
            const destination = Tasker._getNextTaskStepCoordinates()
            const taskMarker = Tasker._createHTMLTaskMarker(`${task.id}`);

            Map._removeMarkers(`img[${Tasker._markerType}]`);
            Map._addMarker(taskMarker, destination)
          }
        }
      })
    } else {
      const destination = Tasker._getNextTaskStepCoordinates()
      const isInRange = MapboxGLMap._isInRange(positionAsNumArr, destination, 100);
      const velocityInMS = UnitsConverter.KmhToMs(velocity);
      estimatedArrival = MapboxGLMap._calculateArrivalTime(positionAsNumArr, destination, velocityInMS);

      if (isInRange) {
        Map._removeMarkers(`img[${Tasker._markerType}="${Tasker.currentTask.id}"]`)
        if (Tasker._isNextTaskStepAvailable()) {
          Tasker._setNewStep();
          const id = Tasker.currentTask.id
          const cords = Tasker._getNextTaskStepCoordinates()
          const marker = Tasker._createHTMLTaskMarker(`${id}`)

          Map._addMarker(marker, cords)
        } else {
          Tasker._taskCompleted()
          Tasker.availableTasks.forEach(({ id, coordinates }) => {
            const marker = Tasker._createHTMLTaskMarker(`${id}`)
            Map._addMarker(marker, coordinates)
          })
        }
      }
    }

    // Map and values updates
    const timeFromLastFrame = (new Date().getTime() - LastFrameTime.getTime()) * 0.001;
    const newPos = Map._calculateNewPosition(mapBearing + planeBearing, timeFromLastFrame, velocity);
    const distanceTraveled = new mapboxgl.LngLat(...newPos).distanceTo(position);

    Map._setBearing(mapBearing + planeBearing);
    Map._updateMapPosition(newPos);

    setVelocity(velocity);
    setBearing(planeBearing);
    addDistance(distanceTraveled);
    if (estimatedArrival) setEstimatedArrival(Math.round(estimatedArrival))

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
      <QuestLogWrapper>
        <QuestLog />
      </QuestLogWrapper>
      <CompassWrapper>
      <CompassInnerWrapper>
        <Compass deg={mapBearing} />
      </CompassInnerWrapper>
      </CompassWrapper>
      { Tasker.currentTask && (
        <DirectionArrowWrapper>
          <DirectionArrow
            angle={MapboxGLMap._calculateAngleBetweenCoordinates(positionAsNumArr, Tasker._getNextTaskStepCoordinates(), mapBearing)}
          />
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
const QuestLogWrapper = styled('div')`
  position: absolute;
  top: 160px;
  right: 0;
  z-index: 100;
  width: 300px;
  backdrop-filter: blur(5px);
  border: 1px solid #ccc;
`