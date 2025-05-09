set logscale

plot [.00001:1.5] [0.9:5.4]  'hilbert2d/dc_h2d_256x256.gp' with l title 'Hilbert 256x256', \
  'gilbert2d/dc_g2d_215x152.gp' with l title 'Gilbert 215x152', \
  'gilbert2d/dc_g2d_215x215.gp' with l title 'Gilbert 215x215', \
  'gilbert2d/dc_g2d_152x215.gp' with l title 'Gilbert 152x215', \
  'gilbert2d/dc_g2d_215x181.gp' with l title 'Gilbert 215x181', \
  'gilbert2d/dc_g2d_215x215.gp' with l title 'Gilbert 215x215', \
  'gilbert2d/dc_g2d_181x215.gp' with l title 'Gilbert 181x215'

plot [.0001:0.41] [1.9:3.4]  'hilbert2d/dc_h2d_256x256.gp' with l title 'Hilbert 256x256', \
  'gilbert2d/dc_g2d_215x152.gp' with l title 'Gilbert 215x152', \
  'gilbert2d/dc_g2d_215x215.gp' with l title 'Gilbert 215x215', \
  'gilbert2d/dc_g2d_152x215.gp' with l title 'Gilbert 152x215', \
  'gilbert2d/dc_g2d_215x181.gp' with l title 'Gilbert 215x181', \
  'gilbert2d/dc_g2d_215x215.gp' with l title 'Gilbert 215x215', \
  'gilbert2d/dc_g2d_181x215.gp' with l title 'Gilbert 181x215'
  
  
  

