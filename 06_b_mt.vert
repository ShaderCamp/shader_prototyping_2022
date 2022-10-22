
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D   u_buffer0;
uniform sampler2D   u_buffer1;

uniform mat4        u_modelViewProjectionMatrix;
uniform mat4        u_projectionMatrix;
uniform mat4        u_modelMatrix;
uniform mat4        u_viewMatrix;
uniform mat3        u_normalMatrix;

attribute vec4      a_position;
varying vec4        v_position;

#ifdef MODEL_VERTEX_COLOR
attribute vec4      a_color;
varying vec4        v_color;
#endif

#ifdef MODEL_VERTEX_NORMAL
attribute vec3      a_normal;
varying vec3        v_normal;
#endif

#ifdef MODEL_VERTEX_TEXCOORD
attribute vec2      a_texcoord;
varying vec2        v_texcoord;
#endif

#ifdef MODEL_VERTEX_TANGENT
attribute vec4      a_tangent;
varying vec4        v_tangent;
varying mat3        v_tangentToWorld;
#endif

#ifdef LIGHT_SHADOWMAP
uniform mat4        u_lightMatrix;
varying vec4        v_lightCoord;
#endif

#include "lygia/color/palette/fire.glsl"
varying float       v_pct;

void main(void) {
    v_position = a_position;

#ifdef MODEL_VERTEX_COLOR
    v_color = a_color;
#endif
    
#ifdef MODEL_VERTEX_NORMAL
    v_normal = a_normal;
#endif
    
#ifdef MODEL_VERTEX_TEXCOORD
    v_texcoord = a_texcoord;
#endif
    
#ifdef MODEL_VERTEX_TANGENT
    v_tangent = a_tangent;
    vec3 worldTangent = a_tangent.xyz;
    vec3 worldBiTangent = cross(v_normal, worldTangent);// * sign(a_tangent.w);
    v_tangentToWorld = mat3(normalize(worldTangent), normalize(worldBiTangent), normalize(v_normal));
#endif

    v_pct = 0.0;
#if defined(MODEL_NAME_TOP) 
    v_pct = smoothstep(0.0, 2.0, v_position.y);
    float disp = texture2D(u_buffer0, v_texcoord).r ;
    v_position.xyz += normalize(v_position.xyz * vec3(1.0, 0.25, 1.0)) * disp * 5.0 * v_pct;
    v_color.rgb = mix(v_color.rgb, fire( (1.0-disp) * 2. - v_pct * 3.), v_pct);
#endif

#ifdef LIGHT_SHADOWMAP
    v_lightCoord = u_lightMatrix * v_position;
#endif
    
    gl_Position = u_modelViewProjectionMatrix * v_position;
}
