import mapboxgl from 'mapbox-gl';

export interface MapboxGLMapConfig {
  mapOptions: mapboxgl.MapboxOptions;
  mapboxDem?: mapboxgl.AnySourceData;
  mapboxTerrain?: mapboxgl.TerrainSpecification;
}

export class MapboxGLMap {
  _config: MapboxGLMapConfig;
  _instance: mapboxgl.Map;

  constructor(accessToken: string, config: MapboxGLMapConfig) {
    mapboxgl.accessToken = accessToken;
    this._config = config;
    this._instance = new mapboxgl.Map(this._config.mapOptions);
  }

  public init() {
    this.enable3DTerrain();
    this._instance.addControl(
      new mapboxgl.AttributionControl({
        customAttribution: 'Welcome on board ~thesvst :)',
      }),
    );
  }

  private enable3DTerrain() {
    this._instance.addSource('mapbox-dem', this._config.mapboxDem!);
    this._instance.setTerrain(this._config.mapboxTerrain);
  }
}
