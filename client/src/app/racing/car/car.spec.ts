import { Car } from "./car";
import { DEFAULT_WHEELBASE, DEFAULT_MASS, DEFAULT_DRAG_COEFFICIENT } from "./car-init";
import { Engine } from "./engine";
import { Wheel } from "./wheel";
import { Vector3 } from "three";
import { CarComponents } from "./physics/constants";
import { CarLights } from "./lights/lights";
import { CarFactoryService } from "./car-factory.service";

const MS_BETWEEN_FRAMES: number = 16.6667;
const CAR_LOAD_TIMEOUT: number = 15000;

/* tslint:disable: no-magic-numbers */
class MockEngine extends Engine {
    public getDriveTorque(): number {
        return 10000;
    }
}

describe("Car", () => {
    let car: Car;
    const carFactoryService: CarFactoryService = new CarFactoryService();

    beforeEach(async (done: () => void) => {
        carFactoryService.initializeCars(1);
        carFactoryService.loadCarMeshes().then(() => {
            car = carFactoryService.cars[0];
            car.isAcceleratorPressed = true;
            car.update(MS_BETWEEN_FRAMES);
            car.isAcceleratorPressed = false;
            done();
        }).then(() => {}).catch(() => {});
    },         CAR_LOAD_TIMEOUT);

    it("should be instantiable using default constructor", () => {
        const components: CarComponents = {
            engine: new MockEngine(),
            rearWheel: new Wheel,
            lights: new CarLights
        };
        car = new Car(components);
        expect(car).toBeDefined();
        expect(car.speed.length()).toBe(0);
    });

    it("should accelerate when accelerator is pressed", () => {
        const initialSpeed: number = car.speed.length();
        car.isAcceleratorPressed = true;
        car.update(MS_BETWEEN_FRAMES);
        expect(car.speed.length()).toBeGreaterThan(initialSpeed);
    });

    it("should accelerate less when accelerator and steering is pressed", () => {
        car.isAcceleratorPressed = true;
        car.update(MS_BETWEEN_FRAMES);
        const accelerationBefore: number = car["_physics"].acceleration.length();
        car.steerLeft();
        car.update(MS_BETWEEN_FRAMES);
        const accelerationAfter: number = car["_physics"].acceleration.length();
        expect(accelerationAfter).toBeLessThan(accelerationBefore);
        car.releaseLeftSteering();
        car.isAcceleratorPressed = false;
    });

    it("should decelerate without brakes", () => {
        car.isAcceleratorPressed = false;
        car.update(MS_BETWEEN_FRAMES);
        const initialSpeed: number = car.speed.length();
        car.releaseBrakes();
        car.update(MS_BETWEEN_FRAMES);

        expect(car.speed.length()).toBeLessThan(initialSpeed);
    });

    it("should turn left when left turn key is pressed", () => {
        const initialAngle: number = car.angle;
        car.isAcceleratorPressed = true;
        car.steerLeft();
        car.update(MS_BETWEEN_FRAMES * 2);
        car.releaseLeftSteering();
        expect(car.angle).toBeGreaterThan(initialAngle);
    });

    it("should turn right when right turn key is pressed", () => {
        const initialAngle: number = car.angle;
        car.isAcceleratorPressed = true;
        car.steerRight();
        car.update(MS_BETWEEN_FRAMES * 2);
        car.releaseRightSteering();
        expect(car.angle).toBeLessThan(initialAngle);
    });

    it("should decelerate when brake is pressed", () => {
        // Remove rolling resistance and drag force so the only force slowing down the car is the brakes.
        car["_physics"]["getRollingResistance"] = () => {
            return new Vector3(0, 0, 0);
        };

        car["_physics"]["getDragForce"] = () => {
            return new Vector3(0, 0, 0);
        };

        car.isAcceleratorPressed = true;
        car.update(MS_BETWEEN_FRAMES * 4);
        car.isAcceleratorPressed = false;

        const initialSpeed: number = car.speed.length();
        car.brake();
        car.update(MS_BETWEEN_FRAMES);
        expect(car.speed.length()).toBeLessThan(initialSpeed);
    });

    it("should not turn when steering keys are released", () => {
        car.isAcceleratorPressed = true;
        car.steerRight();
        car.update(MS_BETWEEN_FRAMES);
        car.releaseRightSteering();
        car.releaseLeftSteering();

        const initialAngle: number = car.angle;
        car.update(MS_BETWEEN_FRAMES);
        expect(car.angle).toBe(initialAngle);
    });

    it("should use default engine parameter when none is provided", () => {
        car = new Car(undefined);
        expect(car["_components"].engine).toBeDefined();
    });

    it("should use default Wheel parameter when none is provided", () => {
        const components: CarComponents = {
            engine: new MockEngine(),
            rearWheel: new Wheel(),
            lights: new CarLights()
        };
        car = new Car(components, undefined);
        expect(components.rearWheel).toBeDefined();
    });

    it("should check validity of wheelbase parameter", () => {
        expect(car["_physicProperties"].wheelbase).toBe(DEFAULT_WHEELBASE);
    });

    it("should check validity of mass parameter", () => {
        expect(car["_physicProperties"].mass).toBe(DEFAULT_MASS);
    });

    it("should check validity of dragCoefficient parameter", () => {
        expect(car["_physicProperties"].dragCoefficient).toBe(DEFAULT_DRAG_COEFFICIENT);
    });
});
