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
  var ele = document.getElementById("simple_hampath_canvas");
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

    "rgba(152,119,182,0.5)",
    "rgba(228,220,242,0.5)"

    //"rgba(200,255,200,0.7)",
    //"rgba(255,200,200,0.9)"
  ];

  let _p = opt.path;

  //let _p = [ [0,0], [0,1], [1,1], [1,0], [2,0], [2,1] ];

  let fudge_parity = ((nx*ny)%2);
  if ("initial_parity" in opt) {
    fudge_parity = opt.initial_parity;
  }

  for (let iy = 0; iy < ny; iy++) {
    for (let ix = 0; ix < nx; ix++) {

      let parity = (ix+iy +fudge_parity)%2;

      let x = sx + ix*x_len;
      let y = sy + iy*y_len;
      let rect = new Two.Rectangle( x,y, x_len, y_len );
      rect.linewidth = 0.5;
      rect.stroke = "rgba(0,0,0,0.4)";
      //rect.fill = "rgba(255, 200, 200, 1)";
      rect.fill = "rgba(255, 200, 200, 1)";
      rect.fill = color[ parity ];
      two.add(rect);

    }
  }

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


  two.update();
}

function simple_hampath_init() {
  let two = g_fig_ctx.two;

  var ele = document.getElementById("simple_hampath_canvas");
  two.appendTo(ele);

  //two.update();

  let square_size = 50;


  // y+ is downwards
  //
  let sx = 50,
      sy = 50,
      cur_x = 50,
      cur_y = 50,
      dx = 200,
      dy = 200;

  // path creep fudge
  let pcf = 0.35;
  pcf = 0.45;

  //cur_x += dx;
  cur_x = sx;
  let opt_2x2_ul = {
    "sx": cur_x, "sy": cur_y,
    "nx": 2, "ny": 2,
    "x_len": square_size, "y_len": square_size,
    "path": [ [0,1], [1,1], [1,0], [0,0] ]
  };
  mk_checkerboard_path(opt_2x2_ul);
  cur_x += dx - (3*square_size/2);

  let opt_2x2_lr = {
    "sx": cur_x, "sy": cur_y,
    "nx": 2, "ny": 2,
    "x_len": square_size, "y_len": square_size,
    "path": [ [0,1], [0,0], [1,0], [1,1] ]
  };
  mk_checkerboard_path(opt_2x2_lr);
  cur_x += dx - (3*square_size/2);

  let opt_2x2_np = {
    "sx": cur_x, "sy": cur_y,
    "nx": 2, "ny": 2,
    "nopath": true,
    "x_len": square_size, "y_len": square_size,
    "path": [ [0,1], [0,pcf],  [1,0] ]
    //"path": [ [0,1], [0,0], [1,0], [1,1] ]
  };
  mk_checkerboard_path(opt_2x2_np);
  //cur_x += dx - square_size;

  /*
  cur_x = sx;
  cur_y += dy - (3*square_size/2);
  let opt_2x3_ur = {
    "sx": cur_x, "sy": cur_y,
    "nx": 2, "ny": 3,
    "initial_parity": 1,
    "x_len": square_size, "y_len": square_size,
    "path": [ [0,2], [1,2], [1,1], [0,1], [0,0], [1,0] ]
  };
  mk_checkerboard_path(opt_2x3_ur);
  cur_x += dx - (3*square_size/2);

  let opt_2x3_lr= {
    "sx": cur_x, "sy": cur_y,
    "nx": 2, "ny": 3,
    "initial_parity": 1,
    "x_len": square_size, "y_len": square_size,
    "path": [ [0,2], [0,1], [0,0], [1,0], [1,1], [1,2] ]
  };
  mk_checkerboard_path(opt_2x3_lr);
  cur_x += dx - (3*square_size/2);

  let opt_2x3_np = {
    "sx": cur_x, "sy": cur_y,
    "nx": 2, "ny": 3,
    "nopath": true,
    "initial_parity": 1,
    "x_len": square_size, "y_len": square_size,
    "path": [ [0,2], [1,2], [1,1+pcf], [0,0] ]
    //"path": [ [0,2], [0,1], [0,0], [1,0], [1,1], [1,2] ]
  };
  mk_checkerboard_path(opt_2x3_np);
  cur_x += dx;
  */


  cur_x = sx;
  cur_y += dy - (3*square_size/2);
  let opt_3x2_ur = {
    "sx": cur_x, "sy": cur_y,
    "nx": 3, "ny": 2,
    "x_len": square_size, "y_len": square_size,
    "path": [ [0,1], [0,0], [1,0], [1,1], [2,1], [2,0] ]
  };
  mk_checkerboard_path(opt_3x2_ur);
  cur_x += dx - (square_size/2);

  let opt_3x2_ul = {
    "sx": cur_x, "sy": cur_y,
    "nx": 3, "ny": 2,
    "x_len": square_size, "y_len": square_size,
    "path": [ [0,1], [1,1], [2,1], [2,0], [1,0], [0,0] ]
  };
  mk_checkerboard_path(opt_3x2_ul);
  cur_x += dx - (square_size/2);

  let opt_3x2_np = {
    "sx": cur_x, "sy": cur_y,
    "nx": 3, "ny": 2,
    "nopath": true,
    "x_len": square_size, "y_len": square_size,
    "path": [ [0,1], [0,0], [1-pcf,0], [2,1] ]
    //"path": [ [0,1], [1,1], [2,1], [2,0], [1,0], [0,0] ]
  };
  mk_checkerboard_path(opt_3x2_np);
  cur_x += dx;



  cur_x = sx;
  cur_y += dy - (3*square_size/2);
  let opt_3x3_ur = {
    "sx": cur_x, "sy": cur_y,
    "nx": 3, "ny": 3,
    "x_len": square_size, "y_len": square_size,
    "path": [
      [0,2], [0,1], [0,0],
      [1,0], [1,1], [1,2],
      [2,2], [2,1], [2,0]
      ]
  };
  mk_checkerboard_path(opt_3x3_ur);
  cur_x += dx - (square_size/2);

  let opt_3x3_ul = {
    "sx": cur_x, "sy": cur_y,
    "nx": 3, "ny": 3,
    "x_len": square_size, "y_len": square_size,
    "path": [
      [0,2], [0,1], [1,1], [1,2],
      [2,2], [2,1], [2,0], [1,0], [0,0]
      ]
  };
  mk_checkerboard_path(opt_3x3_ul);
  cur_x += dx - (square_size/2);

  let opt_3x3_lr = {
    "sx": cur_x, "sy": cur_y,
    "nx": 3, "ny": 3,
    "x_len": square_size, "y_len": square_size,
    "path": [
      [0,2], [1,2], [1,1], [0,1],
      [0,0], [1,0], [2,0], [2,1], [2,2]
      ]
  };
  mk_checkerboard_path(opt_3x3_lr);


}


