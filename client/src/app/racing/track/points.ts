import { Vector3, Mesh, Object3D, Material } from "three";
import { VectorUtils } from "../utils/vector-utils";
import * as TrackConstant from "./constants";

export class Points {
    private _points: Mesh[] ;

    public constructor () {
        this._points = [];
        this.addFirstPoint(new Vector3(0, 0, 0));
    }

    private static createPoint(material: Material): Mesh {
        return new Mesh(TrackConstant.POINT_GEOMETRY, material);
    }

    private static createFirstPoint(): Mesh {
        return Points.createPoint(TrackConstant.FIRST_POINT_MATERIAL);
    }

    private static createNextPoint(): Mesh {
        return Points.createPoint(TrackConstant.NEXT_POINT_MATERIAL);
    }

    public addFirstPoint( firstPoint: Vector3 ): void {
        this._points.push(Points.createFirstPoint());
        VectorUtils.copyVector(firstPoint, this.firstPoint.position);
    }

    public addNewPoint(point: Vector3): void {
        this._points.push(Points.createNextPoint());
        VectorUtils.copyVector(point, this.lastPoint.position);
    }

    public getIndex(point: Object3D): number {

        for (let index: number = 0 ; index < this._points.length ; index++) {
            if (this._points[index].position === point.position) {
                return index ;
            }
        }

        return -1 ;
    }

    public removeLastPoint(): Mesh {
        return this._points.pop();
    }

    public get firstPoint(): Mesh {
        return this._points[0];
    }

    public get lastPoint(): Mesh {
        return this._points[this.numberOfPoints - 1];
    }

    public get numberOfPoints(): number {
        return this._points.length;
    }

    public get points(): Mesh[] {
        return this._points ;
    }

    public generate(array: Vector3[]): Mesh[] {
        this._points = new Array<Mesh>();

        this.addFirstPoint(array[0]);

        for (let i: number = 1 ; i < array.length ; i++) {
            this.addNewPoint(array[i]);
        }

        return this._points;
    }
}
