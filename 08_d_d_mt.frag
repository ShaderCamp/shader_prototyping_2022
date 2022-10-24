#ifdef GL_ES
precision mediump float;
#endif

// position
uniform sampler2D   u_doubleBuffer0; // 512x512

// velocity
uniform sampler2D   u_doubleBuffer1; // 512x512

uniform vec2        u_resolution;
uniform float       u_time;
uniform float       u_delta;
uniform int         u_frame;

varying vec4        v_color;
varying vec2        v_texcoord;

#include "lygia/math/decimation.glsl"
#include "lygia/generative/srandom.glsl"
#include "lygia/generative/snoise.glsl"
#include "lygia/generative/curl.glsl"

void main(void) {
    vec4 color = vec4(0.0);
    vec2 pixel = 1.0/ u_resolution;
    vec2 st = gl_FragCoord.xy * pixel;
    vec2 uv = v_texcoord;

    vec4  buff0 = texture2D(u_doubleBuffer0, uv);
    vec4  buff1 = texture2D(u_doubleBuffer1, uv);
    vec3  pos = buff0.xyz;
    vec3  vel = buff1.xyz;
    float life = buff0.a * 100.0;

    pos = u_frame < 1 ? srandom3(vec3(st, 1.0)) * 0.01 : pos;
    vel = u_frame < 1 ? curl(vec3(st,0.5)) : vel;
    life = u_frame < 1 ? uv.x  * 10. + uv.y * 90. : life;

#if defined(DOUBLE_BUFFER_0)
    pos += vel;
    life -= 0.003;

    if ( length( pos ) > 1.0 || life <= 0.0)
        pos = srandom3(pos + u_time);

    if (life <= 0.0)
        life = 100.0;

    color.rgb = pos;
    color.a = life * 0.01;

#elif defined(DOUBLE_BUFFER_1)
    vel *= 0.5;
    vel += curl( pos + u_time * 0.1) * 0.3;

    float dist = length( pos );

    // Repulsion from the very center of the space
    vel += normalize(pos) * 0.5 * (1.0 - dist) * step(dist, 0.01);

    // Atraction to the center of the space conform the leave
    vel += -normalize(pos) * 0.5 * pow(dist, 2.0);
    
    color.rgb = clamp(vel * u_delta, -0.999, 0.999);// * 0.5 + 0.5;
    color.a = 1.0;

#else
    color = v_color;
#endif

    gl_FragColor = color;
}
