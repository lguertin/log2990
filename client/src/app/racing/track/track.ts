import { Vector3, Mesh, Object3D, Box3 } from "three";
import { Segment } from "./segment";
import { Points } from "./points";
import { SegmentsManager } from "./segmentsManager";

export class Track {

    private _segmentsManager: SegmentsManager;

    public constructor() {
        this._segmentsManager = new SegmentsManager();
    }

    public get points(): Vector3[] {
        return this._segmentsManager.points;
    }

    public set points(points: Vector3[]) {
        this._segmentsManager.points = points;
    }

    public get bounds(): Box3 {
        const box3: Box3 = new Box3();

        for (const cylinder of this.cylinders) {
            box3.expandByObject(cylinder);
        }

        return box3;
    }

    public get segments(): Segment[] {
        return this._segmentsManager.segments;
    }

    public get meshes(): Mesh[] {
        return this._segmentsManager.meshes;
    }

    public get numberOfSegments(): number {
        return this.segments.length;
    }

    public get raceFlagMesh(): Mesh {
        return this._segmentsManager.raceFlagMesh;
    }

    public getSegmentIndex( index: number): Segment {
        return this._segmentsManager.segments[index];
    }

    public get firstSegment(): Segment {
        return this.segments[0];
    }

    public get cylinders(): Mesh[] {
        return this._segmentsManager.cylinders;
    }

    public isEmpty(): boolean {
        return this._segmentsManager.numberOfSegments === 0;
    }

    public isValid(): boolean {
        return this._segmentsManager.isValid() && this.isLooping();
    }

    public isLooping(): boolean {
        return this._segmentsManager.isLooping();
    }

    public addFirstSegment(startPoint: Vector3, nextPoint: Vector3): Mesh[] {
        return this._segmentsManager.addFirstSegment(startPoint, nextPoint);
    }

    public addSegment(nextPoint: Vector3): Mesh[] {
        return this._segmentsManager.addSegment(nextPoint);
    }

    public loopCircuit(): Mesh[] {
        return this._segmentsManager.loopCircuit();
    }

    public createSegment(elem: Object3D, points: Points): Mesh[] {
        return this._segmentsManager.createSegment(elem, points);
    }

    public removeSegment(): Mesh[] {
        return this._segmentsManager.removeSegment();
    }

    public removeMovedSegments(index: number): Mesh[] {
        return this._segmentsManager.removeMovedSegments(index);
    }

    public addMovedSegments(newPoint: Vector3): Mesh[] {
        return this._segmentsManager.addMovedSegments(newPoint);
    }

    public generate(array: Vector3[]): Mesh[] {
        this._segmentsManager.reinitialize();

        this._segmentsManager.addFirstSegment(array[0], array[1]);

        for (let k: number = 2 ; k < array.length ; k++) {
            this._segmentsManager.addSegment(array[k]);
        }

        this._segmentsManager.loopCircuit();

        return this._segmentsManager.meshes;
    }
}
