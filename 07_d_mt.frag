#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D   u_scene;
uniform sampler2D   u_sceneDepth;

uniform sampler2D   u_doubleBuffer0;

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

#include "lygia/math/decimation.glsl"
#include "lygia/color/palette/chroma.glsl"
#include "lygia/draw/digits.glsl"
#define ARROWS_STYLE_LINE
#include "lygia/draw/arrows.glsl"

#include "lygia/space/linearizeDepth.glsl"
#include "lygia/generative/curl.glsl"
#define FBM_NOISE_TYPE vec3
#define FBM_NOISE3_FNC(POS_UV) curl(POS_UV)
#include "lygia/generative/fbm.glsl"

#ifdef LIGHT_SHADOWMAP
uniform sampler2D   u_lightShadowMap;
uniform mat4        u_lightMatrix;
varying vec4        v_lightCoord;
#endif
#include "lygia/lighting/shadow.glsl"

uniform mat4        u_viewMatrix;
uniform mat4        u_projectionMatrix;
#include "lygia/lighting/volumetricLightScattering.glsl"

#include "lygia/math/mirror.glsl"

float focus(vec2 st) {
    float depth = texture2D(u_sceneDepth, st).x;
    depth = linearizeDepth(depth, u_cameraNearClip, u_cameraFarClip) * 250.;
    return 1.0 - smoothstep(0., .9, depth);
}

void main(void) {
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 pixel = 1.0/u_resolution;
    vec2 st = gl_FragCoord.xy * pixel;

    float pct = 1.0;
    // pct = mirror(u_time * 0.5);

#if defined(DOUBLE_BUFFER_0)
    vec2 st1 = st;
    st1 += pixel * vec2(.5, -1.0) * 5.0;
    st1 += pixel * fbm( vec3(st1 * 5., u_time) ).xy * 5.0;

    color = texture2D(u_doubleBuffer0, clamp(st1, vec2(0.001), vec2(0.999)) ) * 0.99;
    color.r = texture2D(u_doubleBuffer0, clamp(st1 - pixel, vec2(0.001), vec2(0.999)) ).r * 0.9;
    color.b = texture2D(u_doubleBuffer0, clamp(st1 + pixel, vec2(0.001), vec2(0.999)) ).b * 0.99;

    float clip = focus(st);

    vec4 scene = texture2D(u_scene, st);
    color = mix(color, scene, scene.a * min(clip, pct));

    // color.rgb = scene.rgb * chroma(clip);
    // color += digits(st - 0.02, focus(vec2(0.5)));

#elif defined(POSTPROCESSING)
    color.xyz = texture2D(u_doubleBuffer0, st).xyz;
    color.rgb += volumetricLightScattering(u_sceneDepth, st) * vec3(0., 3., 1.);

#else

    // Diffuse shading from directional light
    vec3 n = normalize(v_normal);
    vec3 l = normalize(u_light - v_position.xyz);
    color.rgb += dot(n, l) * 0.5 + 0.5;

    color.rgb *= shadow(u_lightShadowMap, vec2(LIGHT_SHADOWMAP_SIZE), v_lightCoord.xy, v_lightCoord.z);

#endif

    gl_FragColor = color;
}

