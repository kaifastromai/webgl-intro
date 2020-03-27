import { vec3, mat4, vec4, mat3 } from "gl-matrix";
import { vec3FromArray } from "./utils";
class Mesh {
    meshFromTris(tris: number[], tri_indices: Array<number>) {

        for (let i = 0; i < tri_indices.length / 3; i++) {
            this.faces.push(
                face.fromVec3(vec3FromArray(tris.slice(tri_indices[i], 3 * tri_indices[i] + 3)),
                    vec3FromArray(tris.slice(3 * tri_indices[i + 1], 3 * tri_indices[i + 1] + 3)),
                    vec3FromArray(tris.slice(3 * tri_indices[i + 2], 3 * tri_indices[i + 2] + 3))
                ))
        }

    }

    /**@param tris An array containing all the vertices of this mesh */
    /**@param faces an array of all the faces. Containts other mesh data such as vertex*/
    private faces: Array<face>;
    /**
     * 
     * @param tris the array of vertices that make a triangle
     */
    constructor(tris: Array<number>, tri_indices: Array<number>) {
        this.faces = [];
        this.meshFromTris(tris, tri_indices);
    }
}

class face {
    /**@param verts */
    protected verts: Array<vec3>;

    constructor(v1: vec3 = null, v2: vec3 = null, v3: vec3 = null) {
        this.verts = [];
        if (v1 == null || v2 == null || v3 == null) {

        }
        else {
            this.verts.push(v1, v2, v3);
        }
    }
    /**
     * Create a face given 3 gl-matrix vec3s;
     * @param v1 the first vector of the face
     * @param v2 the second vector of the face
     * @param v3 the third vector of the face
     */
    public static fromVec3(v1: vec3, v2: vec3, v3: vec3): face {
        let b = new face(v1, v2, v3);
        return b;
    }


}

export { Mesh }