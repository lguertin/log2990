import { Injectable } from "@angular/core";
import { Car } from "./car";
import { VirtualCar } from "../car/ai/virtualCar";
import { CAMERO_PATH, AVENTADOR_PATH } from "./constants";
import { TextureImportUtils } from "../utils/texture-import-utils";

@Injectable()
export class CarFactoryService {

    private _cars: Car[];
    private _playerCarSpot: number ;

    private static getRequiredCarMesh(car: Car): string {
        return car instanceof VirtualCar ? CAMERO_PATH : AVENTADOR_PATH;
    }

    public constructor() {
        this._cars = [];
    }

    public initializeCars(nCars: number): void {
        this._playerCarSpot = Math.floor(Math.random() * nCars);

        for (let i: number = 0; i < nCars; i++) {
            if (i === this._playerCarSpot) {
                this._cars.push(new Car());
            } else {
                this._cars.push(new VirtualCar());
            }
        }
    }

    public async loadCarMeshes(): Promise<void> {
        for (const car of this._cars) {
            car.mesh = await TextureImportUtils.loadObject3D(CarFactoryService.getRequiredCarMesh(car));
            car.add(car.mesh);
        }
    }

    public get playerCar(): Car {
        return this.cars[this._playerCarSpot];
    }

    public get cars(): Car[] {
        return this._cars;
    }
}
