import { TestBed, inject } from "@angular/core/testing";

import { GameManagerService } from "./game-manager.service";
import { CarFactoryService } from "../car/car-factory.service";
import { SoundService } from "../sounds/sound.service";
import { GameState, MAX_LAPS } from "./constants";
import { Player } from "../player/player";
import { Car } from "../car/car";

describe("GameManagerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GameManagerService,
                        CarFactoryService,
                        SoundService]
        });
    });

    it("should be created", inject([GameManagerService], (service: GameManagerService) => {
        expect(service).toBeTruthy();
    }));

    it("should change to finish state when main player has finished the third lap", inject([GameManagerService],
                                                                                           (service: GameManagerService) => {
        service.players.push(new Player(new Car(), 0));
        service["finishRace"] = () => {
            service["_gameState"] = GameState.Finish;
        };
        service["_gameState"] = GameState.Racing;
        service.players[0].statistics.currentLap = MAX_LAPS + 1;
        service["checkIfRaceIsFinished"]();
        expect(service.gameState).toBe(GameState.Finish);
    }));
});
