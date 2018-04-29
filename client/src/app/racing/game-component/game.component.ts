import { Component, ElementRef, ViewChild, HostListener, OnDestroy, OnInit } from "@angular/core";
import { RacingRendererService } from "../rendering/racing-renderer.service";
import { TrackInformation } from "../../../../../common/racing/constants";
import { TrackManagerService } from "../admin-dashboard/track-manager.service";
import { TrackInformationImporter } from "../admin-dashboard/track-parser/trackInformationParser";
import { SoundService } from "../sounds/sound.service";
import { GameCommandService } from "../game-commands/gameCommand.service";
import { CarFactoryService } from "../car/car-factory.service";
import { GameManagerService } from "../game-manager/game-manager.service";
import { Player } from "../player/player";
import { ActivatedRoute } from "@angular/router";

export const  enum gameEventState {
    loadTrack,
    initialize,
    end
}

@Component({
    moduleId: module.id,
    selector: "app-game-component",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.css"],
    providers: [RacingRendererService,
                SoundService,
                GameCommandService,
                CarFactoryService,
                GameManagerService]
})

export class GameComponent implements OnDestroy, OnInit {

    public isTrackLoaded: boolean;
    public trackInformation: TrackInformation;

    public gameState: gameEventState;
    @ViewChild("container")
    private containerRef: ElementRef;

    public constructor(private route: ActivatedRoute,
                       private racingRenderService: RacingRendererService,
                       private trackManagerService: TrackManagerService,
                       private soundService: SoundService) {
        this.trackInformation = new TrackInformation();
        this.isTrackLoaded = false;
        this.gameState = gameEventState.loadTrack;
     }

    public ngOnInit(): void {
        this.loadTrackInfo();
    }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.racingRenderService.onResize();
    }

    @HostListener("window:keydown", ["$event"])
    public onKeyDown(event: KeyboardEvent): void {
        this.racingRenderService.keyDown(event);
    }

    @HostListener("window:keyup", ["$event"])
    public onKeyUp(event: KeyboardEvent): void {
        this.racingRenderService.keyUp(event);
    }

    public ngOnDestroy(): void {
        this.soundService.stopAllSound();
    }

    public onCountDownOver(isCountDownFinished: boolean): void {
        this.racingRenderService.updateEnable = isCountDownFinished;
    }

    private loadTrackInfo(): void {
        this.trackManagerService.getTrack(this.route.snapshot.paramMap.get("id"))
        .subscribe(async (track: TrackInformation) => {
            this.trackInformation = track;
            await this.racingRenderService.initialize(this.containerRef.nativeElement);
            this.racingRenderService.initializeTrack(TrackInformationImporter.parse(this.trackInformation));
            this.isTrackLoaded = true;
        });
    }

    public get players(): Player[] {
        return this.racingRenderService.players;
    }

    public get isFinished(): boolean {
        return this.racingRenderService.isFinished;
    }
}
