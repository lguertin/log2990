import { Statistics } from "../../player/constants";
import { Player } from "../../player/player";
import { Car } from "../../car/car";

export const MOCK_PLAYERS_STATISTICS: Array<Statistics> = new Array<Statistics>();
/*tslint:disable:no-magic-numbers*/
MOCK_PLAYERS_STATISTICS.push({currentLap: 3,
                              lapTimes: [62924, 59230, 65023],
                              finalTime: 0}); // Second position

MOCK_PLAYERS_STATISTICS.push({currentLap: 3,
                              lapTimes: [62923, 59231, 65024],
                              finalTime: 0}); // Third position

MOCK_PLAYERS_STATISTICS.push({currentLap: 3,
                              lapTimes: [62923, 59230, 65023],
                              finalTime: 0}); // First position

MOCK_PLAYERS_STATISTICS.push({currentLap: 3,
                              lapTimes: [125000, 134322, 56203],
                              finalTime: 0}); // Fourth position

export const MOCK_PLAYERS: Array<Player> = new Array<Player>();

for (let i: number = 0; i < MOCK_PLAYERS_STATISTICS.length; i++) {
    MOCK_PLAYERS.push(new Player(new Car(), 0));
    MOCK_PLAYERS[i]["_statistics"] = MOCK_PLAYERS_STATISTICS[i];
}
