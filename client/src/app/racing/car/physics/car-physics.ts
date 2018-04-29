import { Engine } from "../engine";
import { Wheel } from "../wheel";
import { Vector3 } from "three";
import { GRAVITY } from "../../constants";
import { VectorUtils } from "../../utils/vector-utils";
import { MathUtils } from "../../utils/math-utils";
import {    CarDrivingState, CarComponents, CarPhysicProperties,
            MINIMUM_WEIGHT_DISTRIBUTION,
            MAXIMUM_WEIGHT_DISTRIBUTION,
            ANGULAR_SPEED_COLLISION_COEFFICIENT,
            ANGULAR_SPEED_DECELERATION,
            MINIMUM_SPEED,
            NUMBER_REAR_WHEELS,
            NUMBER_WHEELS,
            LATERAL_FRICTION_COEFFICIENT,
            STEERING_ACCEL_DECREASE,
            TIRE_PRESSURE,
            CAR_SURFACE,
            AIR_DENSITY,
            ACCELERATION_AUGMENTATION } from "./constants";

export class CarPhysics {
    private carDrivingState: CarDrivingState;
    private physicProperties: CarPhysicProperties;

    public constructor (private carComponents: CarComponents) { }

    private get rearWheel(): Wheel {
        return this.carComponents.rearWheel;
    }
    private get engine(): Engine {
        return this.carComponents.engine;
    }
    private get speed(): Vector3 {
        return this.physicProperties.speed;
    }
    private get direction(): Vector3 {
        return this.physicProperties.direction.clone();
    }

    public update(deltaTime: number, physicProperties: CarPhysicProperties, carDrivingState: CarDrivingState): void {
        this.physicProperties = physicProperties;
        this.carDrivingState = carDrivingState;
        this.rearWheel.angularVelocity += this.wheelAngularAcceleration * deltaTime;
        this.engine.update(this.speed.length(), this.rearWheel.radius);
        this.updatePhysicsProperties(deltaTime);
        this.rearWheel.update(this.speed.length());
        this.updateAngularSpeed();
    }

    private updatePhysicsProperties(deltaTime: number): void {
        this.physicProperties.weightRear = this.weightDistribution;
        this.physicProperties.speed.add(this.getDeltaSpeed(deltaTime));
        this.boundToMinimumSpeed();
    }

    private boundToMinimumSpeed(): void {
        if (this.speed.length() <= MINIMUM_SPEED) {
            this.speed.multiplyScalar(0);
        }
    }

    private updateAngularSpeed(): void {
        this.physicProperties.angularSpeed *= ANGULAR_SPEED_DECELERATION;
    }

    private get wheelbase(): number {
        return this.physicProperties.wheelbase;
    }

    private get mass(): number {
        return this.physicProperties.mass;
    }

    private get weightDistributionOffset(): number {
        return this.mass * this.acceleration.length() / this.wheelbase / 2 ;
    }

    private get unboundedWeightDistribution(): number {
        return this.mass + this.weightDistributionOffset;
    }

    private get weightDistribution(): number {
        return MathUtils.boundValue(MINIMUM_WEIGHT_DISTRIBUTION,
                                    MAXIMUM_WEIGHT_DISTRIBUTION,
                                    this.unboundedWeightDistribution);
    }

    private get resistance(): Vector3 {
        return  this.speed.length() >= MINIMUM_SPEED
            ?   this.getDragForce().add(this.lateralResistance).add(this.getRollingResistance())
            :   new Vector3();
    }

    private get tractionForceWithSteering(): Vector3 {
        return this.direction
                .multiplyScalar(this.tractionForce)
                .divideScalar( this.isSteering() ? STEERING_ACCEL_DECREASE : 1);
    }

    private get forceFromDrivingState(): Vector3 {
        if (this.carDrivingState.isAcceleratorPressed) {
            return this.tractionForceWithSteering;
        } else if (this.carDrivingState.isBraking && this.isGoingForward()) {
            return this.brakeForce;
        } else {
            return new Vector3();
        }
    }

    private get longitudinalForce(): Vector3 {
        return this.forceFromDrivingState.add(this.resistance);
    }

    private get rollingCoefficient(): number {
        // formula taken from: https://www.engineeringtoolbox.com/rolling-friction-resistance-d_1303.html
        // tslint:disable-next-line:no-magic-numbers
        return (1 / TIRE_PRESSURE) * (Math.pow(this.speed.length() * 3.6 / 100, 2) * 0.0095 + 0.01) + 0.005;
    }

    private get rollingResistanceAmplitude(): number {
        return this.rollingCoefficient * this.mass * GRAVITY;
    }

    private getRollingResistance(): Vector3 {
        return this.direction.multiplyScalar(this.rollingResistanceAmplitude);
    }

    private get dragForceAmplitude(): number {
        return AIR_DENSITY * CAR_SURFACE * this.physicProperties.dragCoefficient * this.speed.lengthSq();
    }

    private getDragForce(): Vector3 {
        return this.direction.negate().setLength(this.dragForceAmplitude);
    }

    private get maximumTractionForce(): number {
        return this.mass * GRAVITY * this.physicProperties.weightRear * NUMBER_REAR_WHEELS / NUMBER_WHEELS;
    }

    private get tractionForce(): number {
        return -Math.min(this.engineForce, this.maximumTractionForce);
    }

    private get wheelAngularAcceleration(): number {
        return this.totalTorque / (this.rearWheel.inertia * NUMBER_REAR_WHEELS);
    }

    private get brakeForceAmplitude(): number {
        return this.rearWheel.frictionCoefficient * this.mass * GRAVITY;
    }

    private get brakeForce(): Vector3 {
        return this.direction.multiplyScalar(this.brakeForceAmplitude);
    }

    private get brakeTorque(): number {
        return this.brakeForceAmplitude * this.rearWheel.radius;
    }

    private get tractionTorque(): number {
        return this.tractionForce * this.rearWheel.radius;
    }

    private get totalTorque(): number {
        return this.tractionTorque * NUMBER_REAR_WHEELS + this.brakeTorque;
    }

    private get engineForce(): number {
        return this.engine.getDriveTorque() / this.rearWheel.radius;
    }

    public get acceleration(): Vector3 {
        return this.longitudinalForce
                .divideScalar(this.physicProperties.mass)
                .multiplyScalar(ACCELERATION_AUGMENTATION);
    }

    private get lateralSpeed(): Vector3 {
        return this.speed.clone().projectOnPlane(this.direction);
    }

    private isDriftingRight(): boolean {
        return this.direction.cross(this.lateralSpeed).y < 0 ;
    }

    private get lateralFriction(): number {
        return this.mass * GRAVITY * LATERAL_FRICTION_COEFFICIENT;
    }

    private get lateralResistance(): Vector3 {
        return VectorUtils.rotateY90DegToRight(this.direction)
                .setLength(this.lateralFriction)
                .multiplyScalar(this.isDriftingRight() ? 1 : -1);
    }

    private getDeltaSpeed(deltaTime: number): Vector3 {
        return this.acceleration.multiplyScalar(deltaTime);
    }

    public getDeltaPosition(deltaTime: number): Vector3 {
        return this.speed.clone().multiplyScalar(deltaTime);
    }

    private get speedDirection(): Vector3 {
        return this.speed.clone().normalize();
    }

    private isGoingForward(): boolean {
        return this.speedDirection.dot(this.direction) > MINIMUM_SPEED;
    }

    private getRotationalImpulsion(impulsion: Vector3, relativeCollisionPosition: Vector3): number {
        return impulsion.clone().cross(relativeCollisionPosition).y /
                this.physicProperties.mass *
                ANGULAR_SPEED_COLLISION_COEFFICIENT;
    }

    public modifyAngularSpeedFromCollision(impulsion: Vector3, relativeCollisionPosition: Vector3): void {
        this.physicProperties.angularSpeed += this.getRotationalImpulsion(impulsion, relativeCollisionPosition);
    }

    private isSteering(): boolean {
        return this.carDrivingState.isSteeringLeft !== this.carDrivingState.isSteeringRight;
    }
}
