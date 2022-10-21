#ifdef GL_ES
precision mediump float;
#endif

void main (void) {
    vec3 color = vec3(0.0);

#if defined(PLATFORM_OSX)
    color = vec3(1.0, 0.0, 0.0);

#elif defined(PLATFORM_LINUX) || defined(PLATFORM_RPI)
    color = vec3(0.0, 1.0, 0.0);

#elif defined(PLATFORM_WIN)
    color = vec3(0.0, 0.0, 1.0);

#elif defined(PLATFORM_WEBGL)
    color = vec3(0.0, 1.0, 1.0);
#endif

    gl_FragColor = vec4(color, 1.0);
}
