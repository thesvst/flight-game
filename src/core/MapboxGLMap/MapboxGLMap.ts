import { UnitsConverter } from '@core/UnitsConverter/UnitsConverter';
import mapboxgl from 'mapbox-gl';

export interface MapboxGLMapConfig {
  mapOptions: mapboxgl.MapboxOptions;
  mapboxDem?: mapboxgl.AnySourceData;
  mapboxTerrain?: mapboxgl.TerrainSpecification;
}

export class MapboxGLMap {
  private readonly _config: MapboxGLMapConfig;
  private readonly _instance: mapboxgl.Map;

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
  }

  public _init() {
    this._enable3DTerrain();
    this._instance.addControl(
      new mapboxgl.AttributionControl({
        customAttribution: 'Welcome on board ~thesvst :)',
      }),
    );
  }

  private _enable3DTerrain() {
    this._instance.addSource('mapbox-dem', this._config.mapboxDem!);
    this._instance.setTerrain(this._config.mapboxTerrain);
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

  public _getZoom() {
    return this._instance.getZoom();
  }

  public _setZoom(zoom: number) {
    this._instance.setZoom(zoom);
  }

  public _getPitch() {
    return this._instance.getPitch()
  }

  public _setPitch(pitch: number) {
    return this._instance.setPitch(pitch);
  }

  public _calculateNewPosition(bearing: number, time: number, velocity: number): [number, number] {
    const bearingRad = UnitsConverter.degreesToRadians(bearing);
    const distance = UnitsConverter.KmhToMs(velocity) * time;
    const newLng = this.position.lng + (distance / 111111) * Math.sin(bearingRad);
    const newLat = this.position.lat + (distance / 111111) * Math.cos(bearingRad);

    return [newLng, newLat];
  }
}
