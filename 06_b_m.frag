
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D   u_buffer0;

uniform sampler2D   u_tex0;
uniform vec2        u_tex0Resolution;

uniform vec2        u_resolution;
uniform vec2        u_mouse;
uniform float       u_time;

varying vec2        v_texcoord;

#include "lygia/filter/gaussianBlur.glsl"

void main (void) {
    vec3 color = vec3(0.0);
    vec2 pixel = 1.0/u_resolution.xy;
    vec2 st = gl_FragCoord.xy * pixel;
    vec2 uv = v_texcoord;

#if defined(BUFFER_0)
    color = gaussianBlur(u_tex0, st, pixel * vec2(1.0, 0.0) * 3.0, 16).rgb;

#else
    color = gaussianBlur(u_buffer0, st, pixel * vec2(0.0, 1.0) * 3.0, 16).rgb;
    
#endif

    gl_FragColor = vec4(color, 1.0);
}
