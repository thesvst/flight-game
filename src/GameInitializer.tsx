import { AirspaceIntelligenceGdanskCords, MapboxGLMap, Tasker, ThreeJSManager } from '@core';
import { BasicPlane } from '@planes';
import { AccessTokenContext } from '@providers';
import { useContext, useEffect, useRef, useState } from 'react';
import { Renderer } from './Renderer';
import { AirSpaceElement, CONTAINER_ID, MAP_CONFIG, markerClassName, tasks } from './Renderer.consts';

export const GameInitializer = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const ThreeJS = useRef<ThreeJSManager>();
  const Plane = useRef<BasicPlane>();
  const Map = useRef<MapboxGLMap>();
  const Tasks = useRef<Tasker>();
  const token = useContext(AccessTokenContext);

  useEffect(() => {
    const PlaneObject = new BasicPlane();
    const MapObject = new MapboxGLMap(token, MAP_CONFIG, markerClassName);
    const ThreeJSObject = new ThreeJSManager(undefined, undefined, undefined, undefined, 'plane');
    const TaskerObject = new Tasker(tasks);

    PlaneObject.turnOnKeyboardControls();
    ThreeJSObject._loadGLTFModel(PlaneObject.modelPath);
    MapObject._onLoadCallbacks([
      () => setMapLoaded(true),
      () => {
        const rotation: [number, number, number] = [Math.PI / 2, 0, 0];
        TaskerObject.availableTasks.forEach((task) => {
          MapObject._render3DModelOnMap(
            task.coordinates,
            0,
            rotation,
            `mission-${task.id}-cylinder`,
            '/cylinder/scene.gltf',
            100,
          );
        });
      },
      () => {
        MapObject._addMarker(AirSpaceElement, AirspaceIntelligenceGdanskCords);
      },
    ]);

    window.addEventListener('resize', () => ThreeJSObject._onWindowResize());

    Plane.current = PlaneObject;
    ThreeJS.current = ThreeJSObject;
    Map.current = MapObject;
    Tasks.current = TaskerObject;

    return () => {
      const MapParentElement = document.querySelector(`#${CONTAINER_ID}`);
      const ThreeJSDomElement = document.querySelector(`#${ThreeJS.current?.DOMElementID}`);
      const MapThreeJSDOMElement = document.querySelector(`#${Map.current?.MapboxGLMapThreeJSDOMElementID}`);

      Plane.current?.turnOffKeyboardControls();

      if (ThreeJS.current) window.removeEventListener('resize', ThreeJS.current._onWindowResize);

      ThreeJS.current = undefined;
      Plane.current = undefined;
      Map.current = undefined;
      Tasks.current = undefined;

      if (MapParentElement) MapParentElement.innerHTML = '';
      if (ThreeJSDomElement) ThreeJSDomElement.innerHTML = '';
      if (MapThreeJSDOMElement) MapThreeJSDOMElement.innerHTML = '';
    };
  }, []);

  return (
    <div>
      {ThreeJS.current && Plane.current && Map.current && Tasks.current && mapLoaded ? (
        <Renderer ThreeJS={ThreeJS.current!} Map={Map.current} Plane={Plane.current} />
      ) : (
        'Loading'
      )}
    </div>
  );
};
