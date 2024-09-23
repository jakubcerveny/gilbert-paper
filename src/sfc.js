// To the extent possible under law, the person who associated CC0 with
// this project has waived all copyright and related or neighboring rights
// to this project.
// 
// You should have received a copy of the CC0 legalcode along with this
// work. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
//


// inefficient reference implemenatation of spave filling curves
//
// curves implemented (2d):
//
// - hilbert
// - moore
// - peano
// - meander (peano_meander)
// - morton (z-order)
//
// functions to create the SFC are recursive and inefficient.
//


var numeric = require("numeric");
var gilbert = require("./gilbert.js");
var njs = numeric;

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
function Mr(x,y) {
  let I = numeric.identity(4);

  I[0][0] = x;
  I[1][1] = y;

  return I;
}

function m_project(v) {
  return [ v[0]/v[3], v[1]/v[3], v[2]/v[3] ];
}

function m_project_inv(v) {
  return [ v[0]*v[3], v[1]*v[3], v[2]*v[3] ];
}

function printpoint(p) {
  for (let i=0; i<p.length; i++) {
    console.log(p[i][0], p[i][1]);
  }
  console.log("\n");
}

function printa(p) {
  for (let i=0; i<p.length; i++) {
    console.log(i, p[i]);
  }
  console.log("\n");
}


function print_array_renorm(p, D) {
  D = ((typeof D === "undefined") ? 1 : D);
  let n = p.length;
  let m = 0,
      M = 0;
  if (p.length == 0) { return; }

  m = p[0];
  M = p[0];

  for (let i=1; i<p.length; i++) {
    if (m > p[i]) { m = p[i]; }
    if (M < p[i]) { M = p[i]; }
  }

  let R = M-m;

  for (let i=1; i<n; i++) {
    let t = i/n;
    //console.log( t, ((p[i] + m)/R) / Math.pow(i, 1/D));
    console.log( t, p[i] / Math.pow(i, 1/D) );
    
    //console.log( i / n, (p[i] + m) / R );
  }
  console.log("\n");
}


//---
// https://rosettacode.org/wiki/Hilbert_curve#C
//
function _rot2(n, p, rx, ry) {
  let t = 0;
  if (ry != 0) { return; }
  if (rx == 1) {
    p[0] = n - 1 - p[0];
    p[1] = n - 1 - p[1];
  }
  t = p[0];
  p[0] = p[1];
  p[1] = t;
}

// n - side dimension (hilbert curve will have n*n points)
// d - index along curve (d={0 ... n*n})
// p - resulting point
//
function sfc_hilbert_d2p(n, d, p) {
  p = ((typeof p === "undefined") ? [0,0] : p);
  let s=1, t=d, rx, ry;

  p[0] = 0;
  p[1] = 0;

  while (s<n) {
    rx = 1 & Math.floor(t/2);
    ry = 1 & (t ^ rx);
    _rot2(s, p, rx, ry);
    p[0] += s*rx;
    p[1] += s*ry;
    t = Math.floor(t/4);
    s *= 2;
  }

  return p;
}
//---

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
    for (let i=0; i<p.length; i++) {
      //pnt_list.push(p[i]);
      pnt_list.push( njs.dot(p[i], 3) );
    }
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

function sfc_peano_meander_r(M, lvl, pnt_template, pnt_list) {
  if (lvl==0) {
    let p = njs.transpose( njs.dot(M, njs.transpose(pnt_template)) );
    for (let i=0; i<p.length; i++) {
      pnt_list.push( njs.dot(p[i], 3) );
    }
    return;
  }

  let sfc = sfc_peano_meander_r;

  let m0 = njs.dot( Mt([-1/3,-1/3, 1]), njs.dot( Ms(1/3), njs.dot( Mz(-1*Math.PI/2), Mr(-1,1) ) ) );
  sfc(njs.dot(M, m0), lvl-1, pnt_template, pnt_list);

  let m1 = njs.dot( Mt([-1/3,   0, 1]), njs.dot( Ms(1/3), njs.dot( Mz(-1*Math.PI/2), Mr(-1,1) ) ) );
  sfc(njs.dot(M, m1), lvl-1, pnt_template, pnt_list);

  let m2 = njs.dot( Mt([-1/3, 1/3, 1]), njs.dot( Ms(1/3), njs.dot( Mz(0*Math.PI/2), Mr( 1,1) ) ) );
  sfc(njs.dot(M, m2), lvl-1, pnt_template, pnt_list);


  let m3 = njs.dot( Mt([   0, 1/3, 1]), njs.dot( Ms(1/3), njs.dot( Mz(0*Math.PI/2), Mr( 1,1) ) ) );
  sfc(njs.dot(M, m3), lvl-1, pnt_template, pnt_list);

  let m4 = njs.dot( Mt([ 1/3, 1/3, 1]), njs.dot( Ms(1/3), njs.dot( Mz(0*Math.PI/2), Mr( 1,1) ) ) );
  sfc(njs.dot(M, m4), lvl-1, pnt_template, pnt_list);

  let m5 = njs.dot( Mt([ 1/3,   0, 1]), njs.dot( Ms(1/3), njs.dot( Mz(2*Math.PI/2), Mr( 1,1) ) ) );
  sfc(njs.dot(M, m5), lvl-1, pnt_template, pnt_list);


  let m6 = njs.dot( Mt([   0,   0, 1]), njs.dot( Ms(1/3), njs.dot( Mz(1*Math.PI/2), Mr(-1,1) ) ) );
  sfc(njs.dot(M, m6), lvl-1, pnt_template, pnt_list);

  let m7 = njs.dot( Mt([   0,-1/3, 1]), njs.dot( Ms(1/3), njs.dot( Mz(1*Math.PI/2), Mr(-1,1) ) ) );
  sfc(njs.dot(M, m7), lvl-1, pnt_template, pnt_list);

  let m8 = njs.dot( Mt([ 1/3,-1/3, 1]), njs.dot( Ms(1/3), njs.dot( Mz(0*Math.PI/2), Mr( 1,1) ) ) );
  sfc(njs.dot(M, m8), lvl-1, pnt_template, pnt_list);
}


function sfc_peano_meander(lvl) {
  let pnt_template = [
    [ -1/3, -1/3, 1, 1 ],
    [ -1/3,    0, 1, 1 ],
    [ -1/3,  1/3, 1, 1 ],
    [    0,  1/3, 1, 1 ],
    [  1/3,  1/3, 1, 1 ],
    [  1/3,    0, 1, 1 ],
    [    0,    0, 1, 1 ],
    [    0, -1/3, 1, 1 ],
    [  1/3, -1/3, 1, 1 ]
  ];

  let pnt_list = [];

  sfc_peano_meander_r( numeric.identity(4), lvl, pnt_template, pnt_list );
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

function nonsfc_scanline(lvl, B) {
  B = ((typeof B === "undefined") ? 2 : B);

  let n = Math.floor(Math.pow(B, lvl));
  let N = n*n;

  let pnt = [];

  let x = 0,
      y = 0,
      dx = 1,
      dy = 1;
  for (let i=0; i<n; i++) {
    for (let j=0; j<n; j++) {
      pnt.push([x,y]);
      if (j<(n-1)) {
        x += dx;
      }
    }
    y += dy;
    dx *= -1;
  }

  return pnt;
}

function fisher_yates_shuffle(a) {
  var t, n = a.length;
  for (var i=0; i<(n-1); i++) {
    var idx = i + Math.floor(Math.random()*(n-i));
    t = a[i];
    a[i] = a[idx];
    a[idx] = t;
  }
}

function sfc_random2x2_r(M, lvl, pnt_template, pnt_list) {
  if (lvl==0) {
    fisher_yates_shuffle(pnt_template);
    let p = njs.transpose( njs.dot(M, njs.transpose(pnt_template)) );
    for (let i=0; i<p.length; i++) { pnt_list.push(p[i]); }
    return;
  }


  let sfc = sfc_random2x2_r;

  let m0 = njs.dot( Mt([-1/2, 1/2, 1]), Ms(1/2) );
  let m1 = njs.dot( Mt([ 1/2, 1/2, 1]), Ms(1/2) );
  let m2 = njs.dot( Mt([-1/2,-1/2, 1]), Ms(1/2) );
  let m3 = njs.dot( Mt([ 1/2,-1/2, 1]), Ms(1/2) );

  let m_a = [ m0, m1, m2, m3 ];

  fisher_yates_shuffle(m_a);

  for (let i=0; i<m_a.length; i++) {
    sfc(njs.dot(M, m_a[i]), lvl-1, pnt_template, pnt_list);
  }

}

function sfc_random2x2(lvl) {
  let pnt_template = [
    [ -1/2,  1/2, 1, 1 ],
    [  1/2,  1/2, 1, 1 ],
    [ -1/2, -1/2, 1, 1 ],
    [  1/2, -1/2, 1, 1 ]
  ];

  fisher_yates_shuffle(pnt_template);

  let pnt_list = [];
  sfc_random2x2_r( numeric.identity(4), lvl, pnt_template, pnt_list );
  return pnt_list;
}

function pnorm_diff(pnta, pntb, p) {
  let s = 0;
  for (let i=0; i<pnta.length; i++) {
    s += Math.pow( Math.abs(pnta[i] - pntb[i]), p );
  }
  return Math.pow(s, 1/p);
}

function holder_subsample(sfc_f,lvl,p, Q, len_factor) {
  sfc_f = ((typeof sfc_f === "undefined") ? sfc_hilbert : sfc_f);
  len_factor = ((typeof len_factor === "undefined") ? 1.75 : len_factor);
  let count=0;
  let F = [];

  let pnt = sfc_f(lvl);

  for (let i=0; i<pnt.length; i++) {
    F.push(0);
  }

  //let s_pos = Math.floor(0.25*pnt.length);
  //let e_pos = Math.floor(0.5*pnt.length);

  let dn = (1<<(Math.floor(len_factor*lvl)));

  console.log("#dn:", dn);

  for (let it=0; it<Q; it++) {
    let i = Math.floor(Math.random()*pnt.length);
    let j = Math.floor(Math.random()*pnt.length);

    j = Math.floor(Math.random()*dn) + i;
    if (j >= pnt.length) { j = pnt.length-1; }

    let a = pnt[i];
    let b = pnt[j];
    F[ Math.abs(i-j) ] += pnorm_diff(a,b,p);
    count++;
  }

  for (let i=0; i<pnt.length; i++) {
    F[i] /= count;
  }

  return F;
}

function holder(sfc_f,lvl,p) {
  sfc_f = ((typeof sfc_f === "undefined") ? sfc_hilbert : sfc_f);
  p = ((typeof p === "undefined") ? 1 : p);
  let count=0;
  let F = [];

  let pnt = sfc_f(lvl);

  for (let i=0; i<pnt.length; i++) {
    F.push(0);
  }

  for (let i=0; i<pnt.length; i++) {
    for (let j=0; j<pnt.length; j++) {
      let a = pnt[i];
      let b = pnt[j];
      F[ Math.abs(i-j) ] += pnorm_diff(a,b,p);
      count++;
    }
  }

  for (let i=0; i<pnt.length; i++) {
    F[i] *= pnt.length;
    F[i] /= count;
  }

  return F;
}

// shift and rescale to be on integral points
//
function renorm_point(pnt) {
  let bbox = [[0,0],[0,0]];

  bbox[0][0] = pnt[0][0];
  bbox[0][1] = pnt[0][1];

  bbox[1][0] = pnt[1][0];
  bbox[1][1] = pnt[1][1];

  for (let i=1; i<pnt.length; i++) {
    if (bbox[0][0] > pnt[i][0]) { bbox[0][0] = pnt[i][0]; }
    if (bbox[0][1] > pnt[i][1]) { bbox[0][1] = pnt[i][1]; }

    if (bbox[1][0] < pnt[i][0]) { bbox[1][0] = pnt[i][0]; }
    if (bbox[1][1] < pnt[i][1]) { bbox[1][1] = pnt[i][1]; }
  }

  for (let i=0; i<pnt.length; i++) {
    pnt[i][0] = ((pnt[i][0] - bbox[0][0]) / (bbox[1][0] - bbox[0][0] + 1));
    pnt[i][1] = ((pnt[i][1] - bbox[0][1]) / (bbox[1][1] - bbox[0][1] + 1));
  }

  return pnt;
}

//---


function gilbert_xyz2d(x,y,z,w,h,d) {
  let _q = {"x": x, "y": y, "z": z};
  let _p = {"x": 0, "y": 0, "z": 0};
  let _a = {"x": w, "y": 0, "z": 0};
  let _b = {"x": 0, "y": h, "z": 0};
  let _c = {"x": 0, "y": 0, "z": d};

  if ((w >= h) && (w >= d)) {
    return gilbert_xyz2d_r(0, _q, _p, _a, _b, _c);
  }
  else if ((h >= w) && (h >= d)) {
    return gilbert_xyz2d_r(0, _q, _p, _b, _a, _c);
  }
  return gilbert_xyz2d_r(0, _q, _p, _c, _a, _b);
}
//---


function coherence(sfc_f,lvl, r,R, n_it, print_debug) {
  print_debug = ((typeof print_debug === "undefined") ? false : print_debug);
  let pnt = sfc_f(lvl);
  renorm_point(pnt);

  let n = Math.floor(Math.sqrt(pnt.length));
  let N = n*n;

  let map_d2p = {},
      map_p2d = {};

  for (let i=0; i<pnt.length; i++) {
    pnt[i][0] *= n;
    pnt[i][1] *= n;

    map_d2p[i] = [pnt[i][0], pnt[i][1]];
    map_p2d[ pnt[i][0].toString() + ":" + pnt[i][1].toString() ] = i;
  }

  //let print_debug = false;

  if (print_debug) {
    console.log("##", "N:", N, "n:", n, "r:", r, "R:", R, "n_it:", n_it);
  }

  let circle_mask = [];

  let mx = R,
      my = R;

  // init circle_mask
  //
  for (let i=0; i<(2*R); i++) {
    circle_mask.push([]);
    for (let j=0; j<(2*R); j++) {
      circle_mask[i].push(0);
    }
  }

  let tot_count = 0;

  for (let it=0; it<n_it; it++) {

    // clear circle_mask
    //
    for (let i=0; i<(2*R); i++) {
      for (let j=0; j<(2*R); j++) {

        circle_mask[i][j] = 0;

        let x = i - mx;
        let y = j - my;

        let u = Math.sqrt( x*x + y*y );
        if (u < r) { circle_mask[i][j] = 1; }
        else if (u < R) { circle_mask[i][j] = 2; }
      }
    }

    if (print_debug) {
      for (let i=0; i<circle_mask.length; i++) {
        console.log("#", circle_mask[i].join(" "));
      }
    }

    let px = Math.floor(Math.random() * (n - 2*R - 2) + R + 1),
        py = Math.floor(Math.random() * (n - 2*R - 2) + R + 1);

    // jitter is causing problems
    //
    //px = (Math.random() * (n - 2*R - 2) + R + 1),
    //py = (Math.random() * (n - 2*R - 2) + R + 1);


    if (print_debug) {
      console.log("#pxy:", px, py);

      let nseg = 32;
      for (let i=0; i<=nseg; i++) {
        console.log(r*Math.cos(2*Math.PI * i / nseg) + px, r*Math.sin(2*Math.PI * i / nseg) + py);
      }
      console.log("\n");

      for (let i=0; i<=nseg; i++) {
        console.log(R*Math.cos(2*Math.PI * i / nseg) + px, R*Math.sin(2*Math.PI * i / nseg) + py);
      }
      console.log("\n");
    }

    let count = 0;

    let _test = 0;
    for (let i=0; i<circle_mask.length; i++) {
      for (let j=0; j<circle_mask.length; j++) {

        if (circle_mask[i][j] != 1) { continue; }

        let x = Math.floor(i + px - mx),
            y = Math.floor(j + py - my);

        if ((x<0) || (x>=n) ||
            (y<0) || (y>=n)) {
          state = 1;
          break;
        }

        //let idx = gilbert.xy2d(x,y, n,n);
        let idx = map_p2d[ x.toString() + ":" + y.toString() ];

        if (print_debug) {
          console.log("#xy:", x,y, "idx:", idx);
        }

        circle_mask[i][j] = -1;

        if (print_debug) {
          console.log(x,y);
        }

        let state = 0;
        for (let u=idx+1; u<N; u++) {
          //let res = gilbert.d2xy(u, n,n);
          let resa = map_d2p[u];
          let res = { "x": resa[0], "y": resa[1] }

          if (print_debug) {
            console.log(res.x, res.y);
          }

          let rel_x = (res.x - px + mx);
          let rel_y = (res.y - py + my);

          let ix = Math.floor(rel_x),
              iy = Math.floor(rel_y);

          if ((ix >= 0) && (ix < circle_mask.length) &&
              (iy >= 0) && (iy < circle_mask.length)) {
            circle_mask[ix][iy] = -1;
          }

          if (print_debug) {
            console.log("#+>>", rel_x, rel_y);
          }

          if ((rel_x < 0) ||
              (rel_x >= circle_mask.length) ||
              (rel_y < 0) ||
              (rel_y >= circle_mask[0].length)) {
            state = 2;
            break;
          }

          let d = Math.sqrt( (res.x - px)*(res.x - px) + (res.y - py)*(res.y - py) );
          if (d > R) { state = 2; break; }

        }
        if (print_debug) {
          console.log("\n");
        }

        if (print_debug) {
          console.log(x,y);
        }
        for (let u=idx-1; u>=0; u--) {
          //let res = gilbert.d2xy(u, n,n);
          let resa = map_d2p[u];
          let res = { "x": resa[0], "y": resa[1] }

          if (print_debug) {
            console.log(res.x, res.y);
          }

          let rel_x = res.x - px + mx;
          let rel_y = res.y - py + my;

          let ix = Math.floor(rel_x),
              iy = Math.floor(rel_y);

          if ((ix >= 0) && (ix < circle_mask.length) &&
              (iy >= 0) && (iy < circle_mask.length)) {
            circle_mask[ix][iy] = -1;
          }

          if ((rel_x < 0) ||
              (rel_x >= circle_mask.length) ||
              (rel_y < 0) ||
              (rel_y >= circle_mask[0].length)) {
            state = 2;
            break;
          }

          let d = Math.sqrt( (res.x - px)*(res.x - px) + (res.y - py)*(res.y - py) );
          if (d > R) { state = 2; break; }

        }
        if (print_debug) {
          console.log("\n");
          console.log("#state:", state);
        }

        if (state == 2) {
          count++;
        }
      }

    }

    tot_count += count;

    if (print_debug) {
      console.log("### count:", count);
    }

  }

  tot_count /= n_it;
  if (tot_count == 0) { return 0; }

  return 2*r / tot_count;
}

// state:
//
//  0 - within r
//  1 - out of r, within R
//
function loopstat(sfc_f,lvl, L,r,R, n_it) {
  let pnt = sfc_f(lvl);
  let state = 0;

  let n = Math.floor(Math.sqrt(pnt.length));

  let count = [0,0,0];
  for (let it = 0; it < n_it; it++) {

    let p0_idx = Math.floor(Math.random() * pnt.length);
    let p0 = pnt[p0_idx];

    if ((p0_idx + L) >= pnt.length) { continue; }
    if ((p0_idx - L) <  0) { continue; }

    state = 0;

    for (let t = 1; t < L; t++) {

      let idx = p0_idx + t;

      let x = pnt[idx][0];
      let y = pnt[idx][1];

      let _len = Math.sqrt( (x-p0[0])*(x-p0[0]) + (y-p0[1])*(y-p0[1]) );

      if (_len <= r) {
        if (state == 1) {
          count[0]++;
          break;
        }

      }
      else if ((_len > r) &&
               (_len <= R)) {
        state = 1;
      }
      else if (_len > R) {
        count[1]++;
        break;
      }

    }

  }

  return count;
}

if (typeof module !== "undefined") {

  function show_help() {
    console.log("usage:");
    console.log("");
    console.log("  node sfc.js [hilbert|peano|meander|morton|moore|random] [<recursion_level>] [holder|snippet] [param]");
    console.log("");
    console.log("");
  }

  let sfc_f_map = {
    "hilbert": sfc_hilbert,
    "peano": sfc_peano,
    "meander": sfc_peano_meander,
    "peano_meander": sfc_peano_meander,
    "morton": sfc_morton,
    "moore": sfc_moore,
    "scanline": nonsfc_scanline,
    "random": sfc_random2x2
  };

  function main(curve_name, recursion_level) {
    if (!(curve_name in sfc_f_map)) { return; }
    printpoint( sfc_f_map[curve_name](recursion_level) );
  }

  function main_holder(curve_name, recursion_level, D) {
    let _D = D;
    if (typeof D === "undefined") { D = 2; _D = 1; }
    if (!(curve_name in sfc_f_map)) { return; }
    print_array_renorm( holder( sfc_f_map[curve_name], recursion_level, D ), _D );
  }

  function main_holder_subsample(curve_name, recursion_level, D, Q, len_factor) {
    if (!(curve_name in sfc_f_map)) { return; }
    print_array_renorm( holder_subsample( sfc_f_map[curve_name], recursion_level, D, Q, len_factor), D );
  }

  function idir(a,b) {
    if ( (a[0] - b[0]) >  0.5 ) { return 0; }
    if ( (a[0] - b[0]) < -0.5 ) { return 1; }
    if ( (a[1] - b[1]) >  0.5 ) { return 2; }
    if ( (a[1] - b[1]) < -0.5 ) { return 3; }
    if ( (a[2] - b[2]) >  0.5 ) { return 4; }
    if ( (a[2] - b[2]) < -0.5 ) { return 5; }
    return -1;
  }

  function main_snippet(curve_name, recursion_level, snip_size) {
    if (!(curve_name in sfc_f_map)) { return; }
    let w = sfc_f_map[curve_name](recursion_level);
    for (let i=0; i<(w.length-snip_size); i++) {
      let raw_path = [ w[i] ];
      let snip_path = [];
      for (let j=0; j<(snip_size-1); j++) {
        raw_path.push( w[i+j+1] );
        snip_path.push( idir(w[i+j], w[i+j+1]) );
      }
      //console.log( snip_path.join(","), "#", raw_path );
      console.log( snip_path.join(",") );
    }
  }

  let op = "help";
  let n = 4;
  let sub_op = "";
  let m = 8;
  let Q = -1;

  if (process.argv.length > 2) {
    op = process.argv[2];

    if (process.argv.length > 3) {
      n = parseInt(process.argv[3]);

      if (process.argv.length > 4) {
        sub_op = process.argv[4];

        if (process.argv.length > 5) {
          m = parseInt(process.argv[5]);

          if (process.argv.length > 6) {
            Q = parseInt(process.argv[6]);
          }
        }
      }
    }
  }

  if (op == "help") { show_help(); }

  else if (sub_op == "holder") {
    if (Q < 0) {
      main_holder(op, n, m);
    }
    else {
      let lf = 1.75;
      if ((op == "hilbert") || (op == "morton") || (op == "moore")) { lf = 1.75; }
      else if ((op == "meander") || (op == "peano") || (op == "")) { lf = 2.75; }
      main_holder_subsample(op, n, m, Q, lf);
    }
  }

  else if (sub_op == "snippet") {
    main_snippet(op, n, m);
  }

  else if (sub_op == "coherence_debug") {
    let r = 20;
    let c = coherence(sfc_hilbert,n, r, 2*r, 4, true);
  }

  else if (sub_op == "coherence") {

    let f = sfc_f_map[ op ];

    if (typeof f === "undefined") {
      console.log("provide function");
      process.exit();
    }

    let N = f(n).length;
    let l = Math.floor(Math.sqrt(N));
    console.log("#", op, N, "(", l, l, ")");
    console.log("##", 20, coherence(f,n, 20, 2*20, 4));

    for (r=0.5; r<101; r+=0.5) {
      let c = coherence(f,n, r, 2*r, 100);
      console.log(r,c);
    }

  }

  else if (sub_op == "loop") {

    for (let r=5; r<20; r+=0.125) {
      for (let R=(r+0.25); R<(r+10); R+=10.125) {
        R = 30;
        let c = loopstat(sfc_hilbert,4, 64,r,R, 1000000);
        //console.log( r/R, c[0], c[1] );
        console.log( r/R, c[0] );
      }
    }

  }

  else {
    main(op, n);
  }

}
