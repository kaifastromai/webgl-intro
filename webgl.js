import { Shader } from "./shader_utils";
import { resize_canvas } from "./utils";
import { mat4 } from "gl-matrix";
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
    var ch = glcanvas.clientHeight;
    var cw = glcanvas.clientWidth;
    var p_m = mat4.create();
    mat4.ortho(p_m, -cw / 2, cw / 2, -ch / 2, ch / 2, 400, -400);
    //Update the position buffer reactanle positions
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    //Compute matrices
    //Translation matrix
    var m = mat4.create();
    mat4.multiply(m, p_m, m);
    mat4.translate(m, m, translate);
    mat4.rotate(m, m, rotation, [0, 1, 0]);
    mat4.scale(m, m, scale);
    gl.uniformMatrix4fv(shader.uniforms.matrixLocation, false, m);
    gl.uniform4f(shader.uniforms.colorLocation, 1, 1, 1, 1);
    gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);
    console.log(gl.getError());
}
//Create an 'F' from triangles
function createGeo() {
    //--------------//
    //Second triangle
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        // left column front
        0, 0, 0,
        30, 0, 0,
        0, 150, 0,
        0, 150, 0,
        30, 0, 0,
        30, 150, 0,
        // top rung front
        30, 0, 0,
        100, 0, 0,
        30, 30, 0,
        30, 30, 0,
        100, 0, 0,
        100, 30, 0,
        // middle rung front
        30, 60, 0,
        67, 60, 0,
        30, 90, 0,
        30, 90, 0,
        67, 60, 0,
        67, 90, 0,
        // left column back
        0, 0, 30,
        30, 0, 30,
        0, 150, 30,
        0, 150, 30,
        30, 0, 30,
        30, 150, 30,
        // top rung back
        30, 0, 30,
        100, 0, 30,
        30, 30, 30,
        30, 30, 30,
        100, 0, 30,
        100, 30, 30,
        // middle rung back
        30, 60, 30,
        67, 60, 30,
        30, 90, 30,
        30, 90, 30,
        67, 60, 30,
        67, 90, 30,
        // top
        0, 0, 0,
        100, 0, 0,
        100, 0, 30,
        0, 0, 0,
        100, 0, 30,
        0, 0, 30,
        // top rung right
        100, 0, 0,
        100, 30, 0,
        100, 30, 30,
        100, 0, 0,
        100, 30, 30,
        100, 0, 30,
        // under top rung
        30, 30, 0,
        30, 30, 30,
        100, 30, 30,
        30, 30, 0,
        100, 30, 30,
        100, 30, 0,
        // between top rung and middle
        30, 30, 0,
        30, 30, 30,
        30, 60, 30,
        30, 30, 0,
        30, 60, 30,
        30, 60, 0,
        // top of middle rung
        30, 60, 0,
        30, 60, 30,
        67, 60, 30,
        30, 60, 0,
        67, 60, 30,
        67, 60, 0,
        // right of middle rung
        67, 60, 0,
        67, 60, 30,
        67, 90, 30,
        67, 60, 0,
        67, 90, 30,
        67, 90, 0,
        // bottom of middle rung.
        30, 90, 0,
        30, 90, 30,
        67, 90, 30,
        30, 90, 0,
        67, 90, 30,
        67, 90, 0,
        // right of bottom
        30, 90, 0,
        30, 90, 30,
        30, 150, 30,
        30, 90, 0,
        30, 150, 30,
        30, 150, 0,
        // bottom
        0, 150, 0,
        0, 150, 30,
        30, 150, 30,
        0, 150, 0,
        30, 150, 30,
        30, 150, 0,
        // left side
        0, 0, 0,
        0, 0, 30,
        0, 150, 30,
        0, 0, 0,
        0, 150, 30,
        0, 150, 0,
    ]), gl.STATIC_DRAW);
}
// function planeArray(length: number, height: number, width: number): Array<number> {
//     let cubeTris = [];
//     var z_axis = [0, 0, 1];
//     var l = length;
//     var h = height;
//     var w = width;
//     var m = mat4.create();
//     var cross_axis = vec3.create();
//     vec3.cross(cross_axis, planarAxis, x_axis);
//     mat4.rotate(m, m, vec3.angle(x_axis, planarAxis), cross_axis);
//     mat4.translate(m, m, [-l / 2, -h / 2, -l / 2]);
//     var p = vec3.create();
//     vec3.transformMat4(p, [0, 0, 0], m);
//     //First Triangle
//     //mat4.scale(m, m, [2, 2, 0]);
//     var rot_center = vec3.create();
//     var m_rot = mat4.clone(m);
//     mat4.translate(m_rot, m_rot, [-50, -50, 0]);
//     vec3.transformMat4(rot_center, [0, 0, 0], m);
//     var rotCenter = rot_center;
//     cubeTris.push(p[0], p[1], p[2]);
//     cubeTris.push(p[0], p[1] + h, p[2]);
//     cubeTris.push(p[0] + l, p[1], p[2]);
//     mat4.translate(m, m, [50, 50, 0]);
//     mat4.rotate(m, m, -Math.PI / 2, cross_axis);
//     vec3.transformMat4(p, rotCenter, m);
//     cubeTris.push(p[0], p[1], p[2]);
//     mat4.translate(m, m, [0, h, 0]);
//     vec3.transformMat4(p, rotCenter, m);
//     cubeTris.push(p[0], p[1], p[2]);
//     mat4.translate(m, m, [l, 0, 0]);
//     vec3.transformMat4(p, rotCenter, m);
//     cubeTris.push(p[0], p[1], p[2]);
//     return cubeTris;
// }
export { gl, glcanvas, initializeShader, drawScene };
//# sourceMappingURL=webgl.js.map