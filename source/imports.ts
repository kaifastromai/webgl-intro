//import * as glMatrix from 'gl-matrix';
import * as glMatrix from './gl-matrix/gl-matrix.js';
var glm = glMatrix;
const vec2 = glm.vec2;
const vec3 = glm.vec3;
const vec4 = glm.vec4;
const mat4 = glm.mat4;
const glcanvas = <HTMLCanvasElement>document.getElementById('glcanvas');
const txcanvas = <HTMLCanvasElement>document.getElementById('txcanvas');
const gl = glcanvas.getContext('webgl2');
const ct = txcanvas.getContext('2d');

export { gl, glm, glMatrix, vec2, vec3, vec4, mat4, ct, glcanvas };