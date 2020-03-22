#version 300 es
precision mediump float;
in vec3 v_lighting;
uniform vec4 u_color;
uniform vec3 u_reverseLightDirection;

out vec4 frag_color;


void main(void)
{
  //  Compute light by taking dot product
    if(!gl_FrontFacing){
        frag_color.rgba=vec4(1,1,1,1);
    }
    else{
    frag_color=vec4(u_color.rgb*v_lighting,u_color.a);

    }
    // frag_color=u_color;
    // frag_color.rgb=v_lighting;


}