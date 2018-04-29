import * as THREE from "three";
import { INITIAL_NIGHT_LIGHT_MODE } from "./constants";

export abstract class CarLight {
    protected nightLight: boolean;

    public constructor() {
        this.nightLight = INITIAL_NIGHT_LIGHT_MODE;
    }

    public abstract update(position: THREE.Vector3, direction: THREE.Vector3, isBreaking: boolean): void;
    public abstract get object(): THREE.Light;

    public toggleLight(): void {
        this.nightLight = !this.nightLight;
    }
}
