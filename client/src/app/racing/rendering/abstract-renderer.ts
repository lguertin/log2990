import { WebGLRenderer, Scene, Mesh, Vector3, OrthographicCamera } from "three";
import { Field } from "../environement/field";
import { Track } from "../track/track";
import { Skybox } from "../environement/skybox";
import { CameraManager } from "../rendering/camera/cameraManager";
import { RenderCamera } from "./camera/renderCamera";
import { TopDownCamera } from "./camera/topDownCamera";
import { ScreenshotManager } from "./screenshot-manager";

export abstract class Renderer {

    protected container: HTMLDivElement;
    protected renderer: WebGLRenderer;
    private field: Field;
    protected scene: THREE.Scene;
    protected cameraManager: CameraManager;
    protected lastDate: number;
    protected _track: Track;
    protected skybox: Skybox;

    protected constructor() {
        this.field = new Field();
        this.skybox = new Skybox();
        this.scene = new Scene();
        this._track = new Track();
    }

    public get camera(): RenderCamera {
        return this.cameraManager.activeCamera;
    }
    public get track(): Track {
        return this._track;
    }

    public get _scene(): Scene {
        return this.scene;
    }
    protected async initialize(container: HTMLDivElement): Promise<void> {
        if (container) {
            this.container = container;
        }
        await this.createScene();
        this.startRenderingLoop();
    }

    public get containerWidth(): number {
        return this.container.clientWidth;
    }

    public get containerHeight(): number {
        return this.container.clientHeight;
    }

    protected addMesh( mesh: Mesh): void {
        this.scene.add(mesh);
    }

    protected addMeshes(meshes: Mesh[]): void {
        for (const mesh of meshes) {
            this.scene.add(mesh);
        }
    }

    protected removeMesh(mesh: Mesh): void {
        this.scene.remove(mesh);
    }

    protected removeMeshes(meshes: Mesh[]): void {
        for (const mesh of meshes) {
            this.scene.remove(mesh);
        }
    }

    protected update(): void {
        this.lastDate = Date.now();
    }

    public takeTrackScreenShotIfValid(): string {
        new ScreenshotManager(this.camera as TopDownCamera, this._track).positionnateScreenShotCamera();
        this.renderer.render(this.scene, this.camera);

        return this.renderer.domElement.toDataURL( "image/jpeg" , "screenshot" );
    }

    public takeTrackScreenShot(): string {
        if (this.camera instanceof OrthographicCamera) {
            return this.takeTrackScreenShotIfValid();
        } else {
            throw new Error("the current camera is not orthographic. Screenshot denied");
        }
    }

    private addSkyboxSceneComponents(): void {
        this.scene.add(this.skybox.directionalLight);
        this.scene.add(this.skybox.mesh);
    }

    protected async createScene(): Promise<void> {
        this.addMeshes(this.field.meshes);
        this.addSkyboxSceneComponents();
        this.cameraManager = new CameraManager();
    }

    private startRenderingLoop(): void {
        this.renderer = new WebGLRenderer( { preserveDrawingBuffer: true } );
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

        this.lastDate = Date.now();
        this.container.appendChild(this.renderer.domElement);
        this.render();
    }

    private render(): void {
        requestAnimationFrame(() => this.render());
        this.update();
        this.renderer.render(this.scene, this.camera);
    }

    public onResize(): void {
        this.cameraManager.updateContainerSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    public importTrack(pointsVector: Vector3[]): void {
        this.removeMeshes(this._track.meshes);
        this.addMeshes(this._track.generate(pointsVector));
    }
}
