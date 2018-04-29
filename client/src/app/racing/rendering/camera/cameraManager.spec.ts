// import { TestBed, inject } from "@angular/core/testing";
import { OrthographicCamera, PerspectiveCamera } from "three";
import { CameraManager } from "./cameraManager";
import { ThirdPersonCamera } from "./thirdPersonCamera";
import { TopDownCamera } from "./topDownCamera";

const MOCK_HEIGHT: number = 400;
const MOCK_WIDTH: number = 300;

describe("Camera Manager", () => {
    let cameraManager: CameraManager;

    beforeEach(() => {
        cameraManager = new CameraManager();
    });

    it("should be able to add ThirdPersonCamera", () => {
        cameraManager.addCamera(new ThirdPersonCamera("ThirdPersonCam", MOCK_HEIGHT, MOCK_WIDTH));
        expect(cameraManager.activeCamera).toBeDefined();
        expect(cameraManager.activeCameraName).toBe("ThirdPersonCam");
    });

    it("should be able to add TopDownCamera", () => {
        cameraManager.addCamera(new TopDownCamera("TopDownCam", MOCK_HEIGHT, MOCK_WIDTH));
        expect(cameraManager.activeCamera).toBeDefined();
        expect(cameraManager.activeCameraName).toBe("TopDownCam");
    });

    it("should switch to Top down Camera", () => {
        cameraManager.addCamera(new ThirdPersonCamera("ThirdPersonCam", MOCK_HEIGHT, MOCK_WIDTH));
        cameraManager.addCamera(new TopDownCamera("TopDownCam", MOCK_HEIGHT, MOCK_WIDTH));

        expect(cameraManager.activeCameraName).toBe("ThirdPersonCam");
        cameraManager.switchCamera();
        expect(cameraManager.activeCameraName).toBe("TopDownCam");
        const iSOrthographic: boolean = cameraManager.activeCamera instanceof OrthographicCamera;
        expect(iSOrthographic).toBeTruthy();
    });

    it("should switch to Third person Perspective Camera", () => {
        cameraManager.addCamera(new ThirdPersonCamera("ThirdPersonCam", MOCK_HEIGHT, MOCK_WIDTH));
        cameraManager.addCamera(new TopDownCamera("TopDownCam", MOCK_HEIGHT, MOCK_WIDTH));
        cameraManager.switchCamera();

        expect(cameraManager.activeCameraName).toBe("TopDownCam");
        cameraManager.switchCamera();
        expect(cameraManager.activeCameraName).toBe("ThirdPersonCam");
        const isPerspective: boolean = cameraManager.activeCamera instanceof PerspectiveCamera;
        expect(isPerspective).toBeTruthy();
    });
});
