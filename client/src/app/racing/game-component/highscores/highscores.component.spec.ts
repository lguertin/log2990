import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Statistics } from "../../player/constants";
import { HighscoresComponent } from "./highscores.component";
import { FormsModule } from "@angular/forms";
import { TrackManagerService } from "../../admin-dashboard/track-manager.service";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { Car } from "../../car/car";
import { Player } from "../../player/player";
import { of } from "rxjs/observable/of";
import { TrackInformation } from "../../../../../../common/racing/constants";

/*tslint:disable: no-magic-numbers*/

const MOCK_PLAYERS_STATISTICS: Array<Statistics> = [
    { currentLap: 3, lapTimes: [623, 590, 623], finalTime: 1836 },   // First position
    { currentLap: 3, lapTimes: [62924, 59230, 65023], finalTime: 187177 },  // Second position,
    { currentLap: 3, lapTimes: [62923, 59231, 65024], finalTime: 187178 },   // Third position
    { currentLap: 3, lapTimes: [125000, 134322, 56203], finalTime: 315525 },  // Fourth position
    { currentLap: 3, lapTimes: [125000, 595230, 655023], finalTime: 1375253 }   // Fifth position
];
const MOCKTRACK: TrackInformation = new TrackInformation();
MOCKTRACK.bestTimes = [{ name: "", time: 20000 }, { name: "", time: 20000 }, { name: "", time: 20000 }, { name: "", time: 20000 },
                       { name: "", time: 20000 }];

describe("HighscoresComponent", () => {
    let component: HighscoresComponent;
    let fixture: ComponentFixture<HighscoresComponent>;
    let service: TrackManagerService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HighscoresComponent],
            imports: [FormsModule],
            providers: [TrackManagerService,
                        HttpClient,
                        HttpHandler]
        })
            .compileComponents()
            .then()
            .catch();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HighscoresComponent);
        component = fixture.componentInstance;
        service =  TestBed.get(TrackManagerService);
        spyOn(service, "update").and.returnValue(of(null));

        component["_players"] = [];
        for (let i: number = 0; i < MOCK_PLAYERS_STATISTICS.length; i++) {
            if (i === 3) {
                const temp: Player = new Player(new Car(), 0);
                temp.name = "You";
                component.players.push(temp);
            } else {
                component.players.push(new Player(new Car(), 0));
            }
            component.players[i]["_statistics"] = MOCK_PLAYERS_STATISTICS[i];
        }
        component.players.sort();
        component["_trackInformation"] = MOCKTRACK;
        component["localPlayerName"] = "Sid";

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("Testing if the winner banner will be displayed only if requirements are meets", () => {
        it("winner should be qualified to write his name and put his time among best times", () => {
            expect(component.isQualifiedForHighscore()).toBe(true);
        });

        it("winner should not be  qualified to write his name and put his time among best times", () => {
            component.players[0].statistics.finalTime = 4444555;
            component.players.sort();
            expect(component.isQualifiedForHighscore()).toBe(false);
        });
    });

    describe("Testing if the informations are correctly saved", () => {

        it("Should not add the player time in best time", () => {
            component.players[0].statistics.finalTime = 69696996969;
            component.save();
            let hasBeenFound: boolean = false;
            for (const time of component.trackInformation.bestTimes) {
                if (time.name === "Sid") {
                    hasBeenFound = true;
                }
            }
            expect(hasBeenFound).toBe(false);
        });

        it("Should  add the player time in best time", () => {
            component.save();
            for (const time of component.trackInformation.bestTimes) {
                if (time.name === "Sid") {
                    expect (time.time).toBe(component["localBestPlayer"].statistics.finalTime);
                }
            }
        });

        it("Should always have a max of  5 items after save method", () => {
            component.trackInformation.bestTimes = [{ name: "", time: 20000 }];
            component.save();
            expect(component.trackInformation.bestTimes.length).toBe(2);
            component.players[0].statistics.finalTime = 13444;
            component.save();
            expect(component.trackInformation.bestTimes.length).toBe(3);
            component.players[0].statistics.finalTime = 13444;
            component.save();
            expect(component.trackInformation.bestTimes.length).toBe(4);
            component.players[0].statistics.finalTime = 13444;
            component.save();
            expect(component.trackInformation.bestTimes.length).toBe(5);
            component.players[0].statistics.finalTime = 12;
            component.save();
            expect(component.trackInformation.bestTimes.length).toBe(5);
            component.players[0].statistics.finalTime = 4;
            component.save();
            expect(component.trackInformation.bestTimes.length).toBe(5);
            component.save();
        });

        it("should call the update method of trackManagerService ", () => {
            component.save();
            expect(service.update).toHaveBeenCalled();
        });
    });

});
