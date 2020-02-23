import { vec3 } from "gl-matrix";
declare const glcanvas: HTMLCanvasElement;
declare const gl: WebGL2RenderingContext;
declare function initializeShader(): Promise<void>;
declare function drawScene(rotation: number, scale: vec3, translate: vec3): void;
export { gl, glcanvas, initializeShader, drawScene };
