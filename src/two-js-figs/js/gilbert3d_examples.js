// LICENSE: CC0
//

var njs = numeric;

var CANVAS_ID = 'gilbert3d_examples';
var g_fig_ctx = {};

var RECT_COLOR = "rgb(100,100,100)";
var LINE_COLOR = "rgb(81,166,10)";

var BEG_COLOR = "rgb(80,80,140)";
var END_COLOR = "rgb(120,180,180)";



function _dl() {
  var ele = document.getElementById(CANVAS_ID);
  var b = new Blob([ ele.innerHTML ]);
  saveAs(b, "fig.svg");
}

function makeTwoAnchor(_pnt) {
  let pnt = [];
  for (let ii=0; ii<_pnt.length; ii++) {
    pnt.push( new Two.Anchor(_pnt[ii][0], _pnt[ii][1]) );
  }
  return pnt;
}

function hsl_lerp(p) {
  //let hue = Math.floor(360*idx / (W*H)).toString();
  let hue = Math.floor(360*p).toString();
  let sat = "95%";
  let lit = '35%';

  //sat = '95%';
  lit = '41%';
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

// projection for the lazy.
// Project onto two vectors, [s,s,0] and [L/2, -L/2, -L] and
// consider that the plane
//
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

function toRGBAa(rgba) {
  let va = rgba.split(")")[0].split("(")[1].split(",");

  if (rgba.match( /^rgba\(/ )) {
    return va;
  }

  va.push(1);
  return va;
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


    //let label = new Two.Text(_txt[xyz], x0+txy[0], y0+txy[1], style);
    //label.fill = "rgba(16,16,16,1)";
    //two.add(label);

  }

  let c = two.makeCircle( xy0[0], xy0[1], 3);
  c.fill = "#000";
  c.linewidth = 0;

  two.update();
}




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
  mask.firstChild.setAttribute("d", "M -4000 -4000 L 8000 -4000 L 4000 4000 L -4000 4000 Z");

  two.update();
}

function squeeze(p, a,b) {
  return a + (b-a)*p;
}

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
function mkg3curve(xy, whd, s) {
  s = ((typeof s === "undefined") ? 1 : s);
  //flipxy = ((typeof flipxy === "undefined") ? {"y":false, "x": false} : flipxy);

  let two = g_fig_ctx.two;

  let vr = [0,0,1];
  let theta = -Math.PI/16;

  let N = whd[0]*whd[1]*whd[2];
  let pnt3 = [];
  let pnt2 = [];
  let pnt32 = [];
  for (let idx=0; idx<N; idx++) {
    let _p3 = Gilbert3Dpp_d2xyz(idx, whd[0], whd[1], whd[2], true);
    //let p3 = Gilbert3D_d2xyz(idx, 0, [0,0,0], [0,whd[0],0], [whd[1],0,0], [0,0,whd[2]]);


    let p3 = [ (whd[1]-_p3[1]-1), _p3[0], _p3[2] ];

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

      let co = hsl_lerp( p_idx / n );

      let l_bg = two.makeLine( p2[0], p2[1], qm[0], qm[1] );
      l_bg.noFill();
      l_bg.stroke = bg_co;
      l_bg.linewidth = bg_diam;
      l_bg.cap = "butt";

      //let _c = two.makeCircle( p2[0], p2[1], bg_diam/2 );
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

      let co = hsl_lerp( p_idx / n );

      //let l = two.makeLine( p2[0], p2[1], q2[0], q2[1] );
      let l = two.makeLine( p2[0], p2[1], qm[0], qm[1] );
      l.noFill();
      l.stroke = co;
      l.linewidth = fg_lw;
      l.cap = "round";
    }

  }

}


function gilbert3d_examples() {
  let two = new Two({"fitted":true});
  g_fig_ctx["two"] = two;

  let ele = document.getElementById(CANVAS_ID);
  two.appendTo(ele);

  //WIP

  let fs = 18;
  let font_style = {
    "size": fs,
    "family": "Libertine, Linux Libertine 0"
  };

  let lx = 40;

  let co = "rgb(50,50,50)";

  let ex = 250,
      ey = 250;

  //mkg3curve([lx+35,35], [4, 4, 4], 10, {"y":true, "x":false});
  mkg3curve([40,170], [4, 4, 4], 30);
  mkg3curve([230,190], [4, 4, 5], 30);
  mkg3curve([440,180], [5, 5, 5], 30);

  //mkg3curve([40,420], [8, 4, 4], 30);
  mkg3curve([40,420], [8, 4, 4], 30);
  mkg3curve([350,370], [3, 5, 3], 30);

  mkg3curve([520,420], [3, 3, 5], 30);

  axis_fig(50,50,20);

  two.update();

  /*
  two.makeText("i)", lx, 50, font_style);
  mkgcurve([lx+35,35], [8, 8], 10, {"y":true, "x":false});

  two.makeText("ii)", lx + 140, 50, font_style);
  mkgcurve([lx+160,35], [18, 6], 10, {"y":true, "x":false});

  two.makeText("iii)", lx, 150, font_style);
  mkgcurve([lx+10,160], [13, 8], 10, {"y":true, "x":false});

  two.makeText("iv)", lx + 140, 150, font_style);
  mkgcurve([lx+170,130], [14, 14], 10, {"y":true, "x":false});

  two.update();

  return two;
  */
}

