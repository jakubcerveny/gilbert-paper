set logscale
set tics font 'Libertine,14'
set title font 'Libertine,14'
set xlabel font 'Libetine,14'
set ylabel font 'Libetine,14'
set label 1 font 'Libetine,14'
set key font 'Libertine,10'

set xlabel '|i-j| / N'
set ylabel 'S_{|i-j|} / |i-j|^{(1 + 1/3)}'

set title "\n"
set label 1 "3D Gilbert Binned Cumulative Distance   \n                    Data Collapse  " at graph 0.16,1.2 left

plot [.000015:1.2] [0.95:5.9]  'hilbert3d/dc_h3d_32x32x32.gp' with l title 'Hilbert 32x32x32', \
  'gilbert3d/dc_g3d_26x32x32.gp' with l title 'Gilbert 26x32x32', \
  'gilbert3d/dc_g3d_32x26x32.gp' with l title 'Gilbert 32x26x32', \
  'gilbert3d/dc_g3d_32x32x26.gp' with l title 'Gilbert 32x32x26', \
  'gilbert3d/dc_g3d_38x32x32.gp' with l title 'Gilbert 38x32x32', \
  'gilbert3d/dc_g3d_32x38x32.gp' with l title 'Gilbert 32x38x32', \
  'gilbert3d/dc_g3d_32x32x38.gp' with l title 'Gilbert 32x32x38', \

set term pdf
set output "datacollapse_3d.pdf"
replot
unset output
unset term


#plot [.000005:0.7] [1.9:3.1]  'hilbert3d/dc_h3d_32x32x32.gp' with l title 'Hilbert 32x32x32', \
#  'gilbert3d/dc_g3d_26x32x32.gp' with l title 'Gilbert 26x32x32', \
#  'gilbert3d/dc_g3d_32x26x32.gp' with l title 'Gilbert 32x26x32', \
#  'gilbert3d/dc_g3d_32x32x26.gp' with l title 'Gilbert 32x32x26', \
#  'gilbert3d/dc_g3d_38x32x32.gp' with l title 'Gilbert 38x32x32', \
#  'gilbert3d/dc_g3d_32x38x32.gp' with l title 'Gilbert 32x38x32', \
#  'gilbert3d/dc_g3d_32x32x38.gp' with l title 'Gilbert 32x32x38', \
#

#plot [.000005:0.7] [1.9:3.1]  'hilbert3d/dc_h3d_32x32x32.gp' with l title 'Hilbert 32x32x32', \
#  'gilbert3d/dc_g3d_45x53x53.gp' with l title 'Gilbert 45x53x53', \
#  'gilbert3d/dc_g3d_53x45x53.gp' with l title 'Gilbert 53x45x53', \
#  'gilbert3d/dc_g3d_53x53x45.gp' with l title 'Gilbert 53x53x45', \
#  'gilbert3d/dc_g3d_32x32x32.gp' with l title 'Gilbert 32x32x32', \
#
##  'gilbert3d/dc_g3d_53x53x45.gp' with l title 'Gilbert 38x45x53', \
##  'gilbert3d/dc_g3d_53x53x45.gp' with l title 'Gilbert 45x38x53', \
##  'gilbert3d/dc_g3d_53x53x45.gp' with l title 'Gilbert 53x38x45', \
##  'gilbert3d/dc_g3d_53x53x45.gp' with l title 'Gilbert 53x45x38', \

#plot [.0001:0.41] [1.9:3.4]  'hilbert2d/dc_h2d_256x256.gp' with l title 'Hilbert 256x256', \
#  'gilbert2d/dc_g2d_215x152.gp' with l title 'Gilbert 215x152', \
#  'gilbert2d/dc_g2d_215x215.gp' with l title 'Gilbert 215x215', \
#  'gilbert2d/dc_g2d_152x215.gp' with l title 'Gilbert 152x215', \
#  'gilbert2d/dc_g2d_215x181.gp' with l title 'Gilbert 215x181', \
#  'gilbert2d/dc_g2d_215x215.gp' with l title 'Gilbert 215x215', \
#  'gilbert2d/dc_g2d_181x215.gp' with l title 'Gilbert 181x215'

