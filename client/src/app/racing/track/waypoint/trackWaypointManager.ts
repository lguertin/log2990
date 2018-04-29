import { WaypointCollection } from "./waypointCollection";
import { Waypoint } from "./waypoint";
import { Track } from "../track";

export class TrackWaypointManager {
    private _waypointCollection: WaypointCollection<Waypoint>;

    public constructor(track: Track) {
        this.createWaypointCollection(track);
    }

    private createWaypointCollection(track: Track): void {
        this._waypointCollection = new WaypointCollection();
        for (const point of track.points) {
            this._waypointCollection.add(new Waypoint(point));
        }
        this._waypointCollection.linkLoop();

        this._waypointCollection.addBefore(new Waypoint(track.raceFlagMesh.position), this._waypointCollection.firstWaypoint.next);
    }

    public get waypointCollection(): WaypointCollection<Waypoint> {
        return this._waypointCollection;
    }
}
