#ifdef GL_ES
precision mediump float;
#endif

uniform vec3        u_camera;
uniform vec3        u_light;

uniform vec2        u_resolution;
uniform vec2        u_mouse;
uniform float       u_time;

varying vec4        v_position;
varying vec3        v_normal;
#ifdef MODEL_VERTEX_TEXCOORD
varying vec2        v_texcoord;
#endif

void main(void) {
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 pixel = 1.0/u_resolution;
    vec2 st = gl_FragCoord.xy * pixel;

    #ifdef MODEL_NAME_TOP 
    color.rgb = vec3(1.0, 0.0, 0.0);
    #else 
    color.rgb = vec3(1.0);
    #endif

    // Diffuse shading from directional light
    vec3 n = normalize(v_normal);
    vec3 l = normalize(u_light - v_position.xyz);
    vec3 v = normalize(u_camera - v_position.xyz);
    color.rgb *= dot(n, l) * 0.5 + 0.5;

    gl_FragColor = color;
}

