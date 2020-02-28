import { vec3 } from "gl-matrix";

const x_axis = vec3.fromValues(1, 0, 0);
const y_axis = vec3.fromValues(0, 1, 0);
const z_axis = vec3.fromValues(0, 0, 1);
interface IShader {
    vrtx: string,
    frag: string,
}
function radiansToDegrees(angle_in_degrees: number): number {
    return angle_in_degrees * (Math.PI / 180);
}
function degreesToRadians(angle_in_radians: number): number {
    return angle_in_radians / Math.PI * 180;
}

async function loadFileAsync(path: string): Promise<string> {
    let res = await fetch(path);
    return await res.text();
}
async function loadShader(frag_url: string, vrtx_url: string): Promise<IShader> {

    let shader: IShader;
    shader.vrtx = await loadFileAsync(vrtx_url);
    shader.frag = await loadFileAsync(frag_url);
    return shader;
}

function resize_canvas(canvas: HTMLCanvasElement) {
    var cssToRealPixels = 1;
    var displayWidth = Math.floor(canvas.clientWidth * cssToRealPixels);
    var displayHeight = Math.floor(canvas.clientHeight * cssToRealPixels);
    if (canvas.width != displayWidth ||
        canvas.height != displayHeight) {

        canvas.width = displayWidth;
        canvas.height = displayHeight;

    }
}

export { degreesToRadians, radiansToDegrees, loadFileAsync, loadShader, IShader, x_axis, y_axis, z_axis, resize_canvas };
