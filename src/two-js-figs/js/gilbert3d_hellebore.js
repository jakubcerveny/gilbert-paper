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



var PAL5 = [
  'rgb(215,25,28)',
  'rgb(253,174,97)',
  'rgb(255,255,159)',
  'rgb(171,221,164)',
  'rgb(43,131,186)',
];

var PAL2 = [
  'rgb(215,25,28)',
  'rgb(43,131,186)',
];


var lPAL5 = [
  'rgb(120,25,28)',
  'rgb(203,134,37)',
  'rgb(215,215,191)',
  'rgb(121,181,124)',
  'rgb(13,91,136)',
];

var lPAL2 = [
  'rgb(120,25,28)',
  'rgb(13,91,136)',
];

var PAL8 = [ '#ce6f4f', '#e89e50', '#d4b247', '#b3c359', '#84d17e', '#41d9aa', '#00dad9', '#00d9ff' ];
PAL8 = [ '#ff3c24', '#96009a', '#006bb3', '#778500', '#ff5cb9', '#00d8ff', '#61ea92', '#ecb500', ];
PAL8 = [ '#f64842', '#6103b7', '#006b8d', '#7f8300', '#ff67b4', '#36cdff', '#6cea91', '#f3b200', ];
PAL8 = [ '#ed6a97', '#edaffc', '#97e4fe', '#2bf3d8', '#2fda80', '#5dbd43', '#879c16', '#be8651', ];

PAL8 = [ '#c96462', '#ce4906', '#859a2c', '#41ac73', '#4489d5', '#9a75b9', '#d8743f', '#e28271', ];

PAL8 = [ "#E6F1E9", "#EAF3E8", "#F0F4E6", "#F7F6E6", "#F5F2DF", "#F7E8D5", "#EDD5C5", "#DCBEB0", "#B59790", "#D6C2C0" ];
PAL8 = [ "#FDFCE8", "#F1F3E5", "#E4E9E2", "#D7DFDF", "#CAD5DB", "#BDCBD8", "#B1C2D5", "#A4B8D2", "#97AECF", "#8AA4CB" ];
PAL8 = [ '#777777', "#008042", "#6FA253", "#B7C370", "#FCE498", "#D78287", "#BF5688", "#7C1D6F", '#777777' ];
PAL8 = ['#777777', "#443F90", "#685BA7", "#A599CA", "#F5DDEB", "#F492A5", "#EA6E8A", "#D21C5E" ];
PAL8 = [ '#777777', "#045275", "#089099", "#7CCBA2", "#FCDE9C", "#F0746E", "#DC3977", "#7C1D6F" ];
PAL8 = [ '#777777', "#009392", "#39B185", "#9CCB86", "#E9E29C", "#EEB479", "#E88471", "#CF597E"];

var lPAL8 = [];
for (let i=0; i<PAL8.length; i++) {
  let rgb = _hex2rgb(PAL8[i]);
  let hsv = RGBtoHSV(rgb.r, rgb.g, rgb.b);

  //hsv.s *= 0.8;
  //hsv.v *= 0.8;

  hsv.s *= 0.7;
  hsv.v *= 0.7;


  let dst_rgb = HSVtoRGB(hsv.h, hsv.s, hsv.v);
  let dst_rgb_str =  "rgb(" +
              Math.floor(dst_rgb.r).toString() + "," +
              Math.floor(dst_rgb.g).toString() + "," +
              Math.floor(dst_rgb.b).toString() + ")";
  lPAL8.push(dst_rgb_str);
}

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

function _hex2rgb(rgb) {
  let s = 0;
  let d = 2;
  if (rgb[0] == '#') {
    rgb = rgb.slice(1);
  }
  if (rgb.length==3) { d = 1; }
  let hxr = rgb.slice(s,s+d);
  if (hxr.length==1) { hxr += hxr; }
  s += d;

  let hxg = rgb.slice(s,s+d);
  if (hxg.length==1) { hxg += hxg; }
  s += d;

  let hxb = rgb.slice(s,s+d);
  if (hxb.length==1) { hxb += hxb; }
  s += d;

  let v = { "r": parseInt(hxr,16), "g": parseInt(hxg,16), "b": parseInt(hxb,16) };
  return v;
}



//  https://stackoverflow.com/a/17243070
// From user Paul S. (https://stackoverflow.com/users/1615483/paul-s)
//
/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v
 * 0 <= h,s,v, <=1
*/
function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) { s = h.s, v = h.v, h = h.h; }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/* accepts parameters
 * r  Object = {r:x, g:y, b:z}
 * OR 
 * r, g, b
 *
 * 0 <= r,g,b <= 255
*/
function RGBtoHSV(r, g, b) {
  if (arguments.length === 1) { g = r.g, b = r.b, r = r.r; }
  var max = Math.max(r, g, b), min = Math.min(r, g, b),
    d = max - min,
    h,
    s = (max === 0 ? 0 : d / max),
    v = max / 255;

  switch (max) {
    case min: h = 0; break;
    case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
    case g: h = (b - r) + d * 2; h /= 6 * d; break;
    case b: h = (r - g) + d * 4; h /= 6 * d; break;
  }

  return { h: h, s: s, v: v };
}

function HSVtoHSL(h, s, v) {
  if (arguments.length === 1) { s = h.s, v = h.v, h = h.h; }
  var _h = h,
    _s = s * v, _l = (2 - s) * v;
  _s /= (_l <= 1) ? _l : 2 - _l;
  _l /= 2;
  return { h: _h, s: _s, l: _l };
}

function HSLtoHSV(h, s, l) {
  if (arguments.length === 1) { s = h.s, l = h.l, h = h.h; }
  var _h = h, _s, _v; l *= 2;
  s *= (l <= 1) ? l : 2 - l;
  _v = (l + s) / 2;
  _s = (2 * s) / (l + s);
  return { h: _h, s: _s, v: _v };
}


function hsl_lerp(p) {
  let hue = Math.floor(360*p).toString();
  let sat = "95%";
  let lit = '35%';

  sat = '60%';
  lit = '55%';
  return "hsl(" + [ hue,sat,lit ].join(",") + ")";
}


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
  var ele = document.getElementById("gilbert3d_hellebore");
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
        //mathjax2twojs( _latex_id[xyz], x0+txy[0]-20, y0+txy[1]-8, 0.018 );
        mathjax2twojs( _latex_id[xyz], x0+txy[0]+12, y0+txy[1]-8, 0.018 );
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


function hellebore_block3d(x0,y0,s0, vr, theta) {
  vr = ((typeof vr === "undefined") ? [0,0,1] : vr);
  theta = ((typeof theta === "undefined") ? 0 : theta);

  let dw = 1/4;
  let dw2 = dw/2;
  let js = s0*dw;
  let D = 1.39;
  D = 1.49;

  let cuboid_size = [
    [1,1,1],
    [1,1,1],

    [1,1,1],
    [1,1,1],

    [1,1,1],
    [1,1,1],

    [1,1,1],
    [1,1,1]
  ];


  let cxyz = [
    [ -D, -D,  -D],
    [ -D, -D,   D],

    [ -D,  D,   D],
    [ -D,  D,  -D],

    [  D,  D,  -D],
    [  D,  D,   D],

    [  D, -D,   D],
    [  D, -D,  -D],
  ];

  let dock_dxyz = [
    // A
    //
    [1-dw2,1-dw2,dw2], [dw2,dw2,1-dw2],

    // B
    //
    [dw2,dw2,dw2], [1-dw2,1-dw2,1-dw2],

    // C
    //
    [1-dw2,dw2,1-dw2], [dw2,1-dw2,dw2],

    // D
    //
    [dw2,1-dw2,1-dw2], [1-dw2,dw2,dw2],

    // E
    //
    [dw2,dw2,dw2], [1-dw2,1-dw2,1-dw2],

    // F
    //
    [1-dw2,1-dw2,0], [dw2,dw2,1-dw2],

    // G
    //
    [dw2,1-dw2,1-dw2], [1-dw2,dw2,dw2],

    // H
    //
    [1-dw2,dw2,1-dw2], [dw2,1-dw2,dw2],

  ];

  let dock_xyz = [];
  for (let i=0; i<cxyz.length; i++) {
    let xyz0 = [],
        xyz1 = [];
    for (let j=0; j<3; j++) {
      xyz0.push( cxyz[i][j] + dock_dxyz[2*i][j] );
      xyz1.push( cxyz[i][j] + dock_dxyz[2*i+1][j] );
    }
    dock_xyz.push( xyz0 );
    dock_xyz.push( xyz1 );
  }

  let order = [0,1, 2,3, 4,5, 6,7];

  block3d_fig(x0,y0,s0, cuboid_size, cxyz, dock_xyz, order, vr, theta);

  return;
}

function hellebore_s0_block3d(x0,y0,s0, vr, theta) {
  vr = ((typeof vr === "undefined") ? [0,0,1] : vr);
  theta = ((typeof theta === "undefined") ? 0 : theta);

  let dw = 1/4;
  let dw2 = dw/2;
  let js = s0*dw;
  let D = 1.49;

  let ls = 1.3;

  let cuboid_size = [
    [1,1,1],
    [1,1,ls],

    [1,ls,ls],
    [1,ls,1],

    [ls,ls,1],
    [ls,ls,ls],

    [ls,1,ls],
    [ls,1,1]
  ];


  let cxyz = [
    [  0,  0,  -D],
    [  0,  0,   D],

    [  0,  1,   D],
    [  0,  1,  -D],

    [  1,  1,  -D],
    [  1,  1,   D],

    [  1,  0,   D],
    [  1,  0,  -D],
  ];

  let dock_dxyz = [

    // A
    //
    [1-dw2,1-dw2,dw2], [dw2,dw2,1-dw2],

    // B
    //
    [dw2,dw2,dw2], [1-dw2,1-dw2,ls-dw2],

    // C
    //
    [1-dw2,dw2,ls-dw2], [dw2,ls-dw2,dw2],

    // D
    //
    [dw2,ls-dw2,1-dw2], [1-dw2,dw2,dw2],

    // E
    //
    [dw2,dw2,dw2], [ls-dw2,ls-dw2,1-dw2],

    // F
    //
    [ls-dw2,ls-dw2,dw2], [dw2,dw2,ls-dw2],

    // G
    //
    [dw2,1-dw2,ls-dw2], [ls-dw2,dw2,dw2],

    // H
    //
    [ls-dw2,dw2,1-dw2], [dw2,1-dw2,dw2],

  ];

  let dock_xyz = [];
  for (let i=0; i<cxyz.length; i++) {
    let xyz0 = [],
        xyz1 = [];
    for (let j=0; j<3; j++) {
      xyz0.push( cxyz[i][j] + dock_dxyz[2*i][j] );
      xyz1.push( cxyz[i][j] + dock_dxyz[2*i+1][j] );
    }
    dock_xyz.push( xyz0 );
    dock_xyz.push( xyz1 );
  }

  let order = [2,3, 0,1, 4,5, 6,7];

  let skip = [0,3,4,7,8,11,12,15];

  block3d_fig(x0,y0,s0, cuboid_size, cxyz, dock_xyz, order, vr, theta, [5,6], skip);

  return;
}

function hellebore_s1_block3d(x0,y0,s0, vr, theta) {
  vr = ((typeof vr === "undefined") ? [0,0,1] : vr);
  theta = ((typeof theta === "undefined") ? 0 : theta);

  let dw = 1/4;
  let dw2 = dw/2;
  let js = s0*dw;
  let D = 1.59;

  let ls = 1.3;

  let cuboid_size = [
    [ls,ls,ls],
    [ls,ls,1],

    [ls,1,1],
    [ls,1,ls],

    [1,1,ls],
    [1,1,1],

    [1,ls,1],
    [1,ls,ls]
  ];


  let cxyz = [
    [  0,  0,  -D],
    [  0,  0,   D],

    [  0,  ls,   D],
    [  0,  ls,  -D],

    [  ls,  ls,  -D],
    [  ls,  ls,   D],

    [  ls,  0,   D],
    [  ls,  0,  -D],
  ];

  let dock_dxyz = [
    // A
    //
    [ls-dw2,ls-dw2,dw2], [dw2,dw2,ls-dw2],

    // B
    //
    [dw2,dw2,dw2], [ls-dw2,ls-dw2,1-dw2],

    // C
    //
    [ls-dw2,dw2,1-dw2], [dw2,1-dw2,dw2],

    // D
    //
    [dw2,1-dw2,ls-dw2], [ls-dw2,dw2,dw2],

    // E
    //
    [dw2,dw2,dw2], [1-dw2,1-dw2,ls-dw2],

    // F
    //
    [1-dw2,1-dw2,dw2], [dw2,dw2,1-dw2],

    // G
    //
    [dw2,ls-dw2,1-dw2], [1-dw2,dw2,dw2],

    // H
    //
    [1-dw2,dw2,ls-dw2], [dw2,ls-dw2,dw2],

  ];

  let dock_xyz = [];
  for (let i=0; i<cxyz.length; i++) {
    let xyz0 = [],
        xyz1 = [];
    for (let j=0; j<3; j++) {
      xyz0.push( cxyz[i][j] + dock_dxyz[2*i][j] );
      xyz1.push( cxyz[i][j] + dock_dxyz[2*i+1][j] );
    }
    dock_xyz.push( xyz0 );
    dock_xyz.push( xyz1 );
  }

  let order = [2,3, 0,1, 4,5, 6,7];

  let skip = [0,3,4,7,8,11,12,15];

  block3d_fig(x0,y0,s0, cuboid_size, cxyz, dock_xyz, order, vr, theta,[5,6],skip);

  return;
}

function hellebore_011_block3d(x0,y0,s0, vr, theta) {
  vr = ((typeof vr === "undefined") ? [0,0,1] : vr);
  theta = ((typeof theta === "undefined") ? 0 : theta);

  let dw = 1/4;
  let dw2 = dw/2;
  let js = s0*dw;
  let D = 1.59;

  let ls = 1.3;

  let lm = (1+ls)/2;
  let xxx= 1;

  let cuboid_size = [
    [  1,  1,  1 ],
    [ lm, lm, ls ],

    [ lm, lm, ls ],
    [ ls, ls,  1 ],

    [  1, ls,  1 ],
    [ lm, lm, ls ],

    [ lm, lm, ls ],
    [ ls,  1, 1 ]
  ];


  let cxyz = [
    [  0,  0,  -D],
    [  0,  0,   D],

    [  0,  lm,   D],
    [  0,  1,  -D],

    [  ls,  1,  -D],
    [  lm,  lm,   D],

    [  lm,  0,   D],
    [  1,  0,  -D],
  ];

  let dock_dxyz = [
    // A
    //
    [1-dw2,1-dw2,dw2], [dw2,dw2,1-dw2],

    // B
    //
    [dw2,dw2,dw2], [lm-dw2,lm-dw2,ls-dw2],

    // C
    //
    [lm-dw2,dw2,ls-dw2], [dw2,lm-dw2,dw2],

    // D
    //
    [dw2,ls-dw2,1-dw2], [ls-dw2,dw2,dw2],

    // E
    //
    [dw2,dw2,dw2], [1-dw2,ls-dw2,1-dw2],

    // F
    //
    [lm-dw2,lm-dw2,dw2], [dw2,dw2,ls-dw2],

    // G
    //
    [dw2,lm-dw2,ls-dw2], [lm-dw2,dw2,dw2],

    // H
    //
    [ls-dw2,dw2,1-dw2], [dw2,1-dw2,dw2],

  ];

  let dock_xyz = [];
  for (let i=0; i<cxyz.length; i++) {
    let xyz0 = [],
        xyz1 = [];
    for (let j=0; j<3; j++) {
      xyz0.push( cxyz[i][j] + dock_dxyz[2*i][j] );
      xyz1.push( cxyz[i][j] + dock_dxyz[2*i+1][j] );
    }
    dock_xyz.push( xyz0 );
    dock_xyz.push( xyz1 );
  }

  let order = [2,3, 0,1, 4,5, 6,7];

  let skip = [0,3,4,7,8,11,12,15];

  block3d_fig(x0,y0,s0, cuboid_size, cxyz, dock_xyz, order, vr, theta,[5,6],skip);

  return;
}

function hellebore_101_block3d(x0,y0,s0, vr, theta) {
  vr = ((typeof vr === "undefined") ? [0,0,1] : vr);
  theta = ((typeof theta === "undefined") ? 0 : theta);

  let dw = 1/4;
  let dw2 = dw/2;
  let js = s0*dw;
  let D = 1.59;

  let ls = 1.25;

  let lm = (1+ls)/2;
  let xxx= 1;

  let cuboid_size = [
    [  1,  lm,  ls ],

    // B
    [ 1, ls, 1 ],

    // C
    [ 1,  1, 1 ],

    [ 1,  lm, ls ],

    [  ls, lm,  ls ],

    //F
    [ ls, ls, 1 ],

    // G
    [ ls, 1, 1],

    [ ls,  lm, ls ]
  ];


  let cxyz = [
    [  0,  0,  -D],
    [  0,  0,   D],

    [  0,  ls,   D],
    [  0,  lm,  -D],

    [  1,  lm,  -D],
    [  1,  1,   D],

    [  1,  0,   D],
    [  1,  0,  -D],
  ];

  let dock_dxyz = [


    // A
    //
    [1-dw2,lm-dw2,dw2], [dw2,dw2,ls-dw2],

    // B
    //
    [dw2,dw2,dw2], [1-dw2,ls-dw2,1-dw2],

    // C
    //
    [1-dw2,dw2,1-dw2], [dw2,1-dw2,dw2],

    // D
    //
    [dw2,lm-dw2,ls-dw2], [1-dw2,dw2,dw2],

    // E
    //
    [dw2,dw2,dw2], [ls-dw2,lm-dw2,ls-dw2],

    // F
    //
    [ls-dw2,ls-dw2,dw2], [dw2,dw2,1-dw2],

    // G
    //
    [dw2,lm-dw2,1-dw2], [ls-dw2,dw2,dw2],

    // H
    //
    [ls-dw2,dw2,ls-dw2], [dw2,lm-dw2,dw2],

  ];

  let dock_xyz = [];
  for (let i=0; i<cxyz.length; i++) {
    if ((2*i) >= dock_dxyz.length) { continue; }
    if ((2*i+1) >= dock_dxyz.length) { continue; }
    let xyz0 = [],
        xyz1 = [];
    for (let j=0; j<3; j++) {
      xyz0.push( cxyz[i][j] + dock_dxyz[2*i][j] );
      xyz1.push( cxyz[i][j] + dock_dxyz[2*i+1][j] );
    }
    dock_xyz.push( xyz0 );
    dock_xyz.push( xyz1 );
  }

  let order = [2,3, 0,1, 4,5, 6,7];

  let skip = [0,3,4,7,8,11,12,15];

  block3d_fig(x0,y0,s0, cuboid_size, cxyz, dock_xyz, order, vr, theta, [5,6], skip);

  return;
}

function hellebore_110_block3d(x0,y0,s0, vr, theta) {
  vr = ((typeof vr === "undefined") ? [0,0,1] : vr);
  theta = ((typeof theta === "undefined") ? 0 : theta);

  let dw = 1/4;
  let dw2 = dw/2;
  let js = s0*dw;
  let D = 1.59;

  let ls = 1.25;

  let lm = (1+ls)/2;
  let xxx= 1;

  let cuboid_size = [
    [  1,   1,  1 ],
    [  1,   1, ls ],

    // C
    [  1,  ls,  lm ],
    [  1,  ls,  lm ],

    [ ls,  ls,  lm ],
    [ ls,  ls,  lm ],

    [ ls,   1,  1 ],
    [ ls,   1, ls ]
  ];


  let cxyz = [
    [  0, -D,  0],
    [  0, -D,  1],

    [  0,  D,  lm],
    [  0,  D,  0],

    [  1,  D,  0],
    [  1,  D,  lm],

    [  1, -D,  ls],
    [  1, -D,  0],
  ];

  let dock_dxyz = [


    // A
    //
    [1-dw2,1-dw2,dw2], [dw2,dw2,1-dw2],

    // B
    //
    [dw2,dw2,dw2], [1-dw2,1-dw2,ls-dw2],

    // C
    //
    [1-dw2,dw2,lm-dw2], [dw2,ls-dw2,dw2],

    // D
    //
    [dw2,ls-dw2,lm-dw2], [1-dw2,dw2,dw2],

    // E
    //
    [dw2,dw2,dw2], [ls-dw2,ls-dw2,lm-dw2],

    // F
    //
    [ls-dw2,ls-dw2,dw2], [dw2,dw2,lm-dw2],

    // G
    //
    [dw2,1-dw2,1-dw2], [ls-dw2,dw2,dw2],

    // H
    //
    [ls-dw2,dw2,ls-dw2], [dw2,1-dw2,dw2],

  ];

  let dock_xyz = [];
  for (let i=0; i<cxyz.length; i++) {
    if ((2*i) >= dock_dxyz.length) { continue; }
    if ((2*i+1) >= dock_dxyz.length) { continue; }
    let xyz0 = [],
        xyz1 = [];
    for (let j=0; j<3; j++) {
      xyz0.push( cxyz[i][j] + dock_dxyz[2*i][j] );
      xyz1.push( cxyz[i][j] + dock_dxyz[2*i+1][j] );
    }
    dock_xyz.push( xyz0 );
    dock_xyz.push( xyz1 );
  }

  let order = [3,2, 0,1, 4,5,  7,6];

  let skip = [0,1,2, 5,6,7,8,9,10,  13,14,15];

  block3d_fig(x0,y0,s0, cuboid_size, cxyz, dock_xyz, order, vr, theta, [5,6], skip);

  return;
}

function hellebore_111_block3d(x0,y0,s0, vr, theta) {
  vr = ((typeof vr === "undefined") ? [0,0,1] : vr);
  theta = ((typeof theta === "undefined") ? 0 : theta);

  let dw = 1/4;
  let dw2 = dw/2;
  let js = s0*dw;
  let D = 1.49;

  let ls = 1.3;

  let cuboid_size = [
    [2,2,1],
    [2,2,ls],

  ];


  let cxyz = [
    [  0,  0,  -D],
    [  0,  0,   D],
  ];

  let dock_dxyz = [

    // A
    //
    [2-dw2,2-dw2,1-dw2],
    [dw2,dw2,1-dw2],

    // B
    //
    [dw2,dw2,dw2], [2-dw2,2-dw2,dw2],
  ];

  let dock_xyz = [];
  for (let i=0; i<cxyz.length; i++) {
    let xyz0 = [],
        xyz1 = [];
    for (let j=0; j<3; j++) {
      xyz0.push( cxyz[i][j] + dock_dxyz[2*i][j] );
      xyz1.push( cxyz[i][j] + dock_dxyz[2*i+1][j] );
    }
    dock_xyz.push( xyz0 );
    dock_xyz.push( xyz1 );
  }

  let order = [0,1];

  let skip = [0,3,4,7,8,11,12,15];
  skip = [];

  block3d_fig(x0,y0,s0, cuboid_size, cxyz, dock_xyz, order, vr, theta, [], skip);

  return;
}



function in_array(idx, a) {
  for (let i=0; i<a.length; i++) {
    if (a[i] == idx) { return true; }
  }
  return false;
}


function block3d_fig(x0,y0,s0, cuboid_size, cxyz, dock_xyz, order, vr, theta, dim_conn, skip) {
  vr = ((typeof vr === "undefined") ? [0,0,1] : vr);
  theta = ((typeof theta === "undefined") ? 0 : theta); //-Math.PI/9 + 0.2;
  dim_conn = ((typeof dim_conn === "undefined") ? [] : dim_conn);
  skip = ((typeof skip === "undefined") ? [] : skip);

  let pal = PAL8;
  let lpal = lPAL8;

  if (cxyz.length == 5) {
    pal = PAL5; 
    lpal = lPAL5;
  }
  if (cxyz.length == 2) {
    pal = PAL2;
    lpal = lPAL2;
  }

  let two = g_fig_ctx.two;

  let dxyz = 100;

  let qs = s0*Math.sqrt(3)/2;

  let js = s0/4;

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

    let lco = lpal[i];
    let fco = pal[i];

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

    if (!in_array(i, skip)) {

      let iso_cuboid_alpha = 0.2;
      if (in_array(i, dim_conn)) { iso_cuboid_alpha = 0.05; }

      mk_iso_cuboid( jxy[0],jxy[1],1, lco,fco, cs, 1, vr, theta, iso_cuboid_alpha);

      let _c = two.makeCircle( cxy[0], cxy[1],  4 );
      _c.noStroke();

      _c.opacity = 0.9;
      //if (i in dim_conn) { _c.opacity = 0.3; }
      if (in_array(i, dim_conn)) { _c.opacity= 0.3; }

      //if ((i==0) || (i==(dock_xyz.length-1))) { _c.fill = "rgb(255,255,255)"; }
      //else                                    { _c.fill = "rgb(0,0,0)"; }

      if (i==0) { _c.fill = "rgb(0,0,0)"; }
      else if (i==(dock_xyz.length-1))  { _c.fill = "rgb(255,255,255)"; }
      else                              { _c.fill = "rgb(60,60,60)"; }
    }

  }


  for (let i=1; i<proj_cxy.length; i+=2) {
    let alpha = 0.9;

    let i_nxt = (i+1)%(proj_cxy.length);

    if (in_array(i, skip) && in_array(i_nxt, skip)) { continue; }
    if (in_array(i, dim_conn) && in_array(i_nxt, dim_conn)) { alpha = 0.2; }

    _Line( proj_cxy[i][0], proj_cxy[i][1], proj_cxy[i_nxt][0], proj_cxy[i_nxt][1], "rgb(60,60,60)", 2.8, alpha);
  }

  two.update();
}

function mk_colormap_f(_range, _pal) {
  return function(_t) {
    let _n = _range[ _range.length-1 ];
    let _tidx = Math.floor(_t*_n);

    for (let _i=1; _i<_range.length; _i++) {
      if ((_tidx >= _range[_i-1]) && (_tidx < _range[_i])) {
        return _pal[_i-1];
      }
    }
    return _pal[ _pal.length-1 ];
  };
}

function curve3d_hellebore(x0,y0, s, vr, theta) {

  idx_region_xy = [
    0,
    64,
    90,
    114,
    144,
    160,
    172,
    186,
    216
  ];

  let WHD = [6,6,6];

  let pnts = Hellebore3D(WHD[0],WHD[1],WHD[2]);

  let order = [0,1,2,3,4,5,6,7];

  let col = PAL8;

  let colormap_f = mk_colormap_f(idx_region_xy, col);
  mkg3curve([x0,y0], WHD, s, vr, theta, pnts, colormap_f);

  return;
}

//----
//----
//----


// There's some trickery here.
// The goals are to create a 3d gilbert curve figure that:
//
// - is rotated at a nice angle for good viewing
// - is orthographic (non-perspective)
// - has an outline for the edges to get a better sense of depth
// - has 'dots' at vertex points to give a sense for where the
//   verticies are
// - is an SVG image
//
// All these machinations (custom projection, custom rotations, etc.)
// are pretty much so we can save figures into SVG.
// two.js is a 2d library, so we need to do some 3d stuff ourselves.
//
// To acheive this we:
//
// - generate a 3d gilbert curve
// - rotate it in 3d appropriately
// - project down to 2d
// - keep the 3d, 2d and index points
// - sort by the rotated vectors, depth first (see the 'sort' function below
//   where we do the lazy projection, project onto the 'away' vector that's the
//   cross product of the lazy projection vectors)
// - draw the circle for the vertex and a white line, larger than the colored line,
//   halfway from each source vertex to the neighbor (making sure to use 'butt' cap
//   so no artifacts on the curve are seen)
// - finally, draw the colored line, again drawing from the source vertex to halfway
//   to each of it's neighboring verticies (rounded cap)
//
// The figure has alpha going up and to the right, beta going left and up and gamma
// going up, so we need to do an extra x/y and x-flip for the returned gilbert curve
// to be consistent with the displayed reference axis.
//
function mkg3curve(xy, whd, s, vr, theta, pnts, colormap_f ) {
  s = ((typeof s === "undefined") ? 1 : s);

  if (typeof colormap_f === "undefined") {
    console.log(">>> using default");
    colormap_f = function(_t) { return hsl_lerp(_t); }
  }

  let two = g_fig_ctx.two;

  let N = whd[0]*whd[1]*whd[2];

  let pnt3 = [];
  let pnt2 = [];
  let pnt32 = [];
  for (let idx=0; idx<N; idx++) {
    let p3 = pnts[idx];
    pnt3.push( p3 );

    let txyz = njs.mul(s, rodrigues(p3, vr, theta));
    let txy = njs.add(xy, _project( txyz[0], txyz[1], txyz[2] ));

    pnt2.push(txy);
    pnt32.push([txyz,txy,idx]);
  }

  pnt32.sort( function(a,b) {

    // inverse lazy projection
    //
    let _zz = cross3([s,s,0], [1/2, -1/2, -1]);
    let R = njs.norm2(_zz);

    let da = njs.dot(_zz,a[0]) / R;
    let db = njs.dot(_zz,b[0]) / R;

    if (da > db) { return -1; }
    if (da < db) { return  1; }
    return 0;
  });

  let idx_bp = [];

  let n = pnt32.length;
  for (let idx=0; idx<n; idx++) { idx_bp.push(0); }
  for (let idx=0; idx<n; idx++) {
    let p_idx = pnt32[idx][2];
    idx_bp[p_idx] = idx;
  }

  let bg_co = "rgb(255,255,255)";

  let fg_lw = 5;
  let bg_diam = 8;

  fg_lw = 3;
  bg_diam = 6;

  for (let idx=0; idx<n; idx++) {

    let p3 = pnt32[idx][0];
    let p2 = pnt32[idx][1];
    let p_idx = pnt32[idx][2];

    let draw_lines = [];

    if (p_idx > 0) {
      let nei_idx = p_idx-1;
      let q2 = pnt32[ idx_bp[nei_idx] ][1];
      draw_lines.push( [p2, q2] );
    }

    if (p_idx < (n-1)) {
      let nei_idx = p_idx+1;
      let q2 = pnt32[ idx_bp[nei_idx] ][1];
      draw_lines.push( [p2, q2] );
    }

    for (let ii=0; ii<draw_lines.length; ii++) {
      let p2 = draw_lines[ii][0];
      let q2 = draw_lines[ii][1];

      qm = [
        p2[0] + (q2[0] - p2[0])/2,
        p2[1] + (q2[1] - p2[1])/2,
      ];

      //let co = hsl_lerp( p_idx / n );
      let co = colormap_f( p_idx / n );

      let l_bg = two.makeLine( p2[0], p2[1], qm[0], qm[1] );
      l_bg.noFill();
      l_bg.stroke = bg_co;
      l_bg.linewidth = bg_diam;
      l_bg.cap = "butt";

      let _c = two.makeCircle( p2[0], p2[1], 3*bg_diam/5 );
      _c.noStroke();
      _c.fill = bg_co;

      _c.fill = "rgb(220,220,220)";
    }

    for (let ii=0; ii<draw_lines.length; ii++) {
      let p2 = draw_lines[ii][0];
      let q2 = draw_lines[ii][1];

      qm = [
        p2[0] + (q2[0] - p2[0])/2,
        p2[1] + (q2[1] - p2[1])/2,
      ];

      //let co = hsl_lerp( p_idx / n );
      let co = colormap_f( p_idx / n );

      let l = two.makeLine( p2[0], p2[1], qm[0], qm[1] );
      l.noFill();
      l.stroke = co;
      l.linewidth = fg_lw;
      l.cap = "round";
    }

  }

}



//----
//----
//----

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
    _face_norm = cross3( rodrigues( njs.sub( _face[1], _face[0] ), vr, theta), rodrigues( njs.sub( _face[2], _face[1] ), vr, theta) );

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

function gilbert3d_hellebore() {
  let two = g_fig_ctx.two;

  let font_style = {
    "size": 18,
    "family": "Libertine, Linux Libertine 0"
  };

  var ele = document.getElementById("gilbert3d_hellebore");
  two.appendTo(ele);

  let vr = [0,0,1];
  let theta = Math.PI/4 + Math.PI/6;

  theta = -Math.PI/2 + Math.PI/9;

  let txt_x = [70, 490, 890];
  let gfx_x = [50, 450, 850];

  let txt_y = [290, 590];
  let gfx_y = [480, 780];

  txt_y = [300, 630];
  gfx_y = [490, 830];

  let curve_s = 12;
  let curve_dxy = [210,-50,
                   309, 50];

  two.makeText("Hellebore:",70, 120, font_style);
  hellebore_block3d(250, 190, 40, vr, theta);

  two.makeText("000:",30, txt_y[0], font_style);
  hellebore_s0_block3d(gfx_x[0], gfx_y[0], 40, vr, theta);

  curve3d_hellebore( gfx_x[0]+curve_dxy[0], gfx_y[0]+curve_dxy[1], curve_s, vr, theta);
  curve3d_hellebore( gfx_x[0]+curve_dxy[2], gfx_y[0]+curve_dxy[3], curve_s, vr, theta + Math.PI);

  two.makeText("001,010,100:",70, txt_y[1], font_style);
  hellebore_s1_block3d(gfx_x[0], gfx_y[1], 40, vr, theta);

  two.makeText("011:",txt_x[1], txt_y[0], font_style);
  hellebore_011_block3d(gfx_x[1], gfx_y[0], 40, vr, theta);

  two.makeText("101:",txt_x[1], txt_y[1], font_style);
  hellebore_101_block3d(gfx_x[1], gfx_y[1], 40, vr, theta);

  two.makeText("110:",txt_x[2], txt_y[0], font_style);
  hellebore_110_block3d(gfx_x[2], gfx_y[0], 40, vr, theta);

  two.makeText("111:",txt_x[2], txt_y[1], font_style);
  hellebore_111_block3d(gfx_x[2], gfx_y[1], 40, vr, theta);

  axis_fig(50,60, 20, vr, theta);
  two.update();
}


