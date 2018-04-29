import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { DifficultySelectorComponent } from "./game-config/difficulty-selector/difficulty-selector.component";
import { GameInfoComponent } from "./game-info/game-info.component";
import { CrosswordComponent } from "./crossword.component";
import { HintsComponent } from "./hints/hints.component";
import { FormsModule } from "@angular/forms";
import { GridService } from "./services/grid.service";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { WordSelectionService } from "./services/word-selection.service";
import { GameModeSelectorComponent } from "./game-config/gamemode-selector/gamemode-selector.component";
import { SocketsService } from "./services/sockets.service";
import { MultiplayerGridComponent } from "./grid/grid-multiplayer/gridMultiplayer.component";
import { WaitingRoomComponent } from "./game-config/waiting-room/waiting-room.component";
import { SoloGridComponent } from "./grid/grid-solo/gridSolo.component";
import { MultiplayerRoomsComponent } from "./game-config/multiplayer-rooms/multiplayer-rooms.component";
import { EndGameComponent } from "./game-config/end-game/end-game.component";
import { RouterTestingModule } from "@angular/router/testing";
import { RouterModule } from "@angular/router";

describe("CrosswordComponent", () => {
    let component: CrosswordComponent;
    let fixture: ComponentFixture<CrosswordComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule,
                      RouterTestingModule,
                      RouterModule],
            declarations: [CrosswordComponent,
                           DifficultySelectorComponent,
                           GameInfoComponent,
                           SoloGridComponent,
                           MultiplayerGridComponent,
                           HintsComponent,
                           GameModeSelectorComponent,
                           MultiplayerRoomsComponent,
                           WaitingRoomComponent,
                           EndGameComponent],
            providers: [GridService,
                        HttpClient,
                        HttpHandler,
                        WordSelectionService,
                        SocketsService]
        })
            .compileComponents()
            .catch(() => {
                throw new Error("Crossword Component could not be created");
            });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CrosswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
    /*describe("Testing if the replay possibilities", () => {
        it("should create new grid", () => {
            component["gridInformation"].mode = GameMode.Solo;
            component.words = undefined;
            component["gridInformation"].difficulty = GameDifficulty.Easy;
            component.onEndSelection(EndGameOptions.Replay);
            expect(component.selfReplay).toBe(true);

        });

        it("should return to menu", () => {
            component["gridInformation"].mode = GameMode.Solo;
            component.onEndSelection(EndGameOptions.Menu);
            expect(component).toBeUndefined();
        });
    });*/
});
