import { RenderCamera, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE } from "./renderCamera";
import { OrthographicCamera, Vector3 } from "three";
import { PI_OVER_2 } from "../../constants";
import { Followable } from "../../followable";
import { VectorUtils } from "../../utils/vector-utils";

export const TOP_DOWN_CAMERA_HEIGHT: number = 10;
const TOP_DOWN_CAMERA_SIZE_FACTOR: number = 0.015;
const ZOOM_SPEED: number = 0.003;
const MAX_ZOOM: number = 8;
const MIN_ZOOM: number = 0.1;

export class TopDownCamera extends OrthographicCamera implements RenderCamera {
    public isZoomingIn: boolean;
    public isZoomingOut: boolean;

    public constructor(name: string, private _width: number, private _height: number) {
        super( _width * -TOP_DOWN_CAMERA_SIZE_FACTOR,
               _width * TOP_DOWN_CAMERA_SIZE_FACTOR,
               _height * TOP_DOWN_CAMERA_SIZE_FACTOR,
               _height * -TOP_DOWN_CAMERA_SIZE_FACTOR,
               NEAR_CLIPPING_PLANE,
               FAR_CLIPPING_PLANE );

        this.quaternion.setFromAxisAngle( new Vector3( -1, 0, 0 ), PI_OVER_2);
        this.position.setY(TOP_DOWN_CAMERA_HEIGHT);
        this.name = name;
        this.isZoomingIn = false;
        this.isZoomingOut = false;
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    private convertToCameraDimension(dimension: number): number {
        return dimension * TOP_DOWN_CAMERA_SIZE_FACTOR;
    }

    private updateOrthographicCamera(): void {
        this.left = -this.convertToCameraDimension(this._width);
        this.right = this.convertToCameraDimension(this._width);
        this.top = this.convertToCameraDimension(this._height);
        this.bottom = -this.convertToCameraDimension(this._height);
    }

    public updateAspectRatio(width: number, height: number): void {
        this._width = width;
        this._height = height;

        this.updateOrthographicCamera();
        this.updateProjectionMatrix();
    }

    private updateZoom(deltaTime: number): void {
        if (this.isZoomingIn && !this.isZoomingOut) {
            this.zoomIn(deltaTime);
        } else if (this.isZoomingOut && !this.isZoomingIn) {
            this.zoomOut(deltaTime);
        }
    }

    public update(deltaTime: number, reference: Followable): void {
        this.updateZoom(deltaTime);
        VectorUtils.copyVectorXZ(reference.getPosition(), this.position);
    }

    public setZoom(amount: number): void {
        this.zoom = amount;
        this.updateProjectionMatrix();
    }

    public zoomIn(deltaTime: number): void {
        this.zoom += deltaTime * ZOOM_SPEED;
        this.zoom = Math.min(this.zoom, MAX_ZOOM);
        this.updateProjectionMatrix();
    }

    public zoomOut(deltaTime: number): void {
        this.zoom -= deltaTime * ZOOM_SPEED;
        this.zoom = Math.max(this.zoom, MIN_ZOOM);
        this.updateProjectionMatrix();
    }
}
