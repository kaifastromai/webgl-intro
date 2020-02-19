interface IColorShader {
    vrtx: string;
    frag: string;
}
declare function InitShaders(vert_url: string, frag_url: string): Promise<IColorShader>;
export { InitShaders, IColorShader };
