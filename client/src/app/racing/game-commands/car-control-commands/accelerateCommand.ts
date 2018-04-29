import { CarCommand } from "./carCommand";
import { Car } from "../../car/car";

export class AccelerateKey extends CarCommand {
    public constructor(protected car: Car) {
        super(car);
    }

    public executeDown(): void {
        this.car.isAcceleratorPressed = true;
    }

    public executeUp(): void {
        this.car.isAcceleratorPressed = false;
    }
}
