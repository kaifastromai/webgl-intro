#version 300 es
precision mediump float;
in vec3 v_normal;
uniform vec4 u_color;
uniform vec3 u_reverseLightDirection;

out vec4 frag_color;


void main(void)
{
    vec3 normal=normalize(v_normal);
    //Compute light by taking dot product
    float light=dot(normal,u_reverseLightDirection);
    
    frag_color=u_color;
    frag_color.rgb*=light;


}