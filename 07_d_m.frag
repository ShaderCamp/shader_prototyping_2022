
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D   u_doubleBuffer0;

uniform vec2        u_resolution;
uniform vec2        u_mouse;
uniform float       u_time;

#include "lygia/math/saturate.glsl"
#include "lygia/space/ratio.glsl"
#include "lygia/draw/circle.glsl"
#include "lygia/color/palette/chroma.glsl"

void main(void) {
    vec4 color = vec4(vec3(0.0), 1.0);
    vec2 pixel = 1.0/u_resolution.xy;
    vec2 st = gl_FragCoord.xy * pixel;
    st = ratio(st, u_resolution);

#if defined(DOUBLE_BUFFER_0)

    vec2 pos =  u_mouse*pixel;
    pos.x = cos(u_time * 1.5);
    pos.y = sin(u_time * 1.7);
    pos *= 0.5;
    pos = pos * 0.5 + 0.5;

    color.rgb = texture2D(u_doubleBuffer0, st).rgb * 0.99;
    color.rgb += circle(st - pos + 0.5, 0.1);
    color.rgb = saturate(color.rgb);
    
#else
    float value = texture2D(u_doubleBuffer0, st).r;
    color.rgb += chroma(value);

#endif

    gl_FragColor = color;
}
