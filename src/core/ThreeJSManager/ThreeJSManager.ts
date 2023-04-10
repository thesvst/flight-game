import * as THREE from 'three';
import { Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class ThreeJSManager {
  private readonly _scene = new THREE.Scene();
  private readonly _light = new THREE.AmbientLight(0xffffff, 5);
  private readonly _renderer = new THREE.WebGL1Renderer({ antialias: true, alpha: true });
  private _camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
  private _model: THREE.Group | undefined;

  constructor() {
    this._initialize();
  }

  get cameraRotation() {
    return this._camera.rotation;
  }

  get cameraPosition() {
    return this._camera.position;
  }

  get modelRotation() {
    return this._model?.rotation;
  }

  get modelPosition() {
    return this._model?.position;
  }

  public _rerender() {
    this._renderer.render(this._scene, this._camera);
  }

  private _setRendererSize() {
    this._renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private _setCameraSize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._rerender;
  }

  private _initialize() {
    const id = 'root';
    const root = document.getElementById(id);

    if (root) {
      this._setRendererSize();
      this._scene.add(this._light);
      const domElement = this._renderer.domElement;
      domElement.style.position = 'absolute';
      domElement.style.left = '0';
      domElement.style.top = '0';
      root.appendChild(domElement);
      this._camera.position.set(0, -2, -35);
      this._camera.lookAt(0, 0, 0);
    } else {
      throw new Error(`Element with id ${id} not found`);
    }
  }

  public _loadGLTFModel(path: string) {
    const loader = new GLTFLoader();
    loader.load(path, (gltf) => {
      this._model = gltf.scene;
      this._scene.add(this._model);
      this._rerender();
    });
  }

  public _changeCameraPosition(position: Pick<Vector3, 'x' | 'y' | 'z'>) {
    this._camera.position.set(position.x, position.y, position.z);
  }

  public _changeModelRotation(rotation: Pick<Vector3, 'x' | 'y' | 'z'>) {
    if (this._model) {
      this._model.rotation.x = rotation.x;
      this._model.rotation.y = rotation.y;
      this._model.rotation.z = rotation.z;
    } else {
      throw new Error('You need to specify model first!');
    }
  }

  public _onWindowResize() {
    this._setRendererSize();
    this._setCameraSize();
  }
}
