declare const glcanvas: HTMLCanvasElement;
declare const gl: WebGL2RenderingContext;
declare function initializeShader(): Promise<void>;
declare function drawScene(rotation: number, scale: Array<number>, translate: Array<number>): void;
export { gl, glcanvas, initializeShader, drawScene };
