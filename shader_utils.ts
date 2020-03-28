import { loadFileAsync } from "./utils";
import { gl } from "./webgl";
import { vec3 } from "gl-matrix";
class Shader {
    program: WebGLProgram;
    uniforms?: { [k: string]: WebGLUniformLocation; };
    attribs?: { [k: string]: number; };
    vertexText: string;
    fragmentText: string;
    positionBuffer: WebGLBuffer;
    colorBuffer: WebGLBuffer;
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
        this.attribs.colorLocation = gl.getAttribLocation(this.program, 'a_color');
        this.positionBuffer = gl.createBuffer();
    }


}
function reloadTriple(vao: WebGLVertexArrayObject, buffer: WebGLBuffer, vrts: Array<number>, draw_mode = gl.STATIC_DRAW, attribute_index = 0) {
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(attribute_index, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attribute_index);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vrts), draw_mode);
}
function reloadImage(vao: WebGLVertexArrayObject, texture_coord_buffer:
    WebGLBuffer, attribute_index = 0, texture_coords: Array<number>,
    draw_mode = gl.STATIC_DRAW, image: HTMLImageElement) {
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, texture_coord_buffer);
    gl.vertexAttribPointer(attribute_index, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attribute_index);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture_coords), draw_mode);

    let texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + 0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    let mipLevel = 0;
    let internalFormat = gl.RGBA;
    let srcFormat = gl.RGBA;
    let srcType = gl.UNSIGNED_BYTE;
    gl.texImage2D(gl.TEXTURE_2D, mipLevel, internalFormat, srcFormat, srcType, image);
}
function unbind() {
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}
/**
 * Initializes the uniforms on the solid color shader. Can be made more general later.
 * @param shader the shader to operate on.
 */
function InitializeSolidColorShader(shader: Shader) {
    gl.useProgram(shader.program);
    shader.uniforms.u_mvp = gl.getUniformLocation(shader.program, "u_mvp");
    shader.uniforms.u_color = gl.getUniformLocation(shader.program, "u_color");
    gl.useProgram(null);
    console.log('Solid shader:');
    console.log('Program: ' + shader.program);
    console.log('MVP handle: ' + shader.uniforms.u_mvp);
    console.log('Color handle: ' + shader.uniforms.u_color);
}
/**
 * 
 * @param quads The array containing quad vec3 data
 */
function createNormalsFromQuads(quads: Array<vec3>) {


}
export { Shader, reloadTriple, unbind, InitializeSolidColorShader as ISCS, createNormalsFromQuads, reloadImage };
