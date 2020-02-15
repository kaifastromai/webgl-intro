import { loadTextResource } from './utilities';
var index_color_shader = {
    vrtx: '',
    frag: ''
};
//The solid shader is an UNLIT taking a single color as a uniform
var solid_color_shader = {
    vrtx: '',
    frag: ''
};
var InitShaders = (vert_url, frag_url, shader) => {
    loadTextResource(vert_url, (vsErr, vsText) => {
        if (vsErr) {
            alert('Fatal error getting vertex shader, see console');
            console.error(vsErr);
        }
        else {
            loadTextResource(frag_url, (fsErr, fsText) => {
                if (fsErr) {
                    alert('Fatal error getting vertex shader, see console');
                    console.error(fsErr);
                }
                else {
                    shader.vrtx = vsText;
                    shader.frag = fsText;
                    console.log('Shaders load correctly!');
                }
            });
        }
    });
    InitShaders('./solid_color_shader.vert', './solid_color_shader.frag', solid_color_shader);
    InitShaders('./index_color_shader.vert', './index_color_shader.frag', index_color_shader);
};
export { solid_color_shader, index_color_shader };
//# sourceMappingURL=shader_source.js.map