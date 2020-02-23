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
export { degreesToRadians, radiansToDegrees, loadFileAsync, loadShader, x_axis, y_axis, z_axis, resize_canvas };
//# sourceMappingURL=utils.js.map