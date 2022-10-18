#ifdef GL_ES
precision mediump float;
#endif

uniform vec2        u_mouse;
uniform vec2        u_resolution;
uniform float       u_time;

void main (void) {
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 pixel = 1.0/u_resolution;
    vec2 st = gl_FragCoord.xy * pixel;

    color.rgb = vec3(st.x, st.y, (1.0+sin(u_time))*0.5);

    gl_FragColor = color;
}
