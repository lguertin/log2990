import { AbstractCommand } from "./AbstractCommand";
import {EditorRendererService} from "../../../rendering/editor-renderer.service";

export class MouseUpCommand extends AbstractCommand {

    public constructor(editor: EditorRendererService) {
        super(editor);
    }

    public execute(event: MouseEvent): void {
        this._mouseRaycaster.unselectDraggedObject();
    }
}
