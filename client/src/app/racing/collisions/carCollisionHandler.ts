import { Vector3, Quaternion } from "three";
import { Car } from "../car/car";
import { VectorUtils } from "../utils/vector-utils";
import { VERTICAL_AXIS } from "../constants";
import { CAR_CORNERS, MAX_CAR_COLLISION_SPEED } from "./constants";
import { VerticalRaycast } from "../utils/vertical-raycast";
import { VirtualCar } from "../car/ai/virtualCar";

export class CarCollisionHandler {

    public static checkCarsIntersections(cars: Car[]): boolean {
        let humanPlayerCollided: boolean = false;

        for (const collider of cars) {
            for (const collided of cars) {
                if (collider !== collided) {
                    if (CarCollisionHandler.verifyCollision(collider, collided)) {
                        if (CarCollisionHandler.isHumanPlayer(collider, collided)) {
                            humanPlayerCollided = true;
                        }
                    }
                }
            }
        }

        return humanPlayerCollided;
    }

    private static isHumanPlayer(collider: Car, collided: Car): boolean {
        return !(collider instanceof VirtualCar) || !(collided instanceof VirtualCar);
    }

    private static verifyCollision(collider: Car, collided: Car): boolean {
        if (CarCollisionHandler.areIntersecting(collider, collided)) {
            CarCollisionHandler.manageCollision(collider, collided);

            return true;
        }

        return false;
    }

    private static getCollisionSpeedDifference(collider: Car, collided: Car): Vector3 {
        return collider.speed.clone().sub(collided.speed.clone().projectOnVector(collider.speed));
    }

    public static getCollisionVolume(cars: Car[]): number {
        for (const collider of cars) {
            for (const collided of cars) {
                if (collider !== collided) {
                    if (CarCollisionHandler.verifyCollision(collider, collided)) {
                        return CarCollisionHandler.getCollisionSpeedDifference(collider, collided).length() / MAX_CAR_COLLISION_SPEED;
                    }
                }
            }
        }

        return 0;
    }

    private static areIntersecting(collider: Car, collided: Car): boolean {
        return CarCollisionHandler.getCarsCollisionPosition(collider, collided) !== undefined;
    }

    private static manageCollision(collider: Car, collided: Car): void {
        CarCollisionHandler.modifyAngularSpeed(collider, collided);
        CarCollisionHandler.modifyVelocity(collider, collided);
        CarCollisionHandler.separateCars(collider, collided);
    }

    private static separateCars(collider: Car, collided: Car): void {
        const push: Vector3 = CarCollisionHandler.getPush(collider, collided).divideScalar(2);
        collider.mesh.position.add(push);
        collided.mesh.position.sub(push);
    }

    private static modifyVelocity(collider: Car, collided: Car): void {
        const push: Vector3 = CarCollisionHandler.getPush(collider, collided).multiplyScalar(2);
        const rotationQuaternion1: Quaternion = collider.meshRotationQuaternion;
        const rotationQuaternion2: Quaternion = collided.meshRotationQuaternion;

        collider.speed.applyQuaternion(rotationQuaternion1);
        collided.speed.applyQuaternion(rotationQuaternion2);

        collider.speed = collider.speed.add(push);
        collided.speed = collided.speed.sub(push);

        collider.speed.applyQuaternion(rotationQuaternion1.inverse());
        collided.speed.applyQuaternion(rotationQuaternion2.inverse());
    }

    private static modifyAngularSpeed(collider: Car, collided: Car): void {
        const collisionPosition: Vector3 = CarCollisionHandler.getCarsCollisionPosition(collider, collided);
        const push: Vector3 = CarCollisionHandler.getPush(collider, collided);

        collider.modifyAngularSpeedFromCollision(push, collisionPosition);
        push.negate();
        collided.modifyAngularSpeedFromCollision(push, collisionPosition);
    }

    private static getCollisionWithOtherCar(colliderCorner: Vector3, collided: Car): Vector3 {
        return VerticalRaycast.isIntersecting(colliderCorner, collided.boxMesh) ? colliderCorner : undefined;
    }

    private static getCarCorners(car: Car): Vector3[] {
        const corners: Vector3[] = [];

        for (const corner of CAR_CORNERS) {
            corners.push(car.getCorner(corner[0], corner[1]));
        }

        return corners;
    }

    private static getCarsCollisionPosition(collider: Car, collided: Car): Vector3 {
        for (const corner of CarCollisionHandler.getCarCorners(collider)) {
            if (CarCollisionHandler.getCollisionWithOtherCar(corner, collided)) {
                return CarCollisionHandler.getCollisionWithOtherCar(corner, collided);
            }
        }

        return undefined;
    }

    private static getPush(collider: Car, collided: Car): Vector3 {
        const corners: Vector3[] = VectorUtils.sortToClosest(CarCollisionHandler.getCarCorners(collided), collider.getPosition());
        const direction: Vector3 = corners[0].clone().sub(corners[1]).cross(VERTICAL_AXIS);

        return corners[0].clone().sub(CarCollisionHandler.getCarsCollisionPosition(collider, collided)).projectOnVector(direction);
    }
}
