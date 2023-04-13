import { Plane } from '@core';

export class BasicPlane extends Plane {
  constructor() {
    const acceleration = 1;
    const agility = .4;
    const maxVelocity = 259;
    const modelPath = '/aircrafts/basic/scene.gltf';

    super(acceleration, agility, maxVelocity, modelPath);
  }
}
