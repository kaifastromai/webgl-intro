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
    CreateShader(): void;
}
declare var solid_shader: Shader;
declare var color_shader: Shader;
declare function InitializeSolidColorShader(): Promise<void>;
declare function InitializeIndexedColorShader(): Promise<void>;
export { Shader };
export { solid_shader, color_shader, InitializeSolidColorShader, InitializeIndexedColorShader };
