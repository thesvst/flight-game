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
  const { setVelocity, setBearing, addDistance, setEstimatedArrival, setCompletedTasks, setAvailableTasks, setCurrentTask, store } = useContext(StoreContext);
  const { ThreeJS, Map, Plane, Tasker } = props;
  let LastFrameTime = new Date();

  let mapBearing = Map.getBearing()
  let position = Map.position
  let estimatedArrival: EstimatedArrival = null;
  let positionAsNumArr: [number, number] = [position.lng, position.lat]

  function rerender() {
    Plane.planeMovementFraming();
    const velocity = Plane.velocity;
    const planeBearing = Plane.bearing;
    position = Map.position;
    positionAsNumArr = [position.lng, position.lat]
    mapBearing = Map.getBearing()


    // Plane handling
    // TODO: Implement as map layer instead of separated threejs scene
    ThreeJS.changeModelRotation({ x: 10, y: 0, z: planeBearing * 3 });
    ThreeJS.rerender();

    // Task Handling
    if (!Tasker.currentTask) {
      estimatedArrival = null;
      setEstimatedArrival(null);

      Tasker.availableTasks.forEach((task) => {
        const isInRange = MapboxGLMap.isInRange(positionAsNumArr, task.coordinates, 100);

        if (isInRange) {
          Tasker.beginTask(task.id)
          if (Tasker.currentTask) {
            const destination = Tasker.getNextTaskStepCoordinates()
            const taskMarker = Tasker.createHTMLTaskMarker(`${task.id}`);

            Map.removeMarkers(`img[${Tasker._markerType}]`);
            Map.addMarker(taskMarker, destination)
          }
        }
      })
    } else {
      const destination = Tasker.getNextTaskStepCoordinates()
      const isInRange = MapboxGLMap.isInRange(positionAsNumArr, destination, 100);
      const velocityInMS = UnitsConverter.KmhToMs(velocity);
      estimatedArrival = MapboxGLMap.calculateArrivalTime(positionAsNumArr, destination, velocityInMS);

      if (isInRange) {
        Map.removeMarkers(`img[${Tasker._markerType}="${Tasker.currentTask.id}"]`)
        if (Tasker.isNextTaskStepAvailable()) {
          Tasker.setNewStep();
          const id = Tasker.currentTask.id
          const cords = Tasker.getNextTaskStepCoordinates()
          const marker = Tasker.createHTMLTaskMarker(`${id}`)

          Map.addMarker(marker, cords)
        } else {
          Tasker.taskCompleted()
          Tasker.availableTasks.forEach(({ id, coordinates }) => {
            const marker = Tasker.createHTMLTaskMarker(`${id}`)
            Map.addMarker(marker, coordinates)
          })

          setAvailableTasks(Tasker.availableTasks)
          setCurrentTask(Tasker.currentTask)
          setCompletedTasks(Tasker.completedTasks)
        }
      }
    }

    // Map and values updates
    const timeFromLastFrame = (new Date().getTime() - LastFrameTime.getTime()) * 0.001;
    const newPos = Map.calculateNewPosition(mapBearing + planeBearing, timeFromLastFrame, velocity);
    const distanceTraveled = new mapboxgl.LngLat(...newPos).distanceTo(position);

    Map.setBearing(mapBearing + planeBearing);
    Map.updateMapPosition(newPos);

    if (store.velocity !== velocity) setVelocity(velocity);
    if (store.bearing !== planeBearing) setBearing(planeBearing);
    if (store.distance !== distanceTraveled) addDistance(distanceTraveled);

    if (store.questLog.available.length !== Tasker.availableTasks.length) setAvailableTasks(Tasker.availableTasks);
    if (JSON.stringify(store.questLog.current) !== JSON.stringify(Tasker.currentTask)) setCurrentTask(Tasker.currentTask);
    if (store.questLog.completed.length !== Tasker.completedTasks.length) setCompletedTasks(Tasker.completedTasks)

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
            angle={MapboxGLMap.calculateAngleBetweenCoordinates(positionAsNumArr, Tasker.getNextTaskStepCoordinates(), mapBearing)}
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