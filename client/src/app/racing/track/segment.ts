import { Vector3, LineCurve3, ExtrudeGeometry, Material, Mesh } from "three" ;
import * as TrackConstant from "./constants";
import { VERTICAL_AXIS } from "../constants";

export class Segment {

    private _path: LineCurve3 ;
    private _mesh: Mesh ;
    private _valid: boolean = true;

    public static getValidityMaterial(valid: boolean): Material {
        return valid ? TrackConstant.SEGMENT_TRACK_MATERIAL : TrackConstant.INVALID_SEGMENT_MATERIAL;
    }

    public constructor(startPoint: Vector3, endPoint: Vector3) {
        this._path = new LineCurve3(startPoint, endPoint);
        this._mesh = this.createMesh();
    }

    private createMesh(): Mesh {
        return new Mesh(this.geometry, TrackConstant.SEGMENT_TRACK_MATERIAL);
    }

    public get mesh(): Mesh {
        return this._mesh ;
    }

    public setValidity(valid: boolean): void {
        this._valid = valid;
        this._mesh.material = Segment.getValidityMaterial(valid);
    }

    public get isValid(): boolean {
        return this._valid;
    }

    public get startPoint(): Vector3 {
        return this._path.getPointAt(0);
    }

    public get middlePoint(): Vector3 {
        // tslint:disable-next-line:no-magic-numbers
        return this._path.getPointAt(0.5);
    }

    public get endPoint(): Vector3 {
        return this._path.getPointAt(1);
    }

    public get direction(): Vector3 {
        return this._path.getTangentAt(0);
    }

    public get distance(): number {
        return this._path.getLength();
    }

    public getDistanceVector(point: Vector3): Vector3 {
        return this.startPoint.clone().sub(point).projectOnPlane(this.direction);
    }

    public isValidLength(): boolean {
        return this.distance >= TrackConstant.SEGMENT_MINIMUM_LENGTH;
    }

    public get leftDirection(): Vector3 {
        return VERTICAL_AXIS.clone().cross(this.direction);
    }

    public get rightDirection(): Vector3 {
        return this.direction.cross(VERTICAL_AXIS);
    }

    private get extrudeSettings(): {} {
        return {
            steps           : TrackConstant.SEGMENT_PATH_NUMBER_OF_STEPS,
            bevelEnabled    : TrackConstant.SEGMENT_PATH_BEVEL_ENABLED,
            extrudePath     : this._path
        };
    }

    private get geometry(): ExtrudeGeometry {
        return new ExtrudeGeometry( TrackConstant.TRACK_EXTRUDED_SHAPE, this.extrudeSettings);
    }
}
