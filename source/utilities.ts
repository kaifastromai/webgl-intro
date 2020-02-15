function radiansToDegrees(angle_in_degrees: number): number {
    return angle_in_degrees * (Math.PI / 180);
}
function degreesToRadians(angle_in_radians: number): number {
    return angle_in_radians / Math.PI * 180;
}
interface IRequestCallback {
    (error: string, response: string): void;
}
var loadTextResource = function (url: string, callback: IRequestCallback) {
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onload = function (): void {
        if (req.status < 200 || req.status > 299) {
            callback('Erro: HTTP Status' + req.status + 'on resource' + url, null);
        } else {
            callback(null, req.responseText);
        }
    };
    req.send();
};

export { degreesToRadians, radiansToDegrees, loadTextResource, IRequestCallback };