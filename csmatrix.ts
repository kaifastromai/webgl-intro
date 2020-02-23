import { mat3 } from "gl-matrix";

function createScale2D(sx: number, sy: number): mat3 {

    return mat3.fromValues(
        sx, 0, 0,
        0, sy, 0,
        0, 0, 1
    );
}
//Returns transformation matrix translate by tx and ty
function createTranslation2D(tx: number, ty: number): mat3 {
    return mat3.fromValues(
        1, 0, 0,
        0, 1, 0,
        tx, ty, 1
    );
}
//Returns a transformation matrix rotated by an angle theta
function createRotation2D(angleInRadians: number): mat3 {
    return mat3.fromValues(
        Math.cos(angleInRadians), -Math.sin(angleInRadians), 0,
        Math.sin(angleInRadians), Math.cos(angleInRadians), 0,
        0, 0, 1
    );
}
export { createRotation2D, createScale2D, createTranslation2D };