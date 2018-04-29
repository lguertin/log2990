import { Player } from "./player";
import { VirtualPlayer } from "./virtualPlayer";
import { LOCAL_PLAYER_NAME, RANDOM_FIRSTNAMES, RANDOM_LASTNAMES } from "./constants";
import { VirtualCar } from "../car/ai/virtualCar";

describe("VirtualPlayer", () => {
    const RANDOM_NAME_INDEX: number = 7;
    const player: Player = new VirtualPlayer(new VirtualCar(), 0);
    beforeEach(() => {
        spyOn(Math, "random").and.returnValue(RANDOM_NAME_INDEX / RANDOM_FIRSTNAMES.length);
    });

    it("should not have the default name", () => {
        expect(player.name).not.toBe(LOCAL_PLAYER_NAME);
    });

    it("should have a random name from the random list name", () => {

        const player2: Player = new VirtualPlayer(new VirtualCar(), 0);
        expect(player2.name).toBe(RANDOM_FIRSTNAMES[RANDOM_NAME_INDEX] + " " +
                                 RANDOM_LASTNAMES[Math.floor(RANDOM_NAME_INDEX / RANDOM_FIRSTNAMES.length *  RANDOM_LASTNAMES.length)]);
    });
});
