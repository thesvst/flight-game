import { Plane } from '@core';

export class BasicPlane extends Plane {
  constructor() {
    const acceleration = 3;
    const agility = 5;
    const maxVelocity = 450
    const modelPath = '/aircrafts/basic/scene.gltf';

    super(acceleration, agility, maxVelocity, modelPath);
  }
}
