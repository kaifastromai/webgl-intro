#version 300 es
precision mediump float;

in vec4 colors;

out vec4 frag_color;

void main(void)
{
	frag_color = colors;
}