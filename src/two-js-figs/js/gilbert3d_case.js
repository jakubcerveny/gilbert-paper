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
  var ele = document.getElementById("gilbert3d_case_canvas");

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

  co = [
    "rgb(100,100,100)",
    "rgb(100,100,100)",
    "rgb(100,100,100)",
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

        //_l.fill = "rgba(0,0,0,0)";
        _l.noFill();

        _l.cap = 'round';
        _l.stroke = co[xyz];
      }
      else {
        let _l = two.makeLine( x0,y0, x0-vxy[0], y0-vxy[1], 10);
        _l.linewidth = lw;

        //_l.fill = "rgba(0,0,0,0)";
        _l.noFill();

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

  let abg_txt = [ "alpha", "beta", "gamma" ];
  let abg_dxy = [
    [-1,15],
    [-15, 10],
    [5,0]
  ];

  for (let xyz=0; xyz<3; xyz++) {
    let vxyz = njs.mul(s, rodrigues( v0xyz[xyz], vr, theta ));
    let vxy = _project( vxyz[0], vxyz[1], vxyz[2] );

    //let mx = x0 + (vxy[0]/2) + abg_dxy[xyz][0];
    //let my = y0 + (vxy[1]/2) + abg_dxy[xyz][1];
    //mathjax2twojs(abg_txt[xyz], mx, my, 0.018);

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

    //let label = new Two.Text(_txt[xyz], x0+txy[0], y0+txy[1], style);
    //label.fill = "rgba(16,16,16,1)";
    //two.add(label);

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

  // inkscape has problems with rgba fill, so back out of fill color rgba
  // to explicitly provide rgb and opacity
  //
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
    //p.opacity = opacity;
    p.closed = true;
    p.join = "round";

    p.stroke = lco;
    p.linewidth = lw;

    p.opacity = alpha;
  }


  two.update();
}

function ORIGmkfullblock(start_xy, opos, cuboid_size, disp_order, scale) {
  scale = ((typeof scale === "undefined") ? 25 : scale);
  let two = g_fig_ctx.two;

  let vr = [0,0,1];
  let theta = -Math.PI/16 + Math.PI/2;

  for (let _i=0; _i<5; _i++) {
    let i = disp_order[_i];
    let jxyz = njs.mul(scale, rodrigues(opos[i], vr, theta));
    let jxy = njs.add( [start_xy[0], start_xy[1]], _project( jxyz[0], jxyz[1], jxyz[2]) );
    let lco = lPAL[i];
    let fco = PAL[i];
    let cs = njs.mul(scale, cuboid_size[i]);

    mk_iso_cuboid(jxy[0],jxy[1],1, lco, fco, cs, 2, vr, theta);
  }

}

function mkfullblock(start_xy, opos, cuboid_size, disp_order, scale, highlight_idx, alpha_bg) {
  scale = ((typeof scale === "undefined") ? 25 : scale);
  highlight_idx = ((typeof highlight_idx === "undefined") ? -1 : highlight_idx);
  alpha_bg = ((typeof alpha_bg === "undefined") ? 1 : alpha_bg);
  let two = g_fig_ctx.two;

  let vr = [0,0,1];
  let theta = -Math.PI/16 + Math.PI/2;

  for (let _i=0; _i<5; _i++) {
    let i = disp_order[_i];
    let jxyz = njs.mul(scale, rodrigues(opos[i], vr, theta));
    let jxy = njs.add( [start_xy[0], start_xy[1]], _project( jxyz[0], jxyz[1], jxyz[2]) );
    let lco = lPAL[i];
    let fco = PAL[i];
    let cs = njs.mul(scale, cuboid_size[i]);

    if (i == highlight_idx) {
      mk_iso_cuboid(jxy[0],jxy[1],1, lco, fco, cs, 2, vr, theta);
    }
    else {
      mk_iso_cuboid(jxy[0],jxy[1],1, lco, fco, cs, 2, vr, theta, alpha_bg);
    }
  }

  /*
  if (highlight_idx >= 0) {
    let i = highlight_idx;
    let jxyz = njs.mul(scale, rodrigues(opos[i], vr, theta));
    let jxy = njs.add( [start_xy[0], start_xy[1]], _project( jxyz[0], jxyz[1], jxyz[2]) );
    let lco = lPAL[i];
    let fco = PAL[i];
    let cs = njs.mul(scale, cuboid_size[i]);
    mk_iso_cuboid(jxy[0],jxy[1],1, lco, fco, cs, 2, vr, theta);

  }
  */

}

// main entry point
//
function gilbert3d_case() {
  let two = g_fig_ctx.two;

  let vr = [0,0,1];
  let theta = -Math.PI/16 + Math.PI/2;

  var ele = document.getElementById("gilbert3d_case_canvas");
  two.appendTo(ele);

  let scale = 25;
  let s0 = scale;

  let whd2pconfig = [0,1,0,1,0,1,0,2];

  let dw = 1/4;
  let js = s0*dw;

  let jx = (s0 - js)*Math.sqrt(3)/2,
      jy = (s0 - js)/2;

  let _D = 1/3;
  let _d = _D/2;

  // there are four labels (3 + a slightly modified persion of P1)
  // P_0, P_1, P_1q, and P_2
  //
  // these hold the html element ids (as they appear in the HTML)
  //   of the rendered latex elements, their relative positions
  //   to the drawn cuboid
  // the order in which the labels are displayed, and the order of
  //   the small sub axis displayed
  // orientation is the dirtion of the axis (before order is applied)
  //
  let label_P0 = [
    {
      "order" : [1,2,0],
      "orientation" : [1,1,1],
      "x": { "t": "alpha2e", "xy": [10,5]  },
      "y": { "t": "beta2e", "xy": [-25,0]  },
      "z": { "t": "gamma2e", "xy": [-37,-20]  }
    },

    {
      "order" : [2,0,1],
      "orientation" : [1,1,1],
      "x": { "t": "alpha2e", "xy": [10,5]  },
      "y": { "t": "beta2s", "xy": [-25,0]  },
      "z": { "t": "gamma", "xy": [-30,-20]  }
    },

    {
      "order" : [0,1,2],
      "orientation" : [1,-1,-1],
      "x": { "t": "alpha", "xy": [10,5]  },
      "y": { "t": "m_beta2e", "xy": [-25,0]  },
      "z": { "t": "m_gamma2s", "xy": [-37,-20]  }
    },

    {
      "order" : [2,0,1],
      "orientation" : [-1,-1,1],
      "x": { "t": "m_alpha2s", "xy": [10,5]  },
      "y": { "t": "beta2s", "xy": [-25,0]  },
      "z": { "t": "m_gamma", "xy": [-30,-20]  }
    },

    {
      "order" : [1,2,0],
      "orientation" : [-1,1,-1],
      "x": { "t": "m_alpha2s", "xy": [10,5]  },
      "y": { "t": "m_beta2e", "xy": [-25,0]  },
      "z": { "t": "gamma2e", "xy": [-38,-20]  }
    }

  ];

  let label_P1 = [
    {
      "order": [2,0,1],
      "orientation" : [1,1,1],
      //"x": { "t": "alpha2", "xy": [10,5]  },
      "x": { "t": "alpha2u", "xy": [10,5]  },
      //"y": { "t": "beta2", "xy": [-25,0]  },
      "y": { "t": "beta2e", "xy": [-25,0]  },
      "z": { "t": "gamma2e", "xy": [-37,-20]  }
    },

    {
      "order": [1,2,0],
      "orientation" : [1,1,1],
      //"x": { "t": "alpha2", "xy": [10,5]  },
      "x": { "t": "alpha2u", "xy": [10,5]  },
      "y": { "t": "beta", "xy": [-25,0]  },
      "z": { "t": "gamma2s", "xy": [-55,-35]  }
    },

    {
      "order": [0,1,2],
      "orientation" : [1,-1,-1],
      "x": { "t": "alpha", "xy": [10,5]  },
      //"y": { "t": "m_beta2p", "xy": [-25,0]  },
      "y": { "t": "m_beta2s", "xy": [-25,0]  },
      "z": { "t": "m_gamma2e", "xy": [-37,-20]  }
    },

    {
      "order": [1,2,0],
      "orientation" : [-1,1,-1],
      //"x": { "t": "m_alpha2p", "xy": [10,5]  },
      "x": { "t": "m_alpha2up", "xy": [10,5]  },
      "y": { "t": "m_beta", "xy": [-25,0]  },
      "z": { "t": "gamma2s", "xy": [-55,-40]  }
    },

    {
      "order": [2,0,1],
      "orientation" : [-1,-1,1],
      //"x": { "t": "m_alpha2p", "xy": [10,5]  },
      "x": { "t": "m_alpha2up", "xy": [10,5]  },
      //"y": { "t": "beta2", "xy": [-25,0]  },
      "y": { "t": "beta2e", "xy": [-25,0]  },
      "z": { "t": "m_gamma2e", "xy": [-40,-20]  }
    }

  ];

  let label_P1_011 = [
    {
      "order": [2,0,1],
      "orientation" : [1,1,1],
      "x": { "t": "alpha2u", "xy": [10,5]  },
      //"y": { "t": "beta2", "xy": [-25,0]  },
      "y": { "t": "beta2e", "xy": [-25,0]  },
      "z": { "t": "gamma2e", "xy": [-37,-20]  }
    },

    {
      "order": [1,2,0],
      "orientation" : [1,1,1],
      "x": { "t": "alpha2u", "xy": [10,5]  },
      "y": { "t": "beta", "xy": [-25,0]  },
      "z": { "t": "gamma2u", "xy": [-55,-35]  }
    },

    {
      "order": [0,1,2],
      "orientation" : [1,-1,-1],
      "x": { "t": "alpha", "xy": [10,5]  },
      //"y": { "t": "m_beta2p", "xy": [-25,0]  },
      "y": { "t": "m_beta2s", "xy": [-25,0]  },
      "z": { "t": "m_gamma2e", "xy": [-37,-20]  }
    },

    {
      "order": [1,2,0],
      "orientation" : [-1,-1,1],
      "x": { "t": "m_alpha2up", "xy": [10,5]  },
      "y": { "t": "m_beta", "xy": [-25,0]  },
      "z": { "t": "gamma2u", "xy": [-55,-40]  }
    },

    {
      "order": [2,0,1],
      "orientation" : [-1,-1,1],
      "x": { "t": "m_alpha2up", "xy": [10,5]  },
      //"y": { "t": "beta2", "xy": [-25,0]  },
      "y": { "t": "beta2e", "xy": [-25,0]  },
      "z": { "t": "m_gamma2e", "xy": [-40,-20]  }
    }

  ];

  let label_P2 = [
    {
      "order": [1,2,0],
      "orientation" : [1,1,1],
      //"x": { "t": "alpha2", "xy": [10,5]  },
      "x": { "t": "alpha2u", "xy": [10,5]  },
      "y": { "t": "beta2e", "xy": [-25,0]  },
      "z": { "t": "gamma", "xy": [-30,-20]  }
    },

    {
      "order": [2,0,1],
      "orientation" : [1,1,1],
      "x": { "t": "alpha", "xy": [10,5]  },
      "y": { "t": "beta2u", "xy": [-25,0]  },
      "z": { "t": "gamma2e", "xy": [-38,-25]  }
    },

    {
      "order": [0,1,2],
      "orientation" : [1,1,1],
      "x": { "t": "alpha", "xy": [10,5]  },
      "y": { "t": "beta2u", "xy": [-25,0]  },
      "z": { "t": "gamma2u", "xy": [-39,-20]  }
    },

    {
      "order": [1,2,0],
      "orientation" : [-1,1,-1],
      //"x": { "t": "m_alpha2p", "xy": [10,5]  },
      "x": { "t": "m_alpha2up", "xy": [10,5]  },
      "y": { "t": "m_beta2e", "xy": [-25,0]  },
      "z": { "t": "gamma2u", "xy": [-38,-25]  }
    },

    {
      "order": [2,0,1],
      "orientation" : [-1,-1,1],
      //"x": { "t": "m_alpha2p", "xy": [10,5]  },
      "x": { "t": "m_alpha2up", "xy": [10,5]  },
      "y": { "t": "beta2e", "xy": [-25,0]  },
      "z": { "t": "m_gamma2e", "xy": [-38,-20]  }
    }

  ];

  // position of "docking" graphics, where the path in the sub-cuboid starts
  // and ends
  //
  let dock_P0 = [
    [ [0,0,0, _d,_d,_d], [0,1-_D,0, _d, 1-_d,_d] ],
    [ [0,0,0, _d,_d,_d], [0,0,2-_D, _d, _d, 2-_d] ],
    [ [0,1-_D,1-_D, _d, 1-_d,1-_d], [2-_D,1-_D,1-_D, 2-_d,1-_d,1-_d] ],
    [ [1-_D,0,2-_D, 1-_d,_d,2-_d], [1-_D,0,0, 1-_d,_d,_d] ],
    [ [1-_D,1-_D,0, 1-_d,1-_d,_d], [1-_D,0,0, 1-_d,_d,_d] ]
  ];

  let dock_P1 = [
    [ [0,0,0, _d,_d,_d], [0,0,1-_D, _d,_d,1-_d] ],
    [ [0,0,0, _d,_d,_d], [0,2-_D,0,  _d, 2-_d,_d] ],
    [ [0,1-_D,1-_D, _d, 1-_d,1-_d], [2-_D,1-_D,1-_D, 2-_d,1-_d,1-_d] ],
    [ [1-_D,2-_D,0, 1-_d,2-_d,_d], [1-_D,0,0, 1-_d,_d,_d] ],
    [ [1-_D,0,1-_D, 1-_d,_d,1-_d], [1-_D,0,0, 1-_d,_d,_d] ]
  ];

  let dock_P2 = [
    [ [0,0,0, _d,_d,_d], [0,1-_D,0, _d,1-_d,_d] ],
    [ [0,0,0, _d,_d,_d], [0,0,1-_D, _d,_d,1-_d] ],
    [ [0,0,0, _d,_d,_d], [2-_D,0,0, 2-_d,_d,_d] ], 
    [ [1-_D,1-_D,0, 1-_d,1-_d,_d], [1-_D,0,0, 1-_d,_d,_d] ],
    [ [1-_D,0,1-_D, 1-_d,_d,1-_d], [1-_D,0,0, 1-_d,_d,_d] ]
  ];

  let jsplit_dock = [
    [    0, 0, 0,    _d, _d, _d ],
    [ 2-_D, 0, 0,  2-_d, _d, _d ]
    //[ 1.5-_D, 0, 0,  1.5-_d, _d, _d ]
  ];

  // relative positions of sub-coboids displayed in the grid line
  //
  let CXY_P0 = [ [70, 150], [140, 150], [197, 125], [280, 150], [350, 150] ];
  let CXY_P1 = [ [70, 150], [140, 150], [195,  125], [290, 150], [350, 150] ];
  let CXY_P2 = [ [70, 150], [130, 150], [210, 125], [290, 150], [350, 150] ];

  CXY_P0 = [ [70, 150], [140, 150], [210, 125], [290, 150], [360, 150] ];
  CXY_P1 = [ [75, 150], [160, 150], [225, 125], [335, 150], [410, 150] ];
  CXY_P2 = [ [75, 150], [150, 150], [245, 125], [335, 150], [410, 150] ];

  let fstyle = {
    "size": 12,
    //"weight": "bold",
    "family": "Libertine, Linux Libertine O"
  };

  // index positions of cuboids for display, as well as display order
  // since we're drawing psuedo-iso cubes ourselves
  //
  let PConfig = [
    {
      "xy": CXY_P0,
      "opos" : [ [0,0,0], [0,1,0], [0,0,1], [1,1,0], [1,0,0] ],
      "cuboid_size": [ [1,1,1], [1,1,2], [2,1,1], [1,1,2], [1,1,1] ],
      "disp_order" : [3,4,1,0,2],
      "label": label_P0,
      "endpoint": dock_P0
    },
    {
      "xy": CXY_P1,
      "opos" : [ [0,0,0], [0,0,1], [0,1,0], [1,0,1], [1,0,0] ],
      "cuboid_size": [ [1,1,1], [1,2,1], [2,1,1], [1,2,1], [1,1,1] ],
      "disp_order" : [2,4,3,0,1],
      "label": label_P1,
      "endpoint": dock_P1
    },
    {
      "xy": CXY_P2,
      "opos" : [ [0,0,0], [0,1,0], [0,1,1], [1,0,1], [1,0,0] ],
      "cuboid_size": [ [1,1,2], [2,1,1], [2,1,1], [1,1,1], [1,1,1] ],
      "disp_order": [1,2,4,3,0],
      "label": label_P2,
      "endpoint": dock_P2
    }
  ];

  for (let whd=0; whd<8; whd++) {

    let pc = PConfig[whd2pconfig[whd]];
    let cxya = pc.xy;
    let cuboid_size_a = pc.cuboid_size;

    let start_xy = [ ((whd%2) ? (scale*18) : 0), Math.floor(whd/2)*155 ];

    let sxy = [ start_xy[0] + 50, start_xy[1] + 150 ];

    //----
    //----
    //----

    // STILL WIP
    //
    // think we're abandoning the funnel in lieu of high alpha full cubes
    // with highlighted focus cuboid
    //
    let show_funnel = false;
    if (show_funnel) {
      let s0_x = sxy[0];
      let s0_y = sxy[1];

      let e0_x = sxy[0] + 90;
      let e0_y = sxy[1] - 3;

      let s1_x = sxy[0];
      let s1_y = sxy[1] - 20;

      let e1_x = sxy[0] + 90;
      let e1_y = sxy[1] - 45;


      let cp_f_s = 30;
      let funnel = new Two.Path([
        new Two.Anchor(s0_x,s0_y,       0,0,   cp_f_s,0, Two.Commands.curve),
        new Two.Anchor(e0_x,e0_y, -cp_f_s,0,        0,0, Two.Commands.curve),
        new Two.Anchor(e1_x,e1_y,       0,0,  -cp_f_s,0, Two.Commands.curve),
        new Two.Anchor(s1_x,s1_y,  cp_f_s,0,        0,0, Two.Commands.curve)
      ], true, false, true);
      funnel.linewidth = 1;
      funnel.stroke = "rgba(0,0,0,0.5)";
      funnel.fill = "rgba(47,55,55,0.2)";

      two.add(funnel);

      s0_x = sxy[0]-15;
      s0_y = sxy[1]-15;

      e0_x = s0_x + 170;
      e0_y = s0_y + 0;

      s1_x = s0_x;
      s1_y = s0_y - 30;

      e1_x = s0_x + 170;
      e1_y = s0_y - 55;

      cp_f_s = 30;
      let funnelB = new Two.Path([
        new Two.Anchor(s0_x,s0_y,       0,0,   cp_f_s,0, Two.Commands.curve),
        new Two.Anchor(e0_x,e0_y, -cp_f_s,0,        0,0, Two.Commands.curve),
        new Two.Anchor(e1_x,e1_y,       0,0,  -cp_f_s,0, Two.Commands.curve),
        new Two.Anchor(s1_x,s1_y,  cp_f_s,0,        0,0, Two.Commands.curve)
      ], true, false, true);
      funnelB.linewidth = 1;
      funnelB.stroke = "rgba(0,0,0,0.5)";
      funnelB.fill = "rgba(47,55,55,0.2)";

      two.add(funnelB);


      s0_x = sxy[0]-0;
      s0_y = sxy[1]-30;

      e0_x = s0_x + 210;
      e0_y = s0_y + 15;

      s1_x = s0_x;
      s1_y = s0_y - 15;

      e1_x = s0_x + 210;
      e1_y = s0_y - 55;

      cp_f_s = 30;
      let funnelC = new Two.Path([
        new Two.Anchor(s0_x,s0_y,       0,0,   cp_f_s,0, Two.Commands.curve),
        new Two.Anchor(e0_x,e0_y, -cp_f_s,0,        0,0, Two.Commands.curve),
        new Two.Anchor(e1_x,e1_y,       0,0,  -cp_f_s,0, Two.Commands.curve),
        new Two.Anchor(s1_x,s1_y,  cp_f_s,0,        0,0, Two.Commands.curve)
      ], true, false, true);
      funnelC.linewidth = 1;
      funnelC.stroke = "rgba(0,0,0,0.5)";
      funnelC.fill = "rgba(47,55,55,0.2)";

      two.add(funnelC);

    }

    //----
    //----
    //----

    let tsxy = [ sxy[0], sxy[1] ];
    if (whd%2) { tsxy[0] -= 5; }
    else { tsxy[0] -= 5; }

    // draw the full J-split block
    //
    let jsplit_scale = 18;
    mkfullblock(tsxy, pc.opos, pc.cuboid_size, pc.disp_order, jsplit_scale);


    let show_jsplit_dock = true;
    if (show_jsplit_dock) {

      // docking circles for each of the sub-blocks
      //
      //let dock_co = [ "rgba(0,0,0,0)", "rgba(0,0,0,0.3)" ];
      let dock_co = [ "rgba(0,0,0,0)", "rgba(0,0,0,0.4)" ];
      for (let _di=0; _di<2; _di++) {
        let dock_pos = jsplit_dock[_di];

        let _dd = 1/3;
        let jxyz = njs.mul(jsplit_scale, rodrigues([ dock_pos[0],dock_pos[1],dock_pos[2]], vr, theta));
        let jxy = njs.add( tsxy, _project( jxyz[0], jxyz[1], jxyz[2]) );
        //mk_iso_cuboid(jxy[0],jxy[1],jsplit_scale*_dd, dock_co[0], dock_co[1], [1,1,1], 2, vr, theta);
        mk_iso_cuboid(jxy[0],jxy[1],jsplit_scale*_dd, dock_co[0], dock_co[1], [1,1,1], 0, vr, theta);

        let dc_xyz = njs.mul(jsplit_scale, rodrigues([dock_pos[3],dock_pos[4],dock_pos[5]], vr, theta));
        let dc_xy = njs.add( tsxy, _project( dc_xyz[0], dc_xyz[1], dc_xyz[2]) );

        let _c = two.makeCircle( dc_xy[0], dc_xy[1],  4 );
        //_c.stroke = "rgba(0,0,0,0)";
        //_c.stroke = "rgb(0,0,0)";
        _c.noStroke();
        //_c.linewidth = 0;

        //if (_di==1) { _c.fill = "rgba(255,255,255,0.9)"; }
        //else        { _c.fill = "rgba(0,0,0,0.9)"; }
        _c.opacity = 0.9;
        if (_di==1) { _c.fill = "rgb(255,255,255)"; }
        else        { _c.fill = "rgb(0,0,0)"; }
      }

    }



    let _st = {
      "size": 10,
      "weight": "normal",
      "family": "Libertine, Linux Libertine O"
    };

    // show parity on full blocks sides
    //
    let bcode = [ "000", "001", "010", "011", "100", "101", "110", "111" ];

    let _btx = two.makeText( bcode[whd][0], sxy[0]+15, sxy[1]+3, _st );
    let _bty = two.makeText( bcode[whd][1], sxy[0]-25, sxy[1]-5, _st );
    let _btz = two.makeText( bcode[whd][2], sxy[0]-38, sxy[1]-35, _st );



    two.makeText("Block", sxy[0]+5, sxy[1]+30, _st);
    two.makeText("Axis", sxy[0]+5, sxy[1]+45, _st);


    //EXPERIMENTAL
    //EXPERIMENTAL
    let order_legend = false;
    if (order_legend) {
      let _smsc = 4;
      mkfullblock( njs.add(tsxy, [-30, 30]), pc.opos, pc.cuboid_size, pc.disp_order, _smsc, 0, 0.8);
      mkfullblock( njs.add(tsxy, [-10, 30]), pc.opos, pc.cuboid_size, pc.disp_order, _smsc, 1, 0.2);

      mkfullblock( njs.add(tsxy, [ 10, 30]), pc.opos, pc.cuboid_size, pc.disp_order, _smsc, 2, 0.015);
      mkfullblock( njs.add(tsxy, [ 30, 30]), pc.opos, pc.cuboid_size, pc.disp_order, _smsc, 3, 0.15);
      mkfullblock( njs.add(tsxy, [ 50, 30]), pc.opos, pc.cuboid_size, pc.disp_order, _smsc, 4, 0.2);
    }
    //EXPERIMENTAL
    //EXPERIMENTAL

    let vord_pos = [-1,-1];
    for (let idx=0; idx<5; idx++) {

      // draw sub-cuboid
      //
      let cxy = njs.add( [60,0], njs.add( start_xy, cxya[idx]) );
      let lco = lPAL[idx];
      let fco = PAL[idx];
      let cs = njs.mul(scale, cuboid_size_a[idx]);
      mk_iso_cuboid(cxy[0],cxy[1],1, lco, fco, cs, 2, vr, theta);

      //EXPERIMENTAL
      let order_legend_local = false;
      if (order_legend_local) {
        let _smsc = 6;
        let _smo = [ start_xy[0] + 60 - 25 + cxya[idx][0], start_xy[1] + 85 ];
        mkfullblock( _smo, pc.opos, pc.cuboid_size, pc.disp_order, _smsc, idx, 0.1);
      }
      //EXPERIMENTAL

      // draw red X's on cuboids that have a forced notch 
      //
      if ((idx==2) &&
          ((whd == 4) ||
           (whd == 5) ||
           (whd == 6)
          )
         ) {

        let txy = [ cxy[0] + 15, cxy[1] - 38 ];
        let notch0 = two.makeLine( txy[0], txy[1], txy[0]+10, txy[1]+10 );
        notch0.cap = "round";
        notch0.stroke = "#f00";
        notch0.noFill();
        notch0.linewidth = 4;

        let notch1 = two.makeLine( txy[0], txy[1]+10, txy[0]+10, txy[1] );
        notch1.cap = "round";
        notch1.stroke = "#f00";
        notch1.noFill();
        notch1.linewidth = 4;
      }

      if (vord_pos[0] < 0) {
        vord_pos[0] = cxy[0];
        vord_pos[1] = cxy[1];
      }
      else {
        vord_pos[0] = cxy[0];
      }

      // C fudge right for whd%2
      //
      if (((whd%2)==1) &&
           (whd < 7) &&
           (idx==2)) {
        vord_pos[0]+=15;
      }

      // D fudge for 011
      //
      let rparen = 38;
      if ((whd == 3) &&
          (idx == 3)) {
        vord_pos[0]-=10;
        rparen = 44;
      }

      let _lbl = pc.label[idx];

      // local axis for the sub-cuboid
      //
      small_axis_fig(vord_pos[0]-26, vord_pos[1] + 42, _lbl.order, _lbl.orientation, 12);

      // axis annotations for the cuboids
      //
      let label_annotations = true;
      if (label_annotations) {

        if (whd == 3) { _lbl = label_P1_011[idx]; }

        let _xt = _lbl.x.t;
        let _yt = _lbl.y.t;
        let _zt = _lbl.z.t;

        _xt = _xt.replace(/^m_/, '');
        _yt = _yt.replace(/^m_/, '');
        _zt = _zt.replace(/^m_/, '');

        // edge annotations on the cuboid proper
        //
        mathjax2twojs(_xt, cxy[0]+_lbl.x.xy[0],cxy[1]+_lbl.x.xy[1], 0.015);
        mathjax2twojs(_yt, cxy[0]+_lbl.y.xy[0],cxy[1]+_lbl.y.xy[1], 0.015);
        mathjax2twojs(_zt, cxy[0]+_lbl.z.xy[0],cxy[1]+_lbl.z.xy[1], 0.015);


        // axis order displayed in a column underneath the cuboid
        //
        let _ord = _lbl.order;

        let _ltxt = [ _lbl.x.t, _lbl.y.t, _lbl.z.t ];
        let ltxt = [ _ltxt[_ord[0]], _ltxt[_ord[1]], _ltxt[_ord[2]] ];

        let dx = [0,0,0];
        for (let __i=0; __i<3; __i++) {
          if (ltxt[__i].slice(0,2) == "m_") { dx[__i] -= 8; }
        }
        mathjax2twojs(ltxt[0], vord_pos[0]+dx[0],vord_pos[1]+30, 0.0125);
        mathjax2twojs(ltxt[1], vord_pos[0]+dx[1],vord_pos[1]+42, 0.0125);
        mathjax2twojs(ltxt[2], vord_pos[0]+dx[2],vord_pos[1]+54, 0.0125);

      }

      // docking circles for each of the sub-blocks
      //
      let dock_co = [ "rgba(0,0,0,0)", "rgba(0,0,0,0.4)" ];
      for (let _di=0; _di<2; _di++) {
        let dock_pos = pc.endpoint[idx][_di];

        let _dd = 1/3;
        let jxyz = njs.mul(scale, rodrigues([ dock_pos[0],dock_pos[1],dock_pos[2]], vr, theta));
        let jxy = njs.add( [cxy[0], cxy[1]], _project( jxyz[0], jxyz[1], jxyz[2]) );
        //mk_iso_cuboid(jxy[0],jxy[1],scale*_dd, dock_co[0], dock_co[1], [1,1,1], 2, vr, theta);
        mk_iso_cuboid(jxy[0],jxy[1],scale*_dd, dock_co[0], dock_co[1], [1,1,1], 0, vr, theta);

        let dc_xyz = njs.mul(scale, rodrigues([dock_pos[3],dock_pos[4],dock_pos[5]], vr, theta));
        let dc_xy = njs.add( [cxy[0], cxy[1]], _project( dc_xyz[0], dc_xyz[1], dc_xyz[2]) );

        let _c = two.makeCircle( dc_xy[0], dc_xy[1],  4 );
        //_c.stroke = "rgba(0,0,0,0)";
        //_c.linewidth = 0;
        _c.noStroke();

        //if (_di==1) { _c.fill = "rgba(255,255,255,0.9)"; }
        //else        { _c.fill = "rgba(0,0,0,0.9)"; }
        _c.opacity = 0.9;
        if (_di==1) { _c.fill = "rgb(255,255,255)"; }
        else        { _c.fill = "rgb(0,0,0)"; }
      }

    }

  }

  if (false) {
    let pc0 = PConfig[0];
    let pc1 = PConfig[1];
    let pc2 = PConfig[2];

    let disp_order0 = [3,4,1,0,2];
    let disp_order1 = [2,4,3,0,1];
    let disp_order2 = [1,2,4,3,0];

    mkfullblock([150,100], pc0.opos, pc0.cuboid_size, disp_order0, 20);
    mkfullblock([250,100], pc1.opos, pc1.cuboid_size, disp_order1, 20);
    mkfullblock([200,200], pc2.opos, pc2.cuboid_size, disp_order2, 20);
  }

  let W = g_fig_ctx.two.width;
  let H = g_fig_ctx.two.height;

  let sep_lw = 3;

  let h0 = 215;
  let hline0 = two.makeLine(0, h0, W, h0);
  //hline0.stroke = "rgba(0,0,0,0.8)";
  hline0.stroke = "rgb(0,0,0)";
  hline0.opacity = 0.8;
  hline0.linewidth = sep_lw;

  let h1 = h0+155;
  let hline1 = two.makeLine(0, h1, W, h1);
  //hline1.stroke = "rgba(0,0,0,0.8)";
  hline1.stroke = "rgb(0,0,0)";
  hline1.opacity = 0.8;
  hline1.linewidth = sep_lw;

  let h2 = h1+155;
  let hline2 = two.makeLine(0, h2, W, h2);
  //hline2.stroke = "rgba(0,0,0,0.8)";
  hline2.stroke = "rgb(0,0,0)";
  hline2.opacity = 0.8;
  hline2.linewidth = sep_lw;

  let h3 = h2+155;
  let hline3 = two.makeLine(0, h3, W, h3);
  //hline3.stroke = "rgba(0,0,0,0.8)";
  hline3.stroke = "rgb(0,0,0)";
  hline3.opacity = 0.8;
  hline3.linewidth = sep_lw;

  let h_s = 65;
  let h_e = H-50;
  h_e = h3;

  let mid_x = W/2 - 45;
  let vline = two.makeLine(mid_x, h_s, mid_x, h_e);
  //vline.stroke = "rgba(0,0,0,0.8)";
  vline.stroke = "rgb(0,0,0)";
  vline.opacity = 0.8;
  vline.linewidth = sep_lw;

  let w0 = 90;
  let vline0 = two.makeLine(w0, h_s, w0, h_e);
  //vline0.stroke= "rgba(0,0,0,0.3)";
  vline0.stroke = "rgb(0,0,0)";
  vline0.opacity = 0.3;

  let w1 = mid_x+85;
  let vline1 = two.makeLine(w1, h_s, w1, h_e);
  //vline1.stroke= "rgba(0,0,0,0.3)";
  vline1.stroke = "rgb(0,0,0)";
  vline1.opacity = 0.3;

  axis_fig(50, 50, 20);
  //block3d_fig(50, 160, 40);
  //curve3d_fig(15, 300, 20);
}

var debug = [];

// so very hacky
// somehow we managed to shoehorn
// mathjax notation into svg so that it
// can be used by two.js.
// We need to contort ourselves to get the mask
// right so that it gets all the element
//
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

  debug.push(sgr);

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
  //mask.firstChild.setAttribute("d", "M -10000 -10000 L 10000 -10000 L 10000 10000 L -10000 10000 Z");
  mask.firstChild.setAttribute("d", "M -4000 -4000 L 4000 -4000 L 4000 4000 L -4000 4000 Z");

  two.update();
}


/*
var debug = [];
function okok() {
  let two = g_fig_ctx.two;
  let s = '<svg width="100" height="100"><circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" /></svg>';
  const div = document.createElement('div');
  div.innerHTML = s;
  let fc = div.firstChild;
  let g = two.interpret(fc);
  console.log(s,div, g);
  two.update();
}
*/
