declare const glcanvas: HTMLCanvasElement;
declare const gl: WebGL2RenderingContext;
declare function initializeShader(): Promise<void>;
declare function drawScene(now: number): void;
declare function createGeo(): void;
declare function setColors(): void;
declare function setColorsLns(): void;
export { gl, glcanvas, initializeShader, drawScene, createGeo, setColors, setColorsLns };
