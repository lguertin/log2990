import { Vector3, Matrix4, Object3D, Quaternion, Box3, Mesh } from "three";
import { MS_TO_SECONDS, RAD_TO_DEG, VERTICAL_AXIS, PI_OVER_2, TRANSPARENT_MATERIAL } from "../constants";
import { CarInit, DEFAULT_WHEELBASE } from "./car-init";
import { CarPhysics } from "./physics/car-physics";
import { CarPhysicProperties, CarDrivingState, CarComponents } from "./physics/constants";
import { Followable } from "../followable";
import { CAR_BOX_GEOMETRY, CAR_BOX_LENGTH, CAR_BOX_WIDTH } from "./constants";
import { VectorUtils } from "../utils/vector-utils";
import { Waypoint } from "../track/waypoint/waypoint";
import { SteeringAdjustment } from "./ai/constants";

const MAXIMUM_STEERING_ANGLE: number = 0.35;
const SPEED_COEFFICIENT_ON_HANDLING: number = 0.1;

export class Car extends Object3D implements Followable {
    private _drivingState: CarDrivingState;
    private _physicProperties: CarPhysicProperties;
    private _components: CarComponents;
    private _mesh: Object3D;
    protected _physics: CarPhysics;
    private boundBox: Box3;
    private _boxMesh: Mesh;

    private static changeDirectionIfNeeded(vector: Vector3, keepCurrentDirection: boolean): Vector3 {
        return keepCurrentDirection ? vector : vector.negate();
    }

    /** @Override Followable */
    public getPosition(): Vector3 {
        return this._mesh.position.clone();
    }

    /** @Override Followable */
    public getDirection(): Vector3 {
        return new Vector3(0, 0, -1).applyMatrix4(this.meshRotationMatrix);
    }

    public getLateralDirection(): Vector3 {
        return this.getDirection().cross(VERTICAL_AXIS);
    }

    public get speed(): Vector3 {
        return this._physicProperties.speed;
    }

    public set speed(value: Vector3) {
        this._physicProperties.speed = value;
    }

    public get currentGear(): number {
        return this._components.engine.currentGear;
    }

    public get rpm(): number {
        return this._components.engine.rpm;
    }

    public get angle(): number {
        return this._mesh.rotation.y * RAD_TO_DEG;
    }

    public get mass(): number {
        return this._physicProperties.mass;
    }

    public get mesh(): Object3D {
        return this._mesh;
    }

    public set mesh(mesh: Object3D) {
        this._mesh = mesh;
    }

    public get angularSpeed(): number {
        return this._physicProperties.angularSpeed;
    }

    public set angularSpeed(angularSpeed: number) {
        this._physicProperties.angularSpeed = angularSpeed;
    }

    public get isAcceleratorPressed(): boolean {
        return this._drivingState.isAcceleratorPressed;
    }
    public set isAcceleratorPressed(value: boolean) {
        this._drivingState.isAcceleratorPressed = value;
    }

    public get isAllowedToMove(): boolean {
        return this._drivingState.isAllowedToMove;
    }
    public set isAllowedToMove(value: boolean) {
        this._drivingState.isAllowedToMove = value;
    }

    public get bounds(): Box3 {
        return this.boundBox;
    }

    public get boxMesh(): Mesh {
        return this._boxMesh;
    }

    public constructor(
        components: CarComponents = CarInit.defaultCarComponents,
        physicProperties: CarPhysicProperties = CarInit.defaultCarPhysicsProperties) {
        super();
        CarInit.verifyMinimumPhysicsRequirements(physicProperties);
        this._components = components;
        this._physicProperties = physicProperties;
        this._drivingState = CarInit.defaultDrivingState;
        this.add(this._components.lights);
        this._physics = new CarPhysics(this._components);
        this.boundBox = new Box3();
        this.boundBox.setFromObject(this);
        this.initBoxMesh();
    }

    private initBoxMesh(): void {
        this._boxMesh = new Mesh(CAR_BOX_GEOMETRY, TRANSPARENT_MATERIAL);
        this.add(this._boxMesh);
    }

    private getSteeringAngle(): number {
        if (this.speed.length() > 0) {
            const steeringDecreaseFactor: number = this.speed.length() * SPEED_COEFFICIENT_ON_HANDLING;

            return steeringDecreaseFactor >= 1 ? MAXIMUM_STEERING_ANGLE / steeringDecreaseFactor : MAXIMUM_STEERING_ANGLE;
        }

        return 0;
    }

    private updateSteeringAngle(): void {
        /* tslint:disable-next-line:prefer-conditional-expression */
        if (this._drivingState.isSteeringLeft && !this._drivingState.isSteeringRight) {
            this._physicProperties.steeringWheelDirection = this.getSteeringAngle();
        } else if (this._drivingState.isSteeringRight && !this._drivingState.isSteeringLeft) {
            this._physicProperties.steeringWheelDirection = -this.getSteeringAngle();
        } else {
            this._physicProperties.steeringWheelDirection = 0;
        }
    }

    public steerLeft(): void {
        this._drivingState.isSteeringLeft = true;
    }

    public steerRight(): void {
        this._drivingState.isSteeringRight = true;
    }

    public releaseRightSteering(): void {
        this._drivingState.isSteeringRight = false;
    }

    public releaseLeftSteering(): void {
        this._drivingState.isSteeringLeft = false;
    }

    public releaseBrakes(): void {
        this._drivingState.isBraking = false;
    }

    public brake(): void {
        this._drivingState.isBraking = true;
    }

    public get meshRotationMatrix(): Matrix4 {
        return new Matrix4().extractRotation(this._mesh.matrix);
    }

    public get meshRotationQuaternion(): Quaternion {
        return new Quaternion().setFromRotationMatrix(this.meshRotationMatrix);
    }

    private updatePhysicsCalculations(deltaTime: number): void {
        this._physicProperties.direction = this.getDirection();
        this._physics.update(deltaTime, this._physicProperties, this._drivingState);
        this._mesh.position.add(this._physics.getDeltaPosition(deltaTime));
    }

    public update(deltaTime: number): void {
        if (this.isAllowedToMove) {
            this.updateIfAllowedToMove(deltaTime);
        } else {
            this.blockControls();
        }
    }

    private blockControls(): void {
        this.releaseLeftSteering();
        this.releaseRightSteering();
        this.isAcceleratorPressed = false ;
        this.brake();
    }

    private getSteeringR(deltaTime: number): number {
        return DEFAULT_WHEELBASE / Math.sin(this._physicProperties.steeringWheelDirection * deltaTime);
    }

    private getSteeringRotation(deltaTime: number): number {
        return this.speed.length() / this.getSteeringR(deltaTime);
    }

    private updateCarRotation(deltaTime: number): void {
        this.updateSteeringAngle();
        this._mesh.rotateY(this.getSteeringRotation(deltaTime) + this._physicProperties.angularSpeed);
    }

    private updateIfAllowedToMove(deltaTime: number): void {
        deltaTime /= MS_TO_SECONDS;

        this._physicProperties.speed.applyMatrix4(this.meshRotationMatrix);
        this.updatePhysicsCalculations(deltaTime);
        this.boundBox.setFromObject(this);
        this._physicProperties.speed = this._physicProperties.speed.applyQuaternion(this.meshRotationQuaternion.inverse());
        this.updateCarRotation(deltaTime);
        this._components.lights.update(this.getPosition(), this.getDirection(), this._drivingState.isBraking);
        this.updateBoxMesh();
    }

    public switchNightLights(): void {
        this._components.lights.switchNightLights();
    }

    private updateBoxMesh(): void {
        this._boxMesh.setRotationFromAxisAngle(VERTICAL_AXIS, VectorUtils.getXZAngle(this.getDirection()) + PI_OVER_2);
        VectorUtils.copyVector(this.getPosition(), this._boxMesh.position);
    }

    private get boxLengthVector(): Vector3 {
        return this.getDirection().setLength(CAR_BOX_LENGTH / 2);
    }

    private get boxWidthVector(): Vector3 {
        return this.getLateralDirection().setLength(CAR_BOX_WIDTH / 2);
    }

    public getCorner(front: boolean, right: boolean): Vector3 {
        return this.getPosition()
            .add(Car.changeDirectionIfNeeded(this.boxLengthVector, front))
            .add(Car.changeDirectionIfNeeded(this.boxWidthVector, right));
    }

    public modifyAngularSpeedFromCollision(impulsion: Vector3, collisionPosition: Vector3): void {
        this._physics.modifyAngularSpeedFromCollision(impulsion, collisionPosition.clone().sub(this.getPosition()));
    }

    public hasCrossedWaypoint(waypoint: Waypoint): boolean {
        if (waypoint.getTurnSide() === SteeringAdjustment.Right) {
            return waypoint.bisectrixUnitVector.cross(this.getPosition().sub(waypoint.position)).y > 0;
        } else if (waypoint.getTurnSide() === SteeringAdjustment.Left) {
            return waypoint.bisectrixUnitVector.cross(this.getPosition().sub(waypoint.position)).y < 0;
        } else {
            return waypoint.vectorToNext.angleTo(this.getPosition().sub(waypoint.position)) < PI_OVER_2;
        }
    }
}
