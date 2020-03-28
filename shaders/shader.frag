#version 300 es
precision mediump float;
in vec3 v_lighting;
uniform vec4 u_color;
uniform vec3 u_reverseLightDirection;
in vec2 v_textCord;
out vec4 frag_color;

uniform sampler2D u_image;

void main(void)
{
  //  Compute light by taking dot product

    frag_color=texture(u_image,v_textCord);
   frag_color.rgb*=v_lighting;
    // frag_color=u_color;
    // frag_color.rgb=v_lighting;


}