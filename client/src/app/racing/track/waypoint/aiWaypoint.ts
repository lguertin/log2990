import { Waypoint } from "./waypoint";
import { Vector3 } from "three";

export class AiWaypoint extends Waypoint {
    protected _lateralDisplacement: Vector3;

    public constructor(position: Vector3, protected _speed: number) {
        super(position);
        this._lateralDisplacement = new Vector3(0, 0, 0);
    }

    public set lateralDisplacement(displacement: Vector3) {
        this._lateralDisplacement = displacement;
    }

    public get adjustedPosition(): Vector3 {
        return this._position.clone().add(this._lateralDisplacement);
    }

    public get speed(): number {
        return this._speed;
    }

    public set speed(speed: number) {
        this._speed = speed;
    }

    public get next(): AiWaypoint {
        return this._next as AiWaypoint;
    }

    public set next(next: AiWaypoint) {
        this._next = next;
    }

    public get previous(): AiWaypoint {
       return this._previous as AiWaypoint;
    }

    public set previous(previous: AiWaypoint) {
        this._previous = previous;
    }

    private get angleBetweenWaypoints(): number {
        return this.vectorToPrevious.angleTo(this.vectorToNext);
    }

    public waypointAngle(): number {
        return this.isDoublyLinked() ? this.angleBetweenWaypoints : 0;
    }
}
