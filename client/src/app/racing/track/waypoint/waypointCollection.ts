import { Waypoint } from "./waypoint";

export class WaypointCollection<T extends Waypoint> {
    private _waypoints: Set<T>;
    private _lastWaypoint: T;
    private _firstWaypoint: T;

    public constructor() {
        this._waypoints = new Set<T>();
    }

    public get waypoints(): Set<T> {
        return this._waypoints;
    }

    public get numberOfWaypoints(): number {
        return this._waypoints.size;
    }

    public get firstWaypoint(): T {
        return this._firstWaypoint;
    }

    public get lastWaypoint(): T {
        return this._lastWaypoint;
    }

    public isEmpty(): Boolean {
        return this.numberOfWaypoints === 0;
    }

    public add(newWaypoint: T): void {
        if (newWaypoint === undefined) {
            return;
        }

        if (this.isEmpty()) {
            this._firstWaypoint = newWaypoint;
        } else {
            this.linkWaypoints(this.lastWaypoint, newWaypoint);
        }

        this._waypoints.add(newWaypoint);
        this._lastWaypoint = newWaypoint;
    }

    public addBefore(newWaypoint: T, referenceWaypoint: T): void {
        if (this.isEmpty() || !this._waypoints.has(referenceWaypoint) || newWaypoint === undefined) {
            return;
        }

        if (referenceWaypoint.hasPrevious()) {
            this.linkWaypoints((referenceWaypoint.previous as T), newWaypoint);
        } else {
            this._firstWaypoint = newWaypoint;
        }

        this.linkWaypoints(newWaypoint, referenceWaypoint);
        this._waypoints.add(newWaypoint);
    }

    private linkWaypoints(waypoint: T, nextWaypoint: T): void {
        waypoint.next = nextWaypoint;
        nextWaypoint.previous = waypoint;
    }

    public linkLoop(): void {
        this.lastWaypoint.next = this.firstWaypoint;
        this.firstWaypoint.previous = this.lastWaypoint;
    }
}
