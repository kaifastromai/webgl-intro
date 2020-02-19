declare function radiansToDegrees(angle_in_degrees: number): number;
declare function degreesToRadians(angle_in_radians: number): number;
interface IRequestCallback {
    (error: string, response: string): void;
}
declare function loadFileAsync(path: string): Promise<string>;
export { degreesToRadians, radiansToDegrees, loadFileAsync, IRequestCallback };
