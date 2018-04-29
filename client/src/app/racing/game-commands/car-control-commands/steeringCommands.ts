import { CarCommand } from "./carCommand";
import { Car } from "../../car/car";

export class LeftKey extends CarCommand {
    public constructor(protected car: Car) {
        super(car);
    }

    public executeDown(): void {
        this.car.steerLeft();
    }

    public executeUp(): void {
        this.car.releaseLeftSteering();
    }
}

export class RightKey extends CarCommand {
    public constructor(protected car: Car) {
        super(car);
    }

    public executeDown(): void {
        this.car.steerRight();
    }

    public executeUp(): void {
        this.car.releaseRightSteering();
    }
}
