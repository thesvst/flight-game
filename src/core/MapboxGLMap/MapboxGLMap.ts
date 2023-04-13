import { UnitsConverter } from '@core/UnitsConverter/UnitsConverter';
import mapboxgl, { CustomLayerInterface, LngLatLike } from 'mapbox-gl';
import { ThreeJSManager } from '@core/ThreeJSManager/ThreeJSManager';
import * as THREE from 'three';
import * as turf from '@turf/turf'

export interface MapboxGLMapConfig {
  mapOptions: mapboxgl.MapboxOptions;
  mapboxDem?: mapboxgl.AnySourceData;
  mapboxTerrain?: mapboxgl.TerrainSpecification;
}

export class MapboxGLMap {
  private _instance: mapboxgl.Map;
  private readonly _config: MapboxGLMapConfig;
  private _ThreeJSManager: ThreeJSManager | undefined;
  readonly MapboxGLMapThreeJSDOMElementID = 'mapboxGLThreeJS';

  get position() {
    return this._instance.getCenter();
  }

  get zoom() {
    return this._instance.getZoom();
  }

  constructor(accessToken: string, config: MapboxGLMapConfig) {
    mapboxgl.accessToken = accessToken;
    this._config = config;
    this._instance = new mapboxgl.Map(this._config.mapOptions);

    this._instance.on('load', () => {
      this._init();
    });
  }

  public _onLoadCallbacks(callbacks: (() => void)[]) {
    this._instance.on('load', () => {
      callbacks.forEach((callback) => {
        callback();
      });
    });
  }

  public _init() {
    this._instance.addControl(
      new mapboxgl.AttributionControl({
        customAttribution: 'Welcome on board ~thesvst :)',
      }),
    );
    this._initiateThreeJSManager();
  }

  public _updateMapPosition(lngLat: [number, number]) {
    this._instance.flyTo({ center: lngLat, animate: false });
  }

  public _setBearing(bearing: number) {
    this._instance.setBearing(bearing);
  }

  public _getBearing() {
    return this._instance.getBearing();
  }

  public _setZoom(zoom: number) {
    this._instance.setZoom(zoom);
  }

  public _addMarker(element: HTMLElement, cords: LngLatLike) {
    new mapboxgl.Marker(element).setLngLat(cords).addTo(this._instance);
  }

  public _calculateNewPosition(bearing: number, time: number, velocity: number): [number, number] {
    const bearingRad = UnitsConverter.degreesToRadians(bearing);
    const distance = UnitsConverter.KmhToMs(velocity) * time;
    const newLng = this.position.lng + (distance / 111111) * Math.sin(bearingRad);
    const newLat = this.position.lat + (distance / 111111) * Math.cos(bearingRad);

    return [newLng, newLat];
  }

  public _removeMarkers(selector: string) {
    if (selector) {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) throw new Error(`None markers with selector ${selector} found.`)

      elements.forEach((marker) => { marker.remove(); });
    } else {
      document.querySelectorAll('.mapboxgl-marker').forEach((marker) => {
        marker.remove();
      });
    }
  }

  private _initiateThreeJSManager() {
    this._ThreeJSManager = new ThreeJSManager(
      undefined,
      new THREE.DirectionalLight(0xffffff),
      undefined,
      new THREE.PerspectiveCamera(),
      'mapboxGLThreeJS',
    );
  }

  // TODO: Add something fun to a map
  public _render3DModelOnMap(
    position: LngLatLike,
    altitude: number,
    rotate: [number, number, number],
    id: string,
    modelPath: string,
    scale = 1,
  ) {
    const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(position, altitude);
    const modelTransform = {
      translateX: modelAsMercatorCoordinate.x,
      translateY: modelAsMercatorCoordinate.y,
      translateZ: modelAsMercatorCoordinate.z,
      rotateX: rotate[0],
      rotateY: rotate[1],
      rotateZ: rotate[2],
      scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
    };

    const layer: CustomLayerInterface = {
      id,
      type: 'custom',
      renderingMode: '3d',
      onAdd: (map, gl) => {
        this._ThreeJSManager?._loadGLTFModel(modelPath, scale);
        this._instance = map;

        const newRenderer = new THREE.WebGLRenderer({
          canvas: map.getCanvas(),
          context: gl,
          antialias: true,
        });
        newRenderer.autoClear = false;

        this._ThreeJSManager?._setRenderer(newRenderer);
      },
      render: (_, matrix) => {
        const rotationX = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), modelTransform.rotateX);
        const rotationY = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), modelTransform.rotateY);
        const rotationZ = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1), modelTransform.rotateZ);

        const m = new THREE.Matrix4().fromArray(matrix);
        const l = new THREE.Matrix4()
          .makeTranslation(modelTransform.translateX, modelTransform.translateY, modelTransform.translateZ ?? 0)
          .scale(new THREE.Vector3(modelTransform.scale, -modelTransform.scale, modelTransform.scale))
          .multiply(rotationX)
          .multiply(rotationY)
          .multiply(rotationZ);

        this._ThreeJSManager?._setCameraProjectionMatrix(m.multiply(l));
        this._ThreeJSManager?._resetRendererState;
        this._ThreeJSManager?._rerender();
        this._instance.triggerRepaint();
      },
    };

    this._instance.addLayer(layer, 'waterway-label');
  }

  public _isInRange(coordinates: [number, number], destinationCoordinates: [number, number], radius: number) {
    const buffer = turf.circle(destinationCoordinates, radius, {steps: 64, units: 'meters'});
    const point = turf.point(coordinates);
    return turf.booleanPointInPolygon(point, buffer)
  }
}
