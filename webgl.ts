import { Shader } from "./shader_utils";
import { create } from "gl-matrix/src/gl-matrix/vec2";
const glcanvas = <HTMLCanvasElement>document.getElementById('glcanvas');
const gl = glcanvas.getContext('webgl2');
if (!gl)
    throw "WebGL2 is not supported on this browser!";

function RunDemo() {
    let shader: Shader = new Shader();
    shader.initializeShaderText('./shaders/shader.vert', './shaders/shader.frag').then(() => {
        shader.createProgram();

        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        var positions = [
            10, 20,
            80, 20,
            10, 30,
            10, 30,
            80, 20,
            80, 30
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        var vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        gl.enableVertexAttribArray(shader.attribs.positionAttribLocation);
        gl.vertexAttribPointer(shader.attribs.positionAttribLocation, 2, gl.FLOAT, false, 0, 0);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(shader.program);
        gl.bindVertexArray(vao);
        gl.uniform2f(shader.uniforms.resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
        shader.uniforms.colorLocation = gl.getUniformLocation(shader.program, "u_color");
        //draw 50 random rectangles!
        for (var ii = 0; ii < 50; ++ii) {
            createRect(randomInt(1000), randomInt(1000), randomInt(1000), randomInt(1000));
            gl.uniform4f(shader.uniforms.colorLocation, Math.random(), Math.random(), Math.random(), 1);
            gl.drawArrays(gl.TRIANGLES, 0, 6);


        }

    });
}

function randomInt(range: number) {
    return Math.floor(Math.random() * range);
}
function createRect(x: number, y: number, width: number, height: number) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2
    ]), gl.STATIC_DRAW);
}
export { gl, glcanvas, RunDemo };