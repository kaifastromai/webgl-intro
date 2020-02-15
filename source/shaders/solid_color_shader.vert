#version 300 es
uniform mat4 u_m;
uniform mat4 u_v;
uniform mat4 u_pj;

in vec3 a_vertex_coordinates;

void main(void)
{
	gl_Position = u_pj * u_v * u_m * vec4(a_vertex_coordinates, 1.0);
}