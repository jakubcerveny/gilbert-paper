// To the extent possible under law, the person who associated CC0 with
// this project has waived all copyright and related or neighboring rights
// to this project.
// 
// You should have received a copy of the CC0 legalcode along with this
// work. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
//


// inefficient reference implemenatation of space filling curves
//
// curves implemented (2d):
//
// - hilbert
// - moore
// - peano
// - morton (z-order)
//
// functions to create the SFC are recursive and inefficient.
//


var numeric = require("numeric");
var njs = numeric;

var gilbert3dpp = require("./gilbert3dpp.js");

function Mx(theta) {
  let I = numeric.identity(4);
  I[1][1] =  Math.cos(theta);
  I[1][2] = -Math.sin(theta);

  I[2][1] =  Math.sin(theta);
  I[2][2] =  Math.cos(theta);

  return I;
}

function My(theta) {
  let I = numeric.identity(4);
  I[0][0] =  Math.cos(theta);
  I[0][2] =  Math.sin(theta);

  I[2][0] = -Math.sin(theta);
  I[2][2] =  Math.cos(theta);

  return I;
}

function Mz(theta) {
  let I = numeric.identity(4);
  I[0][0] =  Math.cos(theta);
  I[0][1] = -Math.sin(theta);

  I[1][0] =  Math.sin(theta);
  I[1][1] =  Math.cos(theta);

  return I;
}

// translate
//
function Mt(dxyz) {
  let I = numeric.identity(4);

  I[0][3] = dxyz[0];
  I[1][3] = dxyz[1];
  I[2][3] = dxyz[2];

  return I;
}

// scale
//
function Ms(s) {
  let I = numeric.identity(4);

  I[3][3] = 1/s;

  return I;
}

// reflect
//
function Mr(x,y,z) {
  x = ((typeof x === "undefined") ? 1 : x);
  y = ((typeof y === "undefined") ? 1 : y);
  z = ((typeof z === "undefined") ? 1 : z);

  let I = numeric.identity(4);

  I[0][0] = x;
  I[1][1] = y;
  I[2][2] = z;

  return I;
}

function m_project(v) {
  return [ v[0]/v[3], v[1]/v[3], v[2]/v[3] ];
}

function printpoint(p) {
  for (let i=0; i<p.length; i++) {
    if (p[i].length > 2) {
      console.log(p[i][0], p[i][1], p[i][2]);
    }
    else {
      console.log(p[i][0], p[i][1]);
    }
  }
  //console.log("\n");
}

function sfc_hilbert_r(M, lvl, pnt_template, pnt_list) {
  if (lvl==0) {
    let p = njs.transpose( njs.dot(M, njs.transpose(pnt_template)) );
    for (let i=0; i<p.length; i++) { pnt_list.push(p[i]); }
    return;
  }

  let sfc = sfc_hilbert_r;

  let m0 = njs.dot( Mt([-1/2, -1/2, 1]), njs.dot( Ms(1/2), njs.dot( Mz(3*Math.PI/2), Mr(-1,1) ) ) );
  sfc(njs.dot(M, m0), lvl-1, pnt_template, pnt_list);

  let m1 = njs.dot( Mt([-1/2,  1/2, 1]), njs.dot( Ms(1/2), njs.dot( Mz(0*Math.PI/2), Mr( 1,1) ) ) );
  sfc(njs.dot(M, m1), lvl-1, pnt_template, pnt_list);

  let m2 = njs.dot( Mt([ 1/2,  1/2, 1]), njs.dot( Ms(1/2), njs.dot( Mz(0*Math.PI/2), Mr( 1,1) ) ) );
  sfc(njs.dot(M, m2), lvl-1, pnt_template, pnt_list);

  let m3 = njs.dot( Mt([ 1/2, -1/2, 1]), njs.dot( Ms(1/2), njs.dot( Mz(1*Math.PI/2), Mr(-1,1) ) ) );
  sfc(njs.dot(M, m3), lvl-1, pnt_template, pnt_list);
}

function sfc_hilbert(lvl) {
  let pnt = [
    [ -1/2, -1/2, 1, 1 ],
    [ -1/2,  1/2, 1, 1 ],
    [  1/2,  1/2, 1, 1 ],
    [  1/2, -1/2, 1, 1 ]
  ];

  let pnt_list = [];
  sfc_hilbert_r( numeric.identity(4), lvl, pnt, pnt_list);
  return pnt_list;
}


// https://github.com/PrincetonLIPS/numpy-hilbert-curve
//
function sfc_hilbert3_npy_r(M, lvl, pnt_template, pnt_list) {
  let _dot = njs.dot;
  if (lvl==0) {
    let p = njs.transpose( _dot(M, njs.transpose(pnt_template)) );
    for (let i=0; i<p.length; i++) { pnt_list.push(p[i]); }
    return;
  }

  let sfc = sfc_hilbert3_npy_r;

  let m0 = _dot( Mt([-1/2, -1/2, -1/2]), _dot( Ms(1/2), _dot( My(1*Math.PI/2), Mr(-1) ) ) );
  sfc(_dot(M, m0), lvl-1, pnt_template, pnt_list);

  let m1 = _dot( Mt([-1/2, -1/2,  1/2]), _dot( Ms(1/2), _dot( Mz(3*Math.PI/2), Mr(-1) ) ) );
  sfc(_dot(M, m1), lvl-1, pnt_template, pnt_list);


  let m2 = _dot( Mt([-1/2,  1/2,  1/2]), Ms(1/2) );
  sfc(_dot(M, m2), lvl-1, pnt_template, pnt_list);

  let m3 = _dot( Mt([-1/2,  1/2, -1/2]), _dot( Ms(1/2), _dot( My(3*Math.PI/2), Mr(-1) ) ) );
  sfc(_dot(M, m3), lvl-1, pnt_template, pnt_list);



  let m4 = _dot( Mt([ 1/2,  1/2, -1/2]), _dot( Ms(1/2), _dot( My(1*Math.PI/2), Mr(-1) ) ) );
  sfc(_dot(M, m4), lvl-1, pnt_template, pnt_list);

  let m5 = _dot( Mt([ 1/2,  1/2,  1/2]), Ms(1/2) );
  sfc(_dot(M, m5), lvl-1, pnt_template, pnt_list);


  let m6 = _dot( Mt([ 1/2, -1/2,  1/2]), _dot( Ms(1/2), _dot( Mz(1*Math.PI/2), Mr(-1) ) ) );
  sfc(_dot(M, m6), lvl-1, pnt_template, pnt_list);

  let m7 = _dot( Mt([ 1/2, -1/2, -1/2]), _dot( Ms(1/2), _dot( My(3*Math.PI/2), Mr(-1) ) ) );
  sfc(_dot(M, m7), lvl-1, pnt_template, pnt_list);

  return pnt_list;
}


function sfc_hilbert3_npy(lvl) {
  let pnt = [
    [ -1/2, -1/2, -1/2, 1 ],
    [ -1/2, -1/2,  1/2, 1 ],

    [ -1/2,  1/2,  1/2, 1 ],
    [ -1/2,  1/2, -1/2, 1 ],

    [  1/2,  1/2, -1/2, 1 ],
    [  1/2,  1/2,  1/2, 1 ],

    [  1/2, -1/2,  1/2, 1 ],
    [  1/2, -1/2, -1/2, 1 ]
  ];

  let pnt_list = [];
  sfc_hilbert3_npy_r( numeric.identity(4), lvl, pnt, pnt_list);
  return pnt_list;
}

//---

// https://github.com/PrincetonLIPS/numpy-hilbert-curve
//
function sfc_hilbert3_r(M, lvl, pnt_template, pnt_list) {
  let _dot = njs.dot;
  if (lvl==0) {
    let p = njs.transpose( _dot(M, njs.transpose(pnt_template)) );
    for (let i=0; i<p.length; i++) { pnt_list.push(p[i]); }
    return;
  }

  let sfc = sfc_hilbert3_r;

  //let m0 = _dot( Mt([-1/2, -1/2, -1/2]), _dot( Ms(1/2), _dot( Mz(3*Math.PI/2), Mr(-1) ) ) );
  //sfc(_dot(M, m0), lvl-1, pnt_template, pnt_list);

  let m0 = _dot( Mt([-1/2, -1/2, -1/2]), _dot( Ms(1/2), _dot( My(1*Math.PI/2), Mz(1*Math.PI/2) ) ) );
  sfc(_dot(M, m0), lvl-1, pnt_template, pnt_list);

  //let m1 = _dot( Mt([-1/2,  1/2, -1/2]), _dot( Ms(1/2), _dot( My(1*Math.PI/2), Mr(-1) ) ) );
  //sfc(_dot(M, m1), lvl-1, pnt_template, pnt_list);

  let m1 = _dot( Mt([-1/2,  1/2, -1/2]), _dot( Ms(1/2), _dot( Mx(3*Math.PI/2), Mz(3*Math.PI/2) ) ) );
  sfc(_dot(M, m1), lvl-1, pnt_template, pnt_list);

  let m2 = _dot( Mt([-1/2,  1/2,  1/2]), _dot( Ms(1/2), _dot( Mx(3*Math.PI/2), Mz(3*Math.PI/2) ) ) );
  sfc(_dot(M, m2), lvl-1, pnt_template, pnt_list);


  let m3 = _dot( Mt([-1/2, -1/2,  1/2]), _dot( Ms(1/2), _dot( Mx(2*Math.PI/2), Mr( 1) ) ) );
  sfc(_dot(M, m3), lvl-1, pnt_template, pnt_list);



  let m4 = _dot( Mt([ 1/2, -1/2,  1/2]), _dot( Ms(1/2), _dot( Mx(2*Math.PI/2), Mr( 1) ) ) );
  sfc(_dot(M, m4), lvl-1, pnt_template, pnt_list);


  let m5 = _dot( Mt([ 1/2,  1/2,  1/2]), _dot( Ms(1/2), _dot( Mx(3*Math.PI/2), Mz(1*Math.PI/2) ) ) );
  sfc(_dot(M, m5), lvl-1, pnt_template, pnt_list);

  let m6 = _dot( Mt([ 1/2,  1/2, -1/2]), _dot( Ms(1/2), _dot( Mx(3*Math.PI/2), Mz(1*Math.PI/2) ) ) );
  sfc(_dot(M, m6), lvl-1, pnt_template, pnt_list);



  let m7 = _dot( Mt([ 1/2, -1/2, -1/2]), _dot( Ms(1/2), _dot( My(3*Math.PI/2), Mz(3*Math.PI/2) ) ) );
  sfc(_dot(M, m7), lvl-1, pnt_template, pnt_list);

  return pnt_list;
}


function sfc_hilbert3(lvl) {
  let pnt = [
    [ -1/2, -1/2, -1/2, 1 ],
    [ -1/2,  1/2, -1/2, 1 ],

    [ -1/2,  1/2,  1/2, 1 ],
    [ -1/2, -1/2,  1/2, 1 ],

    [  1/2, -1/2,  1/2, 1 ],
    [  1/2,  1/2,  1/2, 1 ],

    [  1/2,  1/2, -1/2, 1 ],
    [  1/2, -1/2, -1/2, 1 ]
  ];

  let pnt_list = [];
  sfc_hilbert3_r( numeric.identity(4), lvl, pnt, pnt_list);
  return pnt_list;
}


function sfc_moore(lvl) {
  let pnt_template = [
    [ -1/2, -1/2, 1, 1 ],
    [ -1/2,  1/2, 1, 1 ],
    [  1/2,  1/2, 1, 1 ],
    [  1/2, -1/2, 1, 1 ]
  ];

  let pnt_list = [];

  let sfc = sfc_hilbert_r;

  let M = njs.identity(4);

  let m0 = njs.dot( Mt([-1/2, -1/2, 1]), njs.dot( Ms(1/2), njs.dot( Mz(1*Math.PI/2), Mr( 1,1) ) ) );
  sfc(njs.dot(M, m0), lvl-1, pnt_template, pnt_list);

  let m1 = njs.dot( Mt([-1/2,  1/2, 1]), njs.dot( Ms(1/2), njs.dot( Mz(1*Math.PI/2), Mr( 1,1) ) ) );
  sfc(njs.dot(M, m1), lvl-1, pnt_template, pnt_list);

  let m2 = njs.dot( Mt([ 1/2,  1/2, 1]), njs.dot( Ms(1/2), njs.dot( Mz(3*Math.PI/2), Mr( 1,1) ) ) );
  sfc(njs.dot(M, m2), lvl-1, pnt_template, pnt_list);

  let m3 = njs.dot( Mt([ 1/2, -1/2, 1]), njs.dot( Ms(1/2), njs.dot( Mz(3*Math.PI/2), Mr( 1,1) ) ) );
  sfc(njs.dot(M, m3), lvl-1, pnt_template, pnt_list);

  return pnt_list;
}

function __sfc_peano_r(M, lvl, pnt_template, pnt_list) {
  if (lvl==0) {
    let p = njs.transpose( njs.dot(M, njs.transpose(pnt_template)) );
    for (let i=0; i<p.length; i++) { pnt_list.push(p[i]); }
    return;
  }

  let sfc = sfc_peano_r;

  let m0 = njs.dot( Mt([-1/3,-1/3, 1]), njs.dot( Ms(1/3), njs.dot( Mz(0*Math.PI/2), Mr( 1, 1) ) ) );
  sfc(njs.dot(M, m0), lvl-1, pnt_template, pnt_list);

  let m1 = njs.dot( Mt([-1/3,   0, 1]), njs.dot( Ms(1/3), njs.dot( Mz(0*Math.PI/2), Mr(-1, 1) ) ) );
  sfc(njs.dot(M, m1), lvl-1, pnt_template, pnt_list);

  let m2 = njs.dot( Mt([-1/3, 1/3, 1]), njs.dot( Ms(1/3), njs.dot( Mz(0*Math.PI/2), Mr( 1, 1) ) ) );
  sfc(njs.dot(M, m2), lvl-1, pnt_template, pnt_list);


  let m3 = njs.dot( Mt([  0, 1/3, 1]), njs.dot( Ms(1/3), njs.dot( Mz(0*Math.PI/2), Mr( 1,-1) ) ) );
  sfc(njs.dot(M, m3), lvl-1, pnt_template, pnt_list);

  let m4 = njs.dot( Mt([  0,   0, 1]), njs.dot( Ms(1/3), njs.dot( Mz(0*Math.PI/2), Mr(-1,-1) ) ) );
  sfc(njs.dot(M, m4), lvl-1, pnt_template, pnt_list);

  let m5 = njs.dot( Mt([  0,-1/3, 1]), njs.dot( Ms(1/3), njs.dot( Mz(0*Math.PI/2), Mr( 1,-1) ) ) );
  sfc(njs.dot(M, m5), lvl-1, pnt_template, pnt_list);


  let m6 = njs.dot( Mt([ 1/3,-1/3, 1]), njs.dot( Ms(1/3), njs.dot( Mz(0*Math.PI/2), Mr( 1, 1) ) ) );
  sfc(njs.dot(M, m6), lvl-1, pnt_template, pnt_list);

  let m7 = njs.dot( Mt([ 1/3,   0, 1]), njs.dot( Ms(1/3), njs.dot( Mz(0*Math.PI/2), Mr(-1, 1) ) ) );
  sfc(njs.dot(M, m7), lvl-1, pnt_template, pnt_list);

  let m8 = njs.dot( Mt([ 1/3, 1/3, 1]), njs.dot( Ms(1/3), njs.dot( Mz(0*Math.PI/2), Mr( 1, 1) ) ) );
  sfc(njs.dot(M, m8), lvl-1, pnt_template, pnt_list);
}

function sfc_peano_r(M, lvl, pnt_template, pnt_list) {
  if (lvl==0) {
    let p = njs.transpose( njs.dot(M, njs.transpose(pnt_template)) );
    for (let i=0; i<p.length; i++) { pnt_list.push(p[i]); }
    return;
  }

  let sfc = sfc_peano_r;

  let m0 = njs.dot( Mt([-1/3,-1/3, 1]), njs.dot( Ms(1/3), Mr( 1, 1) ) );
  sfc(njs.dot(M, m0), lvl-1, pnt_template, pnt_list);

  let m1 = njs.dot( Mt([-1/3,   0, 1]), njs.dot( Ms(1/3), Mr(-1, 1) ) );
  sfc(njs.dot(M, m1), lvl-1, pnt_template, pnt_list);

  let m2 = njs.dot( Mt([-1/3, 1/3, 1]), njs.dot( Ms(1/3), Mr( 1, 1) ) );
  sfc(njs.dot(M, m2), lvl-1, pnt_template, pnt_list);


  let m3 = njs.dot( Mt([  0, 1/3, 1]), njs.dot( Ms(1/3), Mr( 1,-1) ) );
  sfc(njs.dot(M, m3), lvl-1, pnt_template, pnt_list);

  let m4 = njs.dot( Mt([  0,   0, 1]), njs.dot( Ms(1/3), Mr(-1,-1) ) );
  sfc(njs.dot(M, m4), lvl-1, pnt_template, pnt_list);

  let m5 = njs.dot( Mt([  0,-1/3, 1]), njs.dot( Ms(1/3), Mr( 1,-1) ) );
  sfc(njs.dot(M, m5), lvl-1, pnt_template, pnt_list);


  let m6 = njs.dot( Mt([ 1/3,-1/3, 1]), njs.dot( Ms(1/3), Mr( 1, 1) ) );
  sfc(njs.dot(M, m6), lvl-1, pnt_template, pnt_list);

  let m7 = njs.dot( Mt([ 1/3,   0, 1]), njs.dot( Ms(1/3), Mr(-1, 1) ) );
  sfc(njs.dot(M, m7), lvl-1, pnt_template, pnt_list);

  let m8 = njs.dot( Mt([ 1/3, 1/3, 1]), njs.dot( Ms(1/3), Mr( 1, 1) ) );
  sfc(njs.dot(M, m8), lvl-1, pnt_template, pnt_list);
}

function sfc_peano(lvl) {
  let pnt_template = [
    [ -1/3, -1/3, 1, 1 ],
    [ -1/3,    0, 1, 1 ],
    [ -1/3,  1/3, 1, 1 ],
    [    0,  1/3, 1, 1 ],
    [    0,    0, 1, 1 ],
    [    0, -1/3, 1, 1 ],
    [  1/3, -1/3, 1, 1 ],
    [  1/3,    0, 1, 1 ],
    [  1/3,  1/3, 1, 1 ]
  ];

  let pnt_list = [];

  sfc_peano_r( numeric.identity(4), lvl, pnt_template, pnt_list );
  return pnt_list;
}

function sfc_morton_r(M, lvl, pnt_template, pnt_list) {
  if (lvl==0) {
    let p = njs.transpose( njs.dot(M, njs.transpose(pnt_template)) );
    for (let i=0; i<p.length; i++) { pnt_list.push(p[i]); }
    return;
  }

  let sfc = sfc_morton_r;

  let m0 = njs.dot( Mt([-1/2, 1/2, 1]), Ms(1/2) );
  sfc(njs.dot(M, m0), lvl-1, pnt_template, pnt_list);

  let m1 = njs.dot( Mt([ 1/2, 1/2, 1]), Ms(1/2) );
  sfc(njs.dot(M, m1), lvl-1, pnt_template, pnt_list);

  let m2 = njs.dot( Mt([-1/2,-1/2, 1]), Ms(1/2) );
  sfc(njs.dot(M, m2), lvl-1, pnt_template, pnt_list);

  let m3 = njs.dot( Mt([ 1/2,-1/2, 1]), Ms(1/2) );
  sfc(njs.dot(M, m3), lvl-1, pnt_template, pnt_list);
}

function sfc_morton(lvl) {
  let pnt_template = [
    [ -1/2,  1/2, 1, 1 ],
    [  1/2,  1/2, 1, 1 ],
    [ -1/2, -1/2, 1, 1 ],
    [  1/2, -1/2, 1, 1 ]
  ];

  let pnt_list = [];
  sfc_morton_r( numeric.identity(4), lvl, pnt_template, pnt_list );
  return pnt_list;
}

//---

function sfc_gilbert2d(exponent_dim) {
  let W = Math.floor(Math.pow(2, exponent_dim[0]));
  let H = Math.floor(Math.pow(2, exponent_dim[1]));

  console.log("# W:", W, "H:", H);
  return gilbert3dpp.Gilbert2D(W,H);
}

function sfc_gilbert3d(exponent_dim) {
  let W = Math.floor(Math.pow(2, exponent_dim[0]));
  let H = Math.floor(Math.pow(2, exponent_dim[1]));
  let D = Math.floor(Math.pow(2, exponent_dim[2]));

  console.log("# W:", W, "H:", H, "D:", D);
  return gilbert3dpp.Gilbert3D(W,H,D);
}

//---

function pnorm_diff(pnta, pntb, p) {
  let s = 0;
  for (let i=0; i<pnta.length; i++) {
    s += Math.pow( Math.abs(pnta[i] - pntb[i]), p );
  }
  return Math.pow(s, 1/p);
}

function experiment_pnorm_bindiff(profile) {
  let count=0;
  let F = [];

  let lvl = profile.lvl;
  let p = profile.p;

  let pnt = profile.f(lvl);

  if (profile.verbose > 0) {
    console.log("#" + profile.name + ", lvl:", lvl, ", n:", pnt.length, ", pnorm:", p);
  }


  for (let i=0; i<pnt.length; i++) { F.push(0); }

  for (let i=0; i<pnt.length; i++) {
    for (let j=0; j<pnt.length; j++) {
      let a = pnt[i];
      let b = pnt[j];

      F[ Math.abs(i-j) ] += pnorm_diff(a,b,p);
      count++;
    }
  }

  //console.log("# n:", pnt.length,  "p:", p);

  for (let i=0; i<pnt.length; i++) {
    F[i] /= count;
    console.log(i, F[i]);
  }
  console.log("\n");
}

// this seems wrong to me!!!
function __experiment_pnorm_bindiff_cdf(profile) {
  let count=0;
  let F = [];

  let lvl = profile.lvl;
  let p = profile.p;

  let pnt = profile.f(lvl);

  if (profile.verbose > 0) {
    console.log("#" + profile.name + ", lvl:", lvl, ", n:", pnt.length, ", pnorm:", p);
  }

  for (let i=0; i<=pnt.length; i++) { F.push(0); }

  for (let i=0; i<pnt.length; i++) {
    for (let j=0; j<pnt.length; j++) {
      let a = pnt[i];
      let b = pnt[j];

      F[ Math.abs(i-j) ] += pnorm_diff(a,b,p);
      count++;
    }
  }

  //console.log("# n:", pnt.length,  "p:", p);

  let G = [ 0 ];

  let S = 0;
  for (let i=0; i<F.length; i++) {
    S += F[i];
    G.push( S );
  }

  for (let i=1; i<G.length; i++) {
    let x = (i-1) / pnt.length;
    console.log(x, G[i] / S);
  }
  console.log("\n");
}

// this seems wrong to me!!!
function experiment_pnorm_bindiff_cdf(profile) {
  let F = [];
  let Ffreq = [];

  let lvl = profile.lvl;
  let p = profile.p;

  let pnt = profile.f(lvl);

  if (profile.verbose > 0) {
    console.log("#" + profile.name + ", lvl:", lvl, ", n:", pnt.length, ", pnorm:", p);
  }

  for (let i=0; i<=pnt.length; i++) {
    F.push(0);
    Ffreq.push(0);
  }

  for (let i=0; i<pnt.length; i++) {
    for (let j=0; j<pnt.length; j++) {
      let a = pnt[i];
      let b = pnt[j];

      F[ Math.abs(i-j) ] += pnorm_diff(a,b,p);
      Ffreq[ Math.abs(i-j) ] ++;
    }
  }

  //console.log("# n:", pnt.length,  "p:", p);

  let G = [ 0 ];

  let S = 0;
  for (let i=0; i<F.length; i++) {
    if (Ffreq[i] > 0) {
      S += F[i] / Ffreq[i];
    }
    G.push( S );
  }

  for (let i=1; i<G.length; i++) {
    let x = (i-1) / pnt.length;
    console.log(x, G[i] / S);
  }
  console.log("\n");
}

//----

let curve = "hilbert";
let lvl = 5;
let extra_arg0 = 0;
let extra_arg1 = 0;

let profile = {
  "gilbert2d" : { "name": "gilbert2d",  "lvl": [5,5],   "f": sfc_gilbert2d, "verbose": 1, "p": 2 },
  "gilbert3d" : { "name": "gilbert3d",  "lvl": [3,3,3], "f": sfc_gilbert3d, "verbose": 1, "p": 2 },

  "hilbert3"  : { "name": "hilbert3",   "lvl": 3,       "f": sfc_hilbert3,  "verbose": 1, "p": 2 },
  "hilbert"   : { "name": "hilbert",    "lvl": 5,       "f": sfc_hilbert,   "verbose": 1, "p": 2 },

  "print:hilbert3"  : { "name": "hilbert3",   "lvl": 3,       "f": sfc_hilbert3,  "verbose": 1, "p": 2 },
  "print:hilbert"   : { "name": "hilbert",    "lvl": 5,       "f": sfc_hilbert,   "verbose": 1, "p": 2 },

  "peano"     : { "name": "peano",      "lvl": 3,       "f": sfc_peano,     "verbose": 1, "p": 2 },
  "morton"    : { "name": "morton",     "lvl": 5,       "f": sfc_morton,    "verbose": 1, "p": 2 },
  "moore"     : { "name": "moore",      "lvl": 5,       "f": sfc_moore,     "verbose": 1, "p": 2 }
};

if (process.argv.length > 2) {
  curve = process.argv[2];
  if (process.argv.length > 3) {
    lvl = parseInt(process.argv[3]);

    if (process.argv.length > 4) {
      lvl = parseFloat(process.argv[3]);
      extra_arg0 = parseFloat(process.argv[4]);

      if (process.argv.length > 5) {
        extra_arg1 = parseFloat(process.argv[5]);
      }
    }
  }
}

if (!(curve in profile)) {
  console.log("curve '" + curve + "' not in profile, must be one of hilbert, peano, morton, moore");
  process.exit(-1);
}

profile[curve].lvl = lvl;

if (curve == "gilbert2d") {
  if (extra_arg0 == 0) {
    console.log("provide exponent of other dimension");
    process.exit(-1);
  }
  profile[curve].lvl = [ lvl, extra_arg0 ];
}

if (curve == "gilbert3d") {
  if ((extra_arg0 == 0) || (extra_arg1 == 0))  {
    console.log("provide exponent of other dimension");
    process.exit(-1);
  }
  profile[curve].lvl = [ lvl, extra_arg0, extra_arg1 ];
}

let curve_tok = curve.split(":");
if ((curve_tok.length > 1) && (curve_tok[0] == "print")) {
  let pnt = profile[curve].f( profile[curve].lvl );
  let side = Math.pow(2, profile[curve].lvl) - 0.5;
  for (let i=0; i<pnt.length; i++) {
    pnt[i] = njs.add( [side,side,side], pnt[i] );
    pnt[i][0] = Math.floor(pnt[i][0] + (1/(1024*1024)));
    pnt[i][1] = Math.floor(pnt[i][1] + (1/(1024*1024)));
    pnt[i][2] = Math.floor(pnt[i][2] + (1/(1024*1024)));
  }
  printpoint( pnt );
}
else {
  experiment_pnorm_bindiff_cdf(profile[curve]);
}
