#ifdef GL_ES
precision mediump float;
#endif

uniform vec3        u_camera;
uniform vec3        u_light;

uniform vec2        u_resolution;
uniform vec2        u_mouse;
uniform float       u_time;

varying vec4        v_position;
varying vec3        v_normal;
#ifdef MODEL_VERTEX_TEXCOORD
varying vec2        v_texcoord;
#endif

#include "lygia/space/ratio.glsl"

void main(void) {
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 pixel = 1.0/u_resolution;
    vec2 st = gl_FragCoord.xy * pixel;

#ifdef BACKGROUND
    st = ratio(st, u_resolution);
    color += 0.5 * step(0.5, fract((st.x - st.y - u_time * 0.05) * 10.));
#else

    // Diffuse shading from directional light
    vec3 n = normalize(v_normal);
    vec3 l = normalize(u_light);
    vec3 v = normalize(u_camera - v_position.xyz);
    color += (dot(n, l) + 1.0 ) * 0.5;
#endif

    gl_FragColor = color;
}

