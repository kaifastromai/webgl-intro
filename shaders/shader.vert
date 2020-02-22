#version 300 es

in vec2 a_vert_pos;

uniform vec2 u_resolution;
void main(void)
{
    //convert from pixels to 0.0 to 1.0
    vec2 zeroToOne=a_vert_pos/u_resolution;
    //convert from 0-> to 0->2
    vec2 zeroToTwo=zeroToOne*2.;
    vec2 clipSpace=zeroToTwo-1.;
    gl_Position=vec4(clipSpace*vec2(1,-1),0.,1.);
}