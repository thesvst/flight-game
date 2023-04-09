import { useEffect, useRef } from "react";
import { Plane } from "@core";
import { ThreeJSManager } from "@core";
import { BasicPlane } from "@planes";

export const Renderer = () => {
  const ThreeJSRef = useRef<ThreeJSManager>();
  const Plane = useRef<Plane>(new BasicPlane())

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