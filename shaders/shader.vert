#version 300 es

in vec2 a_vert_pos;
uniform vec2 u_resolution;
uniform mat3 u_matrix;

//all shaders have main func
void main(void)
{
    gl_Position=vec4((u_matrix*vec3(a_vert_pos,1)).xy,0,1);
}