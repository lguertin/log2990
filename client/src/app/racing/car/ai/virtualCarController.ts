import { VirtualCar } from "./virtualCar";
import { AiWaypoint } from "../../track/waypoint/aiWaypoint";
import { SteeringAdjustment, SpeedAdjustment } from "./constants";

export class VirtualCarController {
    private _followedWaypoint: AiWaypoint;

    public constructor(private _car: VirtualCar) {
    }

    public setFirstFollowedWaypoint(waypoint: AiWaypoint): void {
        this._followedWaypoint = waypoint;
        this._car.followedWaypoint = waypoint;
    }

    public moveCar(): void {
        if (this._followedWaypoint) {
            this.adjustSpeed();
            this.adjustSteering();
            this.updateFollowedWaypoint();
        }
    }

    private updateFollowedWaypoint(): void {
        if (this._car.hasCrossedAdjustedWaypoint) {
            this._followedWaypoint = this._followedWaypoint.next;
            this._car.followedWaypoint = this._followedWaypoint;
        }
    }

    private adjustSpeed(): void {
        switch (this._car.speedAdjustmentToMake) {
            case SpeedAdjustment.SpeedUp:
                this._car.releaseBrakes();
                this._car.isAcceleratorPressed = true;
                break;
            case SpeedAdjustment.Brake:
                this._car.brake();
                this._car.isAcceleratorPressed = false;
                break;
            case SpeedAdjustment.SlowDown:
            case SpeedAdjustment.None:
            default:
                this._car.releaseBrakes();
                this._car.isAcceleratorPressed = false;
                break;
        }
    }

    private adjustSteering(): void {
        switch (this._car.steeringAdjustmentToMake) {
            case SteeringAdjustment.Left:
                this._car.releaseRightSteering();
                this._car.steerLeft();
                break;
            case SteeringAdjustment.Right:
                this._car.releaseLeftSteering();
                this._car.steerRight();
                break;
            default:
            case SteeringAdjustment.None:
                this._car.releaseRightSteering();
                this._car.releaseLeftSteering();
                break;
        }
    }
}
