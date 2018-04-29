import { Injectable } from "@angular/core";
import { Renderer } from "./abstract-renderer";
import { Car } from "../car/car";
import { ThirdPersonCamera } from "./camera/thirdPersonCamera";
import { TopDownCamera } from "./camera/topDownCamera";
import { GameManagerService } from "../game-manager/game-manager.service";
import { GameCommandService } from "../game-commands/gameCommand.service";
import { Vector3 } from "three";
import { CarPositionner } from "../car/carPositionner";
import { Player } from "../player/player";
import { GameState } from "../game-manager/constants";

export const THIRD_PERSON_CAMERA_NAME: string = "ThirdPerson";
export const TOP_DOWN_CAMERA_NAME: string = "TopDown";

@Injectable()
export class RacingRendererService extends Renderer {

    private _playerCar: Car;
    private _updateEnable: boolean;
    public constructor(private gameCommandService: GameCommandService,
                       private gameManager: GameManagerService) {
        super();
        this._playerCar = this.gameManager.playerCar;
        this._updateEnable = false;

    }

    public set updateEnable(value: boolean) {
        this._updateEnable = value;
    }

    public get car(): Car {
        return this._playerCar;
    }

    public async initialize(container: HTMLDivElement): Promise<void> {
        await this.gameManager.initializeCarFactory();
        this._playerCar = this.gameManager.playerCar;
        super.initialize(container)
            .then()
            .catch(() => {
                console.error("Game-Renderer : Can't initialize the container");
            });

        this.cameraManager.addCamera(new ThirdPersonCamera(THIRD_PERSON_CAMERA_NAME, this.containerWidth, this.containerHeight));
        this.cameraManager.addCamera(new TopDownCamera(TOP_DOWN_CAMERA_NAME, this.containerWidth, this.containerHeight));
        this.gameCommandService.init(this.gameManager.cars, this.gameManager.playerCar, this.cameraManager, this.skybox);
    }

    public initializeTrack(points: Vector3[]): void {
        this.importTrack(points);
        this.initializeTrackElements();
    }

    private initializeTrackElements(): void {
        this.gameManager.initializeGameComponents(this._track);
        CarPositionner.initializeCarsPosition(this.gameManager.cars, this._track);
    }

    public async createScene(): Promise<void> {
        await super.createScene();
        this.scene.add(this.skybox);
        this.addCarsToScene();
    }

    private addCarsToScene(): void {
        for (const car of this.gameManager.cars) {
            this.scene.add(car);
        }
    }

    public update(): void {
        const timeSinceLastFrame: number = Date.now() - this.lastDate;
        this.lastDate = Date.now();
        this.skybox.updatePosition(this._playerCar);
        if (this._updateEnable) {
            this.gameManager.update(timeSinceLastFrame);
            this.gameManager.updateCollisions();
        }
        this.cameraManager.updateCamera(timeSinceLastFrame, this._playerCar);
    }

    public keyUp(event: KeyboardEvent): void {
        if (this.gameManager.gameState === GameState.Racing) {
            this.gameCommandService.executeUp(event);
        }
    }

    public keyDown(event: KeyboardEvent): void {
        if (this.gameManager.gameState === GameState.Racing) {
            this.gameCommandService.executeDown(event);
        }
    }

    public get players(): Player[] {
        return this.gameManager.players;
    }

    public get isFinished(): boolean {
        return this.gameManager.gameState === GameState.Finish;
    }
}
