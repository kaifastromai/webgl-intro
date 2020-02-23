import { Shader } from "./shader_utils";
import { resize_canvas } from "./utils";
import { mat3 } from "gl-matrix";
const glcanvas = document.getElementById('glcanvas');
const gl = glcanvas.getContext('webgl2');
if (!gl)
    throw "WebGL2 is not supported on this browser!";
let shader = new Shader();
resize_canvas(glcanvas);
var translation = [glcanvas.width / 2, glcanvas.height / 2];
//var color = [Math.random(), Math.random(), Math.random(), 1];
var positionBuffer = gl.createBuffer();
var vao = gl.createVertexArray();
gl.bindVertexArray(vao);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(shader.attribs.positionAttribLocation, 2, gl.FLOAT, false, 0, 0);
createGeo();
async function initializeShader() {
    await shader.initializeShaderText('./shaders/shader.vert', './shaders/shader.frag');
    shader.createProgram();
}
function drawScene(rotation, scale, translate) {
    resize_canvas(glcanvas);
    //Tells gl how to convert from clip-space to pixels
    gl.viewport(0, 0, glcanvas.width, glcanvas.height);
    //Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    //Clear canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //Use our shader
    gl.useProgram(shader.program);
    //Bind our desired attribute/buffer set
    gl.bindVertexArray(vao);
    // //Pass in canvas resolution to convert to pixel-space
    // gl.uniform2f(shader.uniforms.resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    // //Set a color
    //The projection matrix
    var p_m = mat3.fromValues(2 / glcanvas.width, 0, 0, 0, -2 / glcanvas.height, 0, -1, 1, 1);
    //Update the position buffer reactanle positions
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    //Compute matrices
    //Translation matrix
    var m = mat3.create();
    var move_mat = mat3.create();
    mat3.translate(move_mat, move_mat, [-50, -75]);
    mat3.multiply(m, p_m, m);
    mat3.translate(m, m, translate);
    mat3.rotate(m, m, rotation);
    mat3.scale(m, m, scale);
    mat3.multiply(m, m, move_mat);
    gl.uniformMatrix3fv(shader.uniforms.matrixLocation, false, m);
    gl.uniform4f(shader.uniforms.colorLocation, Math.random(), Math.random(), Math.random(), 1);
    gl.drawArrays(gl.TRIANGLES, 0, 18);
    console.log(gl.getError());
}
//Create an 'F' from triangles
function createGeo() {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        // left column
        0, 0,
        30, 0,
        0, 150,
        0, 150,
        30, 0,
        30, 150,
        // top rung
        30, 0,
        100, 0,
        30, 30,
        30, 30,
        100, 0,
        100, 30,
        // middle rung
        30, 60,
        67, 60,
        30, 90,
        30, 90,
        67, 60,
        67, 90
    ]), gl.STATIC_DRAW);
}
export { gl, glcanvas, initializeShader, drawScene };
//# sourceMappingURL=webgl.js.map