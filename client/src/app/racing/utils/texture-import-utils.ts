import { Material, MeshStandardMaterial, Texture, TextureLoader, RepeatWrapping, Object3D, ObjectLoader } from "three";

export class TextureImportUtils {
    public static loadTexture(path: string): Texture {
        return new TextureLoader().load(path);
    }

    private static repeatTexture(texture: Texture, repeatX: number, repeatY: number): Texture {
        texture.wrapS = texture.wrapT = RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(repeatX, repeatY);

        return texture;
    }

    public static loadRepeatableTexture(path: string, repeatX: number, repeatY: number): Texture {
        return this.repeatTexture(this.loadTexture(path), repeatX, repeatY);
    }

    public static createMaterialFromBody(body: {}): Material {
        return new MeshStandardMaterial(body);
    }

    public static createMaterialFromColor(colorHex: number): Material {
        return this.createMaterialFromBody({color: colorHex});
    }

    public static createMaterialFromTexture(texture: Texture): Material {
        return this.createMaterialFromBody({map: texture});
    }

    public static importMaterial(path: string): Material {
        return this.createMaterialFromTexture(this.loadTexture(path));
    }

    public static importRepeatableMaterial(path: string, repeatX: number, repeatY: number): Material {
        return this.createMaterialFromTexture(this.loadRepeatableTexture(path, repeatX, repeatY));
    }

    public static async loadObject3D(PATH: string): Promise<Object3D> {
        return new Promise<Object3D>((resolve, reject) => {
            new ObjectLoader().load(PATH, (object) => {
                resolve(object);
            });
        });
    }
}
