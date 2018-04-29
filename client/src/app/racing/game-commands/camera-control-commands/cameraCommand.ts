import { Command } from "../command";
import { CameraManager } from "../../rendering/camera/cameraManager";

export abstract class CameraCommand extends Command {
    protected cameraManager: CameraManager;

    public constructor(cameraManager: CameraManager) {
        super();
        this.cameraManager = cameraManager;
    }
}
