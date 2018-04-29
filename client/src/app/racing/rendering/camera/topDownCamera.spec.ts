import { TopDownCamera, TOP_DOWN_CAMERA_HEIGHT } from "./topDownCamera";
import { Car } from "../../car/car";
import { Vector3, Euler, OrthographicCamera } from "three";
import {CarFactoryService} from "../../car/car-factory.service";
const MS_BETWEEN_FRAMES: number = 16.6667;
const MOCK_HEIGHT: number = 400;
const MOCK_WIDTH: number = 300;
const CAR_LOAD_TIMEOUT: number = 5000;

describe("Top Down Camera", () => {
    let carFactory: CarFactoryService;
    let car: Car;
    let topDownCamera: TopDownCamera;

    beforeEach(async (done: () => void) => {
        topDownCamera = new TopDownCamera("MockCamera", MOCK_HEIGHT, MOCK_WIDTH);
        carFactory = new CarFactoryService();
        carFactory.initializeCars(1);
        await carFactory.loadCarMeshes();
        car = carFactory.cars[0];

        car.isAcceleratorPressed = true;
        car.update(MS_BETWEEN_FRAMES);
        car.isAcceleratorPressed = false;

        done();
    },         CAR_LOAD_TIMEOUT);

    it("should be on top of the car at initialization", () => {

        topDownCamera.update(MS_BETWEEN_FRAMES, car);
        const currentRelativePosition: Vector3 = topDownCamera.position.sub(car.getPosition());
        const expectedRelativePosition: Vector3 = new Vector3(0, TOP_DOWN_CAMERA_HEIGHT, 0);

        expect(currentRelativePosition).toEqual(expectedRelativePosition);
    });

    it("should follow the car when it's moving", () => {

        const expectedRelativePosition: Vector3 = new Vector3(0, TOP_DOWN_CAMERA_HEIGHT, 0);

        car.isAcceleratorPressed = true;
        car.update(MS_BETWEEN_FRAMES);
        topDownCamera.update(MS_BETWEEN_FRAMES, car);

        const currentRelativePosition: Vector3 = topDownCamera.position.sub(car.getPosition());

        expect(currentRelativePosition).toEqual(expectedRelativePosition);

    });

    it("should not rotate even when car is moving/turning", () => {

        const expectedRotation: Euler = topDownCamera.rotation;

        car.isAcceleratorPressed = true;
        car.steerLeft();
        car.update(MS_BETWEEN_FRAMES);
        topDownCamera.update(MS_BETWEEN_FRAMES, car);

        const currentRotation: Euler = topDownCamera.rotation;
        const currentCarRotation: Euler = car.rotation;

        expect(currentRotation).toEqual(expectedRotation);
        expect(currentRotation).not.toBe(currentCarRotation);
    });

    it("should be an Orthographic Camera", () => {
        const iSOrthographic: boolean = topDownCamera instanceof OrthographicCamera;
        expect(iSOrthographic).toBeTruthy();
    });

    it("should have greater zoom factor after zoom in button is pressed for a certain time", () => {
        const factorBeforeZoom: number = topDownCamera.zoom;
        topDownCamera.isZoomingIn = true;
        topDownCamera.update(MS_BETWEEN_FRAMES, car);
        topDownCamera.isZoomingIn = false;
        const factorAfterZoom: number = topDownCamera.zoom;
        expect(factorAfterZoom).toBeGreaterThan(factorBeforeZoom);
    });

    it("should have smaller zoom factor after zoom out button is pressed for a certain time", () => {
        const factorBeforeZoom: number = topDownCamera.zoom;
        topDownCamera.isZoomingOut = true;
        topDownCamera.update(MS_BETWEEN_FRAMES, car);
        topDownCamera.isZoomingOut = false;
        const factorAfterZoom: number = topDownCamera.zoom;
        expect(factorAfterZoom).toBeLessThan(factorBeforeZoom);
    });
});
