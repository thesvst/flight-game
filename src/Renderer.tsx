import { useEffect, useRef } from "react";
import { ThreeJSManager } from "./core/ThreeJSManager/ThreeJSManager";

const aircraftPath = '/public/aircrafts/basic/scene.gltf'

export const Renderer = () => {
  const ThreeJSRef = useRef<ThreeJSManager>();

  useEffect(() => {
    if (ThreeJSRef.current === undefined) {
      ThreeJSRef.current = new ThreeJSManager();
      ThreeJSRef.current._loadGLTFModel(aircraftPath)
    }
    

    window.addEventListener('resize', () => ThreeJSRef.current?._onWindowResize())
  }, [])
  

  return (
    <div></div>
  )
};