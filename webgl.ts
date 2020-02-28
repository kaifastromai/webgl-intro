import { Shader } from "./shader_utils";
import { resize_canvas, z_axis, y_axis } from "./utils";
import { mat4, vec3 } from "gl-matrix";
import { NumberVertices, tx } from "./app";
import { format } from "url";
const PI = Math.PI;
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
var disk_array: Array<vec3> = [];
var stacks = 8;
var slices = 80;
var tris: Array<number> = [];
var render_array: Array<number> = [];
var temp_array: Array<number> = [];
var lines_array: Array<number> = [];

function drawScene(now: number) {

    //compute frameDelta
    now /= 1000;
    var frameDelta = now - then;
    then = now;
    rotAngle += frameDelta * Math.PI / 2;
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
    mat4.translate(model_view, model_view, [0, -5 / 2, 0]);
    mat4.lookAt(model_view, vec3.fromValues(5, 5, 10), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));
    mat4.perspective(p_m, Math.PI / 3, cw / ch, 4, 400);
    //Compute matrices
    //Translation matrix
    var central_pivot = mat4.create();
    var m = mat4.create();
    mat4.rotate(model_view, model_view, rotAngle, [0, 1, 0]);
    //console.log(frameDelta);
    //mat4.scale(model_view, model_view, scale);
    mat4.multiply(m, p_m, model_view);
    mat4.multiply(m, m, central_pivot);
    gl.uniformMatrix4fv(shader.uniforms.matrixLocation, false, m);
    gl.uniform4f(shader.uniforms.colorLocation, 1, 1, 1, 1);
    //gl.drawArrays(gl.TRIANGLES, 0, tris.length / 3);
    //gl.drawArrays(gl.TRIANGLES, 0, render_array.length / 3);
    gl.drawArrays(gl.LINES, 0, lines_array.length / 3);
    //NumberVertices(m, tris, tx);
    //console.log(gl.getError());
    requestAnimationFrame(drawScene);
}
//Create an 'F' from triangles
function createGeo() {
    var ir = 3;
    var or = 3;
    var ic = vec3.fromValues(0, 0, 0);
    var oc = vec3.fromValues(0, 0, 5);
    var theta = 2 * PI;
    /**@param{float} dr the difference between outer and inner radius**/
    for (let i = 0; i < slices; i++) {
        var x = Math.cos(i * theta / (slices - 1));
        var y = Math.sin(i * theta / (slices - 1));

        //disk_array = [].concat(disk_array, quad(10, 10, [radius * Math.cos(i * 2 * PI / (slices - 2)), radius * Math.sin(i * 2 * PI / (slices - 2)), 0]));
        for (let stck_c = 0; stck_c < stacks; stck_c++) {
            var prcnt = (stck_c / stacks);
            var rad = ir * (1 - prcnt) + or * prcnt;
            var lerp_vec = vec3.create();
            vec3.add(lerp_vec, vec3.lerp(lerp_vec, ic, oc, prcnt),
                vec3.fromValues(rad * x, rad * y, 0));
            disk_array = [].concat(disk_array, lerp_vec);
            temp_array = [].concat(temp_array, ...lerp_vec);

        }
    }
    trisFromQuad(disk_array);
    linesFromQuad(disk_array);
    render_array = lines_array;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(render_array), gl.STATIC_DRAW);
}
function trisFromQuad(quads: Array<vec3>) {
    for (let slc_c = 0; slc_c < slices - 1; slc_c++) {
        for (let stck_c = 0; stck_c < stacks - 1; stck_c++) {
            var slc_fctr = slc_c * stacks;
            tris = [].concat(tris, ...quads[stacks - 1 - stck_c + slc_fctr]);
            tris = [].concat(tris, ...quads[stacks - 2 - stck_c + slc_fctr]);
            tris = [].concat(tris, ...quads[stacks + stacks - 2 - stck_c + slc_fctr]);
            tris = [].concat(tris, ...quads[stacks + stacks - 2 - stck_c + slc_fctr]);
            tris = [].concat(tris, ...quads[stacks + stacks - 1 - stck_c + slc_fctr]);
            tris = [].concat(tris, ...quads[stacks - 1 - stck_c + slc_fctr]);

        }
    }
}
function linesFromQuad(quads: Array<vec3>) {
    //Stack factor
    let sf = stacks - 2;
    for (let slc_c = 0; slc_c < slices - 1; slc_c++) {
        var slc_fctr = slc_c * stacks;
        for (let stck_c = 0; stck_c < stacks - 1; stck_c++) {
            //First line
            lines_array = [].concat(lines_array, ...quads[stacks - 1 - stck_c + slc_fctr]);
            lines_array = [].concat(lines_array, ...quads[stacks - 2 - stck_c + slc_fctr]);
            //Second line
            lines_array = [].concat(lines_array, ...quads[stacks - 2 - stck_c + slc_fctr]);
            lines_array = [].concat(lines_array, ...quads[stacks + stacks - 2 - stck_c + slc_fctr]);
            //Third line
            lines_array = [].concat(lines_array, ...quads[stacks + stacks - 2 - stck_c + slc_fctr]);
            lines_array = [].concat(lines_array, ...quads[stacks + stacks - 1 - stck_c + slc_fctr]);
            //Fourth Line
            lines_array = [].concat(lines_array, ...quads[stacks + stacks - 1 - stck_c + slc_fctr]);
            lines_array = [].concat(lines_array, ...quads[stacks - 1 - stck_c + slc_fctr]);
            //Fifth Line
            lines_array = [].concat(lines_array, ...quads[stacks - 1 - stck_c + slc_fctr]);
            lines_array = [].concat(lines_array, ...quads[stacks + stacks - 2 - stck_c + slc_fctr]);

        }
    }
}
function setColors() {
    var verts: number = render_array.length;

    var color_array: Array<number> = [];
    for (let i = 0; i < verts; i++) {
        var cf = 1;//(i / (verts));
        color_array.push(
            // left column front
            255 * cf, 255 * cf, 250,
            255 * cf, 255 * cf, 250,
            255 * cf, 255 * cf, 250,
            120 * cf, 255 * cf, 255,
            120 * cf, 255 * cf, 255,
        );
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(color_array), gl.STATIC_DRAW);
}
function setColorsLns() {
    var verts: number = disk_array.length;

    var color_array: Array<number> = [];
    for (let i = 0; i < verts; i++) {
        var cf = 1;//(i / (verts))
        color_array.push(
            // left column front
            255 * cf, 255 * cf, 255,
            255 * cf, 255 * cf, 255,
            255 * cf, 255 * cf, 255,
            255 * cf, 255 * cf, 255,
            255 * cf, 255 * cf, 255,
            255 * cf, 255 * cf, 255,
        );
    }
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Uint8Array(color_array),
        gl.STATIC_DRAW);
}
export { gl, glcanvas, initializeShader, drawScene, createGeo, setColors, setColorsLns };