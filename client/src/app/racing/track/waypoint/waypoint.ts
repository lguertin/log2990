import { Vector3 } from "three";
import { SteeringAdjustment, TURN_ANGLE_MARGIN } from "../../car/ai/constants";
import { VERTICAL_AXIS, PI_OVER_2 } from "../../constants";

export class Waypoint {
    protected _previous: Waypoint;
    protected _next: Waypoint;

    public constructor(protected _position: Vector3) {
    }

    public get position(): Vector3 {
        return this._position;
    }

    public set position(position: Vector3) {
        this._position = position;
    }

    public get next(): Waypoint {
        return this._next;
    }

    public set next(next: Waypoint) {
        this._next = next;
    }

    public get previous(): Waypoint {
        return this._previous;
    }

    public set previous(previous: Waypoint) {
        this._previous = previous;
    }

    public hasNext(): boolean {
        return this._next !== undefined;
    }

    public hasPrevious(): boolean {
        return this._previous !== undefined;
    }

    protected isDoublyLinked(): boolean {
        return this.hasNext() && this.hasPrevious();
    }

    protected get distanceToNext(): number {
        return this.hasNext() ? this.position.distanceTo(this.next.position) : undefined;
    }

    public get distanceToPrevious(): number {
        return this.hasPrevious() ? this.position.distanceTo(this.previous.position) : undefined;
    }

    protected get distanceBetweenAdjacent(): number {
        return this.isDoublyLinked() ? this.previous.position.distanceTo(this.next.position) : undefined;
    }

    public get vectorToNext(): Vector3 {
        return this.next.position.clone()
                                 .sub(this.position);
    }

    public get vectorToPrevious(): Vector3 {
        return this.previous.position.clone()
                                     .sub(this.position);
    }

    public get bisectrixUnitVector(): Vector3 {
        if (this.turnAngle() !== 0) {
            return this.vectorToPrevious.normalize()
                                        .add(this.vectorToNext.normalize())
                                        .normalize();
        }

        return this.vectorToNext.cross(VERTICAL_AXIS);
    }

    public getTurnSide(): SteeringAdjustment {
        if (this.turnAngle()) {
            return this.turnAngle() > TURN_ANGLE_MARGIN ?
                   SteeringAdjustment.Left : this.turnAngle() < -TURN_ANGLE_MARGIN ?
                                             SteeringAdjustment.Right : SteeringAdjustment.None;
        }

        return undefined;
     }

    protected turnAngle(): number {
        return this.isDoublyLinked() ?
               this.position.clone()
                             .sub(this.previous.position)
                             .cross(VERTICAL_AXIS)
                             .angleTo(this.vectorToNext)
               - PI_OVER_2
               : undefined;
    }
}
