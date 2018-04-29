import { TestBed, inject } from "@angular/core/testing";
import { CarFactoryService } from "./car-factory.service";
import { NUMBER_OF_CARS } from "./constants";
import { VirtualCar } from "./ai/virtualCar";

describe("CarFactoryService", () => {
    beforeEach(() => {
        spyOn(Math, "random").and.returnValue(1 / 2);
        TestBed.configureTestingModule({
            providers: [CarFactoryService]
        });
    });

    describe("Testing if the car Factory logic is working properly", () => {

        it("should be created", inject([CarFactoryService], (service: CarFactoryService) => {
            service.initializeCars(NUMBER_OF_CARS);
            expect(service).toBeTruthy();
        }));

        it("should have the same number of cars as specified by the constant", inject([CarFactoryService], (service: CarFactoryService) => {
            service.initializeCars(NUMBER_OF_CARS);
            expect(service.cars.length).toEqual(NUMBER_OF_CARS);
        }));

        it("should have car meshes defined when initialization is called",
           inject([CarFactoryService], async (service: CarFactoryService) => {
            service.initializeCars(NUMBER_OF_CARS);
            for (const car of service.cars) {
                expect(car.mesh).toBeUndefined();
            }

            await service.loadCarMeshes();

            for (const car of service.cars) {
                expect(car.mesh).toBeDefined();
            }
        }));

        it("should be able to return the player car", inject([CarFactoryService], (service: CarFactoryService) => {
            service.initializeCars(NUMBER_OF_CARS);
            expect(service.playerCar instanceof VirtualCar).toBeFalsy();
        }));

        it("should have only one player car", inject([CarFactoryService], (service: CarFactoryService) => {
            service.initializeCars(NUMBER_OF_CARS);
            let numberOfPlayerCars: number = 0;

            for (const car of service.cars) {
                if (!(car instanceof (VirtualCar))) {
                    numberOfPlayerCars++;
                }
            }

            expect(numberOfPlayerCars).toBe(1);
        }));

        it("should have the player car contained in the array of cars", inject([CarFactoryService], (service: CarFactoryService) => {
            service.initializeCars(NUMBER_OF_CARS);
            for (const car of service.cars) {
                if (!(car instanceof (VirtualCar))) {
                    expect(car).toBe(service.playerCar);
                }
            }
        }));

    });

    describe("Testing if the player car is placed randomly", () => {
        it("player car spot should be at a random place",  inject([CarFactoryService], (service: CarFactoryService)  => {
            service.initializeCars(NUMBER_OF_CARS);
            const PLAYER_CAR_SPOT_ONE: number = ( NUMBER_OF_CARS / 2 );
            expect(Math.random).toHaveBeenCalled();
            expect(service["_playerCarSpot"]).toBe(PLAYER_CAR_SPOT_ONE);
        }));
    });
});
