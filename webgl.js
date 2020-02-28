import { Shader } from "./shader_utils";
import { resize_canvas } from "./utils";
import { mat4, vec3, vec4 } from "gl-matrix";
import { disc, wireframe, disc2, disc3, disc4, c_m } from "./app";
const glcanvas = document.getElementById('glcanvas');
const gl = glcanvas.getContext('webgl2');
if (!gl)
    throw "WebGL2 is not supported on this browser!";
let shader = new Shader();
resize_canvas(glcanvas);
var vao = gl.createVertexArray();
gl.bindVertexArray(vao);
gl.enable(gl.CULL_FACE);
gl.enable(gl.DEPTH_TEST);
var then = 0;
async function initializeShader() {
    await shader.initializeShaderText('./shaders/shader.vert', './shaders/shader.frag');
    shader.createProgram();
    then = 0;
}
var rotAngle = 0;
function drawScene(now) {
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
    //Clear color and depth buffer 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var ch = glcanvas.clientHeight;
    var cw = glcanvas.clientWidth;
    var p_m = mat4.create();
    var model_view = mat4.create();
    mat4.lookAt(model_view, vec3.fromValues(5, 5, 5), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));
    mat4.perspective(p_m, Math.PI / 2, cw / ch, 4, 1000);
    var m = mat4.create();
    mat4.rotate(model_view, model_view, rotAngle, [0, 1, 0]);
    mat4.scale(model_view, model_view, [0.75, 0.75, 0.75]);
    mat4.multiply(m, p_m, model_view);
    switch (c_m) {
        case 0:
            disc.Draw((() => {
                if (wireframe)
                    return 'lines';
                else
                    return 'solid';
            })(), vec4.fromValues(1, 1, 1, 0.5), m);
            break;
        case 1:
            disc2.Draw((() => {
                if (wireframe)
                    return 'lines';
                else
                    return 'solid';
            })(), vec4.fromValues(1, 1, 1, 0.5), m);
            break;
        case 2:
            disc3.Draw((() => {
                if (wireframe)
                    return 'lines';
                else
                    return 'solid';
            })(), vec4.fromValues(1, 1, 1, 0.5), m);
            break;
        case 3:
            disc4.Draw((() => {
                if (wireframe)
                    return 'lines';
                else
                    return 'solid';
            })(), vec4.fromValues(1, 1, 1, 0.5), m);
            break;
        default:
            break;
    }
    requestAnimationFrame(drawScene);
}
export { gl, glcanvas, initializeShader, drawScene };
//# sourceMappingURL=webgl.js.map