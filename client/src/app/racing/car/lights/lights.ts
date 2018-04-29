import { Object3D, Vector3 } from "three";
import { CarLight } from "./light";
import { FrontLight } from "./frontLight";
import { BackLight } from "./backLight";
import { LightPosition } from "./constants";

export class CarLights extends Object3D {
    private lights: CarLight[];
    public constructor() {
        super();
        this.lights = new Array<CarLight>();
        this.init();
    }

    private createLights(): void {
        for (const lightPosition of [LightPosition.Left, LightPosition.Right]) {
                this.lights.push(new FrontLight(lightPosition));
                this.lights.push(new BackLight(lightPosition));
        }
    }

    private addLightsToItself(): void {
        for (const light of this.lights) {
            this.add(light.object);
        }
    }

    private init(): void {
        this.createLights();
        this.addLightsToItself();
    }

    public update(position: Vector3, direction: Vector3, isBraking: boolean): void {
        for (const light of this.lights) {
            light.update(position.clone(), direction.clone(), isBraking);
        }
    }

    public switchNightLights(): void {
        for (const light of this.lights) {
            light.toggleLight();
        }
    }
}
