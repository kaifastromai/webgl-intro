import { vec3 } from "gl-matrix";
declare const x_axis: vec3;
declare const y_axis: vec3;
declare const z_axis: vec3;
declare global {
}
declare global {
    interface Number {
        method(): String;
    }
}
interface IShader {
    vrtx: string;
    frag: string;
}
declare function radiansToDegrees(angle_in_degrees: number): number;
declare function degreesToRadians(angle_in_radians: number): number;
declare function loadFileAsync(path: string): Promise<string>;
declare function loadShader(frag_url: string, vrtx_url: string): Promise<IShader>;
declare function resize_canvas(canvas: HTMLCanvasElement): void;
declare function loadJSON(path: string): Promise<any>;
declare function linesFromTrisIndicies(tris_indicies: Array<number>): Array<number>;
declare function vec3FromArray(ar: Array<number>): vec3;
export { degreesToRadians, radiansToDegrees, loadFileAsync, loadShader, IShader, x_axis, y_axis, z_axis, resize_canvas, loadJSON, linesFromTrisIndicies, vec3FromArray };
