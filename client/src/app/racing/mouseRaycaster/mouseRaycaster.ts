import { Raycaster, Object3D, Camera, Vector2, Vector3, Intersection } from "three";
import { VectorUtils } from "../utils/vector-utils";
import { PLANE_MESH, DRAGGED_OBJECT_HEIGHT } from "./constants";

export class MouseRaycaster {
    private raycaster: Raycaster;
    private canvasWidth: number;
    private canvasHeight: number;
    private draggedObject: Object3D;
    private mouseDownPosition: Vector3;

    public constructor () {
        this.raycaster = new Raycaster();
    }

    public setCanvasWidthAndHeight(canvasWidth: number, canvasHeight: number): void {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    private transformMouseXPosition(event: MouseEvent): number {
        return event.offsetX / this.canvasWidth * 2 - 1;
    }

    private transformMouseYPosition(event: MouseEvent): number {
        return -event.offsetY / this.canvasHeight * 2 + 1;
    }

    private transformMousePosition(event: MouseEvent): Vector2 {
        return new Vector2(this.transformMouseXPosition(event), this.transformMouseYPosition(event));
    }

    private getIntersections(event: MouseEvent, camera: Camera, objects: Object3D[]): Intersection[] {
        this.raycaster.setFromCamera( this.transformMousePosition(event), camera );

        return this.raycaster.intersectObjects( objects, false);
    }

    private getClosestIntersection(event: MouseEvent, camera: Camera, objects: Object3D[]): Intersection {
        return this.getIntersections(event, camera, objects)[0];
    }

    private getObject(intersection: Intersection): Object3D {
        return intersection ? intersection.object : undefined;
    }

    public findClickedObject(event: MouseEvent, camera: Camera, objects: Object3D[]): Object3D {
        return  this.getObject(this.getClosestIntersection(event, camera, objects));
    }

    private getPoint(intersection: Intersection): Vector3 {
        return intersection ? intersection.point : undefined;
    }

    public getSurfacePoint(event: MouseEvent, camera: Camera ): Vector3 {
        return this.getPoint(this.getClosestIntersection(event, camera, [PLANE_MESH]));
    }

    private setDraggedObject(event: MouseEvent, camera: Camera, objects: Object3D[]): void {
        this.draggedObject = this.findClickedObject(event, camera, objects);
    }

    private setMouseDownPosition(event: MouseEvent, camera: Camera): void {
        this.mouseDownPosition = this.getSurfacePoint(event, camera);
    }

    public mouseDown(event: MouseEvent, camera: Camera, objects: Object3D[]): Object3D {
        this.setDraggedObject(event, camera, objects);
        this.setMouseDownPosition(event, camera);

        return this.draggedObject;
    }

    private applyDraggedObjectHeight(): void {
        this.draggedObject.position.setY(DRAGGED_OBJECT_HEIGHT);
    }

    public drag(event: MouseEvent, camera: Camera): Object3D {
        const point: Vector3 = this.getSurfacePoint(event, camera);

        if (this.draggedObject) {
            if (point) {
                VectorUtils.copyVectorXZ(point, this.draggedObject.position);
                this.applyDraggedObjectHeight();

                return this.draggedObject;
            }
        } else {
            VectorUtils.addVectorXZ(this.mouseDownPosition.clone().sub(point), camera.position);
        }

        return undefined;
    }

    public unselectDraggedObject(): Object3D {
        const object: Object3D = this.draggedObject;
        this.draggedObject = undefined;

        return object;
    }
}
