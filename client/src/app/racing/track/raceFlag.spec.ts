import { Mesh, Vector3, Quaternion } from "three";
import { RaceFlag } from "./raceFlag";
import { Track } from "./track";

class SpecUtils {
    public static getRaceFlag(meshes: Mesh[]): RaceFlag {
        for (const mesh of meshes) {
            if (mesh instanceof RaceFlag) {
                return mesh as RaceFlag;
            }
        }

        return undefined;
    }
}

/* tslint:disable: no-magic-numbers max-file-line-count */
describe("Raceflag", () => {
    let track: Track;
    beforeEach(() => {
        track = new Track();
    });

    it("should be returned by the track when the first segment is added", () => {
        expect(SpecUtils.getRaceFlag(track.addFirstSegment(new Vector3(), new Vector3(20, 0, 0)))).toBeDefined();
        expect(SpecUtils.getRaceFlag(track.addSegment(new Vector3(40, 0, 0)))).toBeUndefined();

        it("should be removed when the first segment is removed", () => {
            expect(SpecUtils.getRaceFlag(track.removeSegment())).toBeUndefined();
            expect(SpecUtils.getRaceFlag(track.removeSegment())).toBeDefined();
        });

        it("should be added back when the first segment is added", () => {
            expect(SpecUtils.getRaceFlag(track.addSegment(new Vector3(20, 0, 0)))).toBeDefined();
            expect(SpecUtils.getRaceFlag(track.addSegment(new Vector3(40, 0, 0)))).toBeUndefined();
        });
    });

    it("should have its position and angle initialized", () => {
        const trackRaceFlag: RaceFlag = SpecUtils.getRaceFlag(track.addFirstSegment(new Vector3(), new Vector3(20, 0, 0)));

        const otherRaceFlag: RaceFlag = new RaceFlag;
        otherRaceFlag.segment = track.firstSegment;

        expect(trackRaceFlag.segment).toBe(otherRaceFlag.segment);
        expect(trackRaceFlag.position).toEqual(otherRaceFlag.position);
        expect(trackRaceFlag.matrix).toEqual(otherRaceFlag.matrix);
    });

    it("should be updated when the first segment is moved but keep the same distance", () => {
        const trackRaceFlag: RaceFlag = SpecUtils.getRaceFlag(track.addFirstSegment(new Vector3(), new Vector3(20, 0, 0)));

        const originalPosition: Vector3 = trackRaceFlag.position.clone();
        const originalQuaternion: Quaternion = trackRaceFlag.quaternion.clone();

        track.removeMovedSegments(0);
        track.addMovedSegments(new Vector3(20, 0, 20));

        expect(trackRaceFlag.position).not.toEqual(originalPosition);
        expect(trackRaceFlag.quaternion).not.toEqual(originalQuaternion);
    });
});
