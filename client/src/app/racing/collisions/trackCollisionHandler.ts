import { Mesh, Vector3 } from "three";
import { Car } from "../car/car";
import { Track } from "../track/track";
import { Segment } from "../track/segment";
import { VerticalRaycast } from "../utils/vertical-raycast";
import { VectorUtils } from "../utils/vector-utils";
import { MathUtils } from "../utils/math-utils";
import { MAXIMUM_SPEED_OUTSIDE_TRACK,
         TRACK_COLLISION_ANGULAR_COEFF,
         TRACK_COLLISION_SPEED_REDUCTION,
         MAX_TRACK_COLLISION_SPEED,
         MAX_TRACK_COLLISION_SPEED_REDUCTION} from "./constants";
import { HALF_ROAD_WIDTH } from "../track/constants";
import { VirtualCar } from "../car/ai/virtualCar";
import { PI_OVER_2 } from "../constants";

export class TrackCollisionHandler {

    public static checkWallIntersections(cars: Car[], track: Track): boolean {
        let humanCarCollided: boolean = false;

        for (const car of cars) {
            if (TrackCollisionHandler.checkCarIntersection(car, track)) {
                if (!(car instanceof VirtualCar)) {
                    humanCarCollided = true;
                }
            }
        }

        return humanCarCollided;
    }

    public static getCollisionVolume(cars: Car[], track: Track): number {
        for (const car of cars) {
            if (!(car instanceof VirtualCar)) {
                return car.speed.length() / MAX_TRACK_COLLISION_SPEED;
            }
        }

        return 0;
    }

    private static isCarCenterInsideTrackSurface(car: Car, trackSurface: Mesh): boolean {
        return VerticalRaycast.intersectObject(car.getPosition(), trackSurface).length > 0;
    }

    private static getCornerOutsideTrack(car: Car, trackSurface: Mesh): Vector3 {
        if (!VerticalRaycast.isIntersecting(car.getCorner(true, true), trackSurface)) {
            return car.getCorner(true, true);
        }

        if (!VerticalRaycast.isIntersecting(car.getCorner(true, false), trackSurface)) {
            return car.getCorner(true, false);
        }

        if (!VerticalRaycast.isIntersecting(car.getCorner(false, true), trackSurface)) {
            return car.getCorner(false, true);
        }

        if (!VerticalRaycast.isIntersecting(car.getCorner(false, false), trackSurface)) {
            return car.getCorner(false, false);
        }

        return undefined;
    }

    private static allCarCornersInsideTrackSurface(car: Car, trackSurface: Mesh): boolean {
        return  trackSurface
        &&      VerticalRaycast.isIntersecting(car.getCorner(true, true), trackSurface)
        &&      VerticalRaycast.isIntersecting(car.getCorner(true, false), trackSurface)
        &&      VerticalRaycast.isIntersecting(car.getCorner(false, true), trackSurface)
        &&      VerticalRaycast.isIntersecting(car.getCorner(false, false), trackSurface);
    }

    private static someCarCornersInsideTrackSurface(car: Car, trackSurface: Mesh): boolean {
        return trackSurface && (VerticalRaycast.isIntersecting(car.getCorner(true, true), trackSurface)
        || VerticalRaycast.isIntersecting(car.getCorner(true, false), trackSurface)
        || VerticalRaycast.isIntersecting(car.getCorner(false, true), trackSurface)
        || VerticalRaycast.isIntersecting(car.getCorner(false, false), trackSurface));
    }

    private static removeHalfWidth(vector: Vector3): Vector3 {
        return vector.setLength(vector.length() - HALF_ROAD_WIDTH);
    }

    private static getSegmentPushNormal(car: Car, segment: Segment): Vector3 {
        return TrackCollisionHandler.removeHalfWidth(segment.getDistanceVector(TrackCollisionHandler
            .getCornerOutsideTrack(car, segment.mesh)));
    }

    private static getCylinderPushNormal(car: Car, cylinder: Mesh): Vector3 {
        return TrackCollisionHandler.removeHalfWidth(cylinder.position.clone()
            .sub(TrackCollisionHandler.getCornerOutsideTrack(car, cylinder)));
    }

    private static getDeltaAngularCollision(car: Car, normal: Vector3, collisionPoint: Vector3): number {
        return collisionPoint.clone().sub(car.getPosition()).cross(normal).y * TRACK_COLLISION_ANGULAR_COEFF ;
    }

    private static getUnboundedCollisionSpeedReduction(car: Car, normal: Vector3): number {
        return TRACK_COLLISION_SPEED_REDUCTION * (1 - (normal.angleTo(car.getDirection()) - PI_OVER_2) / PI_OVER_2);
    }

    private static getCollisionSpeedReduction(car: Car, normal: Vector3): number {
        return MathUtils.boundValue(MAX_TRACK_COLLISION_SPEED_REDUCTION, 1,
                                    this.getUnboundedCollisionSpeedReduction(car, normal));
    }

    private static pushCar(car: Car, pushVector: Vector3, collisionPoint: Vector3): void {
        car.mesh.position.add(pushVector);
        if (pushVector.angleTo(car.getDirection()) > PI_OVER_2) {
            car.angularSpeed = TrackCollisionHandler.getDeltaAngularCollision(car, pushVector, collisionPoint);
        }
        car.speed.multiplyScalar(TrackCollisionHandler.getCollisionSpeedReduction(car, pushVector));
    }

    private static checkCarIntersection(car: Car, track: Track): boolean {
        if (!TrackCollisionHandler.onTrack(car, track)) {
            VectorUtils.boundVector(car.speed, MAXIMUM_SPEED_OUTSIDE_TRACK);

            return false;
        } else {
            if (!TrackCollisionHandler.onMultipleSurfaces(car, track)) {
                return  TrackCollisionHandler.checkCarIntersectionWithCylinders(car, track)
                ||      TrackCollisionHandler.checkCarIntersectionWithSegments(car, track);
            }
        }

        return false;
    }

    private static onMultipleSurfaces(car: Car, track: Track): boolean {
        return VerticalRaycast.intersectObjects(car.getPosition(), track.meshes).length >= 2 ;
    }

    private static onTrack(car: Car, track: Track): boolean {
        for (const surface of track.meshes) {
            if (TrackCollisionHandler.someCarCornersInsideTrackSurface(car, surface)) {
                return true;
            }
        }

        return false;
    }

    private static getCurrentSegment(car: Car, track: Track): Segment {
        for (const segment of track.segments) {
            if (TrackCollisionHandler.isCarCenterInsideTrackSurface(car, segment.mesh)) {
                return segment;
            }
        }

        return undefined;
    }

    private static checkCarIntersectionWithSegments(car: Car, track: Track): boolean {
        const segment: Segment = TrackCollisionHandler.getCurrentSegment(car, track);

        if (segment) {
            if ( !TrackCollisionHandler.allCarCornersInsideTrackSurface(car, segment.mesh)) {
                TrackCollisionHandler.pushCar( car,
                                               TrackCollisionHandler.getSegmentPushNormal(car, segment),
                                               TrackCollisionHandler.getCornerOutsideTrack(car, segment.mesh));

                return true;
            }
        }

        return false;
    }

    private static getCurrentCylinder(car: Car, track: Track): Mesh {
        for (const cylinder of track.cylinders) {
            if (TrackCollisionHandler.isCarCenterInsideTrackSurface(car, cylinder)) {
                return cylinder;
            }
        }

        return undefined;
    }

    private static checkCarIntersectionWithCylinders(car: Car, track: Track): boolean {
        const cylinder: Mesh = TrackCollisionHandler.getCurrentCylinder(car, track);

        if (cylinder) {
            if (!TrackCollisionHandler.allCarCornersInsideTrackSurface(car, cylinder)) {
                TrackCollisionHandler.pushCar( car,
                                               TrackCollisionHandler.getCylinderPushNormal(car, cylinder),
                                               TrackCollisionHandler.getCornerOutsideTrack(car, cylinder));

                return true;
            }
        }

        return false;
    }
}
