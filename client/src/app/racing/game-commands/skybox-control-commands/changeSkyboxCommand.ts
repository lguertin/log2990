import { Command } from "../command";
import { Skybox } from "../../environement/skybox";
import { Car } from "../../car/car";

export class ChangeSkyboxKey extends Command {
    private cars: Car[];
    private skybox: Skybox;

    public constructor(cars: Car[], skybox: Skybox) {
        super();
        this.cars = cars;
        this.skybox = skybox;
    }

    public executeDown(): void {
        this.skybox.switchSkyBoxMode();
        for (const car of this.cars) {
            car.switchNightLights();
        }
    }

    public executeUp(): void {
    }
}
