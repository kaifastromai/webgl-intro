import { loadFileAsync } from './utilities.js';
async function InitShaders(vert_url, frag_url) {
    var shader = {
        vrtx: "",
        frag: "",
    };
    shader.vrtx = await loadFileAsync(vert_url);
    shader.frag = await loadFileAsync(frag_url);
    return shader;
}
;
export { InitShaders };
//# sourceMappingURL=shader_source.js.map