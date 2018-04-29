
import { Mesh, Vector3} from "three";
import { Segment } from "./segment";
import * as TrackConstant from "./constants";
import { VectorUtils } from "../utils/vector-utils";
import { NUMBER_OF_CARS, INITIAL_POSITION_PARALLEL_DISTANCE} from "../car/constants";
import * as Constant from "../constants";

export class RaceFlag extends Mesh {
    private _segment: Segment ;

    public constructor() {
        super( TrackConstant.FLAG_GEOMETRY, TrackConstant.FLAG_MATERIAL);
    }

    public set segment(segment: Segment) {
        this._segment = segment;
        this.update();
    }

    private get depthVector(): Vector3 {
        return this._segment.direction.multiplyScalar(TrackConstant.FLAG_DISTANCE / 2);
    }

    public get leftSide(): Vector3 {
        return this.neededPosition
                .add(this._segment.leftDirection.multiplyScalar(TrackConstant.ROAD_WIDTH))
                .add(this.depthVector);
    }

    public get rightSide(): Vector3 {
        return this.neededPosition
                .add(this._segment.rightDirection.multiplyScalar(TrackConstant.ROAD_WIDTH))
                .add(this.depthVector);
    }

    private get startPoint(): Vector3 {
        return this._segment.middlePoint;
    }

    private get direction(): Vector3 {
        return this._segment.direction;
    }

    private get distance(): number {
        return (NUMBER_OF_CARS + 1) * INITIAL_POSITION_PARALLEL_DISTANCE;
    }

    private get distanceFromStart(): Vector3 {
        return this.direction.multiplyScalar(this.distance);
    }

    private get heightOffset(): Vector3 {
        return new Vector3(0, TrackConstant.FLAG_DEPTH, 0);
    }

    private get neededPosition(): Vector3 {
        return this.startPoint.add(this.distanceFromStart).add(this.heightOffset);
    }

    private updatePosition(): void {
        VectorUtils.copyVector(this.neededPosition, this.position);
    }

    private get neededAngle(): number {
        return VectorUtils.getXZAngle(this.direction) + Constant.PI_OVER_2 ;
    }

    private updateAngle(): void {
        this.setRotationFromAxisAngle( Constant.VERTICAL_AXIS, this.neededAngle);
    }

    private update(): void {
        this.updatePosition();
        this.updateAngle();
    }
}
