## SHADER PROTOTYPING 2022


### Before the course

1. Make sure to clone this repository and their submodules recursivelly

```bash
git clone --recursive https://github.com/ShaderCamp/shader_prototyping_2022.git
```

If you already clone it with out the `--recursive` flag, just do

```bash
git pull
git submodule init
git submodule update
```

2. Make sure you have compiled and installed GlslViewer from source following the instructions of you system of choise:

* [Compile on Linux](https://github.com/patriciogonzalezvivo/glslViewer/wiki/Compile-on-linux)
* [Compile on MacOS](https://github.com/patriciogonzalezvivo/glslViewer/wiki/Compile-on-MacOS)
* [Compile on Windows](https://github.com/patriciogonzalezvivo/glslViewer/wiki/Compile-on-Windows)

### The course

We will start by doing a fast recap of the difference between 2D and 3D shaders, to then load a simple geometry:

```bash
make 01_material
```

or 

```bash
glslViewer 01_mt.frag assets/skull.obj -l
```

We will iterate on it adding and modifying different render passes each one with a unique notation so then it's easier to structure any pipeline:

* **M** main shader (2D): when loaded only a `.frag` file or and image or video.
* **Mt** material shader (3D): when loaded a `.vert` or geometry file (`.ply`/`.obj`/`.glb`/`.gltf`)
* **Bg** Background shader (2D): forked using `BACKGROUND` define keyword
* **Pp** Post Processing shader (2D): forked using `POSTPROCESSING` define keyword renders the entire scene into a FBO call `u_scene` and `u_sceneDepth`.
* **Fl** Floor Material (3D): creates a floor plane when `FLOOR` define keyword is present and fork the shader adding that keyword as a define to it.
* **L** Light's shadowMap (2D): when uniform sampler2D `u_lightShadowMap` is present create a depth pass from the perspective of the light (`vec3 u_light` and `mat4 u_lightMatrix`).
* **B** Buffer (2D): when define keyword `BUFFER_<N>` is present, forks the shader to render a 2D pass inside FBO named `u_buffer<N>`
* **D** Doubple buffer (2D): when define keyword `DOUBLE_BUFFER_<N>` is present, forks the shader to render a 2D pass inside a double FBO named `u_doubleBuffer<N>`. This double buffer it's also know as PingPong, where after each pass the pare is swap, allowing for feedback passing their own content in it self.
* **Cp** Convolution pyramid(2D): when define keyword `CONVOLUTION_PYRAMID_<N>` is present, forks the shader to render a 2D pass inside a FBO to be prosses according to [this paper](https://pages.cs.huji.ac.il/danix-lab/cglab/projects/convpyr/data/convpyr-small.pdf) and delivered through `u_pyramid<N>`.
* **Gn** G Buffer Normal (3D>2D): when uniform sampler2D `u_sceneNormal` is present creates a g buffer of the 3D scene normals in screenspace
* **Gp** G Buffer Position (3D>2D): when uniform sampler2D `u_sceneNPosition` is present creates a g buffer of the 3D scene position in screenspace

## Examples

```bash
make 00_platform

make 00_billboard

make 01_material

make 02_background

make 03_postprocessing

make 04_floor

make 04_pbr

make 05_multiple_materials

make 06_buffer

make 06a_scene_depth

make 06a_scene_normal

make 06a_buffer_postprocessing

make 07_doubleBuffer

make 08_doubleDoubleBuffer

make 09_convolutionPyramid
```