#version 300 es

in vec4 a_vert_pos;
in vec4 a_color;
uniform mat4 u_matrix;

//all shaders have main func
void main(void)
{
    gl_Position=u_matrix*a_vert_pos;
}