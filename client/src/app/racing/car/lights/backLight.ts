import * as THREE from "three";
import { CarLight } from "./light";
import * as LightConstant from "./constants";

export class BackLight extends CarLight {
    private pointLight: THREE.PointLight;

    public constructor(private offSetDirection: number) {
        super();
        this.initPointLight();
    }

    private initPointLight(): void {
        this.pointLight = new THREE.PointLight();
        this.pointLight.color.set(LightConstant.BACK_COLOR);
        this.pointLight.castShadow = true;
        this.pointLight.distance = LightConstant.BACK_SHOW_DISTANCE;
    }

    public get object(): THREE.PointLight {
        return this.pointLight;
    }

    public update(position: THREE.Vector3, direction: THREE.Vector3, isBraking: boolean): void {
        this.pointLight.intensity = (+this.nightLight) * LightConstant.BACK_BOOL_MULTIPLIER
                                    + +isBraking * LightConstant.BACK_BOOL_MULTIPLIER;
        this.pointLight.position.set(position.x, position.y + LightConstant.BACK_Y_ADDITION, position.z);
        this.pointLight.position.sub(direction.multiplyScalar(LightConstant.BACK_DISTANCE));
        const vecteurLateral: THREE.Vector3 = direction.cross(new THREE.Vector3(0, 1, 0));
        this.pointLight.position.add(vecteurLateral.multiplyScalar(this.offSetDirection * LightConstant.BACK_SEPARATE_DISTANCE));
    }
}
