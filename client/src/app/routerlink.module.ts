import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { GameComponent } from "./racing/game-component/game.component";
import { CrosswordComponent } from "./crossword/crossword.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AdminDashboardComponent } from "./racing/admin-dashboard/admin-dashboard.component";
import { TracksManagementComponent } from "./racing/admin-dashboard/tracks-management/tracks-management.component";
import { TrackEditorComponent } from "./racing/admin-dashboard/track-editor/track-editor.component";
import { TrackSelectionComponent } from "./racing/track-selection-component/track-selection.component";

const routes: Routes = [
    { path: "", pathMatch: "full", component: DashboardComponent },
    { path: "crossword", component: CrosswordComponent },
    {
        path: "racing",
        children: [
            { path: "", redirectTo: "tracks", pathMatch: "full" },
            { path: "tracks", component: TrackSelectionComponent },
            { path: "game/:id", component: GameComponent },
            {
                path: "admin", component: AdminDashboardComponent,
                children: [
                    { path: "", redirectTo: "manage", pathMatch: "full" },
                    { path: "manage", component: TracksManagementComponent },
                    { path: "track/:id", component: TrackEditorComponent }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class RouterLinkModule { }
