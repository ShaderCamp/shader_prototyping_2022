#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D   u_scene;
uniform sampler2D   u_doubleBuffer0;

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

#include "lygia/generative/curl.glsl"

#define FBM_NOISE_TYPE vec3
#define FBM_NOISE3_FNC(POS_UV) curl(POS_UV)
#include "lygia/generative/fbm.glsl"

void main(void) {
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 pixel = 1.0/u_resolution;
    vec2 st = gl_FragCoord.xy * pixel;

#if defined(DOUBLE_BUFFER_0)
    vec2 st1 = st;
    st1 += pixel * vec2(.5, -1.0) * 5.0;
    st1 += pixel * fbm( vec3(st1 * 5., u_time) ).xy * 5.0;

    color = texture2D(u_doubleBuffer0, clamp(st1, vec2(0.001), vec2(0.999)) ) * 0.99;

    vec4 scene = texture2D(u_scene, st);
    color = mix(color, scene, scene.a);

#elif defined(POSTPROCESSING)
    color = texture2D(u_doubleBuffer0, st);

#else

    // Diffuse shading from directional light
    vec3 n = normalize(v_normal);
    vec3 l = normalize(u_light - v_position.xyz);
    color.rgb += dot(n, l) * 0.5 + 0.5;

#endif

    gl_FragColor = color;
}

