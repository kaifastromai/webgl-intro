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
export { degreesToRadians, radiansToDegrees, loadFileAsync };
//# sourceMappingURL=utilities.js.map