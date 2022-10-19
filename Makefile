00_platform:
	glslViewer 00_m_platform.frag -l

00_billboard:
	glslViewer 00_m.frag -l

00_image:
	glslViewer 00_m_image.frag assets/danny.png -l

00_video:
	glslViewer 00_m_video.frag assets/oddysey/rgba.mp4 -w 960 -h 540 -l

01_material:
	glslViewer 01_mt.frag assets/dragon.obj -l

02_background:
	glslViewer 02_bg_mt.frag assets/dragon.obj -l

03_postprocessing:
	glslViewer 03_bg_mt_pp.frag assets/dragon.obj -l

05_multiple_materials:
	glslViewer 04_mt_mt.vert 04_mt_mt.frag assets/teapot.obj -l

04_floor:
	glslViewer 04_mt_fl.frag assets/dragon.obj -l

06_buffer:
	glslViewer 06_b_m.frag assets/danny.png -l

07_doubleBuffer:
	glslViewer 07_d_m.frag -l

08_gpgpu:
	glslViewer 08_d_d_mt.vert 08_d_d_mt.frag -e pcl_plane -l 

