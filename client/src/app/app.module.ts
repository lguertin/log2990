import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { GameComponent } from "./racing/game-component/game.component";
import { BasicService } from "./basic.service";
import { DifficultySelectorComponent } from "./crossword/game-config/difficulty-selector/difficulty-selector.component";
import { GameModeSelectorComponent } from "./crossword/game-config/gamemode-selector/gamemode-selector.component";
import { FormsModule } from "@angular/forms";

import { RouterLinkModule } from "./routerlink.module";
import { CrosswordComponent } from "./crossword/crossword.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { HintsComponent } from "./crossword/hints/hints.component";
import { GameInfoComponent } from "./crossword/game-info/game-info.component";
import { GridService } from "./crossword/services/grid.service";
import { AdminDashboardComponent } from "./racing/admin-dashboard/admin-dashboard.component";
import { TracksManagementComponent } from "./racing/admin-dashboard/tracks-management/tracks-management.component";
import { TrackEditorComponent } from "./racing/admin-dashboard/track-editor/track-editor.component";
import { ClickOutsideModule } from "ng-click-outside";
import { EditorRendererService } from "./racing/rendering/editor-renderer.service";
import { TrackManagerService } from "./racing/admin-dashboard/track-manager.service";
import { TrackSelectionComponent } from "./racing/track-selection-component/track-selection.component";
import { MultiplayerRoomsComponent } from "./crossword/game-config/multiplayer-rooms/multiplayer-rooms.component";
import { WaitingRoomComponent } from "./crossword/game-config/waiting-room/waiting-room.component";
import { MultiplayerGridComponent } from "./crossword/grid/grid-multiplayer/gridMultiplayer.component";
import { SoloGridComponent } from "./crossword/grid/grid-solo/gridSolo.component";
import { EndGameComponent } from "./crossword/game-config/end-game/end-game.component";
import { GameHudComponent } from "./racing/game-component/game-hud/game-hud.component";
import { LeaderboardComponent } from "./racing/game-component/leaderboard/leaderboard.component";
import { RacingCountdownComponent } from "./racing/game-component/racing-countdown/racing-countdown.component";
import { GameCommandService } from "./racing/game-commands/gameCommand.service";
import { SocketsService } from "./crossword/services/sockets.service";
import { HighscoresComponent } from "./racing/game-component/highscores/highscores.component";

@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        DifficultySelectorComponent,
        GameModeSelectorComponent,
        CrosswordComponent,
        DashboardComponent,
        HintsComponent,
        GameInfoComponent,
        AdminDashboardComponent,
        TracksManagementComponent,
        TrackEditorComponent,
        TrackSelectionComponent,
        MultiplayerRoomsComponent,
        WaitingRoomComponent,
        MultiplayerGridComponent,
        SoloGridComponent,
        LeaderboardComponent,
        RacingCountdownComponent,
        GameHudComponent,
        SoloGridComponent,
        EndGameComponent,
        HighscoresComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        RouterLinkModule,
        ClickOutsideModule
    ],
    providers: [
        BasicService,
        GridService,
        EditorRendererService,
        TrackManagerService,
        GameCommandService,
        SocketsService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
