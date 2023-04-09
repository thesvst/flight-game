import { useEffect, useRef } from "react";
import { PlaneClass } from "./core/Plane/Plane";
import { ThreeJSManager } from "./core/ThreeJSManager/ThreeJSManager";
import { BasicPlane } from "./planes/BasicPlane/BasicPlane";

export const Renderer = () => {
  const ThreeJSRef = useRef<ThreeJSManager>();
  const Plane = useRef<PlaneClass>(new BasicPlane())

  useEffect(() => {
    if (ThreeJSRef.current === undefined) {
      ThreeJSRef.current = new ThreeJSManager();
      ThreeJSRef.current._loadGLTFModel(Plane.current.modelPath)
    }
    

    window.addEventListener('resize', () => ThreeJSRef.current?._onWindowResize())
  }, [])
  

  return (
    <div></div>
  )
};