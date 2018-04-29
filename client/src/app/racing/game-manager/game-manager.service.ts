import { Injectable } from "@angular/core";
import { CarFactoryService } from "../car/car-factory.service";
import { TrackWaypointManager } from "../track/waypoint/trackWaypointManager";
import { Player } from "../player/player";
import { Track } from "../track/track";
import { Car } from "../car/car";
import { NUMBER_OF_CARS } from "../car/constants";
import { CarCollisionHandler } from "../collisions/carCollisionHandler";
import { TrackCollisionHandler } from "../collisions/trackCollisionHandler";
import { SoundService } from "../sounds/sound.service";
import { SoundEvents, RPM_SOUND_DIVIDER, RPM_SOUND_ADDER } from "../sounds/constants";
import { MAX_LAPS, GameState } from "./constants";
import { VirtualPlayer } from "../player/virtualPlayer";
import { VirtualCar } from "../car/ai/virtualCar";
import { AiPath } from "../car/ai/aiPath";

export const STATE_ERROR_MESSAGE: string = "State is not properly handled";

@Injectable()
export class GameManagerService {
    private _gameState: GameState;
    private _trackWaypointManager: TrackWaypointManager;
    private _track: Track;
    private _players: Player[];

    public constructor( private carFactoryService: CarFactoryService,
                        private soundService: SoundService) {
        this._gameState = GameState.Begin;
        this._players = [];
    }

    public async initializeCarFactory(): Promise<void> {
        this.carFactoryService.initializeCars(NUMBER_OF_CARS);
        await this.carFactoryService.loadCarMeshes();
    }

    public initializeGameComponents(track: Track): void {
        this._track = track;
        this.initializeTrackWaypointManager();
        this.createPlayers();
    }

    public update(timeSinceLastFrame: number): void {
        switch (this._gameState) {
            case GameState.Begin:
                this.beginUpdate();
                break;
            case GameState.Racing:
                this.racingUpdate(timeSinceLastFrame);
                break;
            case GameState.Finish:
                this.soundService.stopAllSound();
                break;
            default:
                console.error(STATE_ERROR_MESSAGE);
                break;
        }
    }

    public get cars(): Car[] {
        return this.carFactoryService.cars;
    }

    public get playerCar(): Car {
        return this.carFactoryService.playerCar;
    }

    private initializeTrackWaypointManager(): void {
        this._trackWaypointManager = new TrackWaypointManager(this._track);
    }

    private createHumanPlayer(): Player {
        return new Player(this.playerCar, this._trackWaypointManager.waypointCollection.numberOfWaypoints);
    }

    private createPlayers(): void {
        this._players.push(this.createHumanPlayer());
        this.createAIPlayers();
        this.initiatePlayersWaypoint();
    }

    public get players(): Player[] {
        return this._players;
    }

    public get gameState(): GameState {
        return this._gameState;
    }

    private racingUpdate(timeSinceLastFrame: number): void {
        this.updateCarsController(timeSinceLastFrame);
        this.updateCarsPosition(timeSinceLastFrame);
        this.updatePlayers();
        this.checkIfRaceIsFinished();
        this.soundService.adjustPitchSpeed(SoundEvents.ENGINE, this.playerCar.rpm / RPM_SOUND_DIVIDER + RPM_SOUND_ADDER);
    }

    private beginUpdate(): void {
        this._gameState = GameState.Racing;
        this.initiatePlayersTimer();
        this.soundService.play(SoundEvents.ENGINE);
    }

    private initiatePlayersTimer(): void {
        for (const player of this._players) {
            player.initiateLapTimer();
        }
    }

    private updateCarsController(timeSinceLastFrame: number): void {
        for (const player of this._players) {
            if (player instanceof VirtualPlayer) {
                (player as VirtualPlayer).moveCar();
            }
        }
    }

    private updateCarsPosition(timeSinceLastFrame: number): void {
        for (const car of this.carFactoryService.cars) {
            car.update(timeSinceLastFrame);
        }
    }

    private updatePlayers(): void {
        for (const player of this._players) {
            player.update();
        }
    }

    public updateCollisions(): void {
        if (CarCollisionHandler.checkCarsIntersections(this.carFactoryService.cars)) {
            this.soundService.play(
                SoundEvents.CAR_COLLISION_CAR,
                CarCollisionHandler.getCollisionVolume(this.carFactoryService.cars));
        }

        if (TrackCollisionHandler.checkWallIntersections(this.carFactoryService.cars, this._track)) {
            this.soundService.play(
                SoundEvents.CAR_COLLISION_WALL,
                TrackCollisionHandler.getCollisionVolume(this.carFactoryService.cars, this._track));
        }
    }

    private hasFinishedRace(player: Player): boolean {
        return player.statistics.currentLap > MAX_LAPS;
    }

    private isHumanPlayer(player: Player): boolean {
        return !(player instanceof VirtualPlayer);
    }

    private finishRace(): void {
        this._gameState = GameState.Finish;
        this.simulateRaceEnding();
    }

    private checkIfRaceIsFinished(): void {
        for (const player of this._players) {
            if (this.hasFinishedRace(player) && this.isHumanPlayer(player)) {
                this.finishRace();
            }
        }
    }

    private createAIPlayer(car: Car): VirtualPlayer {
        return new VirtualPlayer(car as VirtualCar, this._trackWaypointManager.waypointCollection.numberOfWaypoints);
    }

    private createAIPlayers(): void {
        const aiPath: AiPath = new AiPath(this._trackWaypointManager.waypointCollection);
        aiPath.tuneTurningPaths();
        for (const car of this.cars) {
            if (car instanceof VirtualCar) {
                const virtualPlayer: VirtualPlayer = this.createAIPlayer(car);
                virtualPlayer.initializeAI(aiPath);
                this._players.push(virtualPlayer);
            }
        }
    }

    private initiatePlayersWaypoint(): void {
        for (const player of this._players) {
            player.waypoint = this._trackWaypointManager.waypointCollection.firstWaypoint.next;
        }
    }

    private simulateRaceEnding(): void {
        for (const player of this._players) {
            player.simulateUnfinishedLapsTime();
        }
    }
}
