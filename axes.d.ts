import './utilities';
declare class Axes {
    vao: WebGLVertexArrayObject;
    vrts_buffer: WebGLBuffer;
    indx_buffer: WebGLBuffer;
    colr_buffer: WebGLBuffer;
    zOffset: number;
    verts: Array<number>;
    colors: number[];
    indices: number[];
    constructor();
    Draw(M: Float32List, V: Float32List, P: Float32List): void;
}
export { Axes };
