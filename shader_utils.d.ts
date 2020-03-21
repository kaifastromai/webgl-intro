import { vec3 } from "gl-matrix";
declare class Shader {
    program: WebGLProgram;
    uniforms?: {
        [k: string]: WebGLUniformLocation;
    };
    attribs?: {
        [k: string]: number;
    };
    vertexText: string;
    fragmentText: string;
    positionBuffer: WebGLBuffer;
    colorBuffer: WebGLBuffer;
    constructor();
    initializeShaderText(vertext_url: string, fragment_url: string): Promise<void>;
    createProgram(): void;
}
declare function reloadTriple(vao: WebGLVertexArrayObject, buffer: WebGLBuffer, vrts: Array<number>, draw_mode?: number, attribute_index?: number): void;
declare function unbind(): void;
/**
 * Initializes the uniforms on the solid color shader. Can be made more general later.
 * @param shader the shader to operate on.
 */
declare function InitializeSolidColorShader(shader: Shader): void;
/**
 *
 * @param quads The array containing quad vec3 data
 */
declare function createNormalsFromQuads(quads: Array<vec3>): void;
export { Shader, reloadTriple, unbind, InitializeSolidColorShader as ISCS, createNormalsFromQuads };
