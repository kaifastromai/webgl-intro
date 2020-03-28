import { vec3, mat4, vec4, mat3 } from "gl-matrix";
import { Shader } from "./shader";
import { gl } from "./webgl";
import { reloadTriple, unbind, reloadImage } from "./shader_utils";
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
    TEXTURE_ATTRIB_INDEX = 2;
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
    normal_verts: Array<number>;
    proc_norms: any[];
    non_indexed_tris: any[];
    texels: Array<number>;
    texel_indices: any;
    non_indexed_texels: any[];
    image: HTMLImageElement;
    texture_buffer: WebGLBuffer;
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
        this.normal_verts = [];
        this.proc_norms = [];
        this.non_indexed_tris = [];
        this.texels = [];
        this.texel_indices = [];
        this.non_indexed_texels = [];
        this.image = new Image();



    }
    async loadMeshData(path: string) {
        this.json_mesh_data = await loadJSON(path);
    }
    async loadImage() {
        this.image.onload = () => {
            return Promise;
        }
    }
    async initialize() {
        await this.loadMeshData("./box.json");
        this.createGeo();
        await this.initializeShader();
        this.image.src = "./shaders/textures/black_leather.jpg";
        await this.loadImage();

        //this.shader.uniforms.u_mvp = gl.getUniformLocation(this.shader.program, 'u_matrix');
        this.shader.uniforms.u_color = gl.getUniformLocation(this.shader.program, 'u_color');
        this.shader.uniforms.u_world_view_projection = gl.getUniformLocation(this.shader.program, "u_worldViewProjection");
        this.shader.uniforms.u_world_location = gl.getUniformLocation(this.shader.program, "u_world");
        this.shader.uniforms.u_reverse_light_direction = gl.getUniformLocation(this.shader.program, 'u_reverseLightDirection');
        this.shader.uniforms.u_nm = gl.getUniformLocation(this.shader.program, "u_nm");
        this.shader.uniforms.u_image = gl.getUniformLocation(this.shader.program, "u_image");
        this.NORMAL_ATTRIB_INDEX = gl.getAttribLocation(this.shader.program, "a_normal");
        this.InitGLLines();
        this.InitGLTriangles();
        this.InitGLNormals();
        this.InitGLTextures();

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

    Draw(type: string = "solid", color: vec4, p: mat4, m_v: mat4) {
        switch (type) {
            case 'solid':
                this.DrawSolid(p, m_v, color);
                break;
            case 'lines':
                this.DrawWireframe(p, m_v, color);
                break;
            default:
                console.error("Improper type given. Must be 'solid' or 'lines'");
                break;
        }
    }
    DrawSolid(p: mat4, m_v: mat4, color: vec4) {
        gl.useProgram(this.shader.program);
        gl.uniformMatrix4fv(this.shader.uniforms.u_world_location, false, m_v);
        gl.uniformMatrix4fv(this.shader.uniforms.u_world_view_projection, false, p);
        gl.uniform4fv(this.shader.uniforms.u_color, color);
        gl.uniform1i(this.shader.uniforms.u_image, 0);
        let nm = mat3.create();
        mat3.fromMat4(nm, m_v);
        mat3.invert(nm, nm);
        mat3.transpose(nm, nm);
        gl.uniformMatrix3fv(this.shader.uniforms.u_nm, false, nm);
        this.light_dir = vec3.fromValues(-1, -1, -1);
        vec3.normalize(this.light_dir, this.light_dir);
        gl.uniform3fv(this.shader.uniforms.u_reverse_light_direction, this.light_dir);

        gl.bindVertexArray(this.tris_vao);
        gl.drawArrays(gl.TRIANGLES, 0, this.non_indexed_tris.length / 3);
        gl.bindVertexArray(null);
        gl.useProgram(null);
    }


    DrawWireframe(p: mat4, m_v: mat4, color: vec4) {
        gl.useProgram(this.shader.program);
        gl.uniformMatrix4fv(this.shader.uniforms.u_world_location, false, m_v);
        gl.uniformMatrix4fv(this.shader.uniforms.u_world_view_projection, false, p);
        this.light_dir = vec3.fromValues(1, 1, 1);
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
        this.texelsFromJson();
        this.indexedToArray({ index: this.tris_seg_indices, values: this.tris, non_index_array: this.non_indexed_tris, span: 3 });
        this.indexedToArray({ index: this.texel_indices, values: this.texels, non_index_array: this.non_indexed_texels, span: 2 })
        this.calculateDisplayNormals();
        this.calculateNormalsFromIndexedTris(this.tris_seg_indices);
        this.displayNormalsFromNormals(this.proc_norms);
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
    private texelsFromJson() {
        this.texels = this.json_mesh_data.meshes.box.textures;
        this.texel_indices = this.json_mesh_data.meshes.box.t_index;
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
            // slice[0] *= -1;
            // slice[1] *= -1;
            // slice[2] *= -1;
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

        for (let i = 0; i < this.tris_seg_indices.length; i++) {
            let pos = this.tris.slice(3 * this.tris_seg_indices[i], 3 * this.tris_seg_indices[i] + 3);
            this.display_normals.push(...pos);
            // let normal: vec3 = vec3FromArray(this.normal_verts_from_index.slice(3 * this.normal_index[i],
            //     3 * this.normal_index[i] + 3));
            //let normal = vec3FromArray(this.normal_verts_from_index.slice(3 * i, 3 * i + 3));

            let normal = vec3FromArray(this.normal_verts_raw.slice(3 * this.normal_index[i],
                3 * this.normal_index[i] + 3));

            //vec3.scale(normal, normal, length);
            this.normal_verts.push(...normal);
            vec3.add(normal, normal, pos);
            this.display_normals.push(...normal);
            // if (i == 35) {
            //     debugger;
            // }
        }
        // console.log(this.display_normals);

    }
    private indexedToArray({ index, values, non_index_array, span }: {
        index: Array<number>; values: Array<number>;
        non_index_array: Array<number>; span: number;
    }) {
        for (let i = 0; i < index.length; i++) {
            non_index_array.push(...values.slice(span * index[i], span * index[i] + span));
        }
    }
    private displayNormalsFromNormals(normals: Array<number>) {
        this.display_normals = [];
        for (let i = 0; i < normals.length / 3; i++) {
            let pos = this.tris.slice(3 * this.tris_seg_indices[i], 3 * this.tris_seg_indices[i] + 3);
            this.display_normals.push(...pos);
            let normal: vec3 = vec3FromArray(normals.slice(3 * i, 3 * i + 3));
            vec3.add(normal, normal, pos);
            this.display_normals.push(...normal);

        }
    }
    private triNormalFromVertex(face_id: number, vert_id: number): vec3 {
        let face = new Array<vec3>();
        face.push(vec3FromArray(this.tris.slice(3 * this.tris_seg_indices[3 * face_id], 3 * this.tris_seg_indices[3 * face_id] + 3)));
        face.push(vec3FromArray(this.tris.slice(3 * this.tris_seg_indices[3 * face_id + 1], 3 * this.tris_seg_indices[3 * face_id + 1] + 3)));
        face.push(vec3FromArray(this.tris.slice(3 * this.tris_seg_indices[3 * face_id + 2], 3 * this.tris_seg_indices[3 * face_id + 2] + 3)));
        let v1 = face[vert_id];
        let v2 = face[(vert_id + 1) % 3];
        let v3 = face[(vert_id + 2) % 3];
        let line1: vec3 = vec3.create();
        let line2: vec3 = vec3.create();
        vec3.subtract(line1, v2, v3);
        vec3.subtract(line2, v3, v1);
        let cross = vec3.create();
        vec3.cross(cross, line1, line2);
        // let sin_angle: number = vec3.len(cross) / (vec3.len(line1) * vec3.len(line2));
        // vec3.scale(cross, cross, Math.asin(sin_angle));
        return cross;//vec3.normalize(cross, cross);

    }
    private calculateNormalsFromIndexedTris(tris_index: Array<number>) {
        //calculate face ids
        let face_id = [];
        for (let i = 0; i < tris_index.length / 3; i++) {
            let v1_indx = tris_index[3 * i];
            let v2_indx = tris_index[3 * i + 1];
            let v3_indx = tris_index[3 * i + 2];
            face_id.push(vec3.fromValues(v1_indx, v2_indx, v3_indx));

        }
        this.proc_norms = [];
        for (let vert = 0; vert < tris_index.length; vert++) {
            let v: number = tris_index[vert];
            let N: vec3 = vec3.create();
            for (let i = 0; i < tris_index.length / 3; i++) {
                if (face_id[i].includes(v)) {
                    let v_id = face_id[i].findIndex((v_in) => { return v_in == v });
                    vec3.add(N, N, this.triNormalFromVertex(i, v_id));

                }
                //N = this.triNormalFromVertex(i, 0);
            }
            vec3.normalize(N, N);
            this.proc_norms.push(...N);

        }
        //debugger;

    }

    InitGLTriangles() {
        this.tris_vao = gl.createVertexArray();
        this.tris_buffer = gl.createBuffer();
        this.tris_seg_buffer = gl.createBuffer();
        this.ReloadGLTriangles(false);
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
    InitGLTextures() {
        this.texture_buffer = gl.createBuffer();
        this.ReloadGLTextures();

    }
    ReloadGLTextures() {
        reloadImage(this.tris_vao, this.texture_buffer, this.TEXTURE_ATTRIB_INDEX, this.non_indexed_texels, gl.STATIC_DRAW, this.image);
        unbind();
    }
    ReloadGLTriangles(do_index_buffer: boolean = true) {
        reloadTriple(this.tris_vao, this.tris_buffer, this.non_indexed_tris, gl.DYNAMIC_DRAW, this.VERTEX_ATTRIB_INDEX);
        if (do_index_buffer) {
            reloadTriple(this.tris_vao, this.tris_buffer, this.tris, gl.DYNAMIC_DRAW, this.VERTEX_ATTRIB_INDEX);
            // let uarray = new Uint16Array(this.tris_seg_indices.length);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.tris_seg_buffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.tris_seg_indices), gl.DYNAMIC_DRAW);
            // gl.getBufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, uarray);
            // console.log("We actually only buffered for tris: " + uarray.length);
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
            // let ar: ArrayBuffer = new ArrayBuffer(this.vrtx_lines.length * Float32Array.BYTES_PER_ELEMENT);
            // gl.getBufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, uarray);
            // console.log("We actually only buffered for lines: " + uarray.length);
        }
        unbind();
    }
    ReloadGLNormals() {
        reloadTriple(this.tris_vao, this.normal_buffer, this.normal_verts, gl.DYNAMIC_DRAW, this.NORMAL_ATTRIB_INDEX);
        //let uarray = new Float32Array(this.normal_verts_from_index.length);
        // gl.getBufferSubData(gl.ARRAY_BUFFER, 0, uarray);
        //console.log("We actually have: " + uarray.length + " in normal buffer");
        unbind();
    }



}
export { disc as Disc };