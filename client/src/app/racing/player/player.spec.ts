import { Player } from "./player";
import { LOCAL_PLAYER_NAME } from "./constants";
import { Car } from "../car/car";
import { MAX_LAPS } from "../game-manager/constants";

/*tslint:disable:no-magic-numbers*/
describe("Player", () => {
    const NUMBER_OF_WAYPOINT_TO_CROSS: number = 3;
    let player: Player;
    beforeEach(() => {
        player = new Player(new Car(), NUMBER_OF_WAYPOINT_TO_CROSS);
        player["updateWaypoint"] = () => {};
    });

    it("should have the default name", () => {
        expect(player.name).toBe(LOCAL_PLAYER_NAME);
    });

    it("should increment the number of laps if a player cross the finish line", () => {
        for (let i: number = 1; i < NUMBER_OF_WAYPOINT_TO_CROSS; i++) {
            player["_numberbOfWaypointsCrossed"] = i;
            player.update();
            expect(player.statistics.currentLap).toEqual(1);
        }
        player["_numberbOfWaypointsCrossed"] = NUMBER_OF_WAYPOINT_TO_CROSS;
        player.update();
        expect(player.statistics.currentLap).toEqual(2);
    });

    it("should push the lap time in players statistics when he finishes a lap " + MAX_LAPS + " laps", () => {
        player["_timer"]["_currentTime"] = 3000;
        player["_numberbOfWaypointsCrossed"] = NUMBER_OF_WAYPOINT_TO_CROSS;
        player.update();
        expect(player.statistics.lapTimes.length).toEqual(1);
        player["_timer"]["_currentTime"] = 3500;
        player["_numberbOfWaypointsCrossed"] = NUMBER_OF_WAYPOINT_TO_CROSS;
        player.update();
        expect(player.statistics.lapTimes.length).toEqual(2);
    });

    it("should continue incrementing total lap time while the lap time resets when crossing the finish line", () => {
        const INITIAL_TIME: number = new Date().getTime() - 453;
        const CURRENT_FIRST_LAP_TIME: number = 452;
        player["_timer"]["_startLapDate"] = INITIAL_TIME;
        player["_timer"]["_currentTime"] = INITIAL_TIME + CURRENT_FIRST_LAP_TIME;
        player["_numberbOfWaypointsCrossed"] = NUMBER_OF_WAYPOINT_TO_CROSS;
        player.update();
        expect(player.currentLapTime).toEqual(0);
        expect(player.currentTotalTime).toBeGreaterThan(0);
    });

    it("should simulate unfinished lap with " + MAX_LAPS + " laps", () => {
        player["_timer"]["_currentTime"] = 3000;
        player.simulateUnfinishedLapsTime();
        expect(player.statistics.lapTimes.length).toEqual(MAX_LAPS);
    });

    it("should simulate an higher time than the current time if player has only 1 lap", () => {
        const INITIAL_TIME: number = 3000;
        const CURRENT_FIRST_LAP_TIME: number = 500;
        player["_timer"]["_startLapDate"] = INITIAL_TIME;
        player["_timer"]["_currentTime"] = INITIAL_TIME + CURRENT_FIRST_LAP_TIME;
        player.simulateUnfinishedLapsTime();
        let totalTime: number = 0;
        for (const time of player.statistics.lapTimes) {
            totalTime += time;
        }
        expect(totalTime).toBeGreaterThan(CURRENT_FIRST_LAP_TIME);
    });

    it("should simulate an higher time than the current time if player has only 2 laps", () => {
        const INITIAL_TIME: number = 3000;
        const FIRST_LAP_TIME: number = 500;
        const CURRENT_SECOND_LAP_TIME: number = 390;
        player["_timer"]["_startLapDate"] = INITIAL_TIME + FIRST_LAP_TIME;
        player["_timer"]["_currentTime"] = INITIAL_TIME + FIRST_LAP_TIME + CURRENT_SECOND_LAP_TIME;
        player.statistics.lapTimes.push(FIRST_LAP_TIME);
        player.simulateUnfinishedLapsTime();
        let totalTime: number = 0;
        for (const time of player.statistics.lapTimes) {
            totalTime += time;
        }
        expect(totalTime).toBeGreaterThan(FIRST_LAP_TIME + CURRENT_SECOND_LAP_TIME);
    });

    it("should simulate an higher time than the current time if player has only 3 laps", () => {
        const INITIAL_TIME: number = 3000;
        const FIRST_LAP_TIME: number = 500;
        const SECOND_LAP_TIME: number = 390;
        const CURRENT_THIRD_LAP_TIME: number = 530;
        player["_timer"]["_startLapDate"] = INITIAL_TIME + FIRST_LAP_TIME + SECOND_LAP_TIME;
        player["_timer"]["_currentTime"] = INITIAL_TIME + FIRST_LAP_TIME + SECOND_LAP_TIME + CURRENT_THIRD_LAP_TIME;
        player.statistics.lapTimes.push(FIRST_LAP_TIME);
        player.statistics.lapTimes.push(SECOND_LAP_TIME);
        player.simulateUnfinishedLapsTime();
        let totalTime: number = 0;
        for (const time of player.statistics.lapTimes) {
            totalTime += time;
        }
        expect(totalTime).toBeGreaterThan(FIRST_LAP_TIME + SECOND_LAP_TIME + CURRENT_THIRD_LAP_TIME);
    });
});
