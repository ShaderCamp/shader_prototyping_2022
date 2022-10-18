#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D   u_buffer0;
uniform sampler2D   u_buffer1;

uniform vec2        u_resolution;
uniform vec2        u_mouse;
uniform float       u_time;

varying vec2        v_texcoord;

void main() {
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 pixel = 1.0/u_resolution;
    vec2 st = gl_FragCoord.xy * pixel;
    
#ifdef BUFFER_0
    color.g = abs(sin(u_time * 0.2));

#elif defined( BUFFER_1 )
    color.r = abs(sin(u_time * 0.3));

#else
    // color.rg = st;
    color.b = abs(sin(u_time * 0.4));

    color = mix(color,
                mix(texture2D(u_buffer0, st), 
                    texture2D(u_buffer1, st), 
                    step(st.y, 0.5) ), 
                step(st.x, 0.5));
#endif

    gl_FragColor = color;
}