
#ifdef GL_ES
precision mediump float;
#endif

uniform mat4    u_modelViewProjectionMatrix;
uniform mat4    u_projectionMatrix;
uniform mat4    u_modelMatrix;
uniform mat4    u_viewMatrix;
uniform mat3    u_normalMatrix;
uniform float   u_time;

attribute vec4  a_position;
varying vec4    v_position;

#ifdef MODEL_VERTEX_COLOR
attribute vec4  a_color;
varying vec4    v_color;
#endif

#ifdef MODEL_VERTEX_NORMAL
attribute vec3  a_normal;
varying vec3    v_normal;
#endif

#ifdef MODEL_VERTEX_TEXCOORD
attribute vec2  a_texcoord;
varying vec2    v_texcoord;
#endif

#ifdef MODEL_VERTEX_TANGENT
attribute vec4  a_tangent;
varying vec4    v_tangent;
varying mat3    v_tangentToWorld;
#endif

#ifdef LIGHT_SHADOWMAP
uniform mat4    u_lightMatrix;
varying vec4    v_lightCoord;
#endif

#include "lygia/math/const.glsl"
#include "lygia/math/mirror.glsl"
#include "lygia/animation/easing.glsl"
#include "lygia/space/rotateX.glsl"
#include "lygia/space/rotateY.glsl"

void main(void) {
    v_position = a_position;

#ifdef MODEL_VERTEX_NORMAL
    v_normal = a_normal;
#endif

    #ifdef MODEL_NAME_BOTTOM
    float pct = mirror(u_time * 0.5);
    pct = elasticInOut(pct);
    v_position = rotateX(v_position, pct * -PI * 0.1);
    v_normal = rotateX(v_normal, pct *  -PI * 0.1);
    v_position.y -= (pct) * .5;
    #endif

    v_position = rotateY(v_position, sin(u_time * 0.5));
    v_normal = rotateY(v_normal, sin(u_time * 0.5));

    
#ifdef MODEL_VERTEX_COLOR
    v_color = a_color;
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
    
#ifdef LIGHT_SHADOWMAP
    v_lightCoord = u_lightMatrix * v_position;
#endif
    
    gl_Position = u_modelViewProjectionMatrix * v_position;
}
