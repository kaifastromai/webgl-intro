#version 300 es

layout(location=0)in vec4 a_vert_pos;
layout(location=1) in vec4 a_normal;
//layout(location=1)in vec4 a_color;
uniform mat4 u_worldViewProjection;
uniform mat4 u_world;
//Color varying to frag shader
//out vec4 v_color;
out vec3 v_normal;

//all shaders have main func
void main(void)
{
    
    gl_Position=u_worldViewProjection*a_vert_pos;
    gl_PointSize=5.;
    v_normal=(mat3(u_worldViewProjection)*a_normal.xyz).xyz;
   // v_color=
}