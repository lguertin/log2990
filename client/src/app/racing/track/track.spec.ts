import { Track } from "./track";
import { TrackValidator } from "./trackValidator";
import * as TrackConstants from "./constants";
import { Points } from "./points";
import { Vector3 } from "three";

/* tslint:disable: no-magic-numbers max-file-line-count */
describe("Track", () => {
    let track: Track;
    beforeEach(() => {
        track = new Track();
    });

    it("should be instantiable using default constructor", () => {
        track = new Track();
        expect(track).toBeDefined();
        expect(track.numberOfSegments).toBe(0);
    });

    describe("when adding the first segment", () => {
        beforeEach( () => {
            track.addFirstSegment(new Vector3(0, 0, 0), new Vector3(20, 0, 0));
        });

        it("should add constructed segment to the road ", () => {
            expect(track.numberOfSegments).toBe(1);
        });

        it("should add cylinder around spheres", () => {
            expect(track.numberOfSegments).toEqual(track.cylinders.length - 1);
            expect(track.cylinders[0].position).toEqual(new Vector3(0, 0, 0));
        });
    });

    describe("when adding the first segment", () => {
        it("should be invalid if it's shorter than the required length", () => {
            track.addFirstSegment(new Vector3(0, 0, 0), new Vector3(0, 0, TrackValidator.firstSegmentMinimumLength - 1));
            expect(track.segments[0].isValid).toBeFalsy();
        });

        it("should be valid if it's equal or greater than the required length", () => {
            for (let i: number = 0 ; i < 10; i++) {
                track.addFirstSegment(new Vector3(0, 0, 0), new Vector3(0, 0, TrackValidator.firstSegmentMinimumLength + i));
                expect(track.segments[0].isValid).toBeTruthy();
                track.removeSegment();
            }
        });
    });

    describe("when adding an another segment", () => {
        beforeEach( () => {
            track.addFirstSegment(new Vector3(0, 0, -TrackValidator.firstSegmentMinimumLength), new Vector3(0, 0, 0));
        });

        it("should be invalid if it's shorter than the required length", () => {
            track.addSegment(new Vector3(0, 0, TrackConstants.SEGMENT_MINIMUM_LENGTH - 1));
            expect(track.segments[1].isValid).toBeFalsy();
        });

        it("should be valid if it's equal or greater than the required length", () => {
            for (let i: number = 0 ; i < 10; i++) {
                track.addSegment(new Vector3(0, 0, TrackConstants.SEGMENT_MINIMUM_LENGTH + i));
                expect(track.segments[1].isValid).toBeTruthy();
                track.removeSegment();
            }
        });
    });

    describe("when checking angles validity", () => {
        beforeEach( () => {
            track.addFirstSegment(new Vector3(0, 0, -TrackValidator.firstSegmentMinimumLength), new Vector3(0, 0, 0));
            track.addSegment(new Vector3(0, 0, TrackConstants.SEGMENT_MINIMUM_LENGTH));
        });

        it("should have invalid segments as the angle is less than pi/4", () => {
            expect(track.segments[1].isValid).toBeTruthy();
            track.addSegment(new Vector3(TrackConstants.ROAD_WIDTH / 2, 0, 0));
            expect(track.segments[1].isValid).toBeFalsy();
            expect(track.segments[2].isValid).toBeFalsy();
        });

        it("should have valid segments as the angle is more than pi/4", () => {
            expect(track.segments[1].isValid).toBeTruthy();
            track.addSegment(new Vector3(TrackConstants.SEGMENT_MINIMUM_LENGTH, 0, TrackConstants.SEGMENT_MINIMUM_LENGTH));
            expect(track.segments[1].isValid).toBeTruthy();
            expect(track.segments[2].isValid).toBeTruthy();
        });
    });

    describe("when adding and removing", () => {

        beforeEach( () => {
            track.addFirstSegment(new Vector3(0, 0, 0), new Vector3(1, 1, 1));
        });

        it("should have the number of segments incremented and decremented when segments are added and removed", () => {
            for (let i: number = 2 ; i <= 10 ; i++) {
                track.addSegment(new Vector3(i, i, i));
                expect(track.numberOfSegments).toEqual(i);
            }

            for (let i: number = 9 ; i >= 0 ; i--) {
                track.removeSegment();
                expect(track.numberOfSegments).toEqual(i);
            }
        });
    });

    describe("when testing looping", () => {
        let points: Points;

        beforeEach( () => {
            points = new Points();
            points.addNewPoint(new Vector3(0, 0, TrackConstants.ROAD_WIDTH * 2));
            points.addNewPoint(new Vector3(TrackConstants.ROAD_WIDTH * 2, 0, TrackConstants.ROAD_WIDTH * 2));

            track.addFirstSegment(new Vector3(0, 0, 0), points.points[1].position);
            track.addSegment(points.points[2].position);
        });

        it("should not be considered looped when no point is added to the first", () => {
            expect(track.isLooping()).toBeFalsy();
        });

        it("should be considered looped when the next point is added to the first", () => {
            track.createSegment(points.points[0], points);
            expect(track.isLooping()).toBeTruthy();
        });
    });

    it("should not add segments if it's already looped", () => {
        const points: Points = new Points();
        points.addNewPoint(new Vector3(0, 0, TrackConstants.ROAD_WIDTH * 2));
        points.addNewPoint(new Vector3(TrackConstants.ROAD_WIDTH * 2, 0, TrackConstants.ROAD_WIDTH * 2));

        track.addFirstSegment(new Vector3(0, 0, 0), points.points[1].position);
        track.addSegment(points.points[2].position);
        track.createSegment(points.points[0], points);

        const size: number = track.numberOfSegments ;

        const newPoints: Points = new Points();
        newPoints.addNewPoint(new Vector3(1, 1, 1));
        newPoints.addNewPoint(new Vector3(2, 2, 2));
        newPoints.addNewPoint(new Vector3(3, 3, 3));

        for (const mesh of newPoints.points) {
            expect(track.createSegment(mesh, newPoints).length).toBe(0);
            expect(track.numberOfSegments).toEqual(size);
         }
    });

    it("should have the same of number of segments and cylinders-1 when the road is not looped" , () => {
        track.addFirstSegment(new Vector3(0, 0, 0), new Vector3(1, 1, 1));
        expect(track.numberOfSegments).toEqual(track.cylinders.length - 1);

        for (let i: number = 2 ; i <= 10 ; i++) {
            track.addSegment(new Vector3(i, i, i));
            expect(track.numberOfSegments).toEqual(track.cylinders.length - 1);
        }
    });

    describe("when it is looped", () => {
        beforeEach( () => {
            const points: Points = new Points();
            points.addNewPoint(new Vector3(0, 0, TrackConstants.ROAD_WIDTH * 2));
            points.addNewPoint(new Vector3(TrackConstants.ROAD_WIDTH * 2, 0, TrackConstants.ROAD_WIDTH * 2));

            track.addFirstSegment(new Vector3(0, 0, 0), points.points[1].position);
            track.createSegment(points.points[2], points);
            track.createSegment(points.points[0], points);
        });

        it("should have the same number  of cylinders and segments when the road is looped", () => {
            expect(track.numberOfSegments).toEqual(track.cylinders.length);
        });

        it("should be considered looped then unlooped when the method removeSegment is called", () => {
            expect(track.isLooping()).toBeTruthy();
            track.removeSegment();
            expect(track.isLooping()).toBeFalsy();
        });
    });

    it("should have two of its segments moved when moveSegment is called", () => {
        const points: Points = new Points();

        for (let i: number = 1 ; i < 10 ; i++) {
            points.addNewPoint(new Vector3(0, 0, TrackConstants.ROAD_WIDTH * i));
        }

        track.addFirstSegment(new Vector3(0, 0, 0), points.points[1].position);

        for (let i: number = 2 ; i < 10 ; i++ ) {
            track.createSegment(points.points[i], points);
        }

        for (let i: number = 1 ; i < track.numberOfSegments ; i++ ) {
            track.removeMovedSegments(i);
            track.addMovedSegments(points.points[i].position.add(new Vector3(10, 0, 0)));
            expect(track.segments[i - 1].endPoint).toEqual(points.points[i].position);
            expect(track.segments[i].startPoint).toEqual(points.points[i].position);
        }
    });

    describe("when moving segments", () => {
        let points: Points;

        beforeEach( () => {
            points = new Points();
            points.addNewPoint(new Vector3(0, 0, TrackValidator.firstSegmentMinimumLength));
            points.addNewPoint(new Vector3(TrackValidator.firstSegmentMinimumLength, 0, TrackValidator.firstSegmentMinimumLength));

            track.addFirstSegment(new Vector3(0, 0, 0), points.points[1].position);
            track.addSegment(points.points[2].position);
            track.createSegment(points.points[0], points);
        });

        it("should have the first and last segment moved when the road is looped and the first point is moved", () => {
            track.removeMovedSegments(0);
            track.addMovedSegments(points.points[0].position.add(new Vector3(10, 0, 0)));

            expect(track.segments[track.numberOfSegments - 1].endPoint).toEqual(points.points[0].position);
            expect(track.segments[0].startPoint).toEqual(points.points[0].position);
        });

        it("should make the angle segments invalid then valid when they are moved", () => {
            expect(track.segments[track.numberOfSegments - 1].isValid).toBeTruthy();
            expect(track.segments[0].isValid).toBeTruthy();
            expect(track.isValid()).toBeTruthy();

            track.removeMovedSegments(0);
            track.addMovedSegments(points.points[0].position.add(new Vector3(-TrackConstants.ROAD_WIDTH, 0, 0)));

            expect(track.segments[track.numberOfSegments - 1].isValid).toBeFalsy();
            expect(track.segments[0].isValid).toBeFalsy();
            expect(track.isValid()).toBeFalsy();

            track.removeMovedSegments(0);
            track.addMovedSegments(points.points[0].position.add(new Vector3(TrackConstants.ROAD_WIDTH, 0, 0)));

            expect(track.segments[track.numberOfSegments - 1].isValid).toBeTruthy();
            expect(track.segments[0].isValid).toBeTruthy();
            expect(track.isValid()).toBeTruthy();
        });
    });
});
