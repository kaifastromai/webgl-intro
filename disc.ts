import { vec3, mat4, vec4 } from "gl-matrix";
import { Shader } from "./shader";
import { gl } from "./webgl";
import { reloadTriple, unbind } from "./shader_utils";
import { loadJSON, linesFromTrisIndicies, vec3FromArray } from "./utils";

class disc {
    //Direction the directional light is coming from;
    light_dir: vec3;
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
    line_seg_buffer: WebGLBuffer;
    normal_lines_buffer: WebGLBuffer;
    tris_buffer: WebGLBuffer;
    normal_buffer: WebGLBuffer;
    tris_seg_buffer: WebGLBuffer;
    VERTEX_ATTRIB_INDEX = 0;
    NORMAL_ATTRIB_INDEX = 1;
    private json_mesh_data: any;

    quads: Array<vec3>;
    tris: Array<number>;
    vrtx_lines: Array<number>;
    line_seg_indicies: Array<number>;
    tris_seg_indices: Array<number>;
    normal_index: Array<number>;
    normal_verts_raw: Array<number>;
    normal_verts_from_index: Array<number>;
    display_normals: any[];
    constructor(slices: number = 18, stacks: number = 2,
        inner_radius: number = 10, outer_radius: number = 15,
        inner_center: vec3 = vec3.fromValues(0, 0, 0),
        outer_center: vec3 = vec3.fromValues(0, 0, 0), theta: number = 360) {
        if (slices < 2 || stacks < 2) {
            throw new Error('Disc slices must be more than 2');

        }
        this.slices = slices;
        this.stacks = stacks;
        this.inner_radius = inner_radius;
        this.outer_radius = outer_radius;
        this.inner_center = inner_center;
        this.outer_center = outer_center;
        this.theta = theta;
        this.quads = [];
        this.tris = [];
        this.vrtx_lines = [];
        this.line_seg_indicies = [];
        this.tris_seg_indices = [];
        this.normal_verts_raw = [];
        this.normal_verts_from_index = [];
        this.display_normals = [];


    }
    async loadMeshData(path: string) {
        this.json_mesh_data = await loadJSON(path);
    }
    async initialize() {
        await this.loadMeshData("./box.json");
        this.createGeo();
        await this.initializeShader();
        this.shader.uniforms.u_mvp = gl.getUniformLocation(this.shader.program, 'u_matrix');
        this.shader.uniforms.u_color = gl.getUniformLocation(this.shader.program, 'u_color');
        this.shader.uniforms.u_world_view_projection = gl.getUniformLocation(this.shader.program, "u_worldViewProjection");
        this.shader.uniforms.u_world_location = gl.getUniformLocation(this.shader.program, "u_world");
        this.shader.uniforms.u_reverse_light_direction = gl.getUniformLocation(this.shader.program, 'u_reverseLightDirection');
        this.NORMAL_ATTRIB_INDEX = gl.getAttribLocation(this.shader.program, "a_normal");
        this.InitGLLines();
        this.InitGLTriangles();
        this.InitGLNormals();
    }

    async initializeShader() {
        this.shader = new Shader();
        await this.shader.createShader('./shaders/shader.vert',
            './shaders/shader.frag');
    }

    // regenMesh() {
    //     this.quads = [];
    //     this.tris = [];
    //     this.vrtx_lines = [];
    //     this.createGeo();
    //     this.InitGLLines();
    //     this.InitGLTriangles();
    // }

    Draw(type: string = "solid", color: vec4, worldProjection: mat4, worldMatrix: mat4) {
        switch (type) {
            case 'solid':
                this.DrawSolid(worldProjection, worldMatrix, color);
                break;
            case 'lines':
                this.DrawWireframe(worldProjection, worldMatrix, color);
                break;
            default:
                console.error("Improper type given. Must be 'solid' or 'lines'");
                break;
        }
    }
    DrawSolid(worldProjection: mat4, worldMatrix: mat4, color: vec4) {
        gl.useProgram(this.shader.program);
        gl.uniformMatrix4fv(this.shader.uniforms.u_world_location, false, worldMatrix);
        gl.uniformMatrix4fv(this.shader.uniforms.u_world_view_projection, false, worldProjection);
        gl.uniform4fv(this.shader.uniforms.u_color, color);
        this.light_dir = vec3.fromValues(0, -1, 0);
        vec3.normalize(this.light_dir, this.light_dir);
        gl.uniform3fv(this.shader.uniforms.u_reverse_light_direction, this.light_dir);

        gl.bindVertexArray(this.tris_vao);
        gl.drawElements(gl.TRIANGLES, this.tris_seg_indices.length, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
        gl.useProgram(null);
    }

    DrawWireframe(worldProjection: mat4, worldMatrix: mat4, color: vec4) {
        gl.useProgram(this.shader.program);
        gl.uniformMatrix4fv(this.shader.uniforms.u_world_location, false, worldMatrix);
        gl.uniformMatrix4fv(this.shader.uniforms.u_world_view_projection, false, worldProjection);
        this.light_dir = vec3.fromValues(0, -1, 0);
        vec3.normalize(this.light_dir, this.light_dir);
        gl.uniform3fv(this.shader.uniforms.u_reverse_light_direction, this.light_dir);
        gl.uniform4fv(this.shader.uniforms.u_color, color);
        gl.bindVertexArray(this.lns_vao);
        gl.drawArrays(gl.LINES, 0, this.display_normals.length / 3.0);
        gl.bindVertexArray(null);
        gl.useProgram(null);
    }
    createGeo() {
        // this.createQuads();Psh
        this.trisFromJson();
        this.linesFromJson();
        this.normalsFromJson();
        this.calculateDisplayNormals();
    }
    private createQuads() {
        var theta = this.theta * Math.PI / 180;
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
    private trisFromJson() {
        this.tris = this.json_mesh_data.meshes.box.vertices;
        this.tris_seg_indices = this.json_mesh_data.meshes.box.v_index;
    }
    private linesFromJson() {
        this.vrtx_lines = this.json_mesh_data.meshes.box.vertices;
        this.line_seg_indicies = linesFromTrisIndicies(this.tris_seg_indices);
    }
    private normalsFromJson() {
        this.normal_verts_raw = this.json_mesh_data.meshes.box.normals;
        this.normal_index = this.json_mesh_data.meshes.box.n_index;

        //Create the real normals based upon the triangle vertex index and the triangle vertex array
        for (let i = 0; i < this.normal_index.length; i++) {
            let slice = this.normal_verts_raw.slice(
                3 * this.normal_index[i],
                3 * this.normal_index[i] + 3);
            this.normal_verts_from_index = [].concat(this.normal_verts_from_index,
                ...slice);

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
    private calculateDisplayNormals(length: number = 0.5) {
        for (let i = 0; i < this.normal_verts_from_index.length / 3; i++) {
            let pos = this.tris.slice(3 * this.tris_seg_indices[i], 3 * this.tris_seg_indices[i] + 3);
            this.display_normals.push(...pos);
            // let normal: vec3 = vec3FromArray(this.normal_verts_from_index.slice(3 * this.normal_index[i],
            //     3 * this.normal_index[i] + 3));
            let normal = vec3FromArray(this.normal_verts_from_index.slice(3 * i, 3 * i + 3));
            vec3.normalize(normal, normal);
            //vec3.scale(normal, normal, length);
            vec3.add(normal, normal, pos);
            this.display_normals.push(...normal);
            // if (i == 35) {
            //     debugger;
            // }
        }
        console.log(this.display_normals);

    }

    InitGLTriangles() {
        this.tris_vao = gl.createVertexArray();
        this.tris_buffer = gl.createBuffer();
        this.tris_seg_buffer = gl.createBuffer();
        this.ReloadGLTriangles();
    }
    InitGLLines() {
        this.lns_vao = gl.createVertexArray();
        this.lns_buffer = gl.createBuffer();
        this.line_seg_buffer = gl.createBuffer();
        this.ReloadGLLines(false);
    }
    InitGLNormals() {
        this.normal_buffer = gl.createBuffer();
        this.ReloadGLNormals();
    }
    ReloadGLTriangles(do_index_buffer: boolean = true) {
        reloadTriple(this.tris_vao, this.tris_buffer, this.tris, gl.DYNAMIC_DRAW, this.VERTEX_ATTRIB_INDEX);
        if (do_index_buffer) {
            let uarray = new Uint16Array(this.tris_seg_indices.length);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.tris_seg_buffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.tris_seg_indices), gl.DYNAMIC_DRAW);
            gl.getBufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, uarray);
            console.log("We actually only buffered for tris: " + uarray.length);
        }
        unbind();
    }
    ReloadGLLines(do_index_buffer: boolean = true) {

        reloadTriple(this.lns_vao, this.lns_buffer, this.display_normals, gl.DYNAMIC_DRAW, this.VERTEX_ATTRIB_INDEX);
        if (do_index_buffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.line_seg_buffer);
            let uarray = new Uint16Array(this.line_seg_indicies.length);
            console.log("U Array size: " + uarray.length);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.line_seg_indicies), gl.DYNAMIC_DRAW);
            let ar: ArrayBuffer = new ArrayBuffer(this.vrtx_lines.length * Float32Array.BYTES_PER_ELEMENT);
            gl.getBufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, uarray);
            console.log("We actually only buffered for lines: " + uarray.length);
        }
        unbind();
    }
    ReloadGLNormals() {
        reloadTriple(this.tris_vao, this.normal_buffer, this.normal_verts_from_index, gl.DYNAMIC_DRAW, this.NORMAL_ATTRIB_INDEX);
        let uarray = new Float32Array(this.normal_verts_from_index.length);
        gl.getBufferSubData(gl.ARRAY_BUFFER, 0, uarray);
        console.log("We actually have: " + uarray.length + " in normal buffer");
        unbind();
    }



}
export { disc as Disc };