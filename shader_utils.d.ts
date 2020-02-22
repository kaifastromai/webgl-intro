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
    constructor();
    initializeShaderText(vertext_url: string, fragment_url: string): Promise<void>;
    createProgram(): void;
}
export { Shader };
