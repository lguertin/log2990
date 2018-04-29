import { Vector3, Raycaster, Object3D, Intersection } from "three";
import { VERTICAL_DOWN_AXIS, VERTICAL_RAYCAST_HEIGHT_OFFSET} from "./constants";

export class VerticalRaycast {
    private static raycaster: Raycaster = new Raycaster();

    public static intersectObject(position: Vector3, mesh: Object3D): Intersection[] {
        this.setVerticalRaycasterOrigin(position);

        return this.raycaster.intersectObject(mesh);
    }

    public static intersectObjects(position: Vector3, meshes: Object3D[]): Intersection[] {
        this.setVerticalRaycasterOrigin(position);

        return this.raycaster.intersectObjects(meshes);
    }

    public static isIntersecting(position: Vector3, mesh: Object3D): boolean {
        return this.intersectObject(position, mesh).length > 0 ;
    }

    private static addHeightOffset(origin: Vector3): Vector3 {
        return origin.clone().add(VERTICAL_RAYCAST_HEIGHT_OFFSET);
    }

    private static setVerticalRaycasterOrigin(origin: Vector3): void {
        this.raycaster.set(this.addHeightOffset(origin), VERTICAL_DOWN_AXIS);
    }
}
