#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D   u_scene;
uniform vec3        u_camera;
uniform vec3        u_light;

uniform vec2        u_resolution;
uniform vec2        u_mouse;
uniform float       u_time;

varying vec4        v_position;
varying vec3        v_normal;

#if defined(MODEL_VERTEX_TEXCOORD)
varying vec2        v_texcoord;
#endif

#define CHROMAAB_PCT 10.5
#define CHROMAAB_CENTER_BUFFER .15
#define CHROMAAB_SAMPLER_FNC(TEX, UV) SAMPLER_FNC(TEX, clamp(UV, vec2(0.001), vec2(0.999)))
#include "lygia/distort/chromaAB.glsl"

#define BARREL_SAMPLER_FNC(TEX, UV) chromaAB(TEX, UV);
#include "lygia/distort/barrel.glsl"

void main(void) {
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 pixel = 1.0/u_resolution;
    vec2 st = gl_FragCoord.xy * pixel;

    float dist = distance(st, vec2(0.5));

    #if defined(BACKGROUND)
    color.rgb += 1.0-dist;
    // color.rgb += step(.5, fract( (st.x + st.y) * 10.0 + u_time)) * 0.5;

    #elif defined(POSTPROCESSING)
    color.rgb =  barrel(u_scene, st, dist * 0.1);

    #else

    // Diffuse shading from directional light
    vec3 n = normalize(v_normal);
    vec3 l = normalize(u_light - v_position.xyz);
    color.rgb += dot(n, l) * 0.5 + 0.5;
    #endif

    gl_FragColor = color;
}

