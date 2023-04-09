import { useEffect, useRef } from 'react';
import { Plane } from '@core';
import { ThreeJSManager } from '@core';
import { BasicPlane } from '@planes';

export const Renderer = () => {
  const ThreeJSRef = useRef<ThreeJSManager>();
  const PlaneRef = useRef<Plane>(new BasicPlane());

  useEffect(() => {
    if (ThreeJSRef.current === undefined) {
      ThreeJSRef.current = new ThreeJSManager();
      ThreeJSRef.current._loadGLTFModel(PlaneRef.current.modelPath);
      PlaneRef.current.turnOnKeyboardControls();

      function animate() {
        PlaneRef.current.planeMovementFraming();
        const modelRotation = ThreeJSRef.current?.modelRotation;
        const cameraPosition = ThreeJSRef.current?.cameraPosition;

        if (modelRotation && PlaneRef.current)
          ThreeJSRef.current?._changeModelRotation({
            x: PlaneRef.current.pitch,
            y: modelRotation.y,
            z: PlaneRef.current.bearing,
          });

        if (cameraPosition)
          ThreeJSRef.current?._changeCameraPosition({
            x: cameraPosition.x,
            y: PlaneRef.current.pitch * 2,
            z: cameraPosition.z,
          });

        ThreeJSRef.current?._rerender();
        requestAnimationFrame(animate);
      }

      animate();
    }

    window.addEventListener('resize', () => ThreeJSRef.current?._onWindowResize());
  }, []);

  return <div></div>;
};
