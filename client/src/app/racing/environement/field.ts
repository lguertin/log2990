import {Geometry, BoxGeometry, Mesh, Material} from "three";
import * as FieldConstants from "./constants";
import { TextureImportUtils } from "../utils/texture-import-utils";

export class Field {
    private _meshes: Mesh[];

    public constructor() {
        this._meshes = this.buildMeshes();
    }

    private get fieldGeometry(): Geometry {
        return new BoxGeometry(FieldConstants.CUBE_SIZE, FieldConstants.SLAB_HEIGHT, FieldConstants.CUBE_SIZE);
    }

    private get fieldMaterial(): Material {
        return TextureImportUtils.importRepeatableMaterial(
            FieldConstants.GRASS_ASSET_PATH,
            FieldConstants.GRASS_REPEAT_SIZE,
            FieldConstants.GRASS_REPEAT_SIZE);
    }

    private translateDown(mesh: Mesh): Mesh {
        mesh.position.y = -1 ;

        return mesh;
    }

    private buildMeshes(): Mesh[] {
        return [this.translateDown(new Mesh(this.fieldGeometry, this.fieldMaterial))];
    }

    public get meshes(): Mesh[] {
        return this._meshes ;
    }
}
