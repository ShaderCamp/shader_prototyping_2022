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

#if defined(MODEL_VERTEX_TEXCOORD)
varying vec2        v_texcoord;
#endif

uniform sampler2D   u_lightShadowMap;
#ifdef LIGHT_SHADOWMAP
varying vec4        v_lightCoord;
#endif

#include "lygia/lighting/shadow.glsl"

void main(void) {
    vec4 color = vec4(1.0);
    vec2 pixel = 1.0/u_resolution;
    vec2 st = gl_FragCoord.xy * pixel;

    #if defined(FLOOR)
    vec2 uv = v_texcoord;
    color.rgb *= 0.5 + step(0.5, fract( (uv.x + uv.y) * 50.0)) * 0.5;
    #endif

    // Diffuse shading from directional light
    vec3 n = normalize(v_normal);
    vec3 l = normalize(u_light - v_position.xyz);
    color.rgb *= dot(n, l) * 0.5 + 0.5;

    color.rgb *= shadow(u_lightShadowMap, vec2(LIGHT_SHADOWMAP_SIZE), v_lightCoord.xy, v_lightCoord.z);

    gl_FragColor = color;
}

