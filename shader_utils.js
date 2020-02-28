import { loadFileAsync } from "./utils";
import { gl } from "./webgl";
class Shader {
    constructor() {
        this.program = null;
        this.uniforms = {};
        this.attribs = {};
    }
    async initializeShaderText(vertext_url, fragment_url) {
        try {
            this.vertexText = await loadFileAsync(vertext_url);
            this.fragmentText = await loadFileAsync(fragment_url);
        }
        catch (err) {
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
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        // createGeo();
        // gl.enableVertexAttribArray(this.attribs.positionAttribLocation);
        // gl.vertexAttribPointer(this.attribs.positionAttribLocation, 3, gl.FLOAT, false, 0, 0);
        // this.colorBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        // setColors();
        // gl.enableVertexAttribArray(this.attribs.colorLocation);
        // gl.vertexAttribPointer(this.attribs.colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);
        // //this.uniforms.colorLocation = gl.getUniformLocation(this.program, "u_color");
        // this.uniforms.matrixLocation = gl.getUniformLocation(this.program, 'u_matrix');
    }
}
function reloadTriple(vao, buffer, vrts, draw_mode = gl.STATIC_DRAW, attribute_index = 0) {
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(attribute_index, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attribute_index);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vrts), draw_mode);
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
function InitializeSolidColorShader(shader) {
    gl.useProgram(shader.program);
    shader.uniforms.u_mvp = gl.getUniformLocation(shader.program, "u_mvp");
    shader.uniforms.u_color = gl.getUniformLocation(shader.program, "u_color");
    gl.useProgram(null);
    console.log('Solid shader:');
    console.log('Program: ' + shader.program);
    console.log('MVP handle: ' + shader.uniforms.u_mvp);
    console.log('Color handle: ' + shader.uniforms.u_color);
}
export { Shader, reloadTriple, unbind, InitializeSolidColorShader as ISCS };
//# sourceMappingURL=shader_utils.js.map