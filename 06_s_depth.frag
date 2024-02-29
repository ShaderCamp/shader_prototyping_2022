#ifdef GL_ES
precision mediump float;
#endif

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
varying vec4        v_color;
varying vec3        v_normal;

#if defined(MODEL_VERTEX_TEXCOORD)
varying vec2        v_texcoord;
#endif

#include "lygia/space/linearizeDepth.glsl"
#include "lygia/color/palette/heatmap.glsl"

void main(void) {
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 pixel = 1.0/u_resolution;
    vec2 st = gl_FragCoord.xy * pixel;

#if defined(POSTPROCESSING)
    float depth = linearizeDepth(texture2D(u_sceneDepth, st).r, u_cameraNearClip, u_cameraFarClip) / (length(u_camera) * 2.0);
    color.rgb += heatmap(depth);

#else
    color = v_color;

    #if defined(FLOOR)
    #endif

#endif

    gl_FragColor = color;
}

