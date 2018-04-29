import { AbstractCommand } from "./AbstractCommand";
import {EditorRendererService} from "../../../rendering/editor-renderer.service";

export class MouseDownCommand extends AbstractCommand {

    public constructor(editor: EditorRendererService) {
        super(editor);
    }

    public execute(event: MouseEvent): void {
        this._mouseRaycaster.mouseDown(event, this._camera, this._points.points);
    }
}
