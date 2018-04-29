import { Mesh, Object3D, Vector3 } from "three";
import { Points } from "./points";
import { TrackValidator } from "./trackValidator";
import { Segment } from "./segment";
import * as TrackConstant from "./constants";
import { VectorUtils } from "../utils/vector-utils";
import { RaceFlag } from "./raceFlag";

export class SegmentsManager {
    private _segments: Segment[];
    private _cylinders: Mesh[];
    private _isLooping: boolean = false;
    private _raceFlag: RaceFlag;

    private _movedSegmentsIndex: number;
    private _startMovementPoint: Vector3;
    private _endMovementPoint: Vector3;

    public constructor() {
        this._segments = [];
        this._cylinders = [];
        this._raceFlag = new RaceFlag();
    }

    public get segments(): Segment[] {
        return this._segments;
    }

    public get cylinders(): Mesh[] {
        return this._cylinders;
    }

    public get numberOfSegments(): number {
        return this._segments.length;
    }

    public get raceFlagMesh(): Mesh {
        return this._raceFlag;
    }

    private get numberOfCylinders(): number {
        return this._cylinders.length;
    }

    public isLooping(): boolean {
        return this._isLooping;
    }

    private checkValidity(): boolean {
        return TrackValidator.checkValidity(this._segments, this.cylinders, this._raceFlag, this._isLooping);
    }

    public isValid(): boolean {
        return this.checkValidity();
    }

    public get points(): Vector3[] {
        const points: Vector3[] = [];

        for (const segment of this._segments) {
            points.push(segment.startPoint);
        }

        return points;
    }

    public set points(points: Vector3[]) {
        this._segments = [];

        this.addFirstSegment(points[0], points[1]);

        for (let i: number = 2; i < points.length; i++) {
            this.addSegment(points[i]);
        }

        this.loopCircuit();
    }

    public get meshes(): Mesh[] {
        const meshes: Mesh[] = new Array<Mesh>();

        for (const segment of this._segments) {
            meshes.push(segment.mesh);
        }

        for (const cylinder of this._cylinders) {
            meshes.push(cylinder);
        }

        meshes.push(this._raceFlag);

        return meshes;
    }

    public reinitialize(): void {
        this._segments = new Array<Segment>();
        this._cylinders = new Array<Mesh>();
        this._isLooping = false;
    }

    private createCylinderMesh(): Mesh {
        return new Mesh(TrackConstant.CYLINDER_GEOMETRY, TrackConstant.CYLINDER_TRACK_MATERIAL);
    }

    private createCylinder(point: Vector3): Mesh {
        const cylinderMesh: Mesh = this.createCylinderMesh();
        VectorUtils.copyVector(point, cylinderMesh.position);

        return cylinderMesh;
    }

    public addFirstSegment(startPoint: Vector3, nextPoint: Vector3): Mesh[] {
        this._segments.push(new Segment(startPoint, nextPoint));
        this.pushNewCylinder(startPoint);
        this.pushNewCylinder(nextPoint);

        this._raceFlag.segment = this.firstSegment;
        this.checkValidity();

        return [this._segments[0].mesh, this._cylinders[0], this._cylinders[1], this._raceFlag];
    }

    public get firstSegment(): Segment {
        return this._segments[0];
    }

    private get firstPoint(): Vector3 {
        return this.firstSegment.startPoint;
    }

    private get lastSegment(): Segment {
        return this._segments[this.numberOfSegments - 1];
    }

    private get lastCylinder(): Mesh {
        return this._cylinders[this.numberOfCylinders - 1];
    }

    private get lastPoint(): Vector3 {
        return this.lastSegment.endPoint;
    }

    private createNextSegment(nextPoint: Vector3): Segment {
        return new Segment(this.lastPoint, nextPoint);
    }

    private pushNewSegment(nextPoint: Vector3): void {
        this._segments.push(this.createNextSegment(nextPoint));
    }

    private pushNewCylinder(nextPoint: Vector3): void {
        this._cylinders.push(this.createCylinder(nextPoint));
    }

    public addSegment(nextPoint: Vector3): Mesh[] {
        this.pushNewSegment(nextPoint);
        this.pushNewCylinder(nextPoint);

        this.checkValidity();

        return [this.lastSegment.mesh, this.lastCylinder];
    }

    public loopCircuit(): Mesh[] {
        this.pushNewSegment(this.firstPoint);
        this._isLooping = true;

        this.checkValidity();

        return [this.lastSegment.mesh];
    }

    public createSegment(elem: Object3D, points: Points): Mesh[] {
        if (!this._isLooping) {
            if (elem === undefined) {
                if (this.numberOfSegments === 0) {
                    return this.addFirstSegment(points.points[0].position, points.lastPoint.position);
                } else {
                    return this.addSegment(points.lastPoint.position);
                }
            } else {
                if (points.getIndex(elem as Mesh) === 0) {
                    return this.loopCircuit();
                }
            }
        }

        return [];
    }

    private unloopCircuit(): Mesh[] {
        this._isLooping = false;

        return [this._segments.pop().mesh];
    }

    private removeLastSegmentMesh(): Mesh[] {
        if (this._segments.length === 1) {
            return [this._segments.pop().mesh, this._cylinders.pop(), this._cylinders.pop(), this._raceFlag];
        } else {
            return [this._segments.pop().mesh, this._cylinders.pop()];
        }
    }

    public removeSegment(): Mesh[] {
        const meshes: Mesh[] = this._isLooping ? this.unloopCircuit() : this.removeLastSegmentMesh();
        this.checkValidity();

        return meshes;
    }

    private removeMovedSegment(index: number): Mesh {
        const segmentMesh: Mesh = this._segments[index].mesh;
        this._segments[index] = undefined;

        return segmentMesh;
    }

    public removeMovedSegments(index: number): Mesh[] {
        const segmentsToRemove: Mesh[] = [];

        if (index > 0) {
            this._startMovementPoint = this._segments[index - 1].startPoint;
            segmentsToRemove.push(this.removeMovedSegment(index - 1));
        }
        if (index < this._segments.length) {
            this._endMovementPoint = this._segments[index].endPoint;
            segmentsToRemove.push(this.removeMovedSegment(index));
        }
        if (index === 0 && this._isLooping) {
            segmentsToRemove.push(this.removeMovedSegment(this.numberOfSegments - 1));
        }

        this._movedSegmentsIndex = (this._segments.length > 0) ? index : undefined;

        return segmentsToRemove;
    }

    private addMovedSegment(startPoint: Vector3, endPoint: Vector3, index: number): Mesh {
        this._segments[index] = new Segment(startPoint, endPoint);
        this._raceFlag.segment = this.segments[0];

        return this._segments[index].mesh;
    }

    public addMovedSegments(newPoint: Vector3): Mesh[] {
        const segmentsToAdd: Mesh[] = [];

        if (this._movedSegmentsIndex > 0) {
            segmentsToAdd.push(this.addMovedSegment(this._startMovementPoint, newPoint, this._movedSegmentsIndex - 1));
        }

        if (this._movedSegmentsIndex < this._segments.length) {
            segmentsToAdd.push(this.addMovedSegment(newPoint, this._endMovementPoint, this._movedSegmentsIndex));
        }
        if (this._movedSegmentsIndex === 0 && this._isLooping) {
            segmentsToAdd.push(this.addMovedSegment(this._segments[this.numberOfSegments - 2].endPoint,
                                                    newPoint,
                                                    this.numberOfSegments - 1));
        }

        if (this._cylinders[this._movedSegmentsIndex]) {
            VectorUtils.copyVector(newPoint, this._cylinders[this._movedSegmentsIndex].position);
        }

        this.checkValidity();

        return segmentsToAdd;
    }
}
