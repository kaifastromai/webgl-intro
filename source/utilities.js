function radiansToDegrees(angle_in_degrees) {
    return angle_in_degrees * (Math.PI / 180);
}
function degreesToRadians(angle_in_radians) {
    return angle_in_radians / Math.PI * 180;
}
var loadTextResource = function (url, callback) {
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onload = function () {
        if (req.status < 200 || req.status > 299) {
            callback('Erro: HTTP Status' + req.status + 'on resource' + url, null);
        }
        else {
            callback(null, req.responseText);
        }
    };
    req.send();
};
export { degreesToRadians, radiansToDegrees, loadTextResource };
//# sourceMappingURL=utilities.js.map