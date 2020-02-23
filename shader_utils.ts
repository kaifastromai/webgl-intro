import { loadFileAsync } from "./utils";
import { gl } from "./webgl";
class Shader {
    program: WebGLProgram;
    uniforms?: { [k: string]: WebGLUniformLocation; };
    attribs?: { [k: string]: number; };
    vertexText: string;
    fragmentText: string;
    constructor() {
        this.program = null;
        this.uniforms = {};
        this.attribs = {};
    }

    async initializeShaderText(vertext_url: string, fragment_url: string) {
        try {
            this.vertexText = await loadFileAsync(vertext_url);
            this.fragmentText = await loadFileAsync(fragment_url);
        } catch (err) {
            console.error(err.message);
        }
    }
    createProgram() {
        this.program = gl.createProgram();
        //create gl shader itself
        var vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShader, this.vertexText);
        gl.compileShader(vertShader);
        //Debug if we succeded
        var success = gl.getShaderParameter(vertShader, gl.COMPILE_STATUS);
        if (!success)
            console.error(gl.getShaderInfoLog(vertShader));
        var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShader, this.fragmentText);
        gl.compileShader(fragShader);
        success = gl.getShaderParameter(fragShader, gl.COMPILE_STATUS);
        if (!success)
            console.error(gl.getShaderInfoLog(vertShader));
        gl.attachShader(this.program, vertShader);
        gl.attachShader(this.program, fragShader);
        gl.linkProgram(this.program);
        var success = gl.getProgramParameter(this.program, gl.LINK_STATUS);
        if (!success) {
            throw "Could not link program: " + gl.getProgramInfoLog(this.program);
        }
        this.attribs.positionAttribLocation = gl.getAttribLocation(this.program, "a_vert_pos");
        gl.enableVertexAttribArray(this.attribs.positionAttribLocation);
        // this.uniforms.resolutionUniformLocation = gl.getUniformLocation(this.program, 'u_resolution');
        this.uniforms.colorLocation = gl.getUniformLocation(this.program, "u_color");
        this.uniforms.matrixLocation = gl.getUniformLocation(this.program, 'u_matrix');
    }

}
export { Shader };
