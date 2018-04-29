import { Mesh } from "three";
import { Segment } from "./segment";
import * as TrackConstant from "./constants";
import { ArrayUtils } from "../utils/array-utils";
import { INITIAL_POSITION_PARALLEL_DISTANCE, NUMBER_OF_CARS } from "../car/constants";
import { VerticalRaycast } from "../utils/vertical-raycast";
import { RaceFlag } from "./raceFlag";

export class TrackValidator {

    public static checkValidity(segments: Segment[], cylinders: Mesh[], raceFlag: RaceFlag, loop: boolean): boolean {
        TrackValidator.setTrackValid(segments, cylinders);

        if (segments.length >= 2) {
            TrackValidator.changeSegmentsValidityTexture(segments, cylinders, loop);
        } else if (segments.length === 1) {
            TrackValidator.checkValidityForOneSegment(segments);
        }

        return TrackValidator.everySegmentValid(segments) &&
        TrackValidator.checkRaceFlagValidity(raceFlag, TrackValidator.getMeshes(segments), segments[0]);
    }

    public static intersects(segment1: Segment, segment2: Segment): boolean {
        const determinant: number = TrackValidator.segmentDeterminant(segment1, segment2);

        if (determinant === 0) {
              return false;
        } else {
            return  TrackValidator.insideBoundsExclusive(TrackValidator.segmentLambda(segment1, segment2, determinant), 0, 1)
                &&  TrackValidator.insideBoundsExclusive(TrackValidator.segmentGamma(segment1, segment2, determinant) , 0, 1);
        }

    }

    public static validIntersections(segments: Segment[], loop: boolean): boolean[] {
        return TrackValidator.validityForEachSegment(TrackValidator.matrixOfIntersections(segments, loop));
    }

    public static get firstSegmentMinimumLength(): number {
        return (NUMBER_OF_CARS + 1) * INITIAL_POSITION_PARALLEL_DISTANCE + TrackConstant.ROAD_WIDTH * 2;
    }

    private static segmentDeterminant(seg1: Segment, seg2: Segment): number {
        return  (seg1.endPoint.x - seg1.startPoint.x) * (seg2.endPoint.z - seg2.startPoint.z)
            -   (seg2.endPoint.x - seg2.startPoint.x) * (seg1.endPoint.z - seg1.startPoint.z);
    }

    private static segmentLambda(seg1: Segment, seg2: Segment, determinant: number): number {
        return ((seg2.endPoint.z - seg2.startPoint.z) * (seg2.endPoint.x - seg1.startPoint.x)
            +   (seg2.startPoint.x - seg2.endPoint.x) * (seg2.endPoint.z - seg1.startPoint.z))
                / determinant;
    }

    private static segmentGamma(seg1: Segment, seg2: Segment, determinant: number): number {
        return ((seg1.startPoint.z - seg1.endPoint.z) * (seg2.endPoint.x - seg1.startPoint.x)
            +   (seg1.endPoint.x - seg1.startPoint.x) * (seg2.endPoint.z - seg1.startPoint.z))
                / determinant;
    }

    private static insideBoundsExclusive(value: number, min: number, max: number): boolean {
        return value > min && value < max;
    }

    private static matrixOfIntersections(segments: Segment[], loop: boolean): boolean[][] {
        const array2D: boolean[][] = ArrayUtils.init2DArray(segments.length, segments.length, true);

        for ( let i: number = 0; i < segments.length - 1 ; i++ ) {
            for ( let j: number = i + 2; j < segments.length; j++) {
                if (TrackValidator.intersects(segments[i], segments[j])) {
                        array2D[i][j] = false ;
                        array2D[j][i] = false ;
                }
            }
        }

        return array2D;
    }

    private static booleansAllTrue(column: boolean[]): boolean {
        for (const cell of column) {
            if (!cell) {
                return false;
            }
        }

        return true;
    }

    private static validityForEachSegment(array2D: boolean[][]): boolean[] {
        const validSegments: boolean[] = [];

        for (const column of array2D) {
            validSegments.push(TrackValidator.booleansAllTrue(column));
        }

        return validSegments ;
    }

    private static checkFirstSegmentLengthValidity(firstSegment: Segment): boolean {
        if (firstSegment.distance < TrackValidator.firstSegmentMinimumLength) {
            firstSegment.setValidity(false);
        }

        return firstSegment.isValid;
    }

    private static checkRaceFlagValidity(raceFlag: RaceFlag, segmentMeshes: Mesh[], firstSegment: Segment): boolean {
        if (firstSegment) {
            if (VerticalRaycast.intersectObjects(raceFlag.leftSide, segmentMeshes).length !== 0
            ||  VerticalRaycast.intersectObjects(raceFlag.rightSide, segmentMeshes).length !== 0) {
                firstSegment.setValidity(false);
            }

            return firstSegment.isValid;
        }

        return true;
    }

    private static validLengths(segments: Segment[]): boolean[] {
        const validLength: boolean[] = new Array < boolean >();

        for ( const segment of segments) {
            validLength.push(segment.isValidLength());
        }

        validLength[0] = TrackValidator.checkFirstSegmentLengthValidity(segments[0]);

        return validLength ;
    }

    private static angleBetweenSegments(first: Segment, second: Segment): number {
        return Math.abs(first.direction.negate().angleTo(second.direction));
    }

    private static validAngleSegments(first: Segment, second: Segment): boolean {
        return TrackValidator.angleBetweenSegments(first, second) >= TrackConstant.MIN_VALID_ANGLE;
    }

    private static validAngles(segments: Segment[], loop: boolean): boolean[] {
        const validAngle: boolean[] = new Array < boolean >();

        for (let i: number = 0 ; i < segments.length - 1 ; i++) {
            validAngle.push(TrackValidator.validAngleSegments(segments[i], segments[i + 1]));
        }

        if ( loop ) {
            validAngle.push(TrackValidator.validAngleSegments(segments[0], segments[segments.length - 1]));
        }

        return validAngle ;
    }

    private static getCornerValidity(index: number, segments: Segment[], loop: boolean): boolean {
        if (index === 0) {
            if (loop) {
                return segments[index].isValid || segments[segments.length - 1].isValid;
            } else {
                return segments[index].isValid;
            }
        } else if (index === segments.length && !loop) {
            return segments[segments.length - 1].isValid;
        } else {
            return segments[index].isValid || segments[index - 1].isValid;
        }
    }

    private static changeCylindersValidityTexture(cylinders: Mesh[], segments: Segment[], loop: boolean): void {
        for (let i: number = 0 ; i < cylinders.length ; i++) {
            cylinders[i].material = Segment.getValidityMaterial(TrackValidator.getCornerValidity(i, segments, loop));
        }
    }

    private static changeSegmentsValidityTexture(segments: Segment[], cylinders: Mesh[], loop: boolean): void {
        const last: number = segments.length - 1 ;

        const validLengths: boolean[] = TrackValidator.validLengths(segments);
        const validAngles: boolean[] = TrackValidator.validAngles(segments, loop);
        const validIntersections: boolean[] = TrackValidator.validIntersections(segments, loop);

        for (let i: number = 1 ; i < last ; i++) {
            segments[i].setValidity(validLengths[i] && validIntersections[i] && validAngles[i - 1] && validAngles[i]);
        }

        if (loop) {
            segments[0].setValidity(validLengths[0] && validIntersections[0] && validAngles[last] && validAngles[0]);
            segments[last].setValidity( validLengths[last] && validIntersections[last] && validAngles[last - 1] && validAngles[last]);
        } else {
            segments[0].setValidity(validLengths[0] && validIntersections[0] && validAngles[0]);
            segments[last].setValidity( validLengths[last] && validIntersections[last] && validAngles[last - 1]);
        }

        TrackValidator.changeCylindersValidityTexture(cylinders, segments, loop);
    }

    private static everySegmentValid(segments: Segment[]): boolean {
        for (const segment of segments) {
            if (!segment.isValid) {
                return false;
            }
        }

        return true;
    }

    private static checkValidityForOneSegment(segments: Segment[]): void {
        segments[0].setValidity(true);
        TrackValidator.checkFirstSegmentLengthValidity(segments[0]);
    }

    private static setTrackValid(segments: Segment[], cylinders: Mesh[]): void {
        for (const segment of segments) {
            segment.setValidity(true);
        }

        for (const cylinder of cylinders) {
            cylinder.material = TrackConstant.CYLINDER_TRACK_MATERIAL;
        }
    }

    private static getMeshes(segments: Segment[]): Mesh[] {
        const meshes: Mesh[] = [];

        for (const segment of segments) {
            meshes.push(segment.mesh.clone());
        }

        return meshes;
    }
}
