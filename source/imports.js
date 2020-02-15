//import * as glMatrix from 'gl-matrix';
import * as glMatrix from './gl-matrix-min.js';
const vec2 = glMatrix.vec3;
const vec3 = glMatrix.vec3;
const vec4 = glMatrix.vec4;
const mat4 = glMatrix.mat4;
const glcanvas = document.getElementById('glcanvas');
const txcanvas = document.getElementById('txcanvas');
const gl = glcanvas.getContext('webgl2');
const ct = txcanvas.getContext('2d');
export { gl, glMatrix, vec2, vec3, vec4, mat4, ct, glcanvas };
//# sourceMappingURL=imports.js.map