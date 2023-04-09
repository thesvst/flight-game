export class Plane {
    private readonly _acceleration: number;
    private readonly _agility: number;
    private readonly _maxVelocity: number;
    private readonly _modelPath: string;

    // Plane is going to have poor phycisc, so its forced to fly indefinitely
    private readonly _minVelocity = 50;

    private _velocity = this._minVelocity;
    private _bearing = 0;
    private _pitch = 0;

    get velocity(): number {
        return this._velocity;
    }

    get bearing(): number {
        return this._bearing;
    }

    get pitch(): number {
        return this._pitch;
    }

    get modelPath() {
        return this._modelPath;
    }
    
    private controls: { [key in KeyboardEvent['key']]: { pressed: boolean, action: () => void } } = {
        a: { pressed: false, action: () => this.changeBearing('WEST') },
        d: { pressed: false, action: () => this.changeBearing('EAST') },
        w: { pressed: false, action: () => this.increaseVelocity() },
        s: { pressed: false, action: () => this.decreaseVelocity() },
        ArrowUp: { pressed: false, action: () => this.increasePitch() },
        ArrowDown: { pressed: false, action: () => this.decreasePitch() }
    }

    constructor(acceleration: number, agility: number, maxVelocity: number, modelPath: string) {
        this._acceleration = acceleration;
        this._agility = agility;
        this._maxVelocity = maxVelocity
        this._modelPath = modelPath;
    }

    private increaseVelocity() {
        const increaseVelocity = this._velocity + (1 * this._acceleration)
        if (increaseVelocity < this._maxVelocity) {
            this._velocity = increaseVelocity
        } else {
            this._velocity = this._maxVelocity
        }
    }

    private decreaseVelocity() {
        const decreasedVelocity = this._velocity - (1 * this._acceleration)
        if (decreasedVelocity > this._minVelocity) {
            this._velocity = decreasedVelocity;
        } else {
            this._velocity = this._minVelocity;
        }
    }

    private changeBearing(bearing: 'WEST' | 'EAST') {
        if (bearing === 'WEST') {
            const updatedBearing = this._bearing - (this._agility * 1);
            this._bearing = updatedBearing;
        } else if (bearing === 'EAST') {
            const updatedBearing = this._bearing + (this._agility * 1);
            this._bearing = updatedBearing;
        }
    }

    private decreasePitch() {
        this._pitch = this._pitch - (this._agility * 1);
    }

    private increasePitch() {
        this._pitch = this._pitch + (this._agility * 1);
    }

    public turnOnKeyboardControls() {
        window.addEventListener('keydown', (e) => {
            e.preventDefault();
            if (this.controls[e.key]) this.controls[e.key].pressed = true;
        })

        window.addEventListener('keyup', (e) => {
            e.preventDefault();
            if (this.controls[e.key]) this.controls[e.key].pressed = false;
        })
    }

    public planeMovementFraming() {
        return Object.keys(this.controls).forEach(key=> {
            this.controls[key].pressed && this.controls[key].action()
        })
    }
}