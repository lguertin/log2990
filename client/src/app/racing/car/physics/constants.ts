import { Vector3 } from "three";
import { Engine } from "../engine";
import { Wheel } from "../wheel";
import { CarLights } from "../lights/lights";

export interface CarDrivingState {
    isBraking: boolean;
    isSteeringLeft: boolean;
    isSteeringRight: boolean;
    isAcceleratorPressed: boolean;
    isAllowedToMove: boolean;
}

export interface CarPhysicProperties {
    mass: number;
    wheelbase: number;
    dragCoefficient: number;
    weightRear: number;
    speed: Vector3;
    angularSpeed: number;
    direction: Vector3;
    steeringWheelDirection: number;
}

export interface CarComponents {
    engine: Engine;
    rearWheel: Wheel;
    lights: CarLights;
}

export const MINIMUM_WEIGHT_DISTRIBUTION: number = 0.25;
export const MAXIMUM_WEIGHT_DISTRIBUTION: number = 0.75;
export const MAXIMUM_ANGULAR_SPEED: number = 0.5;
export const ANGULAR_SPEED_COLLISION_COEFFICIENT: number = -5;
export const ANGULAR_SPEED_DECELERATION: number = 0.97;
export const MINIMUM_SPEED: number = 0.05;
export const NUMBER_REAR_WHEELS: number = 2;
export const NUMBER_WHEELS: number = 4;
export const LATERAL_FRICTION_COEFFICIENT: number = 0.4;
export const STEERING_ACCEL_DECREASE: number = 2;
export const TIRE_PRESSURE: number = 1;
export const CAR_SURFACE: number = 3;
export const AIR_DENSITY: number = 1.2;
export const ACCELERATION_AUGMENTATION: number = 1.6;
