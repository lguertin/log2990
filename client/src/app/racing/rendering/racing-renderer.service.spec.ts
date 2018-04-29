import { TestBed, inject } from "@angular/core/testing";

import { RacingRendererService } from "./racing-renderer.service";
import { SoundService } from "../sounds/sound.service";
import { GameCommandService } from "../game-commands/gameCommand.service";
import { CarFactoryService } from "../car/car-factory.service";
import { GameManagerService } from "../game-manager/game-manager.service";

describe("RacingRendererService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RacingRendererService,
                        SoundService,
                        GameCommandService,
                        CarFactoryService,
                        GameManagerService]
        });
    });

    it("should be created", inject([RacingRendererService], (service: RacingRendererService) => {
        expect(service).toBeTruthy();
    }));
});
