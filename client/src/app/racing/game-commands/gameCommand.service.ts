import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { AccelerateKey } from "./car-control-commands/accelerateCommand";
import { BrakeKey } from "./car-control-commands/brakeCommand";
import { LeftKey, RightKey } from "./car-control-commands/steeringCommands";
import { ZoomInKey, ZoomOutKey } from "./camera-control-commands/zoomCommands";
import { ChangeCameraKey } from "./camera-control-commands/changeCameraCommand";
import { ChangeSkyboxKey } from "./skybox-control-commands/changeSkyboxCommand";
import { CameraManager } from "../rendering/camera/cameraManager";
import { Command, EMPTY_COMMAND } from "./command";
import { Skybox } from "../environement/skybox";

const ACCELERATE_KEYCODE: number = 87;      // w
const LEFT_KEYCODE: number = 65;            // a
const BRAKE_KEYCODE: number = 83;           // s
const RIGHT_KEYCODE: number = 68;           // d
const CHANGE_SKYBOX_KEYCODE: number = 78;   // n
const CHANGE_CAMERA_KEYCODE: number = 67;   // c
const ZOOM_IN_KEYCODE: number = 73;         // i
const ZOOM_OUT_KEYCODE: number = 79;        // o

@Injectable()
export class GameCommandService {
    private commandsMap: Map<number, Command>;

    public constructor() {
        this.commandsMap = new Map();
    }

    public init(cars: Car[], playerCar: Car, cameraManager: CameraManager, skybox: Skybox): void {
        this.initializePlayerCarCommands(playerCar);
        this.initializeCameraManagerCommands(cameraManager);
        this.initializeSkyboxCommand(cars, skybox);
    }

    private initializePlayerCarCommands(playerCar: Car): void {
        this.commandsMap.set(ACCELERATE_KEYCODE, new AccelerateKey(playerCar));
        this.commandsMap.set(BRAKE_KEYCODE, new BrakeKey(playerCar));
        this.commandsMap.set(LEFT_KEYCODE, new LeftKey(playerCar));
        this.commandsMap.set(RIGHT_KEYCODE, new RightKey(playerCar));
    }

    private initializeCameraManagerCommands(cameraManager: CameraManager): void {
        this.commandsMap.set(ZOOM_IN_KEYCODE, new ZoomInKey(cameraManager));
        this.commandsMap.set(ZOOM_OUT_KEYCODE, new ZoomOutKey(cameraManager));
        this.commandsMap.set(CHANGE_CAMERA_KEYCODE, new ChangeCameraKey(cameraManager));
    }

    private initializeSkyboxCommand(cars: Car[], skybox: Skybox): void {
        this.commandsMap.set(CHANGE_SKYBOX_KEYCODE, new ChangeSkyboxKey(cars, skybox));
    }

    private checkIfDefined(command: Command): Command {
        return command ? command : EMPTY_COMMAND;
    }

    private getCommand(event: KeyboardEvent): Command {
        return this.checkIfDefined(this.commandsMap.get(event.keyCode));
    }

    public executeDown(event: KeyboardEvent): void {
        this.getCommand(event).executeDown();
    }

    public executeUp(event: KeyboardEvent): void {
        this.getCommand(event).executeUp();
    }
}
