import { Player } from "./player";
import { VirtualCar } from "../car/ai/virtualCar";
import { VirtualCarController } from "../car/ai/virtualCarController";
import { RANDOM_FIRSTNAMES, RANDOM_LASTNAMES } from "./constants";
import { ArrayUtils } from "../utils/array-utils";
import { AiPath } from "../car/ai/aiPath";

export class VirtualPlayer extends Player {

    private _carController: VirtualCarController;
    private _aiPath: AiPath;

    private static get generatedRandomName(): string {
        return ArrayUtils.randomElement(RANDOM_FIRSTNAMES) + " " + ArrayUtils.randomElement(RANDOM_LASTNAMES);
    }

    public constructor(car: VirtualCar, numberOfWaypoints: number) {
        super(car, numberOfWaypoints);
        this._name = VirtualPlayer.generatedRandomName;
    }

    public initializeAI(aiPath: AiPath): void {
        this._aiPath = aiPath;
        this.initializeController(this._car as VirtualCar);
    }

    private initializeController(car: VirtualCar): void {
        this._carController = new VirtualCarController(car);
        this._carController.setFirstFollowedWaypoint(this._aiPath.firstWaypointToFollow);
    }

    public moveCar(): void {
        this._carController.moveCar();
    }

}
