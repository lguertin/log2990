import { Vector3 } from "three";

/*tslint:disable-next-line:no-magic-numbers*/ // We only want an up vector which doesn't matter what we put in y axis
export const VERTICAL_RAYCAST_HEIGHT_OFFSET: Vector3 = new Vector3(0, 5, 0);
export const VERTICAL_DOWN_AXIS: Vector3 = new Vector3(0 , -1, 0);
