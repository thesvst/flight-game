import * as THREE from 'three';
import { Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class ThreeJSManager {
  private _scene;
  private _light;
  private _renderer;
  private _camera;
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

  public _setRenderer(renderer: THREE.WebGLRenderer) {
    this._renderer = renderer;
  }

  public _setCameraProjectionMatrix(matrix: THREE.Matrix4) {
    this._camera.projectionMatrix = matrix;
  }

  public _resetRendererState() {
    this._renderer.resetState();
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
    const container = document.getElementById(this._DOMElementID);

    if (container) {
      this._setRendererSize();
      this._scene.add(this._light);
      const domElement = this._renderer.domElement;
      domElement.style.position = 'absolute';
      domElement.style.left = '0';
      domElement.style.top = '0';
      container.appendChild(domElement);
      this._camera.position.set(0, -50, -35);
      this._camera.lookAt(0, 0, 0);
    } else {
      throw new Error(`Element with id ${this._DOMElementID} not found`);
    }
  }

  public _loadGLTFModel(path: string, scale?: number) {
    this._GLTFLoader.load(path, (gltf) => {
      if (scale) {
        gltf.scene.children[0].scale.multiplyScalar(scale);
      }
      this._model = gltf.scene;
      this._scene.add(this._model);
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
