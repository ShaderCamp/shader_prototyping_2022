#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D   u_buffer0;

uniform sampler2D   u_scene;
uniform sampler2D   u_sceneDepth;

uniform vec3        u_camera;
uniform float       u_cameraNearClip;
uniform float       u_cameraFarClip;

uniform vec3        u_light;

uniform vec2        u_resolution;
uniform vec2        u_mouse;
uniform float       u_time;

varying vec4        v_position;
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

uniform mat4        u_viewMatrix;
uniform mat4        u_projectionMatrix;
#include "lygia/lighting/volumetricLightScattering.glsl"

#define GAUSSIANBLUR_2D
#define GAUSSIANBLUR_SAMPLER_FNC(TEX, UV) texture2D(TEX, clamp(UV, 0.001, .999))
#include "lygia/filter/gaussianBlur.glsl"

void main(void) {
    vec4 color = vec4(1.0);
    vec2 pixel = 1.0/u_resolution;
    vec2 st = gl_FragCoord.xy * pixel;

#if defined(BUFFER_0)
    color = texture2D(u_scene, st);
    float brightness = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
    color.rgb *= smoothstep(0.0, 1., brightness);

#elif defined(POSTPROCESSING)
    color.rgb = texture2D(u_scene, st).rgb * 0.9;
    color.rgb += gaussianBlur(u_buffer0, st, pixel * 8.0, 16).rgb * 0.25;
    color.rgb += volumetricLightScattering(u_sceneDepth, st) * 3.0;

#else

    #if defined(FLOOR)
    vec2 uv = v_texcoord;
    color.rgb *= 0.5 + step(0.5, fract( (uv.x + uv.y) * 50.0)) * 0.5;
    #endif

    // Diffuse shading from directional light
    vec3 n = normalize(v_normal);
    vec3 l = normalize(u_light - v_position.xyz);
    color.rgb *= dot(n, l) * 0.5 + 0.5;
    color.rgb *= 0.8;

    color.rgb *= shadow(u_lightShadowMap, vec2(LIGHT_SHADOWMAP_SIZE), v_lightCoord.xy, v_lightCoord.z);
#endif

    gl_FragColor = color;
}

