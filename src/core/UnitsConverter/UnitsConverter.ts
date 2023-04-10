export class UnitsConverter {
  static degreesToRadians(degrees: number) {
    return (degrees * Math.PI) / 180;
  }
  static KmhToMs(kmh: number) {
    return kmh / 3.6;
  }
}
