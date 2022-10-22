#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D   u_scene;
uniform sampler2D   u_buffer0;

uniform vec3        u_camera;
uniform float       u_cameraNearClip;
uniform float       u_cameraFarClip;

uniform vec3        u_light;

uniform vec2        u_resolution;
uniform vec2        u_mouse;
uniform float       u_time;

varying vec4        v_position;
varying vec4        v_color;
varying vec3        v_normal;

#if defined(MODEL_VERTEX_TEXCOORD)
varying vec2        v_texcoord;
#endif

#ifdef LIGHT_SHADOWMAP
uniform sampler2D   u_lightShadowMap;
varying vec4        v_lightCoord;
uniform mat4        u_lightMatrix;
#endif
#include "lygia/lighting/shadow.glsl"
#include "lygia/generative/worley.glsl"

varying float       v_pct;

void main(void) {
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 pixel = 1.0/u_resolution;
    vec2 st = gl_FragCoord.xy * pixel;

#if defined(BUFFER_0)
    color += worley( vec3(st * 10., u_time * 0.22) );
    color *= worley( st * 5. + vec2(u_time * 0.5, 0.) );

#else
    color += v_color;

    #if defined(FLOOR)
    vec2 uv = v_texcoord;
    color.rgb *= 0.5 + step(0.5, fract( (uv.x + uv.y) * 50.0)) * 0.5;
    #endif

    // Diffuse shading from directional light
    vec3 n = normalize(v_normal);
    vec3 l = normalize(u_light - v_position.xyz);
    color.rgb *= dot(n, l) * 0.5 + 0.5;
    color.rgb *= 0.8;

    color.rgb *= mix(shadow(u_lightShadowMap, vec2(LIGHT_SHADOWMAP_SIZE), v_lightCoord.xy, v_lightCoord.z), 1.0, v_pct);
#endif

    gl_FragColor = color;
}

