import { Vector3 } from "three";

export abstract class Followable {
    public abstract getPosition(): Vector3;
    public abstract getDirection(): Vector3;
}
