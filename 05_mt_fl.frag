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

uniform sampler2D   u_lightShadowMap;
uniform mat4        u_lightMatrix;
varying vec4        v_lightCoord;
#include "lygia/sample/shadowPCF.glsl"

void main(void) {
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 pixel = 1.0/u_resolution;
    vec2 st = gl_FragCoord.xy * pixel;

    // Floor Pattern
    #if defined(FLOOR) && defined(MODEL_VERTEX_TEXCOORD)
    
    // Checker floor
    vec2 uv = v_texcoord;
    uv = floor(fract(uv * 8.0) * 2.0);
    color.rgb = vec3(0.5) + (min(1.0, uv.x + uv.y) - (uv.x * uv.y)) * 0.5;

    #else 

    // White model
    color.rgb = vec3(1.0);

    #endif

    // Diffuse shading
    #ifdef MODEL_VERTEX_NORMAL
    vec3 n = normalize(v_normal);
    vec3 l = normalize(u_light);
    vec3 v = normalize(u_camera - v_position.xyz);

    color.rgb *= (dot(n, l) + 1.0 ) * 0.5;
    #endif

    // Shadow
    color.rgb *= sampleShadowPCF(u_lightShadowMap, vec2(LIGHT_SHADOWMAP_SIZE), v_lightCoord.xy, v_lightCoord.z - 0.005) * 0.8 + 0.2;

    gl_FragColor = color;
}

