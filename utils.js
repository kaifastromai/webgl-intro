import { vec3 } from "gl-matrix";
const x_axis = vec3.fromValues(1, 0, 0);
const y_axis = vec3.fromValues(0, 1, 0);
const z_axis = vec3.fromValues(0, 0, 1);
function radiansToDegrees(angle_in_degrees) {
    return angle_in_degrees * (Math.PI / 180);
}
function degreesToRadians(angle_in_radians) {
    return angle_in_radians / Math.PI * 180;
}
async function loadFileAsync(path) {
    let res = await fetch(path);
    return await res.text();
}
async function loadShader(frag_url, vrtx_url) {
    let shader;
    shader.vrtx = await loadFileAsync(vrtx_url);
    shader.frag = await loadFileAsync(frag_url);
    return shader;
}
function resize_canvas(canvas) {
    var cssToRealPixels = 1;
    var displayWidth = Math.floor(canvas.clientWidth * cssToRealPixels);
    var displayHeight = Math.floor(canvas.clientHeight * cssToRealPixels);
    if (canvas.width != displayWidth ||
        canvas.height != displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}
async function loadJSON(path) {
    let res = await loadFileAsync(path);
    return JSON.parse(res);
}
function linesFromTrisIndicies(tris_indicies) {
    let ls_indicies = [];
    for (let i = 0; i < tris_indicies.length / 3; i++) {
        // i is a triangle index. index_vn are indexies of vertexes withing triangles.
        let index_v0 = tris_indicies[i * 3 + 0];
        let index_v1 = tris_indicies[i * 3 + 1];
        let index_v2 = tris_indicies[i * 3 + 2];
        // Make the line segments for drawing outlines.
        ls_indicies.push(index_v0);
        ls_indicies.push(index_v1);
        ls_indicies.push(index_v1);
        ls_indicies.push(index_v2);
        ls_indicies.push(index_v2);
        ls_indicies.push(index_v0);
    }
    return ls_indicies;
}
function vec3FromArray(ar) {
    let out_vec;
    if (ar.length < 3) {
        throw "Too few arguments";
    }
    else {
        out_vec = vec3.fromValues(ar[0], ar[1], ar[2]);
        return out_vec;
    }
}
export { degreesToRadians, radiansToDegrees, loadFileAsync, loadShader, x_axis, y_axis, z_axis, resize_canvas, loadJSON, linesFromTrisIndicies, vec3FromArray };
//# sourceMappingURL=utils.js.map