#version 300 es

layout(location=0)in vec4 a_vert_pos;
layout(location=1) in vec3 a_normal;
//layout(location=1)in vec4 a_color;
uniform mat4 u_worldViewProjection;
uniform mat4 u_world;
//Normal projection vector (inverse transpose of model view)
//Color varying to frag shader
//out vec4 v_color;
uniform mat3 u_nm;
out vec3 v_lighting;

//all shaders have main func
void main(void)
{
    gl_Position=u_worldViewProjection*u_world*a_vert_pos;
    gl_PointSize=5.;
    vec3 ambientLight=vec3(0.3,0.3,0.3);
    vec3 dirLightColor=vec3(1,1,1);
    vec3 dirVec=-normalize(vec3(0,-1.,0.0));
    vec3 n_normal=normalize(u_nm*a_normal);
    float directional=max(dot(n_normal,dirVec),0.0)*0.75;

    v_lighting=ambientLight+(dirLightColor*directional);
    //v_lighting=normalize(a_normal);

   // v_color=
}