#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D   u_tex0;
uniform vec2        u_tex0Resolution;

uniform vec2        u_mouse;
uniform vec2        u_resolution;
uniform float       u_time;

varying vec2        v_texcoord;

void main (void) {
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 pixel = 1.0/u_resolution;
    vec2 st = gl_FragCoord.xy * pixel;
    vec2 uv = v_texcoord;

    color = texture2D(u_tex0, st);

    gl_FragColor = color;
}
