import { gl } from './imports.js';
import { solid_color_shader, index_color_shader } from './shader_source.js';
class Shader {
    program: WebGLProgram;
    uniforms?: { [k: string]: WebGLUniformLocation };
    attribs?: { [k: string]: number };
    vertexText: string;
    fragmentText: string;
    constructor() {
        this.program = null;
        this.uniforms = null;
        this.attribs = null;

    }
    CreateShader(): void {
        if (!this.vertexText)
            throw 'Vertex shader script may be missing.';
        if (!this.fragmentText)
            throw 'Fragment shader script may be missing.';
        let success;
        let vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShader, this.vertexText);
        gl.compileShader(vertShader);
        success = gl.getShaderParameter(vertShader, gl.COMPILE_STATUS);
        if (!success)
            throw 'Coulnd nmot compile vertex shader: ' + gl.getShaderInfoLog(vertShader);
        let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShader, this.fragmentText);
        gl.compileShader(fragShader);
        success = gl.getShaderParameter(fragShader, gl.COMPILE_STATUS);
        if (!success)
            throw 'Could not compile fragment shader: ' + gl.getShaderInfoLog(fragShader);

        let shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertShader);
        gl.attachShader(shaderProgram, fragShader);
        gl.linkProgram(shaderProgram);
        success = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
        if (!success)
            throw ('Shader program failed to link: ' + gl.getProgramInfoLog(shaderProgram));
        this.program= shaderProgram;
    }

}
var solid_shader = new Shader();
var color_shader = new Shader();
function InitializeSolidColorShader():void {
    solid_shader.vertexText = solid_color_shader.vrtx;
    solid_shader.fragmentText = solid_color_shader.frag;
    solid_shader.CreateShader();
    gl.useProgram(solid_shader.program);
    solid_shader.attribs.a_vertex_coordinates = gl.getAttribLocation(solid_shader.program, 'a_vertex_coordinates');
    solid_shader.uniforms.u_m = gl.getUniformLocation(solid_shader.program, 'u_m');
    solid_shader.uniforms.u_v = gl.getUniformLocation(solid_shader.program, 'u_v');
    solid_shader.uniforms.u_pj = gl.getUniformLocation(solid_shader.program, 'u_pj');
    solid_shader.uniforms.u_color = gl.getUniformLocation(solid_shader.program, 'u_color');
    gl.useProgram(null);
    
    console.log('Vertex Coordinate handle: ' + solid_shader.attribs.a_vertex_coordinates);
    console.log('M Matrix handle: ' + solid_shader.uniforms.u_m);
    console.log('V Matrix handle: ' + solid_shader.uniforms.u_v);
    console.log('P Matrix handle: ' + solid_shader.uniforms.u_pj);
    console.log('Color handle: ' + solid_shader.uniforms.u_color);
}

function InitializeIndexedColorShader():void {
    color_shader.vertexText = index_color_shader.vrtx;
    color_shader.fragmentText = index_color_shader.frag;
    color_shader.CreateShader();
    console.log('Program: ' + color_shader.program);
    gl.useProgram(color_shader.program);
    color_shader.attribs.a_vertex_coordinates = gl.getAttribLocation(color_shader.program, 'a_vertex_coordinates');
    color_shader.attribs.a_colors = gl.getAttribLocation(color_shader.program, 'a_colors');
    color_shader.uniforms.u_m = gl.getUniformLocation(color_shader.program, 'u_m');
    color_shader.uniforms.u_v = gl.getUniformLocation(color_shader.program, 'u_v');
    color_shader.uniforms.u_pj = gl.getUniformLocation(color_shader.program, 'u_pj');
    gl.useProgram(null);
    console.log('Vertex Coordinate handle: ' + color_shader.attribs.a_vertex_coordinates);
    console.log('Color attribute handle: ' + color_shader.attribs.a_colors);
    console.log('M Matrix handle: ' + color_shader.uniforms.u_m);
    console.log('V Matrix handle: ' + color_shader.uniforms.u_v);
    console.log('P Matrix handle: ' + color_shader.uniforms.u_pj);
}

export { Shader };
export { solid_shader, color_shader,InitializeSolidColorShader,InitializeIndexedColorShader};