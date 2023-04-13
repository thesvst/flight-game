export class Plane {
  private readonly _acceleration: number;
  private readonly _agility: number;
  private readonly _maxVelocity: number;
  private readonly _modelPath: string;

  // Plane is going to have poor physics, so it's forced to fly indefinitely
  private readonly _minVelocity = 0;

  private _velocity = this._minVelocity;
  private _bearing = 0;

  get velocity(): number {
    return this._velocity;
  }

  get bearing(): number {
    return this._bearing;
  }

  get modelPath() {
    return this._modelPath;
  }

  private controls: { [key in KeyboardEvent['key']]: { pressed: boolean; action: () => void } } = {
    ArrowLeft: { pressed: false, action: () => this.changeBearing('WEST') },
    ArrowRight: { pressed: false, action: () => this.changeBearing('EAST') },
    w: { pressed: false, action: () => this.increaseVelocity() },
    s: { pressed: false, action: () => this.decreaseVelocity() },
  };

  constructor(acceleration: number, agility: number, maxVelocity: number, modelPath: string) {
    this._acceleration = acceleration;
    this._agility = agility;
    this._maxVelocity = maxVelocity;
    this._modelPath = modelPath;
  }

  private increaseVelocity() {
    const increaseVelocity = this._velocity + 1 * this._acceleration;
    if (increaseVelocity < this._maxVelocity) {
      this._velocity = increaseVelocity;
    } else {
      this._velocity = this._maxVelocity;
    }
  }

  private decreaseVelocity() {
    const decreasedVelocity = this._velocity - 1 * this._acceleration;
    if (decreasedVelocity > this._minVelocity) {
      this._velocity = decreasedVelocity;
    } else {
      this._velocity = this._minVelocity;
    }
  }

  private changeBearing(bearing: 'WEST' | 'EAST') {
    if (bearing === 'WEST' && this._bearing > -2 / 10) {
      const updatedBearing = this._bearing - this._agility * 0.005;
      this._bearing = updatedBearing;
    } else if (bearing === 'EAST' && this._bearing < 2 / 10) {
      const updatedBearing = this._bearing + this._agility * 0.005;
      this._bearing = updatedBearing;
    }
  }

  public turnOffKeyboardControls() {
    window.removeEventListener('keydown', this._onKeyDownListener);
    window.removeEventListener('keyup', this._onKeyUpListener);

    Object.keys(this.controls).forEach((key) => {
      this.controls[key].pressed = false;
    });
  }

  private _onKeyUpListener(e: KeyboardEvent) {
    e.preventDefault();
    if (this.controls[e.key]) this.controls[e.key].pressed = false;
  }

  private _onKeyDownListener(e: KeyboardEvent) {
    e.preventDefault();
    if (this.controls[e.key]) this.controls[e.key].pressed = true;
  }

  public turnOnKeyboardControls() {
    window.addEventListener('keydown', this._onKeyDownListener.bind(this));
    window.addEventListener('keyup', this._onKeyUpListener.bind(this));
  }

  public planeMovementFraming() {
    return Object.keys(this.controls).forEach((key) => {
      this.controls[key].pressed && this.controls[key].action();
    });
  }
}
