import * as THREE from "three";
import * as EnvironementConstant from "./constants";
import { Followable } from "../followable";
export class Skybox extends THREE.Object3D {
    private skyBoxMode: EnvironementConstant.Mode;
    private _material: THREE.Material;

    private skyboxDayURL: string[];
    private skyboxNightURL: string[];

    public _mesh: THREE.Mesh;
    public _directionalLight: THREE.DirectionalLight;
    public constructor() {
        super();

        this.skyboxDayURL = [];
        this.skyboxNightURL = [];
        this._directionalLight = new THREE.DirectionalLight(EnvironementConstant.WHITE_COLOR,
                                                            EnvironementConstant.DIRECTIONAL_LIGHT_INTENSITY);

        this._directionalLight.position.set(EnvironementConstant.DIRECTIONAL_LIGHT_POSITIONX,
                                            EnvironementConstant.DIRECTIONAL_LIGHT_POSITIONY,
                                            EnvironementConstant.DIRECTIONAL_LIGHT_POSITIONZ);
        this._directionalLight.target.position.set(0, 0, 0);
        this._mesh = new THREE.Mesh();
        this.initializeAssetsPath();
        this.createLight();
        this.switchSkyboxDay();
        this.skyBoxMode = EnvironementConstant.Mode.DAY;
        this.add(this.mesh);
        this.add(this.directionalLight);
    }

    public get material(): THREE.Material {
        return this._material;
    }
    public get directionalLight(): THREE.DirectionalLight {
        return this._directionalLight;
    }

    public get mesh(): THREE.Mesh {
        return this._mesh;
    }

    private initializeAssetsPath(): void {
        for (let i: number = 0; i < EnvironementConstant.NUMBER_OF_CUBE_FACES; i++) {
            this.skyboxDayURL.push(EnvironementConstant.DAY_ASSETS_PATH + EnvironementConstant.IMAGES_POSITIONS[i] +
                EnvironementConstant.EXTENSION);
        }
        for (let i: number = 0; i < EnvironementConstant.NUMBER_OF_CUBE_FACES; i++) {
            this.skyboxNightURL.push(EnvironementConstant.NIGHT_ASSETS_PATH + EnvironementConstant.IMAGES_POSITIONS[i] +
                EnvironementConstant.EXTENSION);
        }

    }
    private createSkybox(skyboxURL: string[], color: number): void {
        // codeSource :http://borntocode.fr/js-webgl-scene-skybox-three-js/
        const cubeTextures: THREE.CubeTexture =
            new THREE.CubeTextureLoader().load(skyboxURL,
                                               () => {/*On Load*/ },
                                               () => {/*On progress*/ },
                                               () => { console.error("Skybox: Could not load skybox cube textures."); });
        cubeTextures.format = THREE.RGBAFormat;
        const material: THREE.Material = this.createCubeMaterial(cubeTextures);
        material.needsUpdate = true;
        this._mesh = new THREE.Mesh(new THREE.BoxGeometry(EnvironementConstant.CUBE_SIZE,
                                                          EnvironementConstant.CUBE_SIZE,
                                                          EnvironementConstant.CUBE_SIZE),
                                    material);
        this._material = material;
        this._directionalLight.color.setHex(color);
    }
    public switchSkyboxDay(): void {
        this.createSkybox(this.skyboxDayURL, EnvironementConstant.WHITE_COLOR);
    }

    public switchSkyboxNight(): void {
        this.createSkybox(this.skyboxNightURL, EnvironementConstant.BLUE_COLOR);
    }
    private createCubeMaterial(cubeTextures: THREE.CubeTexture): THREE.ShaderMaterial {
        const shader: THREE.Shader = THREE.ShaderLib["cube"];
        shader.uniforms["tCube"].value = cubeTextures;

        return new THREE.ShaderMaterial({
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        });
    }
    public createLight(): void {
        this._directionalLight.castShadow = true;
        this._directionalLight.shadow.camera.left = -EnvironementConstant.DIRECTIONAL_LIGHT_SIZE;
        this._directionalLight.shadow.camera.right = EnvironementConstant.DIRECTIONAL_LIGHT_SIZE;
        this._directionalLight.shadow.camera.top = EnvironementConstant.DIRECTIONAL_LIGHT_SIZE;
        this._directionalLight.shadow.camera.bottom = -EnvironementConstant.DIRECTIONAL_LIGHT_SIZE;
        this._directionalLight.shadow.camera.far = EnvironementConstant.DIRECTIONAL_LIGHT_HALFSIZE;
        this._directionalLight.shadow.bias = EnvironementConstant.SHADOW_BIAS;
    }

    public switchSkyBoxMode(): void {
        if (this.skyBoxMode === EnvironementConstant.Mode.DAY) {
            this.switchSkyboxNight();
            this.skyBoxMode = EnvironementConstant.Mode.NIGHT;

        } else {
            this.switchSkyboxDay();
            this.skyBoxMode = EnvironementConstant.Mode.DAY;
        }

    }

    public updatePosition(objectToFollow: Followable): void {
        this._mesh.position.set(objectToFollow.getPosition().x,
                                objectToFollow.getPosition().y,
                                objectToFollow.getPosition().z);
    }

}
