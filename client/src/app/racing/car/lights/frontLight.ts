import * as THREE from "three";
import { CarLight } from "./light";
import * as LightConstant from "./constants";
import { VectorUtils } from "../../utils/vector-utils";

export class FrontLight extends CarLight {
    private targetObject: THREE.Object3D;
    private spotLight: THREE.SpotLight;

    public constructor(private offSetDirection: number) {
        super();
        this.initSpotLight();
        this.initTargetObject();
    }

    private initSpotLight(): void {
        this.spotLight = new THREE.SpotLight();

        this.spotLight.castShadow = true;
        this.spotLight.color.set(LightConstant.FRONT_COLOR);
        this.spotLight.distance = LightConstant.FRONT_SHOW_DISTANCE;
        this.spotLight.angle = LightConstant.FRONT_ANGLE;
        this.spotLight.decay = LightConstant.FRONT_DECAY;
        this.spotLight.penumbra = LightConstant.FRONT_PENUMBRA;
    }

    private initTargetObject(): void {
        this.targetObject = new THREE.Object3D();

        this.spotLight.add(this.targetObject);
        this.spotLight.target = this.targetObject ;
    }

    public get object(): THREE.SpotLight {
        return this.spotLight;
    }

    private get heightOffset(): THREE.Vector3 {
        return new THREE.Vector3(0, LightConstant.FRONT_HEIGHT_OFFSET, 0);
    }

    private getFrontDistance(direction: THREE.Vector3): THREE.Vector3 {
        return direction.clone().setLength(LightConstant.FRONT_DISTANCE);
    }

    private getLateralDistance(direction: THREE.Vector3): THREE.Vector3 {
        return VectorUtils.rotateY90DegToRight(direction).multiplyScalar(this.offSetDirection);
    }

    private getRequiredSpotLightPosition(position: THREE.Vector3, direction: THREE.Vector3): THREE.Vector3 {
        return position.clone()
                .add(this.heightOffset)
                .add(this.getFrontDistance(direction))
                .add(this.getLateralDistance(direction));
    }

    private updateNightLightMode(position: THREE.Vector3, direction: THREE.Vector3): void {
        this.spotLight.intensity = LightConstant.FRONT_BASE_INTENSITY;
        VectorUtils.copyVector(this.getRequiredSpotLightPosition(position, direction), this.spotLight.position);
        VectorUtils.copyVector(direction, this.spotLight.target.position);
    }

    public update(position: THREE.Vector3, direction: THREE.Vector3, isBreaking: boolean): void {
        if (this.nightLight) {
            this.updateNightLightMode(position, direction);
        } else {
            this.spotLight.intensity = 0;
        }
    }
}
