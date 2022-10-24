#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D   u_scene;
uniform sampler2D   u_pyramid0;
uniform vec3        u_camera;

uniform vec3        u_light;
uniform vec3        u_lightColor;

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

#include "lygia/lighting/atmosphere.glsl"
#define ENVMAP_FNC(NORM, ROUGHNESS, METALLIC) atmosphere(NORM, normalize(u_light))

#include "lygia/lighting/pbrLittle.glsl"
#include "lygia/lighting/material/new.glsl"


void main(void) {
    vec4 color = vec4(1.0);
    vec2 pixel = 1.0/u_resolution;
    vec2 st = gl_FragCoord.xy * pixel;

#if defined(CONVOLUTION_PYRAMID_0)
    color = texture2D(u_scene, st);

#elif defined(POSTPROCESSING)
    color = texture2D(u_pyramid0, st);

#else
    vec2 uv = v_texcoord;
    Material material = materialNew();
    material.albedo = vec4(1.0);
    material.metallic = 0.9;
    material.roughness = 0.1;
    color = pbrLittle(material);
    color = linear2gamma(color);

#endif


    gl_FragColor = color;
}

