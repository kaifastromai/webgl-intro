import { vec3 } from "gl-matrix";
import { Shader } from "./shader_utils";
declare class Triangle {
    vao: WebGLVertexArrayObject;
    vertex_buffer: WebGLBuffer;
    index_buffer: WebGLBuffer;
    color_buffer: WebGLBuffer;
    vertices: Array<vec3>;
    private _verts;
    colors: Array<number>;
    indices: Array<number>;
    constructor();
    createTriangle(coords: Array<vec3>): void;
    bindToShader(shader: Shader): void;
}
export { Triangle };
