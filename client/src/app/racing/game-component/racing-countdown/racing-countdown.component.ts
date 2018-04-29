import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { Subject } from "rxjs/Subject";
import { timer } from "rxjs/observable/timer";
import { SoundService } from "../../sounds/sound.service";
import { SoundEvents } from "../../sounds/constants";

export const COUNTDOWN_TEXT: string[] = ["Are You Ready?", "On Your Marks!", "Get Set!" , "GOOOOOOOO!!!"];
export const FIRST_TIMER_DELAY: number = 2000;
export const NEXT_TIMER_DELAYS: number = 1700;
export const SOUND_START_DELAY: number = 1;
export const SOUND_END_DELAY: number = 3;

@Component({
    selector: "app-racing-countdown",
    templateUrl: "./racing-countdown.component.html",
    styleUrls: ["./racing-countdown.component.css"]
})
export class RacingCountdownComponent implements OnInit {
    @Output() public isCountDownFinished: EventEmitter<boolean>;
    public value: string;
    private timer: Subscription;
    private countdown: Subject<number> = new Subject<number>();

    public constructor(private soundService: SoundService) {
        this.isCountDownFinished = new EventEmitter<boolean>();
        this.timer = timer(FIRST_TIMER_DELAY, NEXT_TIMER_DELAYS).subscribe((timerCounter) => {
            this.countdown.next(timerCounter);
        });
    }

    public checkTimerValue(countdown: number): void {
        if (countdown === SOUND_START_DELAY) {
            this.soundService.play(SoundEvents.RACE_START);
        }
        if (countdown === SOUND_END_DELAY) {
            this.countdown.unsubscribe();
            this.timer.unsubscribe();
            this.isCountDownFinished.emit(true);
        }
    }

    public ngOnInit(): void {
        this.countdown.subscribe((timerCounter) => {
            this.value = COUNTDOWN_TEXT[timerCounter];
            this.checkTimerValue(timerCounter);
        });
    }

}
