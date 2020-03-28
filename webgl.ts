import { Shader } from "./shader_utils";
import { resize_canvas } from "./utils";
import { mat4, vec4, quat } from "gl-matrix";
import { disc, wireframe, scale } from "./app";
import * as CANNON from 'cannon'

var world = new CANNON.World();
world.gravity.set(0, -9.81, 0);

var boxBody = new CANNON.Body({ mass: 5, position: new CANNON.Vec3(0, 0, 0), shape: new CANNON.Box(new CANNON.Vec3(5, 5, 4)) });
world.addBody(boxBody);

var orientation = new CANNON.Quaternion();
orientation.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI / 2);
var groundBody = new CANNON.Body({
    mass: 0, position: new CANNON.Vec3(0, -10, 0)
})
var groundShape = new CANNON.Plane()
groundBody.addShape(groundShape);
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(groundBody);

var fixedTimeStep = 1.0 / 60.0;

var maxSubSteps = 3;


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
    world.step(fixedTimeStep, frameDelta, maxSubSteps);
    console.log("Box position: " + boxBody.position);
    //Tells gl how to convert from clip-space to pixels
    gl.viewport(0, 0, glcanvas.width, glcanvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.frontFace(gl.CW);
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
    let q = quat.create();
    mat4.perspective(p, Math.PI / 3, cw / ch, 1, 2000);
    mat4.lookAt(v, [3 * scale, 3 * scale, 3 * scale], [0, 0, 0], [0, 1, 0]);

    quat.rotateY(q, q, rotAngle / 4);
    //mat4.rotateY(m, m, rotAngle / 4);
    let rot = mat4.create();
    mat4.fromQuat(rot, q);
    mat4.translate(m, m, [boxBody.position.x, boxBody.position.y, boxBody.position.z]);
    mat4.multiply(m, m, rot);
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