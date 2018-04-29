import { Vector3 } from "three";
import { CarComponents, CarPhysicProperties, CarDrivingState } from "./physics/constants";
import { Engine } from "./engine";
import { Wheel } from "./wheel";
import { CarLights } from "./lights/lights";

export const DEFAULT_WHEELBASE: number = 2.78;
export const DEFAULT_MASS: number = 1515;
export const DEFAULT_DRAG_COEFFICIENT: number = 0.35;
export const INITIAL_WEIGHT_DISTRIBUTION: number = 0.5;

export class CarInit {
    public static get defaultCarComponents(): CarComponents {
        return {
            engine: new Engine(),
            rearWheel: new Wheel(),
            lights: new CarLights(),
        };
    }

    public static get defaultCarPhysicsProperties(): CarPhysicProperties {
        return {
            wheelbase: DEFAULT_WHEELBASE,
            mass: DEFAULT_MASS,
            dragCoefficient: DEFAULT_DRAG_COEFFICIENT,
            weightRear: INITIAL_WEIGHT_DISTRIBUTION,
            speed: new Vector3(0, 0, 0),
            angularSpeed: 0,
            direction: new Vector3(0, 0, 0),
            steeringWheelDirection: 0
        };
    }

    public static verifyMinimumPhysicsRequirements(physicProperties: CarPhysicProperties): void {
        if (physicProperties.wheelbase <= 0) {
            physicProperties.wheelbase = DEFAULT_WHEELBASE;
        }
        if (physicProperties.mass <= 0) {
            physicProperties.mass = DEFAULT_MASS;
        }
        if (physicProperties.dragCoefficient <= 0) {
            physicProperties.dragCoefficient = DEFAULT_DRAG_COEFFICIENT;
        }
    }

    public static get defaultDrivingState(): CarDrivingState {
        return {
            isBraking: false,
            isSteeringLeft: false,
            isSteeringRight: false,
            isAcceleratorPressed: false,
            isAllowedToMove: true
        };
    }
}
