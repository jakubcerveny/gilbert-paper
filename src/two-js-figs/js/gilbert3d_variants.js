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

var _PROJECT_VEC = [
  [ Math.sqrt(3)/2, Math.sqrt(3)/2, 0 ],
  [ 1/2, -1/2, -1 ]
];

var PROJECT_VEC = [
  [ Math.sqrt(3)/2,-Math.sqrt(3)/2, 0 ],
  [ -1/2, -1/2,-1 ]
];

var njs = numeric;

var PAL = [
  'rgb(215,25,28)',
  'rgb(253,174,97)',
  //'rgb(235,235,191)',
  'rgb(255,255,159)',
  'rgb(171,221,164)',
  'rgb(43,131,186)',

  'rgb(100,100,100)',
  'rgb(120,120,120)',


  'rgb(140,140,140)'

];

var lPAL = [
  'rgb(120,25,28)',
  'rgb(203,134,37)',
  //'rgb(235,235,191)',
  'rgb(215,215,191)',
  'rgb(121,181,124)',
  'rgb(13,91,136)',

  'rgb(100,100,100)',
  'rgb(120,120,120)',

  'rgb(140,140,140)',
  'rgb(12,12,12)'
];

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

// 3d cross product.
//
function cross3(p,q) {
  let c0 = ((p[1]*q[2]) - (p[2]*q[1])),
      c1 = ((p[2]*q[0]) - (p[0]*q[2])),
      c2 = ((p[0]*q[1]) - (p[1]*q[0]));

  return [c0,c1,c2];
}


// euler rotation or olinde rodrigues
// https://en.wikipedia.org/wiki/Rodrigues%27_rotation_formula
//
function rodrigues(v0, _vr, theta) {
  let c = Math.cos(theta);
  let s = Math.sin(theta);

  let v_r = njs.mul( 1 / njs.norm2(_vr), _vr );

  return njs.add(
    njs.mul(c, v0),
    njs.add(
      njs.mul( s, cross3(v_r,v0)),
      njs.mul( (1-c) * njs.dot(v_r, v0), v_r )
    )
  );
}


function __project(x,y,z, L) {
  L = ((typeof L === "undefined") ? 1 : L);
  let s = L*Math.sqrt(3)/2;

  let vx = [ s,  L/2 ],
      vy = [ s, -L/2 ],
      vz = [ 0, -L ];

  let xy2d = [
    x*vx[0] + y*vy[0] + z*vz[0],
    x*vx[1] + y*vy[1] + z*vz[1]
  ];

  return xy2d;
}

function _project(x,y,z, L) {
  L = ((typeof L === "undefined") ? 1 : L);
  let s = L*Math.sqrt(3)/2;

  let vx = [-s, -L/2 ],
      vy = [-s,  L/2 ],
      vz = [ 0,  L ];

  vx = [ PROJECT_VEC[0][0], PROJECT_VEC[1][0] ];
  vy = [ PROJECT_VEC[0][1], PROJECT_VEC[1][1] ];
  vz = [ PROJECT_VEC[0][2], PROJECT_VEC[1][2] ];

  let xy2d = [
    x*vx[0] + y*vy[0] + z*vz[0],
    x*vx[1] + y*vy[1] + z*vz[1]
  ];

  return xy2d;
}

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
  var ele = document.getElementById("gilbert3d_explode_canvas");
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

function mk_square_lozenge() {
  let two = g_fig_ctx.two;

  let x = 150,
      y = 150;

  let s = 40;
  let q = s*Math.sqrt(3)/2;

  let _p = [
    [x    , y-s   ],
    [x+q  , y-s/2 ],
    [x+q  , y+s/2 ],
    [x    , y+s ],
    [x-q  , y+s/2 ],
    [x-q  , y-s/2 ]
  ];

  let lco = "rgba(80,80,140,1.0)";
  let fco = "rgba(180,180,240,0.9)";

  let lw = 2;

  let v = makeTwoVector(_p);
  let p = two.makePath(v);
  p.linewidth = lw;
  p.stroke = lco;
  p.fill = fco;
  p.cbp = 'round';
  p.join = 'round';

  let dy = 3;
  dy = 0;
  let vy = dy*Math.sqrt(3)/2;

  let sdy = 1.75*dy;
  let svy = 1.75*dy*Math.sqrt(3)/2;

  let _v1 = makeTwoVector([ [x-q + svy, y-s/2 +sdy/2], [x-vy,y-dy/2] ]); //, [x+q, y-s/2] ]);
  let p_1 = two.makePath(_v1);
  p_1.linewidth = lw;
  p_1.fill = "rgba(0,0,0,0)";
  p_1.stroke = lco;
  p_1.cbp = 'round';
  p_1.join = 'round';
  p_1.cap = 'round';
  p_1.closed = false;

  let _v2 = makeTwoVector([ [x+vy,y-dy/2], [x+q-svy, y-s/2+sdy/2] ]);
  let p_2 = two.makePath(_v2);
  p_2.linewidth = lw;
  p_2.fill = "rgba(0,0,0,0)";
  p_2.stroke = lco;
  p_2.cbp = 'round';
  p_2.join = 'round';
  p_2.cap = 'round';
  p_2.closed = false;

  let _v3 = makeTwoVector([ [x,y+dy], [x,y+s-1.75*dy] ]);
  let p_3 = two.makePath(_v3);
  p_3.linewidth = lw;
  p_3.fill = "rgba(0,0,0,0)";
  p_3.stroke = lco;
  p_3.cbp = 'round';
  p_3.join = 'round';
  p_3.cap = 'round';
  p_3.closed = false;

  two.update();
}

function _Line(x0,y0, x1,y1, lco, lw, alpha) {
  lw = ((typeof lw === "undefined") ? 2 : lw);
  alpha = ((typeof alpha === "undefined") ? 1 : alpha);

  let two = g_fig_ctx.two;

  let _l = two.makeLine(x0,y0, x1,y1);
  _l.linewidth = lw;
  _l.fill = "rgb(0,0,0)";
  _l.stroke = lco;
  //_l.cbp = 'round';
  _l.join = 'bevel';
  _l.cap = 'square';

  _l.opacity = alpha;

  return _l;
}

function _Line1(x0,y0, x1,y1, lco, lw, alpha) {
  lw = ((typeof lw === "undefined") ? 2 : lw);
  alpha = ((typeof alpha === "undefined") ? 1 : alpha);

  let two = g_fig_ctx.two;

  let _l = two.makeLine(x0,y0, x1,y1);
  _l.linewidth = lw;
  _l.fill = "rgb(0,0,0)";
  _l.stroke = lco;
  _l.cap = 'round';
  _l.dashes = [8, 8];

  _l.opacity = alpha;

  return _l;
}


function axis_fig(x0,y0,s, vr, theta) {
  vr = ((typeof vr === "undefined") ? [0,0,1] : vr);
  theta = ((typeof theta === "undefined") ? 0 : theta);

  let two = g_fig_ctx.two;

  let use_abg = true;

  //let vr = [0,0,1];
  //let theta = 0;

  let vxyz = njs.mul(s, rodrigues( [1,0,0], vr, theta ));
  let vxy = _project( vxyz[0], vxyz[1], vxyz[2] );

  let lw = 3;

  let v0xyz = [
    [ 1, 0, 0],
    [ 0, 1, 0],
    [ 0, 0, 1]
  ];


  let co = [
    "rgba(255,0,0,0.7)",
    "rgba(0,255,0,0.7)",
    "rgba(0,0,255,0.7)"
  ];

  co = [
    "rgb(240,10,20)",
    "rgb(32,220,32)",
    "rgb(20,10,240)",
  ];

  let style = {
    "size": 12,
    "weight": "bold",
    "family": "Libertine, Linux Libertine O"
  };

  let _txt = ["x", "y", "z"];
  _txt = [ "X", "Y", "Z" ];

  let _latex_id = [ "alpha", "beta", "gamma" ];

  let tdxyz = [
    [ 0.5,   0,   0 ],
    [   0,-0.5,   0 ],
    [   0,   0, 0.5 ],
  ];

  let xyz0 = njs.mul(s, rodrigues( [0,0,0], vr, theta ));
  let xy0 = njs.add( [x0,y0], _project( xyz0[0], xyz0[1], xyz0[1] ) );

  for (let xyz=0; xyz<3; xyz++) {
    let vxyz = njs.mul(s, rodrigues( v0xyz[xyz], vr, theta ));
    let vxy = _project( vxyz[0], vxyz[1], vxyz[2] );


    let _l = two.makeLine( x0,y0, x0+vxy[0], y0+vxy[1], 10);
    _l.linewidth = lw;
    _l.fill = "rgba(0,0,0,0)";
    _l.cap = 'round';
    _l.stroke = co[xyz];

    let txyz = njs.mul(s, rodrigues( njs.add(v0xyz[xyz] , tdxyz[xyz]), vr, theta ));
    let txy = _project( txyz[0], txyz[1], txyz[2] );


    if (use_abg) {

      if (xyz == 1) {
        mathjax2twojs( _latex_id[xyz], x0+txy[0]-20, y0+txy[1]-8, 0.018 );
      }
      else {
        mathjax2twojs( _latex_id[xyz], x0+txy[0]-5, y0+txy[1], 0.018 );
      }
    }
    else {
      let label = new Two.Text(_txt[xyz], x0+txy[0], y0+txy[1], style);
      label.fill = "rgba(16,16,16,1)";
      two.add(label);
    }

  }

  let c = two.makeCircle( xy0[0], xy0[1], 3);
  c.fill = "#000";
  c.linewidth = 0;

  two.update();
}


function hibiscus_block3d(x0,y0,s0, vr, theta) {
  vr = ((typeof vr === "undefined") ? [0,0,1] : vr);
  theta = ((typeof theta === "undefined") ? 0 : theta);

  let dw = 1/4;
  let dw2 = dw/2;
  let js = s0*dw;
  let D = 1.39;
  let D_2 = -1.45;

  let cuboid_size = [
    [1,2,1],
    [1,1,1],
    [2,1,1],
    [1,1,1],
    [1,2,1]
  ];


  let cxyz = [
    [ 0, 0,  -D],

    [ 0, 1,   D],
    [ 0, D_2,   D],
    [ 1, 1,   D],

    [ 1, 0,  -D],
  ];

  let dock_xyz = [

    // A
    //
    [dw2,dw2,-D+dw2], [0+dw2,2-dw2,1-D-dw2],

    // B
    //
    [dw2,2-dw2, D+dw2],[dw2,1+dw2,D+1-dw2],


    // C
    //
    [ dw2, 1+D_2-dw2, D+1-dw2],
    [ 2-dw2, 1+D_2-dw2, D+1-dw2],

    // D
    //
    [2-dw2,1+dw2,D+1-dw2],
    [2-dw2,2-dw2, D+dw2],

    // E
    //
    [2-dw2,2-dw2,1-D-dw2],
    [2-dw2,dw2,-D+dw2],
  ];

  let order = [4,0, 3,1,2];

  block3d_fig(x0,y0,s0, cuboid_size, cxyz, dock_xyz, order, vr, theta);

  return;
}

function peony_block3d(x0,y0,s0,vr,theta) {
  vr = ((typeof vr === "undefined") ? [0,0,1] : vr);
  theta = ((typeof theta === "undefined") ? 0 : theta);

  let dw = 1/4;
  let dw2 = dw/2;
  let js = s0*dw;
  let D = 1.39;
  let D_2 = -1.45;

  let cuboid_size = [
    [1,2,1],
    [1,1,1],
    [2,1,1],
    [1,1,1],
    [1,2,1]
  ];


  let cxyz = [
    [ 0, 0,  -D],

    [ 0, 1,   D],
    [ 0, D_2,   D],
    [ 1, 1,   D],

    [ 1, 0,  -D],
  ];

  let dock_xyz = [

    // A
    //
    [dw2,dw2,-D+dw2], [0+dw2,2-dw2,1-D-dw2],

    // B
    //
    [dw2,2-dw2, D+dw2],[dw2,1+dw2,D+1-dw2],


    // C
    //
    [ dw2, 1+D_2-dw2, D+1-dw2],
    [ 2-dw2, 1+D_2-dw2, D+1-dw2],

    // D
    //
    [2-dw2,1+dw2,D+1-dw2],
    [2-dw2,2-dw2, D+dw2],

    // E
    //
    [2-dw2,2-dw2,1-D-dw2],
    [2-dw2,dw2,-D+dw2],
  ];

  let order = [4,0, 3,1,2];

  block3d_fig(x0,y0,s0, cuboid_size, cxyz, dock_xyz, order, vr, theta);

  return;

}

function block3d_fig(x0,y0,s0, cuboid_size, cxyz, dock_xyz, order, vr, theta) {
  vr = ((typeof vr === "undefined") ? [0,0,1] : vr);
  theta = ((typeof theta === "undefined") ? 0 : theta); //-Math.PI/9 + 0.2;

  let two = g_fig_ctx.two;

  let dxyz = 100;

  let qs = s0*Math.sqrt(3)/2;

  //let dw = 1/4;
  //let js = s0*dw;

  let js = s0/4;

  //let jx = (s0 - js)*Math.sqrt(3)/2,
  //    jy = (s0 - js)/2;

  let proj_cxy = [];
  for (let i=0; i<dock_xyz.length; i++) {
    let djs = -1/8;
    djs = 0;

    let _cxyz = njs.mul(s0, rodrigues( njs.add([djs,djs,djs], dock_xyz[i]), vr, theta));
    let cxy = njs.add( [x0,y0], _project( _cxyz[0], _cxyz[1], _cxyz[2]) );
    proj_cxy.push( cxy );
  }


  for (let _i=0; _i<cxyz.length; _i++) {
    let i = order[_i];
    let rxyz = njs.mul( s0, rodrigues( cxyz[i], vr, theta ) );

    let cxy = njs.add( [x0,y0], _project( rxyz[0], rxyz[1], rxyz[2]) );

    let lco = lPAL[i];
    let fco = PAL[i];

    let cs = njs.mul( s0, cuboid_size[i] );
    mk_iso_cuboid(cxy[0],cxy[1],1, lco, fco, cs, 2, vr, theta);
  }


  for (let i=0; i<dock_xyz.length; i++) {

    let djs = -1/8;
    let jxyz = njs.mul(s0, rodrigues( njs.add( [djs, djs, djs], dock_xyz[i] ), vr, theta));
    let jxy = njs.add( [x0,y0], _project( jxyz[0], jxyz[1], jxyz[2]) );

    let cxyz = njs.mul(s0, rodrigues(dock_xyz[i], vr, theta));
    let cxy = njs.add( [x0,y0], _project( cxyz[0], cxyz[1], cxyz[2]) );

    let lco = "rgb(0,0,0)";
    let fco = "rgb(0,0,0)";
    let cs = njs.mul( js, [1,1,1] );

    mk_iso_cuboid( jxy[0],jxy[1],1, lco,fco, cs, 1, vr, theta, 0.2);

    let _c = two.makeCircle( cxy[0], cxy[1],  4 );
    _c.noStroke();

    _c.opacity = 0.9;
    if ((i==0) || (i==(dock_xyz.length-1))) { _c.fill = "rgb(255,255,255)"; }
    else                                    { _c.fill = "rgb(0,0,0)"; }

    if (i==0) { _c.fill = "rgb(0,0,0)"; }
    else if (i==(dock_xyz.length-1))  { _c.fill = "rgb(255,255,255)"; }
    else                              { _c.fill = "rgb(60,60,60)"; }

  }

  for (let i=1; i<(proj_cxy.length-1); i+=2) {
    let alpha = 0.9;
    if (i==(proj_cxy.length-3)) { alpha = 0.5; }
    _Line( proj_cxy[i][0], proj_cxy[i][1], proj_cxy[i+1][0], proj_cxy[i+1][1], "rgb(60,60,60)", 2.8, alpha);
  }

  two.update();
}

/*
function curve3d_fig(x0,y0,s) {
  let two = g_fig_ctx.two;

  let q = s*Math.sqrt(3)/2;

  let rotaxis = [.5, 0.5, 1],
      rotangle = Math.PI/25;

  rotaxis = [-0.0,0.5,2.25];
  rotangle = -0.251;

  let pfac = 30;

  let idx_region_xy = [
    [0,8,  _project( 2,-1,-0.0, pfac)],
    [8,24, _project(-1,-1,-1, pfac)],
    [24,40,_project( 4, -3, 2, pfac)],
    [40,56,_project(-1, 1, 1, pfac)],
    [56,64,_project( 0.5, 3.5,-0, pfac)]
  ];

  idx_region_xy = [
    [0,8,  _project( 2, .5, -1, pfac)],
    [8,24, _project( 0, 0, 0, pfac)],
    [24,40,_project( 2, .5, -1, pfac)],
    [40,56,_project( 0, 0, 0, pfac)],
    [56,64,_project( 2, .5, -1, pfac)]
  ];

  let N = 4;

  let col = [
    PAL[0],
    PAL[1],

    '#aa9803',

    PAL[3],
    PAL[4],
  ];

  let prv_beg = [-1,-1],
      prv_end = [-1,-1];

  let order = [4,3,2,1,0];

  let join_points = [];
  let curve_points  = [];
  let endpoint = [];

  for (let _gidx=0; _gidx<idx_region_xy.length; _gidx++) {

    let gidx = order[_gidx];
    gidx = _gidx;

    let _beg = idx_region_xy[gidx][0];
    let _end = idx_region_xy[gidx][1];
    let dxy = idx_region_xy[gidx][2];

    let cur_beg = [-1,-1],
        cur_end = [-1,-1];


    let _p = [];
    for (let idx=_beg; idx<_end; idx++) {

      let _xyz = gilbert_d2xyz(idx, N,N,N);
      let xyz = rodrigues( [N-_xyz.y, _xyz.x, _xyz.z], rotaxis, rotangle );

      let xy = njs.add(dxy, njs.add( _project(xyz[0], xyz[1], xyz[2],s), [x0,y0] ));
      _p.push(xy);

      if ((idx==0) || (idx==(N*N*N-1))) {
        //two.makeCircle(xy[0], xy[1], 4);
        endpoint.push( [xy[0], xy[1]] );
      }


      if      (idx == _beg)     { cur_beg = xy; }
      else if (idx == (_end-1)) { cur_end = xy; }
    }

    if (_gidx>0) {
      join_points.push( [[prv_end[0],prv_end[1]], [cur_beg[0], cur_beg[1]]] );
    }
    prv_beg = cur_beg;
    prv_end = cur_end;

    curve_points.push(_p);

  }

  let jp = join_points[3];
  _Line1( jp[0][0], jp[0][1], jp[1][0], jp[1][1], "rgb(60,60,60)", 4, 0.7);

  for (let _gidx=0; _gidx< curve_points.length; _gidx++) {

    let gidx = _gidx
    let _p = curve_points[gidx];

    let v = makeTwoVector(_p);
    let p = two.makePath(v);
    p.linewidth = 4;
    p.stroke = col[gidx];

    p.noFill();

    p.join = "round";
    p.cap = "round";
    p.closed = false;

  }

  for (let i=0; i<endpoint.length; i++) {
    let c = two.makeCircle( endpoint[i][0], endpoint[i][1], 4 );
    c.linewidth = 1;
    c.stroke = '#000';
    c.fill = 'rgb(250,250,250)';
    if (i==0) { c.fill = "rgb(0,0,0)"; }
  }

  for (let gidx=0; gidx<join_points.length; gidx++) {
    let jp = join_points[gidx];
    if (gidx != 3) {
      _Line1( jp[0][0], jp[0][1], jp[1][0], jp[1][1], "rgb(60,60,60)", 4, 0.7);
    }

    let _r = 3.5;

    let _c0 = two.makeCircle( jp[0][0], jp[0][1], _r);
    _c0.linewidth = 0;
    _c0.stroke = "#000"
    _c0.fill = "rgb(60,60,60)";
    _c0.opacity = 0.8;

    let _c1 = two.makeCircle( jp[1][0], jp[1][1], _r);
    _c1.linewidth = 0;
    _c1.stroke = "#000"
    _c1.fill = "rgb(60,60,60)";
    _c1.opacity = 0.8;
  }

  two.update();
}
*/

function mk_iso_cuboid( x0,y0,s, lco, fco, lXYZ, lw, vr, theta, alpha) {
  vr = ((typeof vr === "undefined") ? [0,0,1] : vr);
  theta = ((typeof theta === "undefined") ? (-Math.PI/16) : theta);
  alpha = ((typeof alpha === "undefined") ? 1 : alpha);


  let two = g_fig_ctx.two;

  // face clockwise
  //

  let faces3d = [

    // front face
    [
      [0,0,0],
      [0,0,lXYZ[2]],
      [lXYZ[0],0,lXYZ[2]],
      [lXYZ[0],0,0],
    ],

    // right face
    //
    [
      [lXYZ[0],0,0],
      [lXYZ[0],0,lXYZ[2]],
      [lXYZ[0],lXYZ[1],lXYZ[2]],
      [lXYZ[0],lXYZ[1],0],
    ],

    // left face
    //
    [
      [0,0,0],
      [0,lXYZ[1],0],
      [0,lXYZ[1],lXYZ[2]],
      [0,0,lXYZ[2]],
    ],

    // bottom face
    //
    [
      [0,0,0],
      [lXYZ[0],0,0],
      [lXYZ[0],lXYZ[1],0],
      [0,lXYZ[1],0]
    ],


    // top face
    //
    [
      [0,0,lXYZ[2]],
      [0,lXYZ[1],lXYZ[2]],
      [lXYZ[0],lXYZ[1],lXYZ[2]],
      [lXYZ[0],0,lXYZ[2]]
    ],


    // back face
    [
      [0,lXYZ[1],0],
      [lXYZ[0],lXYZ[1],0],
      [lXYZ[0],lXYZ[1],lXYZ[2]],
      [0,lXYZ[1],lXYZ[2]]
    ]
  ];


  let faces2d = [];
  let V = [],
      P = [];

  for (let fid=0; fid<faces3d.length; fid++) {
    let _face = faces3d[fid];
    let _face_norm = cross3( njs.sub( _face[1], _face[0] ), njs.sub( _face[2], _face[1] ) );
    let _pnorm = cross3( PROJECT_VEC[0], PROJECT_VEC[1] );

    let _d = njs.dot( _face_norm, _pnorm );
    //console.log("face:", fid, "(", _face, ") --> ", _d);
    if (_d < 0) { continue; };

    let f2idx = faces2d.length;
    faces2d.push([]);
    for (let i=0; i<faces3d[fid].length; i++) {
      let xyz = rodrigues( faces3d[fid][i], vr, theta );
      faces2d[f2idx].push( njs.add([x0,y0], _project(xyz[0], xyz[1], xyz[2], s)) );
    }

    V.push( makeTwoAnchor(faces2d[f2idx]) );

    let p = two.makePath(V[f2idx], true);
    P.push( p );

    //console.log("V:", V,"p:",p);

    p.fill = fco;
    p.opacity = alpha;
    p.closed = true;
    p.join = "round";

    p.stroke = lco;
    p.linewidth = lw;
  }


  two.update();
}


function mathjax2twojs(_id,x,y,s,s_sub) {
  s = ((typeof s === "undefined") ? 0.02 : s);
  s_sub = ((typeof s_sub === "undefined") ? 0.7 : s_sub);

  let two = g_fig_ctx.two;

  let ele = document.querySelector("#" + _id + " svg");
  let ser = new XMLSerializer();
  let str = ser.serializeToString(ele);

  let parser = new DOMParser();
  let sge = parser.parseFromString(str, "image/svg+xml").documentElement;

  let sgr = two.interpret(sge);

  sgr.position.x = x;
  sgr.position.y = y;
  sgr.scale.x =  s;
  sgr.scale.y = -s;

  // rescale subscript HACK
  //
  if (_id.slice(0,2) == "m_") {

    if (true) {

    if (sgr.children.length > 0) {
    if (sgr.children[0].children.length > 0) {
    if (sgr.children[0].children[0].children.length > 1) {
    if (sgr.children[0].children[0].children[1].children.length > 1) {
        sgr.children[0].children[0].children[1].children[1].scale.x = s_sub;
        sgr.children[0].children[0].children[1].children[1].scale.y = s_sub;
    }
    }
    }
    }

    }
  }
  else {

    if (sgr.children.length > 0) {
    if (sgr.children[0].children.length > 0) {
    if (sgr.children[0].children[0].children.length > 0) {
    if (sgr.children[0].children[0].children[0].children.length > 1) {
        sgr.children[0].children[0].children[0].children[1].scale.x = s_sub;
        sgr.children[0].children[0].children[0].children[1].scale.y = s_sub;
    }
    }
    }
    }

  }

  //yep, needed, so we can then get the make element
  //
  two.update();

  let mask = document.getElementById(sgr.mask.id);
  mask.firstChild.setAttribute("d", "M -4000 -4000 L 4000 -4000 L 4000 4000 L -4000 4000 Z");

  two.update();
}

function gilbert3d_variants() {
  let two = g_fig_ctx.two;

  var ele = document.getElementById("gilbert3d_variants");
  two.appendTo(ele);

  let vr = [0,0,1];
  let theta = Math.PI/4 + Math.PI/6;
  theta=0;
  theta = +Math.PI/48;

  theta = Math.PI/12;

  hibiscus_block3d(300, 250, 40, vr, theta);

  axis_fig(50,230, 20, vr, theta);
}


