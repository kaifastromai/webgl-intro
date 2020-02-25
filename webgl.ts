import { Shader } from "./shader_utils";
import { resize_canvas, z_axis } from "./utils";
import { mat4, vec3 } from "gl-matrix";
const glcanvas = <HTMLCanvasElement>document.getElementById('glcanvas');
const gl = glcanvas.getContext('webgl2');
if (!gl)
    throw "WebGL2 is not supported on this browser!";
let shader: Shader = new Shader();
resize_canvas(glcanvas);
//var color = [Math.random(), Math.random(), Math.random(), 1];
var vao = gl.createVertexArray();
gl.bindVertexArray(vao);
//gl.enable(gl.CULL_FACE);
gl.enable(gl.DEPTH_TEST);
var then = 0;

async function initializeShader() {
    await shader.initializeShaderText('./shaders/shader.vert', './shaders/shader.frag');
    shader.createProgram();
    then = 0;

}
var rotAngle = 0;
function drawScene(now: number) {

    //compute frameDelta
    now /= 1000;
    var frameDelta = now - then;
    then = now;
    rotAngle += frameDelta * 2 * Math.PI;
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
    gl.bindBuffer(gl.ARRAY_BUFFER, shader.positionBuffer);
    var ch = glcanvas.clientHeight;
    var cw = glcanvas.clientWidth;
    var p_m = mat4.create();
    var model_view = mat4.create();
    mat4.lookAt(model_view, vec3.fromValues(200, 200, 200), vec3.fromValues(0, 0, 0), z_axis);
    mat4.perspective(p_m, Math.PI / 8, cw / ch, 4, 400);
    //Compute matrices
    //Translation matrix
    var central_pivot = mat4.create();
    mat4.translate(central_pivot, central_pivot, [-150 / 2, -50, -15]);
    var m = mat4.create();
    //mat4.translate(model_view, model_view, translate);
    mat4.rotate(model_view, model_view, rotAngle, [0, 0, 1]);
    console.log(frameDelta);
    //mat4.scale(model_view, model_view, scale);
    mat4.multiply(m, p_m, model_view);
    mat4.multiply(m, m, central_pivot);
    gl.uniformMatrix4fv(shader.uniforms.matrixLocation, false, m);
    gl.uniform4f(shader.uniforms.colorLocation, 1, 1, 1, 1);
    gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);

    console.log(gl.getError());
    requestAnimationFrame(drawScene);

}


//Create an 'F' from triangles
function createGeo() {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            // left column front
            0, 0, 0,
            0, 150, 0,
            30, 0, 0,
            0, 150, 0,
            30, 150, 0,
            30, 0, 0,

            // top rung front
            30, 0, 0,
            30, 30, 0,
            100, 0, 0,
            30, 30, 0,
            100, 30, 0,
            100, 0, 0,

            // middle rung front
            30, 60, 0,
            30, 90, 0,
            67, 60, 0,
            30, 90, 0,
            67, 90, 0,
            67, 60, 0,

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
            30, 60, 30,
            30, 30, 30,
            30, 30, 0,
            30, 60, 0,
            30, 60, 30,

            // top of middle rung
            30, 60, 0,
            67, 60, 30,
            30, 60, 30,
            30, 60, 0,
            67, 60, 0,
            67, 60, 30,

            // right of middle rung
            67, 60, 0,
            67, 90, 30,
            67, 60, 30,
            67, 60, 0,
            67, 90, 0,
            67, 90, 30,

            // bottom of middle rung.
            30, 90, 0,
            30, 90, 30,
            67, 90, 30,
            30, 90, 0,
            67, 90, 30,
            67, 90, 0,

            // right of bottom
            30, 90, 0,
            30, 150, 30,
            30, 90, 30,
            30, 90, 0,
            30, 150, 0,
            30, 150, 30,

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
        ]),
        gl.STATIC_DRAW);
}

function setColors() {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Uint8Array([
            // left column front
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,

            // top rung front
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,

            // middle rung front
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,

            // left column back
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,

            // top rung back
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,

            // middle rung back
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,

            // top
            70, 200, 210,
            70, 200, 210,
            70, 200, 210,
            70, 200, 210,
            70, 200, 210,
            70, 200, 210,

            // top rung right
            200, 200, 70,
            200, 200, 70,
            200, 200, 70,
            200, 200, 70,
            200, 200, 70,
            200, 200, 70,

            // under top rung
            210, 100, 70,
            210, 100, 70,
            210, 100, 70,
            210, 100, 70,
            210, 100, 70,
            210, 100, 70,

            // between top rung and middle
            210, 160, 70,
            210, 160, 70,
            210, 160, 70,
            210, 160, 70,
            210, 160, 70,
            210, 160, 70,

            // top of middle rung
            70, 180, 210,
            70, 180, 210,
            70, 180, 210,
            70, 180, 210,
            70, 180, 210,
            70, 180, 210,

            // right of middle rung
            100, 70, 210,
            100, 70, 210,
            100, 70, 210,
            100, 70, 210,
            100, 70, 210,
            100, 70, 210,

            // bottom of middle rung.
            76, 210, 100,
            76, 210, 100,
            76, 210, 100,
            76, 210, 100,
            76, 210, 100,
            76, 210, 100,

            // right of bottom
            140, 210, 80,
            140, 210, 80,
            140, 210, 80,
            140, 210, 80,
            140, 210, 80,
            140, 210, 80,

            // bottom
            90, 130, 110,
            90, 130, 110,
            90, 130, 110,
            90, 130, 110,
            90, 130, 110,
            90, 130, 110,

            // left side
            150, 0, 150,
            150, 0, 0,
            150, 0, 150,
            150, 0, 150,
            150, 0, 150,
            0, 0, 150,
        ]),
        gl.STATIC_DRAW);
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
export { gl, glcanvas, initializeShader, drawScene, createGeo, setColors };