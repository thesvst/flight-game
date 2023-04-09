import { Plane } from '@core';

export class BasicPlane extends Plane {
  constructor() {
    const acceleration = 1;
    const agility = .25;
    const maxVelocity = 200;
    const modelPath = '/aircrafts/basic/scene.gltf';

    super(acceleration, agility, maxVelocity, modelPath);
  }
}
