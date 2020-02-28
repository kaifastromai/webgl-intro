declare const glcanvas: HTMLCanvasElement;
declare const gl: WebGL2RenderingContext;
declare function initializeShader(): Promise<void>;
declare function drawScene(now: number): void;
export { gl, glcanvas, initializeShader, drawScene };
