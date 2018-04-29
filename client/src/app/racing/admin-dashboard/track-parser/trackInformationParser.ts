import { TrackInformation, TrackPoint } from "../../../../../../common/racing/constants";
import { Track } from "../../track/track";
import { Vector3 } from "three";

export class TrackInformationExporter {

    public static parse(track: Track, trackInformation: TrackInformation): void {
        trackInformation.points = track.points.map((p) => new TrackPoint(p.x, p.z));
    }

}

export class TrackInformationImporter {

    public static parse(trackInformation: TrackInformation): Vector3[] {
        return trackInformation.points.map((p) => new Vector3(p.x, 0, p.z));
    }
}
