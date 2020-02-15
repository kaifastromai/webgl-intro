declare function radiansToDegrees(angle_in_degrees: number): number;
declare function degreesToRadians(angle_in_radians: number): number;
interface IRequestCallback {
    (error: string, response: string): void;
}
declare var loadTextResource: (url: string, callback: IRequestCallback) => void;
export { degreesToRadians, radiansToDegrees, loadTextResource, IRequestCallback };
