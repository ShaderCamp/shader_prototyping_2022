#ifdef GL_ES
precision mediump float;
#endif

// Position
uniform sampler2D   u_doubleBuffer0;  // 512x512

// Velocity
uniform sampler2D   u_doubleBuffer1;  // 512x512

uniform mat4        u_modelMatrix;
uniform mat4        u_viewMatrix;
uniform mat4        u_projectionMatrix;
uniform mat4        u_modelViewProjectionMatrix;
uniform vec3        u_camera;
uniform vec2        u_resolution;
uniform float       u_time;

attribute vec4      a_position;
varying vec4        v_position;

varying vec4        v_color;
varying vec2        v_texcoord;

#include "lygia/math/decimation.glsl"

void main(void) {
    
    vec2 uv         = a_position.xy;
    vec2 buffRes    = vec2(512.0);
    vec2 buffPixel  = 1.0/buffRes;
    uv              = decimation(uv, buffRes) + 0.5 * buffPixel;
    v_texcoord      = uv;

    v_position      = a_position;    
    v_position.xyz  = texture2D(u_doubleBuffer0, uv).xyz;
    v_position.xyz  *= 10.0;

    v_color.rgb     = texture2D(u_doubleBuffer1, uv).xyz;
    v_color.rgb     = normalize(v_color.xyz) * 0.5 + 0.5;
    v_color.a       = 1.0;
        
    gl_Position = u_projectionMatrix * u_viewMatrix * v_position;
}
