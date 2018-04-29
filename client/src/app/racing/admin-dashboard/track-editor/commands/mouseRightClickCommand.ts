import { AbstractCommand } from "./AbstractCommand";
import {EditorRendererService} from "../../../rendering/editor-renderer.service";

export class MouseRightClickCommand extends AbstractCommand {
    public constructor(editor: EditorRendererService) {
        super(editor);
    }

    public execute(event: MouseEvent): void {
            if (!this._track.isEmpty()) {
                if (!this._track.isLooping()) {
                    this.removeSphere();
                }
                this.removeSegment();
            }
    }
    public removeSegment(): void {
        this.removeMeshes(this._track.removeSegment());
    }

}
