import { CarCollisionHandler } from "./carCollisionHandler";
import { Car } from "../car/car";
import { Vector3 } from "three";
import { CarFactoryService } from "../car/car-factory.service";
import { VectorUtils } from "../utils/vector-utils";
import { VerticalRaycast } from "../utils/vertical-raycast";

/*tslint:disable:no-magic-numbers*/
describe("CarCollisionHandler", () => {
    let car1: Car;
    let car2: Car;
    const CAR_LOAD_TIMEOUT: number = 15000;
    const carFactoryService: CarFactoryService = new CarFactoryService();

    beforeEach(async (done: () => void) => {
        carFactoryService.initializeCars(2);
        carFactoryService.loadCarMeshes().then(() => {
            car1 = carFactoryService.cars[0];
            car2 = carFactoryService.cars[1];
            done();
        }).then(() => {}).catch(() => {});
    },         CAR_LOAD_TIMEOUT);

    describe("when testing corners calculations", () => {
        let corners1: Vector3[];
        let corners2: Vector3[];

        beforeEach( () => {
            corners1 = CarCollisionHandler["getCarCorners"](car1);
            corners2 = CarCollisionHandler["getCarCorners"](car2);
        });

        it("should detect 4 car corners for each car", () => {
            expect(corners1.length).toEqual(4);
            expect(corners2.length).toEqual(4);
        });

        it("should create corners that are perpendicular to each other", () => {
            for (const corners of [corners1, corners2]) {
                const a: Vector3 = corners[1].clone().sub(corners[0]);
                const b: Vector3 = corners[2].clone().sub(corners[1]);
                const c: Vector3 = corners[3].clone().sub(corners[2]);
                const d: Vector3 = corners[0].clone().sub(corners[3]);

                expect(a.dot(b)).toBeCloseTo(0);
                expect(b.dot(c)).toBeCloseTo(0);
                expect(c.dot(d)).toBeCloseTo(0);
                expect(d.dot(c)).toBeCloseTo(0);
            }
        });

        describe("when testing vertical raycaster", () => {
            it("should make car corners be able to detect car box meshes", () => {
                for (const corner of corners1) {
                    corner.multiplyScalar(0.98);
                    expect(VerticalRaycast.isIntersecting(corner, car1.boxMesh)).toBeTruthy();
                }
            });

            it("should make car corners not be able to detect car box meshes when they are intentionnaly further", () => {
                for (const corner of corners1) {
                    corner.multiplyScalar(1.02);
                    expect(VerticalRaycast.isIntersecting(corner, car1.boxMesh)).toBeFalsy();
                }
            });
        });
    });

    describe("when checking if they are intersecting", () => {
        it("should detect a collision when 2 cars are near each other", () => {
            VectorUtils.copyVector(new Vector3(0, 0, 0), car1.position);
            VectorUtils.copyVector(new Vector3(0.2, 0, 0.2), car2.position);
            car1.update(1);
            car2.update(1);
            expect(CarCollisionHandler["areIntersecting"](car1, car2)).toBeTruthy();
        });

        it("should not detect a collising when cars are far away from one another", () => {
            VectorUtils.copyVector(new Vector3(0, 0, 0), car1.position);
            VectorUtils.copyVector(new Vector3(3, 0, 3), car2.position);
            car1.update(1);
            car2.update(1);
            expect(CarCollisionHandler["areIntersecting"](car1, car2)).toBeFalsy();
        });
    });
});
