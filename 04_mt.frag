#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D   u_scene;

uniform vec3        u_camera;
uniform float       u_cameraNearClip;
uniform float       u_cameraFarClip;

uniform vec3        u_light;
uniform vec3        u_lightColor;

#ifdef SCENE_CUBEMAP
uniform samplerCube SCENE_CUBEMAP;
#endif

#ifdef SCENE_SH_ARRAY
uniform vec3        SCENE_SH_ARRAY[9];
#endif

#ifdef LIGHT_SHADOWMAP
uniform sampler2D   u_lightShadowMap;
varying vec4        v_lightCoord;
#endif
#define LIGHT_COORD     v_lightCoord
#define LIGHT_DIRECTION u_light

uniform vec2        u_resolution;
uniform vec2        u_mouse;
uniform float       u_time;

varying vec4        v_position;
varying vec4        v_color;
varying vec3        v_normal;

#if defined(MODEL_VERTEX_TEXCOORD)
varying vec2        v_texcoord;
#endif

#include "lygia/color/space/linear2gamma.glsl"

#include "lygia/lighting/pbrLittle.glsl"
#include "lygia/lighting/material/new.glsl"

void main(void) {
    vec4 color = vec4(1.0);
    vec2 pixel = 1.0/u_resolution;
    vec2 st = gl_FragCoord.xy * pixel;
    vec2 uv = v_texcoord;

    Material material = materialNew();

    #if defined(FLOOR)
    // Floor
    vec2 uv1 = floor(fract(uv * 8.0) * 2.0);
    float checker = (min(1.0, uv1.x + uv1.y) - (uv1.x * uv1.y));
    material.albedo.rgb = vec3(0.5) + (1.0-checker) * 0.5;
    material.metallic = 0.001;
    #else

    // Skull
    material.albedo = vec4(1.0);
    material.metallic = 0.1;
    material.roughness = 0.1;

    #endif

    color = pbrLittle(material);

    gl_FragColor = linear2gamma(color);
}

