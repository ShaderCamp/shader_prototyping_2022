#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D   u_tex0;
uniform vec2        u_tex0Resolution;

uniform sampler2D   u_buffer0;

uniform vec2        u_mouse;
uniform vec2        u_resolution;
uniform float       u_time;

#define GAUSSIANBLUR_SAMPLER_FNC(UV) texture2D(tex, clamp(UV, vec2(0.001), vec2(0.999))) 
#include "lygia/filter/gaussianBlur.glsl"

void main (void) {
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 pixel = 1.0/u_resolution;
    vec2 st = gl_FragCoord.xy * pixel;

#if defined(BUFFER_0)
    color = gaussianBlur(u_tex0, st, vec2(3.0, 0.0) * pixel);

#else 
    color = gaussianBlur(u_buffer0, st, vec2(0.0, 3.0) * pixel);

#endif

    gl_FragColor = color;
}
