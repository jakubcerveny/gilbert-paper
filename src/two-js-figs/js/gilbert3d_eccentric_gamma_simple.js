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

var njs = numeric;

var PAL = [
  'rgb(215,25,28)',
  'rgb(253,174,97)',
  //'rgb(235,235,191)',
  'rgb(255,255,159)',
  'rgb(171,221,164)',
  'rgb(43,131,186)'
];

var lPAL = [
  'rgb(120,25,28)',
  'rgb(203,134,37)',
  //'rgb(235,235,191)',
  'rgb(215,215,191)',
  'rgb(121,181,124)',
  'rgb(13,91,136)'
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


function _project(x,y,z, L) {
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
  var ele = document.getElementById("gilbert3d_eccentric_canvas");

  let svg_txt = ele.innerHTML;

  var b = new Blob([ svg_txt ]);
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

function _Line(x0,y0, x1,y1, lco, lw) {
  lw = ((typeof lw === "undefined") ? 2 : lw);

  let two = g_fig_ctx.two;

  let _l = two.makeLine(x0,y0, x1,y1);
  _l.linewidth = lw;
  _l.fill = "rgba(0,0,0,0)";
  _l.stroke = lco;
  //_l.cbp = 'round';
  _l.join = 'bevel';
  _l.cap = 'square';

  return _l;
}

function _Line1(x0,y0, x1,y1, lco, lw) {
  lw = ((typeof lw === "undefined") ? 2 : lw);

  let two = g_fig_ctx.two;

  let _l = two.makeLine(x0,y0, x1,y1);
  _l.linewidth = lw;
  _l.fill = "rgba(0,0,0,0)";
  _l.stroke = lco;
  _l.cap = 'round';
  _l.dashes = [8, 8];

  return _l;
}

function small_axis_fig(x0,y0,ord,sdir,s) {
  let two = g_fig_ctx.two;

  let vr = [0,0,1];
  let theta = -Math.PI/16;

  let vxyz = njs.mul(s, rodrigues( [1,0,0], vr, theta ));
  let vxy = _project( vxyz[0], vxyz[1], vxyz[2] );

  let lw_a = 5,
      lw_b = 2;

  let v0xyz = [
    [0,1,0],
    [-1,0,0],
    [0,0,1]
  ];


  let co = [
    "rgba(100,100,100,1)",
    "rgba(100,100,100,1)",
    "rgba(100,100,100,1)",
  ];

  let tdxyz = [
    [  0, 0.5,   0 ],
    [-0.5,   0,   0 ],
    [  0,   0, 0.5 ],
  ];

  let xyz0 = njs.mul(s, rodrigues( [0,0,0], vr, theta ));
  let xy0 = njs.add( [x0,y0], _project( xyz0[0], xyz0[1], xyz0[1] ) );

  let vxy_a = [];
  for (let idx=0; idx<3; idx++) {
    xyz = ord[idx];

    let vxyz = njs.mul(s, rodrigues( v0xyz[xyz], vr, theta ));
    let vxy = _project( vxyz[0], vxyz[1], vxyz[2] );

    vxy_a.push( [vxy[0], vxy[1]] );

    let lw = lw_a;

    if (idx < 2) {

      if (sdir[idx] > 0) {
        let _l = two.makeLine( x0,y0, x0+vxy[0], y0+vxy[1], 10);
        _l.linewidth = lw;
        _l.fill = "rgba(0,0,0,0)";
        _l.cap = 'round';
        _l.stroke = co[xyz];
      }
      else {
        let _l = two.makeLine( x0,y0, x0-vxy[0], y0-vxy[1], 10);
        _l.linewidth = lw;
        _l.fill = "rgba(0,0,0,0)";
        _l.cap = 'round';
        _l.stroke = co[xyz];
      }
    }

    else {
      let N = 3;
      let f = ((sdir[idx] > 0) ? 1 : -1);
      for (ii=0; ii<=N; ii++) {
        let lxy = [ x0 + (f*vxy[0]*ii/N), y0 + (f*vxy[1]*ii/N) ];
        let _c = two.makeCircle( lxy[0], lxy[1], 1.5);
        _c.fill = "#000";
        _c.stroke = "#000";
        _c.linewidth = 0;
      }
    }

  }

  let c = two.makeCircle( xy0[0], xy0[1], 3);
  c.fill = "#000";
  c.stroke = "#000";
  c.linewidth = 1;


  if (sdir[0] > 0) {
    let c_e = two.makeCircle( xy0[0]+vxy_a[0][0], xy0[1]+vxy_a[0][1], 3 );
    c_e.fill = "#fff";
    c_e.stroke = "#000";
    c_e.linewidth = 1;
  }
  else {
    let c_e = two.makeCircle( xy0[0]-vxy_a[0][0], xy0[1]-vxy_a[0][1], 3 );
    c_e.fill = "#fff";
    c_e.stroke = "#000";
    c_e.linewidth = 1;
  }

  two.update();
}

function axis_fig(x0,y0,s) {
  let two = g_fig_ctx.two;

  let use_abg = true;

  let vr = [0,0,1];
  let theta = -Math.PI/16;

  let vxyz = njs.mul(s, rodrigues( [1,0,0], vr, theta ));
  let vxy = _project( vxyz[0], vxyz[1], vxyz[2] );

  let lw = 3;

  let v0xyz = [
    [0,1,0],
    [-1,0,0],
    [0,0,1]
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
    [  0, 0.5,   0 ],
    [-0.5,   0,   0 ],
    [  0,   0, 0.5 ],
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
      mathjax2twojs( _latex_id[xyz], x0+txy[0]-5, y0+txy[1], 0.018 );
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



function block3d_fig(x0,y0,s0) {
  let two = g_fig_ctx.two;

  //let x0 = 190, y0 = 250, s0 = 40;
  let dxyz = 100;

  let qs = s0*Math.sqrt(3)/2;

  let dw = 1/4;
  let js = s0*dw;

  let jx = (s0 - js)*Math.sqrt(3)/2,
      jy = (s0 - js)/2;

  let cuboid_size = [
    [1,1,1],
    [1,1,2],
    [1,2,1],
    [1,1,2],
    [1,1,1]
  ];

  let D = 1.8;

  let cxyz = [
    [ D, 0, 0],
    [-D, 0, 0],
    [ D, 0, 1],
    [-D, 1, 0],
    [ D, 1, 0]
  ];


  let dock_xyz = [
    [ D + 1 - dw, 0, 0 ],

    [ D , 0, 0 ],
    [ -D + 1 - dw, 0, 0],

    [ -D + 1 - dw, 0, 2 - dw],
    [ D, 0, 2-dw],

    [ -D + 1 - dw, 2-dw, 2 - dw],
    [ D, 2-dw, 2-dw],

    [ -D + 1 - dw, 2-dw, 0],
    [ D, 2-dw, 0],

    [ D+1-dw, 2-dw, 0]
  ];

  let order = [3,1, 4,0,2];

  let vr = [0,0,1];
  let theta = -Math.PI/16;

  let proj_cxy = [];
  for (let i=0; i<dock_xyz.length; i++) {
    let cxyz = njs.mul(s0, rodrigues( njs.add([dw/2, dw/2, dw/2], dock_xyz[i]), vr, theta));
    let cxy = njs.add( [x0,y0], _project( cxyz[0], cxyz[1], cxyz[2]) );
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

    // special case where we want the majority of the line to be occluded by subsequent draws
    //
    if (i == 3) {
      let li = proj_cxy.length-3;
      _Line( proj_cxy[li][0], proj_cxy[li][1], proj_cxy[li+1][0], proj_cxy[li+1][1], "rgba(0,0,0,0.9)", 2.8 );
    }


  }


  for (let i=0; i<dock_xyz.length; i++) {

    let jxyz = njs.mul(s0, rodrigues(dock_xyz[i], vr, theta));
    let jxy = njs.add( [x0,y0], _project( jxyz[0], jxyz[1], jxyz[2]) );

    let cxyz = njs.mul(s0, rodrigues( njs.add([dw/2, dw/2, dw/2], dock_xyz[i]), vr, theta));
    let cxy = njs.add( [x0,y0], _project( cxyz[0], cxyz[1], cxyz[2]) );

    if (i==(dock_xyz.length-2)) { continue; }

    mk_iso_cuboid( jxy[0],jxy[1],js, "rgba(0,0,0,0)", "rgba(0,0,0,0.3)", [1,1,1], 0, vr, theta);

    let _c = two.makeCircle( cxy[0], cxy[1],  4 );
    _c.stroke = "rgba(0,0,0,0)";
    _c.linewidth = 0;
    if ((i==0) || (i==(dock_xyz.length-1))) {
      _c.fill = "rgba(255,255,255,0.9)";
    }
    else {
      _c.fill = "rgba(0,0,0,0.9)";
    }

  }

  for (let i=1; i<(proj_cxy.length-1); i+=2) {
    if (i==(proj_cxy.length-3)) { continue; }
    _Line( proj_cxy[i][0], proj_cxy[i][1], proj_cxy[i+1][0], proj_cxy[i+1][1], "rgba(0,0,0,0.9)", 2.8);
  }



  //---

  let style = {
    "size": 18,
    "weight": "bold",
    "family": "Libertine, Linux Libertine O"
  };

  let text_dxyz = [
    [ 1.0, 0.5, 0.6 ],
    [ 1, 0.5, 1 ],
    [ 0.6, 0.9, 1 ],
    [ 1, 0.5, 1 ],
    [ 1.0, 0.4, 0.55 ]
  ];

  let text_co = [
    "rgba(255,255,255,1)",
    "rgba(16,16,16,1)",
    "rgba(16,16,16,1)",
    "rgba(16,16,16,1)",
    "rgba(255,255,255,1)"
  ];

  let text_ = [ "A", "B", "C", "D", "E" ];

  for (let i=0; i<text_dxyz.length; i++) {
    let rxyz = njs.mul( s0, rodrigues( njs.add(text_dxyz[i], cxyz[i]), vr, theta ) );
    let cxy = njs.add( [x0,y0], _project( rxyz[0], rxyz[1], rxyz[2]) );
    let txt = new Two.Text(text_[i], cxy[0], cxy[1], style);
    txt.fill = text_co[i];
    two.add(txt);
  }

  two.update();
}

function curve3d_fig(x0,y0,s) {
  let two = g_fig_ctx.two;

  //let x0 = 15,
  //    y0 = 350;
  //let s = 20;

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

    //PAL[2],
    //"rgba()",
    //'rgb(235,235,191)',
    //'rgb(255,255,159)',
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
      //let xyz = rodrigues( [_xyz.x, N-_xyz.y, _xyz.z], rotaxis, rotangle );

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
      //_Line1( prv_end[0], prv_end[1], cur_beg[0], cur_beg[1], "rgba(0,0,0,0.8)", 4);
      join_points.push( [[prv_end[0],prv_end[1]], [cur_beg[0], cur_beg[1]]] );
    }
    prv_beg = cur_beg;
    prv_end = cur_end;

    curve_points.push(_p);

  }

  let jp = join_points[3];
  _Line1( jp[0][0], jp[0][1], jp[1][0], jp[1][1], "rgba(16,16,16,0.7)", 4);

  for (let _gidx=0; _gidx< curve_points.length; _gidx++) {

    let gidx = _gidx
    let _p = curve_points[gidx];

    let v = makeTwoVector(_p);
    let p = two.makePath(v);
    p.linewidth = 4;
    p.stroke = col[gidx];
    p.fill = "rgba(0,0,0,0)";
    p.join = "round";
    p.cap = "round";
    p.closed = false;

  }

  for (let i=0; i<endpoint.length; i++) {
    let c = two.makeCircle( endpoint[i][0], endpoint[i][1], 4 );
    c.linewidth = 1;
    c.stroke = '#000';
    c.fill = 'rgba(250,250,250,1.0)';
  }

  for (let gidx=0; gidx<join_points.length; gidx++) {
    let jp = join_points[gidx];
    if (gidx != 3) {
      _Line1( jp[0][0], jp[0][1], jp[1][0], jp[1][1], "rgba(16,16,16,0.7)", 4);
    }

    let _r = 3.5;

    let _c0 = two.makeCircle( jp[0][0], jp[0][1], _r);
    _c0.linewidth = 0;
    _c0.stroke = "#000"
    _c0.fill = "rgba(16,16,16,0.8)";

    let _c1 = two.makeCircle( jp[1][0], jp[1][1], _r);
    _c1.linewidth = 0;
    _c1.stroke = "#000"
    _c1.fill = "rgba(16,16,16,0.8)";
  }

  two.update();
}


// x0,y0 start position (in canvas pixels)
// s scale
// lco line color
// fco fill color
// lXYZ len[xyz]
// lw linewidth
// vr rotation axis
// theta rotation angle
//
function mk_iso_cuboid( x0,y0,s, lco, fco, lXYZ, lw, vr, theta, alpha) {
  vr = ((typeof vr === "undefined") ? [0,0,1] : vr);
  theta = ((typeof theta === "undefined") ? (-Math.PI/16) : theta);
  alpha = ((typeof alpha === "undefined") ? 1 : alpha);

  if (fco.match('rgba')) {
    let new_opa = fco.split("(")[1].split(",")[3].split(")")[0];
    let new_fco = "rgb(" + fco.split('(')[1].split(',').slice(0,3).join(',') + ")";

    alpha = new_opa;
    fco = fco;
  }

  let two = g_fig_ctx.two;
  let faces3d = [
    [
      [0,0,0],
      [0,0,lXYZ[2]],
      [lXYZ[0],0,lXYZ[2]],
      [lXYZ[0],0,0]
    ],

    [
      [0,0,0],
      [0,0,lXYZ[2]],
      [0,lXYZ[1], lXYZ[2]],
      [0,lXYZ[1],0]
    ],

    [
      [0,0,lXYZ[2]],
      [0,lXYZ[1],lXYZ[2]],
      [lXYZ[0],lXYZ[1],lXYZ[2]],
      [lXYZ[0],0,lXYZ[2]]
    ]
  ];

  let faces2d = [];
  let V = [],
      P = [];

  for (let fid=0; fid<faces3d.length; fid++) {
    faces2d.push([]);
    for (let i=0; i<faces3d[fid].length; i++) {
      let xyz = rodrigues( faces3d[fid][i], vr, theta );
      faces2d[fid].push( njs.add([x0,y0], _project(xyz[0], xyz[1], xyz[2], s)) );
    }

    V.push( makeTwoAnchor(faces2d[fid]) );

    let p = two.makePath(V[fid], true);
    P.push( p );

    p.fill = fco;
    p.closed = true;
    p.join = "round";

    p.stroke = lco;
    p.linewidth = lw;

    p.opacity = alpha;
  }

  two.update();
}

function mkfullblock(start_xy, opos, cuboid_size, disp_order, scale) {
  scale = ((typeof scale === "undefined") ? 25 : scale);
  let two = g_fig_ctx.two;

  let vr = [0,0,1];
  let theta = -Math.PI/16 + Math.PI/2;

  //let order = [3,4,1,0,2];

  for (let _i=0; _i<5; _i++) {
    let i = disp_order[_i];
    let jxyz = njs.mul(scale, rodrigues(opos[i], vr, theta));
    let jxy = njs.add( [start_xy[0], start_xy[1]], _project( jxyz[0], jxyz[1], jxyz[2]) );
    let lco = lPAL[i];
    let fco = PAL[i];
    let cs = njs.mul(scale, cuboid_size[i]);

    mk_iso_cuboid(jxy[0],jxy[1],1, lco, fco, cs, 2, vr, theta);
  }

  //two.update();
}

function mkdockconn(cxy, dock_pos, scale, dock_co, vr, theta) {
  let two = g_fig_ctx.two;

  let diam = 4*scale/25;

  let _dd = 1/3;
  let jxyz = njs.mul(scale, rodrigues([ dock_pos[0],dock_pos[1],dock_pos[2]], vr, theta));
  let jxy = njs.add( [cxy[0], cxy[1]], _project( jxyz[0], jxyz[1], jxyz[2]) );
  mk_iso_cuboid(jxy[0],jxy[1],scale*_dd, dock_co[0], dock_co[1], [1,1,1], 0, vr, theta);

  let dc_xyz = njs.mul(scale, rodrigues([dock_pos[3],dock_pos[4],dock_pos[5]], vr, theta));
  let dc_xy = njs.add( [cxy[0], cxy[1]], _project( dc_xyz[0], dc_xyz[1], dc_xyz[2]) );

  let _c = two.makeCircle( dc_xy[0], dc_xy[1],  diam );
  _c.noStroke();

  _c.opacity = 0.9;
  _c.fill = dock_co[2];
  //_c.fill = "rgb(0,0,0)";

}

function rbracket(mxy, w, h, theta) {
  theta = ((typeof theta === "undefined") ? 0 : theta);

  let two = g_fig_ctx.two;

  let lw = 1.125;

  let ct = Math.cos(theta);
  let st = Math.sin(theta);

  let M = [
    [  ct, st ],
    [ -st, ct ]
  ];

  let cp_u0 = njs.dot( M, [-w/2, 0] );
  let cp_u1 = njs.dot( M, [ w/2, 0] );
  let ep_u = njs.dot( M, [ -w/2, -h/2 ] );

  let cp_d0 = njs.dot( M, [-w/2, 0] );
  let cp_d1 = njs.dot( M, [ w/2, 0] );
  let ep_d = njs.dot( M, [ -w/2,  h/2 ] );

  let p_u = new Two.Path([
    //new Two.Anchor( mxy[0],     mxy[1],       0,0,   -w/2,0,  Two.Commands.curve),
    //new Two.Anchor( mxy[0]-w/2, mxy[1]-h/2,   w/2,0,    0,0,  Two.Commands.curve),
    new Two.Anchor( mxy[0],         mxy[1],           0,0,                cp_u0[0], cp_u0[1],   Two.Commands.curve),
    new Two.Anchor( mxy[0]+ep_u[0], mxy[1]+ep_u[1],   cp_u1[0],cp_u1[1],  0,0,                  Two.Commands.curve),
  ], false, false, true);

  p_u.linewidth = lw;
  p_u.stroke = "rgb(0,0,0)";
  p_u.noFill();

  let p_d = new Two.Path([
    //new Two.Anchor( mxy[0],     mxy[1],       0,0,   -w/2,0,  Two.Commands.curve),
    //new Two.Anchor( mxy[0]-w/2, mxy[1]+h/2,   w/2,0,    0,0,  Two.Commands.curve),
    new Two.Anchor( mxy[0],         mxy[1],           0,0,                cp_d0[0], cp_d0[1],   Two.Commands.curve),
    new Two.Anchor( mxy[0]+ep_d[0], mxy[1]+ep_d[1],   cp_d1[0],cp_d1[1],  0,0,                  Two.Commands.curve),
  ], false, false, true);

  p_d.linewidth = lw;
  p_d.stroke = "rgb(0,0,0)";
  p_d.noFill();

  two.add(p_u);
  two.add(p_d);

  two.update();

}

function gilbert3d_eccentric_gamma_simple() {
  let two = g_fig_ctx.two;

  let vr = [0,0,1];
  let theta = -Math.PI/16 + Math.PI/2;

  var ele = document.getElementById("gilbert3d_eccentric_canvas");
  two.appendTo(ele);

  let scale = 25;

  //let whd2pconfig = [0,1,0,1,0,1,0,2];
  let idx2SConfig = [0, 1,1, 2,2,2];

  let dw = 1/4;
  let js = scale*dw;

  let jx = (scale - js)*Math.sqrt(3)/2,
      jy = (scale - js)/2;

  let _D = 1/3;
  let _d = _D/2;

  //WIP!!!

  let lco = lPAL[0];
  let fco = PAL[0];

  let cuboid_size = [1,1,1];

  //------
  //------
  //------

  let line_co = "rgb(180,180,180)";
  //line_co = "rgb(150,150,150)";

  let lw = 2;

  let latex_name_scale = 0.0175;
  let latex_eqn_scale = 0.016;

  latex_name_scale = 0.025;

  let dock_co_a = [ "rgba(0,0,0,0)", "rgba(0,0,0,0.3)", "rgb(0,0,0)" ];
  let dock_co_b = [ "rgba(0,0,0,0)", "rgba(0,0,0,0.3)", "rgb(255,255,255)" ];


  // S_1
  // d >> ...
  // |\gamma| >> ...
  //

  scale = 35;
  cxy = [110,190];


  scale = 42;
  cxy = [190,215];

  dxyz = rodrigues([scale,0,0], vr, theta);
  dxy = _project(dxyz[0], dxyz[1], dxyz[2]);

  cs = njs.mul( scale, [1.0,2,1.5] );
  mk_iso_cuboid( cxy[0]+dxy[0], cxy[1]+dxy[1] , 1, lPAL[4], PAL[4], cs, 2, vr, theta );
  mk_iso_cuboid( cxy[0], cxy[1] , 1, lPAL[0], PAL[0], cs, 2, vr, theta );

  dxyz = rodrigues([0,0,scale*1.5], vr, theta);
  dxy = _project(dxyz[0], dxyz[1], dxyz[2]);

  cs = njs.mul( scale, [2,2,1.5] );
  mk_iso_cuboid( cxy[0]+dxy[0], cxy[1]+dxy[1] , 1, lPAL[2], PAL[2], cs, 2, vr, theta );

  let _sm = 0.8*scale;
  let _sl = 1.65*scale;

  mathjax2twojs("one_half", cxy[0]+(2.85*scale), cxy[1]-(1.30*scale), latex_name_scale);
  rbracket( [ cxy[0] + (2.75*scale), cxy[1]-(1.5*scale)], _sl/2, 0.75*_sl);
  //mathjax2twojs("rb", cxy[0]+(2.35*scale), cxy[1]-40, latex_name_scale);


  mathjax2twojs("one_half", cxy[0]+(2.85*scale), cxy[1]-(2.85*scale), latex_name_scale);
  rbracket( [ cxy[0] + (2.75*scale), cxy[1]-(3.05*scale)], _sl/2, 0.75*_sl);

  // bottom s
  mathjax2twojs("abs_beta", cxy[0]-(1.85*scale), cxy[1]+(0.5*scale), latex_name_scale);
  rbracket( [cxy[0] - (1.1*scale), cxy[1]-1], _sl/2, _sl, -Math.PI/2 - theta*0.5);


  mathjax2twojs("gamma_gt", cxy[0]-(3.85*scale), cxy[1]-(scale*2.8), latex_name_scale);
  mathjax2twojs("ft_beta", cxy[0]-(4.35*scale), cxy[1]-(scale*1.9), latex_name_scale);
  rbracket( [cxy[0] - (2.0*scale), cxy[1]-(scale*2.65)], _sl/3, _sl*1.6, Math.PI);

  // 1/2
  rbracket( [cxy[0] + (0.7*scale), cxy[1]+(0.2*scale)], _sl/3, _sm, - theta*0.86);
  rbracket( [cxy[0] + (1.7*scale), cxy[1]-(0.18*scale)], _sl/3, _sm, - theta*0.86);

  mathjax2twojs("one_half", cxy[0]+(0.5*scale), cxy[1]+(0.75*scale), latex_name_scale);
  mathjax2twojs("one_half", cxy[0]+(1.5*scale), cxy[1]+(.35*scale), latex_name_scale);

  //----
  //----
  //----

  axis_fig(30, 50, 20);

  let show_frame=false;
  if (show_frame) {
    let frame = two.makeRectangle( two.width/2, two.height/2, two.width, two.height );
    frame.noFill();
    frame.stroke = "rgb(0,0,0)";
    frame.linewidth = 4;

  }

  two.update();
}

var debug = [];

// so very hacky
// somehow we managed to shoehorn
// mathjax notation into svg so that it
// can be used by two.js.
// We need to contort ourselves to get the mask
// right so that it gets all the element
//
function mathjax2twojs(_id,x,y,s,s_sub, ignore) {
  s = ((typeof s === "undefined") ? 0.02 : s);
  s_sub = ((typeof s_sub === "undefined") ? 0.7 : s_sub);
  ignore = ((typeof ignore === "undefined") ? false : ignore);

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

  debug.push(sgr);

  if (!ignore) {

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

  }

  //yep, needed, so we can then get the make element
  //
  two.update();

  let mask = document.getElementById(sgr.mask.id);
  mask.firstChild.setAttribute("d", "M -4000 -4000 L 8000 -4000 L 8000 4000 L -4000 4000 Z");

  two.update();
}


