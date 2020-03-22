import { Shader } from "./shader_utils";
import { resize_canvas, z_axis, y_axis } from "./utils";
import { mat4, vec3, vec4 } from "gl-matrix";
import { disc, wireframe, disc2, disc3, disc4, c_m } from "./app";
const glcanvas = <HTMLCanvasElement>document.getElementById('glcanvas');
const gl = glcanvas.getContext('webgl2');
if (!gl)
    throw "WebGL2 is not supported on this browser!";
let shader: Shader = new Shader();
resize_canvas(glcanvas);
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
    rotAngle += frameDelta * Math.PI / 2;
    resize_canvas(glcanvas);
    //Tells gl how to convert from clip-space to pixels
    gl.viewport(0, 0, glcanvas.width, glcanvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.frontFace(gl.CCW);
    //gl.enable(gl.CULL_FACE)
    //Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    //Clear color and depth buffer 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var ch = glcanvas.clientHeight;
    var cw = glcanvas.clientWidth;
    /**@param m_p the projection matrix */
    let p = mat4.create();
    /**@param v_m the view matrix */
    let v = mat4.create();
    /**@param m_m the model matrix */
    let m = mat4.create();
    /**@param m_v the model view matrix */
    let m_v = mat4.create();
    /**@param m_v_p the model view projection matrix*/
    let m_v_p = mat4.create();
    mat4.perspective(p, 2 * Math.PI / 3, cw / ch, 1, 2000);
    mat4.lookAt(v, [7, 7, 7], [0, 0, 0], [0, 1, 0]);

    mat4.rotateY(m, m, rotAngle / 4);
    // mat4.rotateX(m, m, Math.PI / 4);
    // mat4.rotateZ(m, m, Math.PI / 4);
    mat4.multiply(m_v, v, m);
    mat4.multiply(m_v_p, p, m_v);

    if (wireframe) {
        disc.Draw('lines', vec4.fromValues(0.2, 1, 1, 1), p, m_v);
    }

    disc.Draw('solid', vec4.fromValues(0.2, 1, 1, 1), p, m_v);


    requestAnimationFrame(drawScene);
}
export { gl, glcanvas, initializeShader, drawScene };