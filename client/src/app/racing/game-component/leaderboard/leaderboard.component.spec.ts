import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserModule } from "@angular/platform-browser";
import { LeaderboardComponent } from "./leaderboard.component";
import { Statistics } from "../../player/constants";
import { Player } from "../../player/player";
import { FormsModule } from "@angular/forms";
import { Car } from "../../car/car";
import { HighscoresComponent } from "../highscores/highscores.component";
import { TrackManagerService } from "../../admin-dashboard/track-manager.service";
import { HttpClient, HttpHandler } from "@angular/common/http";

/*tslint:disable:no-magic-numbers*/
const EXPECTED_MOCK_RACERS_STATISTICS: Array<Statistics> = [
    { currentLap: 3, lapTimes: [62923, 59230, 65023], finalTime: 187176 },  // First position
    { currentLap: 3, lapTimes: [62924, 59230, 65023], finalTime: 187177 },      // Second position,
    { currentLap: 3, lapTimes: [62923, 59231, 65024], finalTime: 187178 },  // Third position
    { currentLap: 3, lapTimes: [125000, 134322, 56203], finalTime: 315525}      // Fourth position
];
describe("LeaderboardComponent", () => {
    let component: LeaderboardComponent;
    let fixture: ComponentFixture<LeaderboardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LeaderboardComponent,
                           HighscoresComponent],
            imports: [FormsModule,
                      BrowserModule],
            providers: [TrackManagerService,
                        HttpClient,
                        HttpHandler]
        })
            .compileComponents()
            .then()
            .catch();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LeaderboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        const MOCK_PLAYERS_STATISTICS: Array<Statistics> = [
            { currentLap: 3, lapTimes: [62924, 59230, 65023], finalTime: 0 },  // Second position,
            { currentLap: 3, lapTimes: [62923, 59231, 65024], finalTime: 0 },   // Third position
            { currentLap: 3, lapTimes: [62923, 59230, 65023], finalTime: 0 },   // First position
            { currentLap: 3, lapTimes: [125000, 134322, 56203], finalTime: 0 }  // Fourth position
        ];
        component["_players"] = [];
        for (let i: number = 0; i < MOCK_PLAYERS_STATISTICS.length; i++) {
            component.players.push(new Player(new Car(), 0));
            component.players[i]["_statistics"] = MOCK_PLAYERS_STATISTICS[i];
        }
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should calculate the racer's final time from their 3 lap times", () => {
        component["calculateFinalTimes"]();
        expect(component.players[0].statistics.finalTime).toEqual(EXPECTED_MOCK_RACERS_STATISTICS[1].finalTime);
        expect(component.players[1].statistics.finalTime).toEqual(EXPECTED_MOCK_RACERS_STATISTICS[2].finalTime);
        expect(component.players[2].statistics.finalTime).toEqual(EXPECTED_MOCK_RACERS_STATISTICS[0].finalTime);
        expect(component.players[3].statistics.finalTime).toEqual(EXPECTED_MOCK_RACERS_STATISTICS[3].finalTime);
    });

    it("should correctly sort racers from their final result", () => {
        component["calculateFinalTimes"]();
        component["sortRacersTimes"]();
        for (let i: number = 0; i < component.players.length; i++) {
            expect(component.players[i].statistics).toEqual(EXPECTED_MOCK_RACERS_STATISTICS[i]);
        }
    });
});
