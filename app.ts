import { drawScene, glcanvas, gl } from "./webgl";
import { vec4, mat4, vec2, vec3 } from "gl-matrix";
import { Disc } from "./disc";
var disc = new Disc(12, 5, 0.001, 5);
var disc2 = new Disc(12, 5, 2, 3, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0));
var disc3 = new Disc(15, 5, 5, 5, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 4));
var disc4 = new Disc(15, 5, 1, 5, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 4), 270);
disc.slices = 60;
disc.regenMesh();

var wireframe: boolean = true;
disc.inner_radius = 1;
disc.outer_radius = 4;
var c_m = 0;
document.addEventListener('keydown', function (event) {
    if (event.key == 'w') {
        wireframe = !wireframe;
    }
    else if (event.key == 'm')
        if (c_m < 3)
            c_m++;
        else
            c_m = 0;
});


async function main() {
    await disc.initialize();
    await disc2.initialize();
    await disc3.initialize();
    await disc4.initialize();
    console.log(disc.shader.program);
    requestAnimationFrame(drawScene);

}
main();
function createSlider(div: HTMLDivElement, name: string, default_val: number, max: number, min: number, step: number): HTMLInputElement {
    var n_div = document.createElement("div");
    var title = document.createElement('b');
    title.innerText = name;
    var theta_sldr = document.createElement("input");
    theta_sldr.type = "range";
    theta_sldr.max = max.toString();
    theta_sldr.min = min.toString();
    theta_sldr.value = default_val.toString();
    theta_sldr.step = step.toString();
    n_div.appendChild(title);
    n_div.appendChild(theta_sldr);
    div.appendChild(n_div);
    return theta_sldr;
}
var then = 0;
// function update(): void {
//     var theta = Number(theta_sldr.value);
//     drawScene(theta, vec3.fromValues(
//         Number(size_x_sldr.value) * 0.1, Number(size_y_sldr.value) * 0.1, 0.1), vec3.fromValues(
//             Number(pos_x_slider.value),
//             Number(pos_y_slider.value),
//             Number(pos_z_slider.value)));
// }
function old_stuff() {
    var txcanvas = <HTMLCanvasElement>document.getElementById('txcanvas');
    txcanvas.width = txcanvas.clientWidth;
    txcanvas.height = txcanvas.clientHeight;
    var tx = txcanvas.getContext('2d');
    tx.font = "40px Arial";
    tx.fillText("WebGl Intro", 0, 0);
    var slider_div = <HTMLDivElement>document.getElementById("slider_container");
    var theta_sldr = createSlider(slider_div, "Rotation Speed(rad/s): ", 0, 2 * Math.PI, 0, 0.001);
    var size_x_sldr = createSlider(slider_div, "SizeX: ", 1, 10, -10, 0.001);
    var size_y_sldr = createSlider(slider_div, "SizeY: ", 1, 10, -10, 0.001);
    var pos_x_slider = createSlider(slider_div, "PosX: ", 0, glcanvas.width / 2, 0, 0.01);
    var pos_y_slider = createSlider(slider_div, "PosY: ", 0, glcanvas.height / 2, 0, 0.01);
    var pos_z_slider = createSlider(slider_div, "PosZ: ", 0, 100, -100, 0.01);
}

function NumberVertices(mvp: mat4, v: Array<number>, ctx: CanvasRenderingContext2D) {
    let num_vertices = v.length / 3;
    for (let vertex_index = 0; vertex_index < num_vertices; vertex_index++) {
        let offset = vertex_index * 3;
        let p = vec4.fromValues(v[offset], v[offset + 1], v[offset + 2], 1);
        ProjectText(p, mvp, ctx, String(vertex_index));
    }
}

/*	ProjectText()
*	
*	Given a point in modeling coordinates and an MVP, compute the screen space
*	coordinate where that point will be after  projection through  the viewing
*	pipeline. 'p' is produced in "normalized device coordinates" which must be
*	converted to window coordinates by the method computing 'c'.
*/
function ProjectText(P: vec4, mvp: mat4, ctx: CanvasRenderingContext2D, text: string) {
    let p = vec4.clone(P);
    vec4.transformMat4(p, p, mvp);
    p[0] /= p[3];
    p[1] /= p[3];
    let c = vec2.fromValues((p[0] * 0.5 + 0.5) * gl.canvas.width, (p[1] * -0.5 + 0.5) * gl.canvas.height);
    ctx.fillText(text, c[0], c[1]);
}
export { then, NumberVertices, disc, wireframe, disc2, disc3, disc4, c_m };
