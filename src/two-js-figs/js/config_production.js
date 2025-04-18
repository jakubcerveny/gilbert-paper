// LICENSE: CC0
//

// inkscape doesn't respect rgba in fill or stroke,
// which is the main method of two.js to do it.
// As a hacky way to make sure it's inkscape compatible,
// the _dl() function will do a post processing step
// of going through each element and converting fill, stroke
// and linearGradient stop components with an rgba value
// to an rgb value with the appropriate 'opacity' portion
// set.
//

// Note on Libertine font,
// Chrome displays it, Inkscape displays it (using 'Linux Libertine O')
// but Firefox shits the bed for some reason.
// It looks like all font-family in `text` elements that have a space don't work.
// I'm tired of fighting with Firefox so I'm moving on as Inkscape works just fine.
//


// enumeration of paths for 2x2, 2x3, 3x2 and 3x3, along with
// a "no path" configuration
//

var g_fig_ctx = {

  "uniq_id_base": "customid_",
  "uniq_id_idx": 0,
  "postprocess": [],

  "html_id":"fig",
  "two": new Two({fitted:true}),
  "pal" : [
    [47,55,55], // black
    [67,54,51], // brown

    [242,244,203], // beige
    [255,94,91], // red
    [197,40,61], // other red

    [255,200,87], // yellow
    [233,114,76], // orange

    [155,195,212], // dark blue
    [164,216,224], // mid blue
    [168,225,230], // light blue

    [100,185,106], // hot green

    [139,177,116], // dark green
    [147,182,126],  // mid green
    [167,196,151]  // light green
  ],

  "rgba_pal" : [
    ""
  ],

  "geom":[],

};

//----
//----

function newID() {
  let id = g_fig_ctx.uniq_id_base + g_fig_ctx.uniq_id_idx.toString();
  g_fig_ctx.uniq_id_idx++;
  return id;
}

function appendPostProcess(_type, val) {
  g_fig_ctx.postprocess.push([_type, val]);
}

function toRGBAa(rgba) {
  let va = rgba.split(")")[0].split("(")[1].split(",");

  if (rgba.match( /^rgba\(/ )) {
    return va;
  }

  va.push(1);
  return va;
}

function _dl() {
  var ele = document.getElementById("config_production_canvas");
  let defs = document.getElementById("custom_defs");

  // very hacky, find the defs definition, take the defs
  // from the html and insert them here.
  // Probably should define the patterns in this file and
  // use two.js to append them...
  //
  let _defs = "<defs>";
  let svg_txt = ele.innerHTML;
  let pos = svg_txt.search("<defs>");

  let fin_txt = svg_txt.slice(0,pos);
  fin_txt +=  "<defs>";
  fin_txt += defs.innerHTML;
  fin_txt += svg_txt.slice(pos + _defs.length);

  var b = new Blob([ fin_txt ]);
  saveAs(b, "fig.svg");


}


//----
//----

//arrow
var LINE_COLOR = "rgb(81,166,10)";
LINE_COLOR = "rgb(71,145,55)";

function mkarrow(px, py, dx, dy, w, h) {
  let two = g_fig_ctx.two;

  let theta = Math.atan2(-dy,dx);
  theta += Math.PI/2;

  let ct = Math.cos(theta);
  let st = Math.sin(theta);

  let w2 = w/2;

  let q0 = [  ct*w2 - st*h, -st*w2 - ct*h ];
  let q1 = [ -ct*w2 - st*h,  st*w2 - ct*h ];

  let hh = h*0.95;

  let qm = [  ct*0  - st*hh, -st*0  - ct*hh ];

  q0[0] += px;
  q0[1] += py;

  q1[0] += px;
  q1[1] += py;

  qm[0] += px;
  qm[1] += py;

  let anch = makeTwoAnchor( [ [px,py], q0, qm, q1 ] );

  let _p = two.makePath( anch );

  _p.linewidth = 3;
  _p.stroke = LINE_COLOR;
  _p.fill = LINE_COLOR;
  _p.join = "round";
  _p.opacity = 1;

  return _p;
}

function mkarrowarc(pxy, qxy, cp_p_xy, awh) {
  awh = ((typeof awh === "undefined") ? [12,18] : awh);

  let two = g_fig_ctx.two;

  let s0_x = pxy[0],
      s0_y = pxy[1],
      e0_x = qxy[0],
      e0_y = qxy[1];
  let cp_f_x = cp_p_xy[0],
      cp_f_y = cp_p_xy[1];

  let _line = new Two.Path([
    new Two.Anchor(s0_x, s0_y,       0,       0,  cp_f_x, -cp_f_y,   Two.Commands.curve),
    new Two.Anchor(e0_x, e0_y, -cp_f_x, -cp_f_y,       0,       0,   Two.Commands.curve)
  ], false, false, true);
  _line.cap = "round"
  _line.linewidth = 3;
  _line.stroke = LINE_COLOR;
  _line.noFill();
  _line.opacity = 1;
  two.add(_line);

  // fudge
  //let _fu = [ cp_p_xy[0]/16, 0*cp_p_xy[1]/8 ];
  //let _arrow0 = mkarrow(e0_x+_fu[0],e0_y+3+_fu[1], cp_f_x,cp_f_y, awh[0], awh[1]);

  let _fu = [  cp_p_xy[0]/16, cp_p_xy[1]/8 ];
  let _arrow0 = mkarrow(e0_x+_fu[0],e0_y+_fu[1], cp_f_x,cp_f_y, awh[0], awh[1]);

}

function mkarrowarc_vertical(pxy, qxy, cp_p_xy, awh) {
  awh = ((typeof awh === "undefined") ? [12,18] : awh);

  let two = g_fig_ctx.two;

  let s0_x = pxy[0],
      s0_y = pxy[1],
      e0_x = qxy[0],
      e0_y = qxy[1];
  let cp_f_x = cp_p_xy[0],
      cp_f_y = cp_p_xy[1];

  let _line = new Two.Path([
    new Two.Anchor(s0_x, s0_y,       0,       0,  cp_f_x, -cp_f_y,   Two.Commands.curve),
    new Two.Anchor(e0_x, e0_y,  cp_f_x,  cp_f_y,       0,       0,   Two.Commands.curve)
  ], false, false, true);
  _line.cap = "round"
  _line.linewidth = 3;
  _line.stroke = LINE_COLOR;
  _line.noFill();
  _line.opacity = 1;
  two.add(_line);

  // fudge
  let _fu = [ cp_p_xy[0]/16, 0*cp_p_xy[1]/8 ];

  _fu = [ -cp_f_x/32, -cp_f_y/32];
  //let _arrow0 = mkarrow(e0_x+_fu[0],e0_y+3+_fu[1], -cp_f_x,-cp_f_y, awh[0], awh[1]);
  let _arrow0 = mkarrow(e0_x+_fu[0],e0_y+_fu[1], -cp_f_x,-cp_f_y, awh[0], awh[1]);

}


function makeTwoVector(_pnt) {
  let pnt = [];
  for (let ii=0; ii<_pnt.length; ii++) {
    pnt.push( new Two.Vector(_pnt[ii][0], _pnt[ii][1]) );
  }
  return pnt;
}

function makeTwoAnchor(_pnt) {
  let pnt = [];
  for (let ii=0; ii<_pnt.length; ii++) {
    pnt.push( new Two.Anchor(_pnt[ii][0], _pnt[ii][1]) );
  }
  return pnt;
}

function mk_checkerboard_path(opt) {
  let two = g_fig_ctx.two;

  let sx = opt.sx;
  let sy = opt.sy;

  let nx = opt.nx;
  let ny = opt.ny;

  let x_len = opt.x_len;
  let y_len = opt.y_len;

  let color_scheme = {
    "red-beige": [ [248,112,116], [248,235,187] ],
    "purple-light" : [[ 152,119,182], [228,220,242] ],
    "green-yellow": [  [85,149,100], [236,249, 179] ],
    "grey-light" : [ [142,162,172], [224,226,231] ]
  };

  let color = [

    // red beige
    //"rgba(248,112,116,0.4)",
    //"rgba(248,235,187,0.5)"

    //"rgba(152,119,182,0.5)",
    //"rgba(228,220,242,0.5)"

    //"rgba(152,119,182,0.375)",
    //"rgba(228,220,242,0.375)"
    "rgb(152,119,182)",
    "rgb(228,220,242)"

    //"rgba(200,255,200,0.7)",
    //"rgba(255,200,200,0.9)"
  ];

  let fudge_parity = ((nx*ny)%2);
  if (("initial_parity" in opt) &&
      (typeof opt.initial_parity !== "undefined")) {
    fudge_parity = opt.initial_parity;
  }

  for (let iy = 0; iy < ny; iy++) {
    for (let ix = 0; ix < nx; ix++) {

      let parity = (ix+iy +fudge_parity)%2;

      let x = sx + ix*x_len;
      let y = sy + iy*y_len;
      let rect = new Two.Rectangle( x,y, x_len, y_len );
      rect.linewidth = 0.5;
      //rect.stroke = "rgba(0,0,0,0.4)";
      rect.stroke = "rgb(0,0,0)";
      rect.fill = color[ parity ];

      rect.opacity = 0.375;

      two.add(rect);

    }
  }

  if ("path" in opt) {
    let _p = opt.path;

    //let _p = [ [0,0], [0,1], [1,1], [1,0], [2,0], [2,1] ];

    let path_r = 8.5;
    let path_color = "rgba(60,60,120,1)";


    //path_color = "rgba(180,170,239,1)";

    // this
    //path_color = "rgba(118,114,223,1)";
    path_color = "rgba(80,80,140,1)";

    //path_color = "rgba(159,226,235,1)";
    //path_color = "rgba(107,202,215,1)";

    //path_color = "rgba(166,197,237,1)";
    //path_color = "rgba(117,162,219,1)";

    let w_p = [];
    for (let idx = 0; idx < _p.length; idx++) {
      w_p.push( [ sx + _p[idx][0]*x_len, sy + _p[idx][1]*y_len ] );

      //let path_step = two.makeCircle( w_p[idx][0], w_p[idx][1], path_r) ;
      //path_step.fill = path_color;
      //path_step.linewidth = 0;
      //two.add( path_step );

    }

    let np_center = {};
    if (("nopath" in opt) &&
        (opt.nopath)) {
      np_center = w_p.pop();
    }

    let tv_path = makeTwoVector(w_p);
    let t_path = two.makePath(tv_path, true);
    t_path.fill = "rgba(0,0,0,0)";
    t_path.linewidth = 10;
    t_path.stroke = path_color;
    t_path.cap = 'round';
    t_path.join = 'round';

    //two.add(t_path);

    let start_circle = two.makeCircle( w_p[0][0], w_p[0][1], path_r );
    start_circle.fill = path_color;
    //start_circle.fill = "rgba(120,120,240,1)";
    //start_circle.fill = "rgba(180,240,180,1)";
    //start_circle.fill = "rgba(180,240,180,1)";
    start_circle.linewidth = 0;
    start_circle.stroke = path_color;

    if (("end_circle" in opt) &&
        (opt.end_circle)) {
      let n = w_p.length-1;
      let end_circle = two.makeCircle( w_p[n][0], w_p[n][1], path_r );
      //end_circle.fill = "rgba(120,120,240,1)";
      end_circle.fill = path_color;
      end_circle.linewidth = 0;
      end_circle.stroke = path_color;
    }

    if (("nopath" in opt) &&
        (opt.nopath)) {

      let alpha = [
        1.15*Math.sqrt(2)*x_len/8,
        1.15*Math.sqrt(2)*y_len/8
      ];

      let co = "rgba(255,81,53,1)";
      co = "rgba(255,110,88,1)";
      co = "rgba(241,3,31,1)";
      co = "rgba(245,52,74,1)";
      co = "rgba(252,74,3,1)";
      co = "rgba(252,41,3,1)";

      co  = "rgba(162,47,26,1)";
      co  = "rgba(255,40,0,1)";
      co  = "rgba(250,42,0,.9)";
      co  = "rgba(236,0,51,0.99)";
      co  = "rgba(190,0,41,1)";

      co = "rgba(252,37,3,0.95)"; //!
      co = "rgb(252,37,3)"; //!

      let lw = 4.5;

      let pnt_cross_a = [
        [np_center[0] + alpha[0], np_center[1] + alpha[1]],
        [np_center[0] - alpha[0], np_center[1] - alpha[1]]
      ];
      let cross_a = makeTwoVector(pnt_cross_a);

      let ca = two.makePath(cross_a);
      ca.linewidth = lw;
      ca.stroke = co;
      ca.cap = 'round';
      ca.join = 'round';

      let pnt_cross_b = [
        [np_center[0] + alpha[0], np_center[1] - alpha[1]],
        [np_center[0] - alpha[0], np_center[1] + alpha[1]]
      ];
      let cross_b = makeTwoVector(pnt_cross_b);

      let cb = two.makePath(cross_b);
      cb.linewidth = lw;
      cb.stroke = co;
      cb.cbp = 'round';
      cb.join = 'round';

    }

  }

  two.update();
}

function mkbox(opt) {
  let two = g_fig_ctx.two;

  let cx = opt.cx,
      cy = opt.cy,
      x_len = opt.x_len,
      y_len = opt.y_len;

  let font_offset = [10,14];

  let radius = 5,
      c_offset = 10;

  let fs = 18;

  let font_style = {
    "size": fs,
    "family": "Libertine, Linux Libertine 0"
  };

  //let path_color = "rgba(80,80,140,1)";
  //let path_color_p = "rgba(120,180,180,1)";
  let path_color = "rgb(80,80,140)";
  let path_color_p = "rgb(120,180,180)";

  //---
  let square_size = x_len / opt.nx;
  let opt_board = {
    "sx": cx - (x_len/2) + (square_size/2), "sy": cy - (y_len/2) + (square_size/2),
    "nx": opt.nx, "ny": opt.ny,
    "initial_parity": opt.initial_parity,
    "x_len": square_size, "y_len": square_size
  };
  mk_checkerboard_path(opt_board);


  let box = two.makeRectangle(cx,cy, x_len,y_len);
  //box.fill = "rgba(0,0,0,0)";
  box.noFill();

  let fo_off_x = -2*font_offset[0] - 1.5*opt.text_h.length;

  //let txt_side      = two.makeText(opt.text_h, cx - x_len/2 - 2*font_offset[0], cy, font_style);
  let txt_side      = two.makeText(opt.text_h, cx - x_len/2 + fo_off_x, cy, font_style);
  //let txt_side_A    = two.makeText("A", cx - x_len/2 - 2*font_offset[0], cy + fs, font_style);

  let txt_bottom    = two.makeText(opt.text_w, cx, cy + (y_len/2) + font_offset[1], font_style);
  //let txt_bottom_B  = two.makeText("B", cx, cy + (y_len/2) + font_offset[1], font_style);

  let circle_s = two.makeCircle(cx - (x_len/2) + c_offset, cy + (y_len/2) - c_offset, radius);
  circle_s.linewidth = 0;
  circle_s.fill = path_color;

  if (("nopath" in opt) &&
      (opt.nopath)) {

    let lc = [ cx + (x_len/2) - c_offset, cy + (y_len/2) - c_offset ];

    let cross_0 = two.makeLine( lc[0] - radius, lc[1] + radius, lc[0] + radius, lc[1] - radius );
    cross_0.linewidth = 1.5;
    //cross_0.stroke = "rgba(252,37,3,0.95)";
    cross_0.stroke = "rgb(252,37,3)";
    cross_0.join = "round";

    let cross_1 = two.makeLine( lc[0] + radius, lc[1] + radius, lc[0] -radius, lc[1] - radius );
    cross_1.linewidth = 1.5;
    //cross_1.stroke = "rgba(252,37,3,0.95)";
    cross_1.stroke = "rgb(252,37,3)";
    cross_1.join = "round";

  }
  else {
    let circle_e = two.makeCircle(cx + (x_len/2) - c_offset, cy + (y_len/2) - c_offset, radius);
    circle_e.linewidth = 0;
    circle_e.fill = path_color_p;
  }



  // fudge
  let _fu = [ 10 ,10];

  mkarrowarc(
    [ cx - (x_len/2) + c_offset + _fu[0], cy + (y_len/2) - c_offset - _fu[1]],
    [ cx + (x_len/2) - c_offset - _fu[0], cy + (y_len/2) - c_offset - _fu[1]],
    [ x_len/6, y_len/6 ],
    [10,16]
  );


  //two.update();
}



function mkbox_subdiv(opt) {
  let two = g_fig_ctx.two;

  let cx = opt.cx,
      cy = opt.cy,
      x_len = opt.x_len,
      y_len = opt.y_len;

  let font_offset = [37,14];
  font_offset = [10,14];

  let radius = 5,
      c_offset = 10;

  let fs = 16;
  //fs = 18;

  let font_style = {
    "size": fs,
    "family": "Libertine, Linux Libertine 0"
  };

  //let path_color = "rgba(80,80,140,1)";
  //let path_color_p = "rgba(120,180,180,1)";

  let path_color = "rgb(80,80,140)";
  let path_color_p = "rgb(120,180,180)";



  //---
  let square_size = x_len / opt.nx;
  let opt_board = {
    "sx": cx - (x_len/2) + (square_size/2), "sy": cy - (y_len/2) + (square_size/2),
    "nx": opt.nx, "ny": opt.ny,
    "initial_parity": opt.initial_parity,
    "x_len": square_size, "y_len": square_size
  };
  mk_checkerboard_path(opt_board);



  let box = two.makeRectangle(cx,cy, x_len,y_len);
  //box.fill = "rgba(0,0,0,0)";
  box.noFill();


  let dh = 0;
  let dw = 0;

  if ("line_ds" in opt) {
    dh = opt.line_ds[0];
    dw = opt.line_ds[1];
  }

  let line_hor = two.makeLine( cx - (x_len/2), cy + dh,
                               cx + (x_len/2), cy + dh);
  line_hor.linewidth = 3;
  //line_hor.stroke = "rgba(20,20,20,1)";
  line_hor.stroke = "rgb(20,20,20)";
  //line_hor.fill = "rgba(0,0,0,0)";
  line_hor.noFill();

  let line_ver = two.makeLine( cx + dw, cy + dh,
                               cx + dw, cy + (y_len/2) );
  line_ver.linewidth = 3;
  //line_ver.stroke = "rgba(20,20,20,1)";
  //line_ver.fill = "rgba(0,0,0,0)";
  line_ver.stroke = "rgb(20,20,20)";
  line_ver.noFill();

  let fo_off_x = [
    - 2*font_offset[0] - (1.5*opt.text_h[0].length),
    - 2*font_offset[0] - (1.5*opt.text_h[1].length)
  ];

  fo_off_x = [
    - 2*font_offset[0] - (1.9*opt.text_h[0].length),
    - 2*font_offset[0] - (1.9*opt.text_h[1].length)
  ];


  //let txt_side_a1  = two.makeText(opt.text_h[0], cx - x_len/2 - font_offset[0], cy - (y_len/4) + dh/2, font_style);
  //let txt_side_a0_eo  = two.makeText(opt.text_h[1], cx - x_len/2 - font_offset[0], cy + (y_len/4)+ dh/2, font_style);
  let txt_side_a1     = two.makeText(opt.text_h[0], cx - x_len/2 + fo_off_x[0], cy - (y_len/4) + dh/2, font_style);
  let txt_side_a0_eo  = two.makeText(opt.text_h[1], cx - x_len/2 + fo_off_x[1], cy + (y_len/4)+ dh/2, font_style);

  let txt_bottom_b0_eo  = two.makeText(opt.text_w[0], cx - x_len/4 + dw/2, cy + (y_len/2) + font_offset[1], font_style);
  let txt_bottom_b1_eo  = two.makeText(opt.text_w[1], cx + x_len/4 + dw/2, cy + (y_len/2) + font_offset[1], font_style);

  let circle_s = two.makeCircle(cx - (x_len/2) + c_offset, cy + (y_len/2) - c_offset, radius);
  circle_s.linewidth = 0;
  circle_s.fill = path_color;


  if (("nopath" in opt) &&
      (opt.nopath)) {

    let lc = [ cx + (x_len/2) - c_offset, cy  - c_offset + dh ];

    let cross_0 = two.makeLine( lc[0] - radius, lc[1] + radius, lc[0] + radius, lc[1] - radius );
    cross_0.linewidth = 1.5;
    cross_0.stroke = "rgb(252,37,3)";
    cross_0.join = "round";

    let cross_1 = two.makeLine( lc[0] + radius, lc[1] + radius, lc[0] -radius, lc[1] - radius );
    cross_1.linewidth = 1.5;
    cross_1.stroke = "rgb(252,37,3)";
    cross_1.join = "round";

  }
  else {
    let circle_a1_e = two.makeCircle(cx + (x_len/2) - c_offset, cy  - c_offset + dh, radius);
    circle_a1_e.linewidth = 0;
    circle_a1_e.fill = path_color_p;
  }

  // C block - left middle to right middle
  //
  let awh = [1.15*opt.ny, 1.15*10*opt.ny/6 ];
  let _fu = [ 10,-10];
  mkarrowarc(

    [ cx - (x_len/2) + c_offset + _fu[0], cy  - c_offset + dh + _fu[1]],
    [ cx + (x_len/2) - c_offset - _fu[0], cy  - c_offset + dh + _fu[1]],
    [  x_len/6,  y_len/6 ],
    awh
    //[8,14]
  );



  let circle_a0_e = two.makeCircle(cx - (x_len/2) + c_offset, cy  + c_offset + dh, radius);
  circle_a0_e.linewidth = 0;
  circle_a0_e.fill = path_color_p;


  let circle_a1_s = two.makeCircle(cx - (x_len/2) + c_offset, cy  - c_offset + dh, radius);
  circle_a1_s.linewidth = 0;
  circle_a1_s.fill = path_color;

  // A block - left arrow from bottom left to middle
  //
  let f_cp = [1,1.5];
  f_cp[0] *= y_len / 9;
  f_cp[1] *= y_len / 9;

  awh = [1.15*opt.ny, 1.15*10*opt.ny/6 ];

  if ( opt.ny <= 5) {
    f_cp = [ 4, 12 ];
    awh = [.95*opt.ny, .95*10*opt.ny/6 ];
  }
  //f_cp = [ 1/ (Math.abs(dh)), 1/ 
  _fu = [ 6, -6 ];
  mkarrowarc_vertical(
    [ cx - (x_len/2) + c_offset + _fu[0], cy + (y_len/2) - c_offset + _fu[1]],
    [ cx - (x_len/2) + c_offset + _fu[0], cy  + c_offset + dh - _fu[1]],
    //[  x_len/10,  y_len/10 ],
    //[  f_cp[0]*x_len,  f_cp[1]*x_len ],
    f_cp,
    awh
    //[6,10]
  );



  let circle_b1_s = two.makeCircle(cx + (x_len/2) - c_offset, cy  + c_offset + dh, radius);
  circle_b1_s.linewidth = 0;
  circle_b1_s.fill = path_color;

  let circle_e = two.makeCircle(cx + (x_len/2) - c_offset, cy + (y_len/2) - c_offset, radius);
  circle_e.linewidth = 0;
  circle_e.fill = path_color_p;



  // C block - right arrow from middle right to bottom right
  //
  //f_cp = [-10, -24];
  //f_cp = [-14, -14];
  awh = [1.15*opt.ny, 1.15*10*opt.ny/6 ];

  f_cp = [-1,-1.5];
  f_cp[0] *= y_len / 9;
  f_cp[1] *= y_len / 9;


  if ( opt.ny <= 5) {
    f_cp = [ -4, -12 ];
    awh = [.95*opt.ny, .95*10*opt.ny/6 ];
  }
  _fu = [ -6,  6 ];
  mkarrowarc_vertical(
    [ cx + (x_len/2) - c_offset + _fu[0], cy  + c_offset + dh + _fu[1]],
    [ cx + (x_len/2) - c_offset + _fu[0], cy + (y_len/2) - c_offset - _fu[1]],
    f_cp,
    awh
    //[ -x_len/10, -y_len/10 ],
    //[6,10]
  );


}

function mk_oo(cur_x, cur_y, x_len, y_len, dx, dy) {

  //----------
  //----------
  //----------
  // odd height, odd width (simplest case)
  //
  box_opt = {
    "cx": cur_x, "cy": cur_y,
    "x_len": x_len, "y_len": y_len,
    "nx": 5, "ny": 5,
    "initial_parity": 1,
    "text_h" : "2h+1",
    "text_w": "2w+1"
  }

  let _ss = x_len / 5;
  cur_x += dx;
  box_subdiv_opt = {
    "cx": cur_x, "cy": cur_y,
    "x_len": x_len, "y_len": y_len,
    "line_ds": [ +_ss/2, -_ss/2 ],
    "initial_parity": 1,
    "nx": 5, "ny": 5,
    "text_h" : ["2⌊h/2⌋+1", "2⌊h/2⌋" ],
    "text_w" : ["2⌊w/2⌋", "2⌊w/2⌋+1" ]
  };

  mkbox(box_opt);
  mkbox_subdiv(box_subdiv_opt);

}

function mk_oe(cur_x, cur_y, x_len, y_len, dx, dy) {

  let start_x = cur_x;
  let start_y = cur_y;

  // odd height, even width
  //
  box_opt = {
    "cx": cur_x, "cy": cur_y,
    "x_len": 4*x_len/5, "y_len": y_len,
    "nx": 4, "ny": 5,
    "initial_parity": 1,
    "text_h" : "2h+1",
    "text_w": "4w"
  }

  cur_x += dx-30;
  box_subdiv_opt = {
    "cx": cur_x, "cy": cur_y,
    "x_len": 4*x_len/5, "y_len": y_len,
    "nx": 4, "ny": 5,
    "initial_parity": 1,
    "line_ds": [ x_len/10, 0 ],
    "text_h" : ["2⌊h/2⌋+1", "2⌊h/2⌋" ],
    "text_w" : ["2w", "2w" ]
  };

  mkbox(box_opt);
  mkbox_subdiv(box_subdiv_opt);

  // odd height, even width
  //
  //cur_x = start_x;
  //cur_y += dy;
  cur_x += dx-30;
  box_opt = {
    "cx": cur_x, "cy": cur_y,
    "x_len": x_len, "y_len": 5*y_len/6,
    "nx": 6, "ny": 5,
    "initial_parity": 1,
    "text_h" : "2h+1",
    "text_w": "4w+2"
  }

  cur_x += dx;

  /*
  box_subdiv_opt = {
    "cx": cur_x, "cy": cur_y,
    "x_len": x_len, "y_len": 5*y_len/6,
    "nx": 6, "ny": 5,
    "line_ds": [ -x_len/12, 0 ],
    "initial_parity": 1,
    "text_h" : ["2⌊h/2⌋+1", "2⌊h/2⌋" ],
    "text_w" : ["2w+1", "2w+1" ]
  };
  */

  box_subdiv_opt = {
    "cx": cur_x, "cy": cur_y,
    "x_len": x_len, "y_len": 5*y_len/6,
    "nx": 6, "ny": 5,
    "line_ds": [  x_len/12, 0 ],
    "initial_parity": 1,
    "text_h" : ["2⌊h/2⌋+1", "2⌊h/2⌋" ],
    "text_w" : ["2w+1", "2w+1" ]
  };

  mkbox(box_opt);
  mkbox_subdiv(box_subdiv_opt);


}

function mk_ee(cur_x, cur_y, x_len, y_len, dx, dy) {

  let start_x = cur_x;
  let start_y = cur_y;

  //----------
  //----------
  //----------
  // even height, even width
  //
  //cur_x = start_x + 2*dx - dx/8;
  //cur_y = start_y;
  box_opt = {
    "cx": cur_x, "cy": cur_y,
    "x_len": x_len, "y_len": y_len,
    "initial_parity":0,
    "nx": 4, "ny": 4,
    "text_h" : "4h",
    "text_w": "4w"
  }

  cur_x += dx - dx/8;
  box_subdiv_opt = {
    "cx": cur_x, "cy": cur_y,
    "x_len": x_len, "y_len": y_len,
    "initial_parity":0,
    "nx": 4, "ny": 4,
    "text_h" : ["2h", "2h" ],
    "text_w": ["2w", "2w" ]
  };

  mkbox(box_opt);
  mkbox_subdiv(box_subdiv_opt);

  //--
  //
  //cur_x = start_x ;
  //cur_y += + dy - dy/8;
  cur_x = start_x + 2*dx-30;
  cur_y = start_y;
  //cur_y += + dy - dy/8;
  box_opt = {
    "cx": cur_x, "cy": cur_y,
    "x_len": x_len, "y_len": 4*y_len/6,
    "initial_parity":0,
    "nx": 6, "ny": 4,
    "text_h" : "4h",
    "text_w": "4w+2"
  }

  cur_x += dx - dx/8;
  box_subdiv_opt = {
    "cx": cur_x, "cy": cur_y,
    "x_len": x_len, "y_len": 4*y_len/6,
    "initial_parity":0,
    "nx": 6, "ny": 4,
    "text_h" : ["2h", "2h" ],
    "text_w": ["2w+1", "2w+1" ]
  };

  mkbox(box_opt);
  mkbox_subdiv(box_subdiv_opt);



  //cur_x = start_x + 2*dx - dx/4;
  //cur_y = start_y;
  cur_x = start_x;
  cur_y += dy;
  box_opt = {
    "cx": cur_x, "cy": cur_y,
    "x_len": x_len, "y_len": y_len,
    "initial_parity":0,
    "nx": 6, "ny": 6,
    "text_h" : "4h+2",
    "text_w": "4w+2"
  }

  cur_x += dx - dx/8;

  /*
  box_subdiv_opt = {
    "cx": cur_x, "cy": cur_y,
    "x_len": x_len, "y_len": y_len,
    "initial_parity":0,
    "nx": 6, "ny": 6,
    "text_h" : ["2h+1", "2h+1" ],
    "text_w": ["2w+1", "2w+1" ]
  };
  */
  box_subdiv_opt = {
    "cx": cur_x, "cy": cur_y,
    "x_len": x_len, "y_len": y_len,
    "initial_parity":0,
    "nx": 6, "ny": 6,
    "line_ds" : [ -x_len/6, 0 ],
    "text_h" : ["2h", "2h+2" ],
    "text_w": ["2w+1", "2w+1" ]
  };

  mkbox(box_opt);
  mkbox_subdiv(box_subdiv_opt);



  //cur_x = start_x + 2*dx - dx/4;
  //cur_y = start_y;
  cur_x = start_x + 2*dx-30;
  cur_y = start_y + dy;
  box_opt = {
    "cx": cur_x, "cy": cur_y,
    "x_len": x_len, "y_len": 6*y_len/8,
    "initial_parity":0,
    "nx": 8, "ny": 6,
    "text_h" : "4h+2",
    "text_w": "4w"
  }

  cur_x += dx - dx/8;
  box_subdiv_opt = {
    "cx": cur_x, "cy": cur_y,
    "x_len": x_len, "y_len": 6*y_len/8,
    "initial_parity":0,
    "nx": 8, "ny": 6,
    "line_ds" : [ -x_len/8, 0],
    "text_h" : ["2h", "2h+2" ],
    "text_w": ["2w", "2w" ]
  };

  mkbox(box_opt);
  mkbox_subdiv(box_subdiv_opt);


}

function mk_eo(cur_x, cur_y, x_len, y_len, dx, dy) {

  let start_x = cur_x;
  let start_y = cur_y;

  //----------
  //----------
  //----------
  // even height, odd width
  //
  box_opt = {
    "cx": cur_x, "cy": cur_y,
    "x_len": x_len, "y_len": 4*y_len/5,
    "initial_parity":0,
    "nx": 5, "ny": 4,
    "nopath": true,
    "text_h" : "4h",
    "text_w": "2w+1"
  }

  cur_x += dx - dx/8;
  box_subdiv_opt = {
    "cx": cur_x, "cy": cur_y,
    "x_len": x_len, "y_len": 4*y_len/5,
    "initial_parity":0,
    "nx": 5, "ny": 4,
    "line_ds" : [ 0, -y_len/10 ],
    "text_h" : ["2h", "2h" ],
    "nopath": true,

    //"text_w": ["2w", "2w+1" ]

    //"text_h" : ["2⌊h/2⌋+1", "2⌊h/2⌋" ],
    "text_w" : ["2⌊w/2⌋", "2⌊w/2⌋+1" ]
  };

  mkbox(box_opt);
  mkbox_subdiv(box_subdiv_opt);

  //----------
  //
  cur_x = start_x;
  cur_y += dy;
  box_opt = {
    "cx": cur_x, "cy": cur_y,
    "x_len": x_len, "y_len": 6*y_len/5,
    "initial_parity":0,
    "nx": 5, "ny": 6,
    "nopath": true,
    "text_h" : "4h+2",
    "text_w": "2w+1"
  }

  cur_x += dx - dx/8;
  box_subdiv_opt = {
    "cx": cur_x, "cy": cur_y,
    "x_len": x_len, "y_len": 6*y_len/5,
    "initial_parity":0,
    "nx": 5, "ny": 6,
    "line_ds" : [ -x_len/5, -y_len/10 ],
    "nopath": true,
    "text_h" : ["2h", "2h+2" ],
    //"text_w": ["2w", "2w+1" ]
    "text_w" : ["2⌊w/2⌋", "2⌊w/2⌋+1" ]
  };

  mkbox(box_opt);
  mkbox_subdiv(box_subdiv_opt);

}

function config_production_init() {
  let two = g_fig_ctx.two;

  var ele = document.getElementById("config_production_canvas");
  two.appendTo(ele);

  g_fig_ctx.width = two.width;
  g_fig_ctx.height = two.height;

  let W = g_fig_ctx.width;
  let H = g_fig_ctx.height;

  let start_x = 150,
      start_y = 100;

  let cur_x = start_x;
  let cur_y = start_y;

  let dx = 230,
      dy = 250;

  let x_len = 150,
      y_len = 150;

  let box_opt = {},
      box_subdiv_opt = {};

  let font_style = {
    "size": 18,
    "family": "Libertine, Linux Libertine 0"
  };


  //TODO make diviisions, region identification
  //and legend

  cur_x = start_x ;
  cur_y = start_y + 30;
  mk_oe(cur_x, cur_y, x_len, y_len, dx, dy);

  two.makeText("odd/even", cur_x - 80, cur_y - 100, font_style );


  //---
  //---

  cur_x = start_x + 4*dx - 30;
  cur_y = start_y + 30;
  mk_oo(cur_x, cur_y, x_len, y_len, dx, dy);

  two.makeText("odd/odd", cur_x - 80, cur_y - 100, font_style );

  let _vl = two.makeLine(cur_x-160, 0, cur_x-160, H);
  _vl.linewidth = 4;
  //_vl.stroke = "rgba(160,160,160,1.0)";
  _vl.stroke = "rgb(160,160,160)";

  //---
  //---

  cur_x = start_x + 4*dx - 30;
  cur_y = start_y + dy;
  mk_eo(cur_x, cur_y, x_len, y_len, dx, dy);

  two.makeText("even/odd", cur_x - 80, cur_y - 100, font_style );

  let _hl = two.makeLine(0, cur_y - 120, W, cur_y - 115);
  _hl.linewidth = 4;
  //_hl.stroke = "rgba(160,160,160,1.0)";
  _hl.stroke = "rgb(160,160,160)";

  //---
  //---

  cur_x = start_x ;
  cur_y = start_y + dy;
  mk_ee(cur_x, cur_y, x_len, y_len, dx, dy);

  two.makeText("even/even", cur_x - 80, cur_y - 100, font_style );

  two.update();
  return;

}



