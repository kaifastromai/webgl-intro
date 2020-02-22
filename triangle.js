import { gl } from "./webgl";
class Triangle {
    constructor() {
        this.vao = gl.createVertexArray();
        this.vertex_buffer = gl.createBuffer();
        this.index_buffer = gl.createBuffer();
        this.color_buffer = gl.createBuffer();
        this._verts = [];
        this.indices = null;
    }
    createTriangle(coords) {
        coords.forEach(coord => {
            coord.forEach(el => {
                this._verts.push(el);
            });
        });
        console.log(this._verts);
        this.colors = [1, 0, 0, 0, 0, 1, 0, 1, 0];
        this.indices = [0, 1, 2];
    }
    bindToShader(shader) {
        gl.bindVertexArray(this.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
        gl.vertexAttribPointer(shader.attribs.a_vertex_coordinates, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shader.attribs.a_vertex_coordinates);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._verts), gl.STATIC_DRAW);
        gl.bindBuffer(shader.attribs.a_colors, this.color_buffer);
        gl.vertexAttribPointer(shader.attribs.a_colors, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shader.attribs.a_colors);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
        //Unbinding VAO
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
}
export { Triangle };
//# sourceMappingURL=triangle.js.map