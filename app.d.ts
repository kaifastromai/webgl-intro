import { mat4 } from "gl-matrix";
declare var tx: CanvasRenderingContext2D;
declare var then: number;
declare function NumberVertices(mvp: mat4, v: Array<number>, ctx: CanvasRenderingContext2D): void;
export { then, NumberVertices, tx };
