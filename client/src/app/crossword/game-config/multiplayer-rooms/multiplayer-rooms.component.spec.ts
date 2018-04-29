import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MultiplayerRoomsComponent, INVALID_USERNAME_CLASS } from "./multiplayer-rooms.component";
import { DifficultySelectorComponent } from "../difficulty-selector/difficulty-selector.component";
import { SocketsService } from "../../services/sockets.service";
import { Room, IRoom } from "../../../../../../common/crossword/room";
import { GameDifficulty, Player } from "../../../../../../common/crossword/constant";
import { MOCK_WORDS } from "../../mock-word";

const playerOne: Player = { id: "", name: "A", score: 0};
const playerTwo: Player = { id: "", name: "B", score: 0};
const players: Player[] = [playerOne];
const interfaceRoom: IRoom = {players: players, difficulty: GameDifficulty.Easy, grid: MOCK_WORDS};

describe("MultiplayerRoomsComponent", () => {
    let component: MultiplayerRoomsComponent;
    let fixture: ComponentFixture<MultiplayerRoomsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MultiplayerRoomsComponent,
                           DifficultySelectorComponent],
            providers: [SocketsService]
        })
            .compileComponents()
            .then(() => { })
            .catch(() => { });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MultiplayerRoomsComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("Room creation", () => {

        it("should show difficulty selector and put username in room", () => {
            component.createRoom("A");
            expect(component["isShowingDifficultySelector"]).toBe(true);
            expect(component["username"]).toBe("A");
        });

        it("should create a room with correct difficulty and player", () => {
            component.createRoom("A");
            component.onDifficultySelectedLocalChange(GameDifficulty.Easy);
            expect(component["chosenRoom"].difficulty).toBe(GameDifficulty.Easy);
            expect(component["chosenRoom"].players[0].name).toBe("A");
        });
    });

    describe("Room slection", () => {
        const room: Room = new Room(interfaceRoom);

        it("should not connect to room, invalid username", () => {
            component.onSelectRoom(room, "");
            expect(component["chosenRoom"]).toEqual(new Room());
        });
    });

    describe("Room availability", () => {

        it("should return false room full", () => {
            const player: Player[] = [playerOne, playerTwo];
            const interfaceRoomFull: IRoom = {players: player, difficulty: GameDifficulty.Easy, grid: MOCK_WORDS};
            const room: Room = new Room(interfaceRoomFull);
            expect(component.isRoomAvailable(room)).toBeFalsy();

        });

        it("should return false room without words", () => {
            const player: Player[] = [playerOne];
            const interfaceRoomNoWords: IRoom = {players: player, difficulty: GameDifficulty.Easy, grid: []};
            const room: Room = new Room(interfaceRoomNoWords);
            expect(component.isRoomAvailable(room)).toBeFalsy();

        });

        it("should return true room available", () => {
            const player: Player[] = [playerOne];
            const interfaceRoomAvailable: IRoom = {players: player, difficulty: GameDifficulty.Easy, grid: MOCK_WORDS};
            const room: Room = new Room(interfaceRoomAvailable);
            expect(component.isRoomAvailable(room)).toBeTruthy();

        });

    });

    describe("Class box", () => {

        it("should return invalid", () => {
            component.classInputBox("");
            expect(component["inputBox"]).toBe(INVALID_USERNAME_CLASS);
        });

    });
});
