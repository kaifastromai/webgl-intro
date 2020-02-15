declare class Square {
    vao_s: WebGLVertexArrayObject;
    vao_l: WebGLVertexArrayObject;
    vrts_buffer: WebGLBuffer;
    findx_buffer: WebGLBuffer;
    lindx_buffer: WebGLBuffer;
    colr_buffer: WebGLBuffer;
    vrts: Array<number>;
    colors: number[];
    filled_indices: number[];
    line_segment_indices: number[];
    constructor();
    Draw(filled: boolean, M: Float32List, V: Float32List, P: Float32List): void;
}
export { Square };
