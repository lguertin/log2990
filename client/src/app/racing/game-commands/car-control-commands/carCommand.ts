import { Car } from "../../car/car";
import { Command } from "../command";

export interface KeyEvent {
    eventKey: KeyboardEvent["keyCode"];
    eventCommand: CarCommand;
}

export abstract class CarCommand extends Command {
    protected car: Car;

    public constructor(car: Car) {
        super();
        this.car = car;
    }
}
