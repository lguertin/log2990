import { Track } from "../track/track";
import * as Constant from "../constants";
import {Vector3} from "three";
import { INITIAL_POSITION_PARALLEL_DISTANCE,
    INITIAL_POSITION_LATERAL_DISTANCE } from "./constants";
import { Car } from "./car";
import { VectorUtils } from "../utils/vector-utils";

export class CarPositionner {
    private static _track: Track;
    private static _cars: Car[];
    public constructor() {
    }

    private static get startPosition(): Vector3 {
        return this._track.firstSegment.startPoint;
    }

    private static get startDirection(): Vector3 {
        return this._track.firstSegment.direction ;
    }

    private static  get parallelOffset(): Vector3 {
        return this.startDirection.multiplyScalar(INITIAL_POSITION_PARALLEL_DISTANCE);
    }

    private static getIndexedParallelOffset(carIndex: number): Vector3 {
        return this.parallelOffset.multiplyScalar(carIndex);
    }

    private static  get perpendicularDirection(): Vector3 {
        return this.startDirection.cross(Constant.VERTICAL_AXIS);
    }

    private static get lateralOffset(): Vector3 {
        return this.perpendicularDirection.multiplyScalar(INITIAL_POSITION_LATERAL_DISTANCE);
    }

    private static reverseOrNot(vector: Vector3, carIndex: number): Vector3 {
        return carIndex % 2 === 0 ? vector.negate() : vector;
    }

    private static getLateralZigZagOffset(carIndex: number): Vector3 {
        return this.reverseOrNot(this.lateralOffset, carIndex);
    }

    private static get startAngle(): number {
        return VectorUtils.getXZAngle(this.startDirection) + Math.PI ;
    }

    private static getNeededCarPosition(carIndex: number): Vector3 {
        return this.startPosition.add(this.getIndexedParallelOffset(carIndex)).add(this.getLateralZigZagOffset(carIndex));
    }

    private static  updateCarPosition(car: Car, carIndex: number): void {
        VectorUtils.copyVector(this.getNeededCarPosition(carIndex), car.mesh.position);
    }

    private static  updateCarAngle(car: Car): void {
        car.mesh.setRotationFromAxisAngle(Constant.VERTICAL_AXIS, this.startAngle);
    }

    public static get requiredRaceFlagDistance(): number {
        return INITIAL_POSITION_PARALLEL_DISTANCE * this._cars.length;
    }

    public static  initializeCarsPosition(cars: Car[], track: Track): void {
        this._cars = cars;
        this._track = track;

        let index: number = 0;
        for (const car of this._cars) {
            this.updateCarPosition(car, index++);
            this.updateCarAngle(car);
        }
    }
}
