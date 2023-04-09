import { PlaneClass } from "../../core/Plane/Plane";

export class BasicPlane extends PlaneClass {
    constructor() {
        const acceleration = 1;
        const agility = 1;
        const maxVelocity = 200;
        const modelPath = '/public/aircrafts/basic/scene.gltf'

        super(acceleration, agility, maxVelocity, modelPath)
    }
}