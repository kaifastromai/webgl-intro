import { vec3, mat4, vec4 } from "gl-matrix";
import { Shader } from "./shader_utils";
import { gl } from "./webgl";

class disc {
    //Number of points along the shape's arc
    slices: number;
    //Number of divisions between inner and outer edges
    stacks: number;
    //The radius of the inner portion
    inner_radius: number;
    //Radius of outer portion
    outer_radius: number;
    //Location of inner center
    inner_center: vec3;
    //Location of outer center
    outer_center: vec3;
    //The sweep of the arc in degrees starting at positive X axis and sweeping counter clockwise
    theta: number;
    //The shader for the program
    shader: Shader;
    lns_vao: WebGLVertexArrayObject;
    tris_vao: WebGLVertexArrayObject;
    lns_buffer: WebGLBuffer;
    tris_buffer: WebGLBuffer;
    VERTEX_ATTRIB_INDEX = 0;


    //quad array--this is an intermediary step I wish to remove from the final implementation
    private quads: Array<vec3>;
    private tris: Array<number>;
    private vrtx_lines: Array<number>;

    constructor(slices: number = 18, stacks: number = 0,
        inner_radius: number = 10, outer_radius: number = 15,
        inner_center: vec3 = vec3.fromValues(0, 0, 0),
        outer_center: vec3 = vec3.fromValues(0, 0, 0), theta: number = 360) {
        if (slices < 2) {
            throw new Error('Disc slices must be more than 2');

        }
        this.initializeDisc(slices, stacks, inner_radius, outer_radius, inner_center, outer_center);


    }
    initializeDisc(slices: number = 18, stacks: number = 0,
        inner_radius: number = 10, outer_radius: number = 15,
        inner_center: vec3 = vec3.fromValues(0, 0, 0),
        outer_center: vec3 = vec3.fromValues(0, 0, 0), theta: number = 360) {
        if (slices < 2)
            throw new Error('Disc slices must be more than 2');
        this.slices = slices;
        this.stacks = stacks;
        this.inner_radius = inner_radius;
        this.outer_radius = outer_radius;
        this.inner_center = inner_center;
        this.outer_center = outer_center;
        this.theta = theta;
        this.createGeo();

    }

    async initializeShader() {
        await this.shader.initializeShaderText('./shaders/shader.vert',
            './shaders/shader.frag');
        this.shader.createProgram();
    }

    Draw(type: string = "solid", color: vec4, mvp: mat4) {
        switch (type) {
            case 'solid':
                this.DrawSolid(mvp, color);
                break;
            case 'lines':
                this.DrawWireframe(mvp, color);
            default:
                console.error("Improper type given. Must be 'solid' or 'lines'");
                break;
        }
    }
    DrawSolid(mvp: mat4, color: vec4) {
        gl.useProgram(this.shader.program);
        gl.uniformMatrix4fv(this.shader.attribs.mvp, false, mvp);
        gl.uniform4fv(this.shader.uniforms.u_color, color);
        gl.bindVertexArray(this.tris_vao);
        gl.drawArrays(gl.TRIANGLES, 0, this.tris.length / 3.0);
        gl.bindVertexArray(null);
        gl.useProgram(null);
    }

    DrawWireframe(mvp: mat4, color: vec4) {
        gl.useProgram(this.shader.program);
        gl.uniformMatrix4fv(this.shader.uniforms.u_mvp, false, mvp);
        gl.uniform4fv(this.shader.uniforms.u_color, color);
        gl.bindVertexArray(this.lns_vao);
        gl.drawArrays(gl.LINES, 0, this.vrtx_lines.length / 3);
        gl.bindVertexArray(null);
        gl.useProgram(null);
    }
    createGeo() {
        this.createQuads();
        this.trisFromQuad(this.quads);
        this.linesFromQuad(this.quads);
    }
    private createQuads() {
        var theta = this.theta * Math.PI / 360;
        for (let i = 0; i < this.slices; i++) {
            var x = Math.cos(i * theta / (this.slices - 1));
            var y = Math.sin(i * theta / (this.slices - 1));

            for (let stck_c = 0; stck_c < this.stacks; stck_c++) {
                var prcnt = (stck_c / this.stacks);
                var rad = this.inner_radius * (1 - prcnt) + this.outer_radius * prcnt;
                var lerp_vec = vec3.create();
                vec3.add(lerp_vec, vec3.lerp(lerp_vec, this.inner_center, this.outer_center, prcnt),
                    vec3.fromValues(rad * x, rad * y, 0));
                this.quads = [].concat(this.quads, lerp_vec);
            }
        }
    }
    private trisFromQuad(quads: Array<vec3>) {
        for (let slc_c = 0; slc_c < this.slices - 1; slc_c++) {
            for (let stck_c = 0; stck_c < this.stacks - 1; stck_c++) {
                var slc_fctr = slc_c * this.stacks;
                this.tris = [].concat(this.tris, ...quads[this.stacks - 1 - stck_c + slc_fctr]);
                this.tris = [].concat(this.tris, ...quads[this.stacks - 2 - stck_c + slc_fctr]);
                this.tris = [].concat(this.tris, ...quads[this.stacks + this.stacks - 2 - stck_c + slc_fctr]);
                this.tris = [].concat(this.tris, ...quads[this.stacks + this.stacks - 2 - stck_c + slc_fctr]);
                this.tris = [].concat(this.tris, ...quads[this.stacks + this.stacks - 1 - stck_c + slc_fctr]);
                this.tris = [].concat(this.tris, ...quads[this.stacks - 1 - stck_c + slc_fctr]);
            }
        }
    }
    private linesFromQuad(quads: Array<vec3>) {
        for (let slc_c = 0; slc_c < this.slices - 1; slc_c++) {
            var slc_fctr = slc_c * this.stacks;
            for (let stck_c = 0; stck_c < this.stacks - 1; stck_c++) {
                //First line
                this.vrtx_lines = [].concat(this.vrtx_lines, ...quads[this.stacks - 1 - stck_c + slc_fctr]);
                this.vrtx_lines = [].concat(this.vrtx_lines, ...quads[this.stacks - 2 - stck_c + slc_fctr]);
                //Second line
                this.vrtx_lines = [].concat(this.vrtx_lines, ...quads[this.stacks - 2 - stck_c + slc_fctr]);
                this.vrtx_lines = [].concat(this.vrtx_lines, ...quads[this.stacks + this.stacks - 2 - stck_c + slc_fctr]);
                //Third line
                this.vrtx_lines = [].concat(this.vrtx_lines, ...quads[this.stacks + this.stacks - 2 - stck_c + slc_fctr]);
                this.vrtx_lines = [].concat(this.vrtx_lines, ...quads[this.stacks + this.stacks - 1 - stck_c + slc_fctr]);
                //Fourth Line
                this.vrtx_lines = [].concat(this.vrtx_lines, ...quads[this.stacks + this.stacks - 1 - stck_c + slc_fctr]);
                this.vrtx_lines = [].concat(this.vrtx_lines, ...quads[this.stacks - 1 - stck_c + slc_fctr]);
                //Fifth Line
                this.vrtx_lines = [].concat(this.vrtx_lines, ...quads[this.stacks - 1 - stck_c + slc_fctr]);
                this.vrtx_lines = [].concat(this.vrtx_lines, ...quads[this.stacks + this.stacks - 2 - stck_c + slc_fctr]);

            }
        }
    }
}