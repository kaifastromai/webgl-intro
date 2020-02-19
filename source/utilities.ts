function radiansToDegrees(angle_in_degrees: number): number {
    return angle_in_degrees * (Math.PI / 180);
}
function degreesToRadians(angle_in_radians: number): number {
    return angle_in_radians / Math.PI * 180;
}
interface IRequestCallback {
    (error: string, response: string): void;
}
async function loadFileAsync(path: string): Promise<string> {
    let res = await fetch(path);
    return await res.text();
}
export { degreesToRadians, radiansToDegrees, loadFileAsync, IRequestCallback };