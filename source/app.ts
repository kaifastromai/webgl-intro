
import {
    ct, gl, glcanvas, mat4, vec3, vec4, vec2, glMatrix,
} from './imports.js';
import { radiansToDegrees, degreesToRadians } from './utilities.js';
import './shader_utils.js';
import { Axes } from './axes.js';
import { Square } from './square.js';
import { InitializeIndexedColorShader, InitializeSolidColorShader } from './shader_utils.js';
//Server init

//Globals
const near_plane: number = 1;
const far_plane: number = 100;
let wireframe = false;

var x_axis = glMatrix.vec3.fromValues(1, 0, 0);
var y_axis = glMatrix.vec3.fromValues(0, 1, 0);
var z_axis = glMatrix.vec3.fromValues(0, 0, 1);

// Methods


function DrawScene(now: number) {
    now /= 1000;
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, glcanvas.clientWidth, glcanvas.clientHeight);
    gl.enable(gl.DEPTH_TEST);
    const P = mat4.create();
    const V = mat4.create();

    mat4.perspective(P, radiansToDegrees(40.0),
        glcanvas.clientWidth / glcanvas.clientHeight,
        near_plane, far_plane);
    // The eye is located to the right of the spiral and our direction of gaze is shifted forward in Z to
    // keep the spiral more centered in the screen. Up is up.
    mat4.lookAt(V, vec3.fromValues(5, 0, 40), vec3.fromValues(0, 0, 25), vec3.fromValues(0, 1, 0));

    for (let i = 0; i < 16; i++) {
        let offset = Math.PI * i / 4;
        let M = mat4.create();
        // The radius of the spiral is 3.
        // Rotation rate of the spiral is once every 2 seconds. Use of Math.PI is needed
        // because we're calculating in Radians directly unlike below where we are
        // calculating in degrees and converting to Radians.
        let x = 3 * Math.cos(Math.PI * now + offset / 2);
        let y = 3 * Math.sin(Math.PI * now + offset / 2);
        mat4.translate(M, M, vec3.fromValues(x, y, 0));
        //Each successive square is closer.
        mat4.translate(M, M, vec3.fromValues(0, 0, i * 2));
        mat4.rotate(M, M, degreesToRadians(offset * 32), z_axis);
        square.Draw(!wireframe, M, V, P);
        axes.Draw(M, V, P);
    }
    requestAnimationFrame(DrawScene);
}

function InitCT() {
    ct.textAlign = 'left';
    ct.textBaseline = 'bottom';
    ct.clearRect(0, 0, ct.canvas.width, ct.canvas.height);
    ct.font = '32px Helvetica';
    ct.fillStyle = '#F0F0F0';
    ct.fillText('Demonstrate roles of M, V and P', 20, 50);
}
function ProjectText(P: number[], mvp: glMatrix.mat4, ctx: CanvasRenderingContext2D, text: string) {
    let p = vec4.clone(P);
    vec4.transformMat4(p, p, mvp);
    p[0] /= p[3];
    p[1] /= p[3];
    let c = vec2.fromValues((p[0] * 0.5 + 0.5) * gl.canvas.width, (-p[1] * 0.5 + 0.5) * gl.canvas.height);
    ctx.fillText(text, c[0], c[1]);


}
document.addEventListener('keydown', (event) => {
    if (event.key == 'w') {
        wireframe = !wireframe;
    }
});

function RunApp() {
    console.log('It works');
}

InitCT();
InitializeIndexedColorShader();
InitializeSolidColorShader();
requestAnimationFrame(DrawScene);

const axes = new Axes();
const square = new Square();

export { DrawScene,RunApp };

