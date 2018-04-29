import { Car } from "../car";
import { Vector3 } from "three";
import { AiWaypoint } from "../../track/waypoint/aiWaypoint";
import { VERTICAL_AXIS, PI_OVER_2 } from "../../constants";
import { SteeringAdjustment, SpeedAdjustment, STEERING_MARGIN_OF_ERROR } from "./constants";
import { MathUtils } from "../../utils/math-utils";

export class VirtualCar extends Car {

    private _followedWaypoint: AiWaypoint;

    public constructor() {
        super();
    }

    public set followedWaypoint(followedWaypoint: AiWaypoint) {
        this._followedWaypoint = followedWaypoint;
    }

    private get deltaSpeed(): number {
        return this._followedWaypoint.speed - this.speed.length();
    }

    private get perpendicularDirection(): Vector3 {
        return this.getDirection().cross(VERTICAL_AXIS);
    }

    private get followedAdjustedPosition(): Vector3 {
        return this._followedWaypoint.adjustedPosition;
    }

    private get previousAdjustedPosition(): Vector3 {
        return this._followedWaypoint.previous.adjustedPosition;
    }

    private get vectorFromFollowedAdjustedPositionToCar(): Vector3 {
        return this.getPosition().sub(this.followedAdjustedPosition);
    }

    private get angleToWaypoint(): number {
        return this.perpendicularDirection.angleTo(this.vectorFromFollowedAdjustedPositionToCar) - PI_OVER_2;
    }

    private get distanceBetweenCarAndPreviousWaypoint(): number {
        return this.getPosition().distanceTo(this.previousAdjustedPosition);
    }

    private get distanceBetweenFollowedAndPreviousWaypoints(): number {
        return this.followedAdjustedPosition.distanceTo(this.previousAdjustedPosition);
    }

    public get hasCrossedAdjustedWaypoint(): boolean {
        return this.distanceBetweenCarAndPreviousWaypoint > this.distanceBetweenFollowedAndPreviousWaypoints;
    }

    private get acceleration(): number {
        return this._physics.acceleration.length();
    }

    private get carDistanceToWaypoint(): number {
        return this.getPosition().distanceTo(this._followedWaypoint.position);
    }

    private get calculatedTimeToReachWaypoint(): number {
        return MathUtils.quadraticSolve(this.acceleration / 2, this.speed.length(), -this.carDistanceToWaypoint)[1];
    }

    private get speedToReachWaypoint(): number {
        return -this.calculatedTimeToReachWaypoint * this.acceleration;
    }

    public get hasToBrake(): boolean {
        return this.speedToReachWaypoint < this.deltaSpeed;
    }

    private get requiredDeceleration(): SpeedAdjustment {
        return this.hasToBrake ? SpeedAdjustment.Brake : SpeedAdjustment.SlowDown;
    }

    private get normalizedDeltaSpeed(): number {
        return Math.sign(this.deltaSpeed);
    }

    public get speedAdjustmentToMake(): SpeedAdjustment {
        switch (this.normalizedDeltaSpeed) {
            case 1: return SpeedAdjustment.SpeedUp;
            case -1: return this.requiredDeceleration;
            default: return SpeedAdjustment.None;
        }
    }

    private get steeringMargin(): number {
        return MathUtils.marginSign(this.angleToWaypoint, STEERING_MARGIN_OF_ERROR);
    }

    public get steeringAdjustmentToMake(): SteeringAdjustment {
        switch (this.steeringMargin) {
            case 1: return SteeringAdjustment.Right;
            case -1: return SteeringAdjustment.Left;
            default: return SteeringAdjustment.None;
        }
    }
}
