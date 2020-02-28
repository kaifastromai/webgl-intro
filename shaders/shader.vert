#version 300 es

layout(location=0)in vec4 a_vert_pos;
layout(location=1)in vec4 a_color;
uniform mat4 u_matrix;
//Color varying to frag shader
out vec4 v_color;

//all shaders have main func
void main(void)
{
    
    gl_Position=u_matrix*a_vert_pos;
    gl_PointSize=5.;
    v_color=a_color;
}