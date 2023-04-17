import * as THREE from 'three';
import { Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class ThreeJSManager {
  private readonly _scene;
  private readonly _light;
  private _renderer;
  private readonly _camera;
  private _model: THREE.Group | undefined;
  private _GLTFLoader = new GLTFLoader();
  private readonly _DOMElementID: string;

  get DOMElementID() {
    return this._DOMElementID;
  }

  constructor(
    scene: THREE.Scene | undefined,
    light: THREE.AmbientLight | THREE.DirectionalLight | undefined,
    renderer: THREE.WebGLRenderer | undefined,
    camera: THREE.PerspectiveCamera | undefined,
    DOMElementID: string,
  ) {
    this._DOMElementID = DOMElementID;

    if (scene) {
      this._scene = scene;
    } else {
      this._scene = new THREE.Scene();
    }

    if (light) {
      this._light = light;
    } else {
      this._light = new THREE.AmbientLight(0xffffff, 5);
    }

    if (renderer) {
      this._renderer = renderer;
    } else {
      this._renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    }

    if (camera) {
      this._camera = camera;
    } else {
      this._camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
    }

    this.initialize();
  }

  public setRenderer(renderer: THREE.WebGLRenderer) {
    this._renderer = renderer;
  }

  public setCameraProjectionMatrix(matrix: THREE.Matrix4) {
    this._camera.projectionMatrix = matrix;
  }

  public resetRendererState() {
    this._renderer.resetState();
  }

  public rerender() {
    this._renderer.render(this._scene, this._camera);
  }

  private setRendererSize() {
    this._renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private setCameraSize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this.rerender;
  }

  private initialize() {
    const container = document.getElementById(this._DOMElementID);

    if (container) {
      this.setRendererSize();
      this._scene.add(this._light);
      const domElement = this._renderer.domElement;
      domElement.style.position = 'absolute';
      domElement.style.left = '0';
      domElement.style.top = '0';
      container.appendChild(domElement);
      this._camera.position.set(0, -70, -35);
      this._camera.lookAt(0, 0, 0);
    } else {
      throw new Error(`Element with id ${this._DOMElementID} not found`);
    }
  }

  public loadGLTFModel(path: string, scale?: number) {
    this._GLTFLoader.load(path, (gltf) => {
      if (scale) {
        gltf.scene.children[0].scale.multiplyScalar(scale);
      }
      this._model = gltf.scene;
      this._scene.add(this._model);
    });
  }

  public changeModelRotation(rotation: Pick<Vector3, 'x' | 'y' | 'z'>) {
    if (this._model) {
      this._model.rotation.x = rotation.x;
      this._model.rotation.y = rotation.y;
      this._model.rotation.z = rotation.z;
    } else {
      throw new Error('You need to specify model first!');
    }
  }

  public onWindowResize() {
    this.setRendererSize();
    this.setCameraSize();
  }
}
