set logscale

set tics font 'Libertine,16'
set title font 'Libertine,16'
set xlabel font 'Libetine,16'
set ylabel font 'Libetine,16'
set label 1 font 'Libetine,16'
set key font 'Libertine,10'

set xlabel '|i-j| / N'
set ylabel 'S_{|i-j|} / |i-j|^{(1 + 1/2)}'

set title "\n"
set label 1 "2D Gilbert Binned Cumulative Distance   \n                    Data Collapse  " at graph 0.16,1.2 left


plot [.00001:1.25] [0.97:1.75]  'hilbert2d/dc_h2d_256x256.gp' with l title 'Hilbert 256x256', \
  'gilbert2d/dc_g2d_215x256.gp' with l title 'Gilbert 215x256', \
  'gilbert2d/dc_g2d_256x215.gp' with l title 'Gilbert 256x215', \
  'gilbert2d/dc_g2d_256x304.gp' with l title 'Gilbert 256x304', \
  'gilbert2d/dc_g2d_304x256.gp' with l title 'Gilbert 304x256', \
  'gilbert2d/dc_g2d_215x215.gp' with l title 'Gilbert 215x215', \
  'gilbert2d/dc_g2d_304x304.gp' with l title 'Gilbert 304x304'

set term pdf
set output "datacollapse_2d.pdf"
replot
unset output
unset term



#plot [.00001:0.61] [1.9:3.8]  'hilbert2d/dc_h2d_256x256.gp' with l title 'Hilbert 256x256', \
#  'gilbert2d/dc_g2d_215x152.gp' with l title 'Gilbert 215x152', \
#  'gilbert2d/dc_g2d_215x215.gp' with l title 'Gilbert 215x215', \
#  'gilbert2d/dc_g2d_152x215.gp' with l title 'Gilbert 152x215', \
#  'gilbert2d/dc_g2d_215x181.gp' with l title 'Gilbert 215x181', \
#  'gilbert2d/dc_g2d_215x215.gp' with l title 'Gilbert 215x215', \
#  'gilbert2d/dc_g2d_181x215.gp' with l title 'Gilbert 181x215'
#
