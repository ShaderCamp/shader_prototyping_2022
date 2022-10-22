00_platform:
	glslViewer 00_m_platform.frag -l

00_billboard:
	glslViewer 00_m.frag -l

01_material:
	glslViewer 01_mt.frag assets/skull.obj -l

02_background:
	glslViewer 02_bg_mt.frag assets/skull.obj -l

03_postprocessing:
	glslViewer 03_bg_mt_pp.frag assets/skull.obj -l

04_multiple_materials:
	glslViewer 04_mt_mt.vert 04_mt_mt.frag assets/skull.obj -l

05_floor:
	glslViewer 05_mt_fl.frag assets/skull.obj -l

06_buffer:
	glslViewer 06_b_mt_pp.frag assets/skull.obj -l

07_doubleBuffer:
	glslViewer 07_d_mt.frag assets/skull.obj -l

