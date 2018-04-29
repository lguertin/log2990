import {Field} from "./field";

describe( "field" , () => {

    let field: Field;

    beforeEach(() => {
        field = new Field();
    });

    it(" field class should be defined", () => {
        expect(field).toBeDefined();
    });

    it("meshes returned by field should be defined", () => {
        expect( field.meshes.length).toBeGreaterThan(0);

        for (const mesh of field.meshes) {
            expect(mesh).toBeDefined();
        }
    });
});
