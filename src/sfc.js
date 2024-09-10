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
    console.log( t, ((p[i] + m)/R) / Math.pow(i, 1/D));
    
    //console.log( i / n, (p[i] + m) / R );
  }
  console.log("\n");
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

function pnorm_diff(pnta, pntb, p) {
  let s = 0;
  for (let i=0; i<pnta.length; i++) {
    s += Math.pow( Math.abs(pnta[i] - pntb[i]), p );
  }
  return Math.pow(s, 1/p);
}

function holder(sfc_f,lvl,p) {
  sfc_f = ((typeof sfc_f === "undefined") ? sfc_hilbert : sfc_f);
  let count=0;
  let F = [];

  let pnt = sfc_f(lvl);

  for (let i=0; i<pnt.length; i++) {
    F.push(0);
  }

  /*
  let max_val =  0.5;
  let min_val = -0.5;
  for (let i=0; i<pnt.length; i++) {

    if ((i==0) ||
        (max_val < pnt[i][0]) || 
        (max_val < pnt[i][1])) {
      max_val = (( pnt[i][0] > pnt[i][1] ) ? pnt[i][0] : pnt[i][1] );
    }

    if ((i==0) ||
        (min_val > pnt[i][0]) || 
        (min_val > pnt[i][1])) {
      min_val = (( pnt[i][0] < pnt[i][1] ) ? pnt[i][0] : pnt[i][1] );
    }

  }

  let dxy = [ min_val, min_val ];
  let sxy = [ (max_val - min_val), (max_val - min_val) ];
  */

  for (let i=0; i<pnt.length; i++) {
    for (let j=0; j<pnt.length; j++) {
      let a = pnt[i];
      let b = pnt[j];

      //a[0] = (a[0] + dxy[0]) / sxy[0];
      //a[1] = (a[1] + dxy[1]) / sxy[1];

      //b[0] = (b[0] + dxy[0]) / sxy[0];
      //b[1] = (b[1] + dxy[1]) / sxy[1];

      F[ Math.abs(i-j) ] += pnorm_diff(a,b,p);

      //console.log("#?", i, j, a, b, p, pnorm_diff(a,b,p));

      count++;
    }
  }

  for (let i=0; i<pnt.length; i++) {
    F[i] /= count;
  }

  return F;
}

if (typeof module !== "undefined") {

  function show_help() {
    console.log("usage:");
    console.log("");
    console.log("  node sfc.js [hilbert|peano|meander|morton|moore] [<recursion_level>] [holder|snippet] [param]");
    console.log("");
    console.log("");
  }

  let sfc_f_map = {
    "hilbert": sfc_hilbert,
    "peano": sfc_peano,
    "meander": sfc_peano_meander,
    "peano_meander": sfc_peano_meander,
    "morton": sfc_morton,
    "moore": sfc_moore
  };

  function main(curve_name, recursion_level) {
    if (!(curve_name in sfc_f_map)) { return; }
    printpoint( sfc_f_map[curve_name](recursion_level) );
  }

  function main_holder(curve_name, recursion_level, D) {
    let _D = D;
    if (typeof D === "undefined") { D = 2; _D = 1; }

    if (!(curve_name in sfc_f_map)) { return; }
    //printa( holder( sfc_f_map[curve_name], recursion_level, 2 ) );
    print_array_renorm( holder( sfc_f_map[curve_name], recursion_level, D ), _D );
  }

  function main_holder2(curve_name, recursion_level, D) {
    if (!(curve_name in sfc_f_map)) { return; }
    //printa( holder( sfc_f_map[curve_name], recursion_level, 2 ) );
    print_array_renorm( holder( sfc_f_map[curve_name], recursion_level, D), D );
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

  if (process.argv.length > 2) {
    op = process.argv[2];

    if (process.argv.length > 3) {
      n = parseInt(process.argv[3]);

      if (process.argv.length > 4) {
        sub_op = process.argv[4];

        if (process.argv.length > 5) {
          m = parseInt(process.argv[5]);
        }
      }
    }
  }

  if (op == "help") { show_help(); }
  else if (sub_op == "holder") {
    main_holder(op, n, m);
  }
  else if (sub_op == "snippet") {
    main_snippet(op, n, m);
  }
  else {
    main(op, n);
  }

}
