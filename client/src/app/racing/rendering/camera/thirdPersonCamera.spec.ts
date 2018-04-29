import { Car } from "../../car/car";
import { CarFactoryService } from "../../car/car-factory.service";
import { ThirdPersonCamera,
         THIRD_PERSON_CAMERA_DISTANCE,
         THIRD_PERSON_CAMERA_HEIGHT } from "./thirdPersonCamera";
import { Vector3 } from "three";

const MS_BETWEEN_FRAMES: number = 16.6667;
const ACCELERATION_PERIOD: number = 5;
const MOCK_HEIGHT: number = 400;
const MOCK_WIDTH: number = 300;
const CAR_LOAD_TIMEOUT: number = 5000;

describe("Third Person Camera", () => {
    let carFactory: CarFactoryService ;
    let car: Car;
    let thirdPersonCamera: ThirdPersonCamera;

    beforeEach(async (done: () => void) => {
        thirdPersonCamera = new ThirdPersonCamera("MockCamera", MOCK_HEIGHT, MOCK_WIDTH);
        carFactory = new CarFactoryService();
        carFactory.initializeCars(1);
        await carFactory.loadCarMeshes();
        car = carFactory.cars[0];

        car.isAcceleratorPressed = true;
        car.update(MS_BETWEEN_FRAMES);
        car.isAcceleratorPressed = false;

        done();
    },         CAR_LOAD_TIMEOUT);

    it("should be behind the car at initialization", () => {

        thirdPersonCamera.update(MS_BETWEEN_FRAMES, car);
        const currentRelativePosition: Vector3 = thirdPersonCamera.position.sub(car.getPosition());
        const expectedRelativePosition: Vector3 = car.getDirection()
                                                    .multiplyScalar(THIRD_PERSON_CAMERA_DISTANCE)
                                                    .add(new Vector3(0, THIRD_PERSON_CAMERA_HEIGHT, 0));

        expect(currentRelativePosition).toEqual(expectedRelativePosition);
    });

    it("should be at the same distance from the car when it is moving", () => {

        const expectedRelativePosition: Vector3 = car.getDirection()
                                                    .multiplyScalar(THIRD_PERSON_CAMERA_DISTANCE)
                                                    .add(new Vector3(0, THIRD_PERSON_CAMERA_HEIGHT, 0));

        const expectedDistance: number = expectedRelativePosition.length();

        car.isAcceleratorPressed = true;
        car.update(MS_BETWEEN_FRAMES);
        thirdPersonCamera.update(MS_BETWEEN_FRAMES, car);

        const currentRelativePosition: Vector3 = thirdPersonCamera.position.sub(car.getPosition());
        const currentDistance: number = currentRelativePosition.length();

        expect(currentDistance).toEqual(expectedDistance);

    });

    it("should be at the same distance from the car when it is moving to the left", () => {

        const expectedRelativePosition: Vector3 = car.getDirection()
                                                    .multiplyScalar(THIRD_PERSON_CAMERA_DISTANCE)
                                                    .add(new Vector3(0, THIRD_PERSON_CAMERA_HEIGHT, 0));

        const expectedDistance: number = expectedRelativePosition.length();

        car.isAcceleratorPressed = true;
        car.steerLeft();
        car.update(MS_BETWEEN_FRAMES);
        thirdPersonCamera.update(MS_BETWEEN_FRAMES, car);

        const currentRelativePosition: Vector3 = thirdPersonCamera.position.sub(car.getPosition());
        const currentDistance: number = currentRelativePosition.length();

        expect(currentDistance).toEqual(expectedDistance);

    });

    it("should be at the same distance from the car when it is moving to the right", () => {

        const expectedRelativePosition: Vector3 = car.getDirection()
                                                    .multiplyScalar(THIRD_PERSON_CAMERA_DISTANCE)
                                                    .add(new Vector3(0, THIRD_PERSON_CAMERA_HEIGHT, 0));

        const expectedDistance: number = expectedRelativePosition.length();

        car.isAcceleratorPressed = true;
        car.steerRight();
        car.update(MS_BETWEEN_FRAMES);
        thirdPersonCamera.update(MS_BETWEEN_FRAMES, car);

        const currentRelativePosition: Vector3 = thirdPersonCamera.position.sub(car.getPosition());
        const currentDistance: number = currentRelativePosition.length();

        expect(currentDistance).toEqual(expectedDistance);

    });

    it("should be at the same distance from the car when it is braking", () => {

        const expectedRelativePosition: Vector3 = car.getDirection()
                                                    .multiplyScalar(THIRD_PERSON_CAMERA_DISTANCE)
                                                    .add(new Vector3(0, THIRD_PERSON_CAMERA_HEIGHT, 0));

        const expectedDistance: number = expectedRelativePosition.length();

        car.isAcceleratorPressed = true;
        car.update(MS_BETWEEN_FRAMES * ACCELERATION_PERIOD);
        car.isAcceleratorPressed = false;
        car.brake();
        car.update(MS_BETWEEN_FRAMES);

        thirdPersonCamera.update(MS_BETWEEN_FRAMES, car);

        const currentRelativePosition: Vector3 = thirdPersonCamera.position.clone().sub(car.getPosition());
        const currentDistance: number = currentRelativePosition.length();

        expect(currentDistance).toEqual(expectedDistance);

    });

    it("should have smaller zoomFactor after zoom in button is pressed for a certain time", () => {
        const zoomFactorBefore: number = thirdPersonCamera["_zoomFactor"];
        thirdPersonCamera.isZoomingIn = true;
        thirdPersonCamera.update(MS_BETWEEN_FRAMES, car);
        thirdPersonCamera.isZoomingIn = false;
        const zoomFactorAfter: number = thirdPersonCamera["_zoomFactor"];
        expect(zoomFactorAfter).toBeLessThan(zoomFactorBefore);
    });

    it("should have greater zoomFactor after zoom out button is pressed for a certain time", () => {
        const zoomFactorBefore: number = thirdPersonCamera["_zoomFactor"];
        thirdPersonCamera.isZoomingOut = true;
        thirdPersonCamera.update(MS_BETWEEN_FRAMES, car);
        thirdPersonCamera.isZoomingOut = false;
        const zoomFactorAfter: number = thirdPersonCamera["_zoomFactor"];
        expect(zoomFactorAfter).toBeGreaterThan(zoomFactorBefore);
    });
});
