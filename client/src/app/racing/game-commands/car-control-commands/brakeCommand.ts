import { CarCommand } from "./carCommand";
import { Car } from "../../car/car";

export class BrakeKey extends CarCommand {
    public constructor(protected car: Car) {
        super(car);
    }

    public executeDown(): void {
        this.car.brake();
    }

    public executeUp(): void {
        this.car.releaseBrakes();
    }
}
