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
export { Shader, reloadTriple, unbind };
