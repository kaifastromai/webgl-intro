#version 300 es
uniform mat4 u_m;
uniform mat4 u_v;
uniform mat4 u_pj;

in vec3 a_vertex_coordinates;
in vec3 a_colors;

out vec4 colors;

void main(void)
{
	gl_Position = u_pj * u_v * u_m * vec4(a_vertex_coordinates, 1.0);
	colors = vec4(a_colors, 1.0);
}