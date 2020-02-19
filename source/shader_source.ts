import { loadFileAsync } from './utilities.js';

//The Indexed color shader is a UNLIT shader feeding vertex colors as attributes

interface IColorShader {
    vrtx: string,
    frag: string;
}
async function InitShaders(vert_url: string, frag_url: string): Promise<IColorShader> {
    var shader: IColorShader = {
        vrtx: "",
        frag: "",
    };
    shader.vrtx = await loadFileAsync(vert_url);
    shader.frag = await loadFileAsync(frag_url);
    return shader;
};


export { InitShaders, IColorShader };