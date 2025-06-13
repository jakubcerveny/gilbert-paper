// To the extent possible under law, the person who associated CC0 with
// this project has waived all copyright and related or neighboring rights
// to this project.
// 
// You should have received a copy of the CC0 legalcode along with this
// work. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
//

// This is a accompanying reference implementation for the
// Gilbert2D and Gilbert3D functions referenced in the
// paper https://github.com/jakubcerveny/gilbert-paper
//
// The code here's main focus is legibility, not execution
// speed or memory usage.
// There are both asynchronous functions that closely match
// the psuedo code from the paper as well as synchronous
// functions with their corresponding d2xyz and xyz2d
// functions.
//
// Running from the command line will list options.
//

var VERBOSE = 0;

function _vprint() {
  let _verbose = ((typeof VERBOSE === "undefined") ? false : VERBOSE );
  if (_verbose) {
    console.log.apply(this,Array.prototype.slice.call(arguments));
  }
}

var GILBERT_ADAPT_METHOD = {
  "HARMONY"     : 0,
  "HAMILTONIAN" : 1,
  "AXIS"        : 2
};

function Gilbert3DAdapt_d2xyz(idx, w,h,d, adapt_method) {
  adapt_method = ((typeof adapt_method === "undefined") ? 0 : adapt_method);
  let w0 = (w%2);
  let h0 = (h%2);
  let d0 = (d%2);

  let p0 = [0,0,0];

  // prioritize harmonious split
  //
  if (adapt_method == GILBERT_ADAPT_METHOD["HARMONY"]) {
    if      ((w >= h) && (w >= d)) { return Gilbert3D_d2xyz(idx, 0, p0, [w,0,0], [0,h,0], [0,0,d]); }
    else if ((h >= w) && (h >= d)) { return Gilbert3D_d2xyz(idx, 0, p0, [0,h,0], [w,0,0], [0,0,d]); }
    return Gilbert3D_d2xyz(idx, 0, p0, [0,0,d], [w,0,0], [0,h,0]);
  }

  // prioritize no notch hamiltonian path
  //
  else if (adapt_method == GILBERT_ADAPT_METHOD["HAMILTONIAN"]) {

    if (w0 == 0) { return Gilbert3D_d2xyz(idx, 0, p0, [w,0,0], [0,h,0], [0,0,d]); }
    if (h0 == 0) { return Gilbert3D_d2xyz(idx, 0, p0, [0,h,0], [w,0,0], [0,0,d]); }
    if (d0 == 0) { return Gilbert3D_d2xyz(idx, 0, p0, [0,0,d], [w,0,0], [0,h,0]); }
    return Gilbert3D_d2xyz(idx, 0, p0, [w,0,0], [0,h,0], [0,0,d]);

  }

  // AXIS (explicit axis order)
  //
  return Gilbert3D_d2xyz(idx, 0, p0, [w,0,0], [0,h,0], [0,0,d]);

}

function Gilbert3DAdapt_xyz2d(q, w,h,d, adapt_method) {
  adapt_method = ((typeof adapt_method === "undefined") ? 0 : adapt_method);
  let w0 = (w%2);
  let h0 = (h%2);
  let d0 = (d%2);

  // prioritize harmonious split
  //
  if (adapt_method == GILBERT_ADAPT_METHOD["HARMONY"]) {
    if      ((w >= h) && (w >= d)) { return Gilbert3D_xyz2d(0, q, [0,0,0], [w,0,0], [0,h,0], [0,0,d]); }
    else if ((h >= w) && (h >= d)) { return Gilbert3D_xyz2d(0, q, [0,0,0], [0,h,0], [w,0,0], [0,0,d]); }
    return Gilbert3D_xyz2d(0, q, [0,0,0], [0,0,d], [w,0,0], [0,h,0]);
  }

  // prioritize no notch hamiltonian path
  //
  else if (adapt_method == GILBERT_ADAPT_METHOD["HAMILTONIAN"]) {

    if (w0 == 0) { return Gilbert3D_xyz2d(0, q, [0,0,0], [w,0,0], [0,h,0], [0,0,d]); }
    if (h0 == 0) { return Gilbert3D_xyz2d(0, q, [0,0,0], [0,h,0], [w,0,0], [0,0,d]); }
    if (d0 == 0) { return Gilbert3D_xyz2d(0, q, [0,0,0], [0,0,d], [w,0,0], [0,h,0]); }
    return Gilbert3D_xyz2d(0, q, [0,0,0], [w,0,0], [0,h,0], [0,0,d]);

  }

  // AXIS (explicit axis order)
  //
  return Gilbert3D_d2xyz(idx, 0, p0, [w,0,0], [0,h,0], [0,0,d]);

}


function Gilbert2DAdapt_d2xy(idx, w,h, adapt_method) {
  adapt_method = ((typeof adapt_method === "undefined") ? 0 : adapt_method);
  let w0 = (w%2);
  let h0 = (h%2);

  let p0 = [0,0,0];

  // prioritize harmonious split
  //
  if (adapt_method == GILBERT_ADAPT_METHOD["HARMONY"]) {

    if (w >= h) {
      let xyz = Gilbert2D_d2xyz(idx, 0, p0, [w,0,0], [0,h,0], [0,0,1]);
      return [xyz[0], xyz[1]];
    }

    let xyz = Gilbert2D_d2xyz(idx, 0, p0, [0,h,0], [w,0,0], [0,0,1]);
    return [xyz[0], xyz[1]];

  }

  // prioritize no notch hamiltonian path
  //
  else if (adapt_method == GILBERT_ADAPT_METHOD["HAMILTONIAN"]) {
    if (w0 == 0) {
      let xyz = Gilbert2D_d2xyz(idx, 0, p0, [w,0,0], [0,h,0], [0,0,1]);
      return [xyz[0], xyz[1]];
    }

    if (h0 == 0) {
      let xyz = Gilbert2D_d2xyz(idx, 0, p0, [0,h,0], [w,0,0], [0,0,1]);
      return [xyz[0], xyz[1]];
    }

    let xyz = Gilbert2D_d2xyz(idx, 0, p0, [w,0,0], [0,h,0], [0,0,1]);
    return [xyz[0], xyz[1]];
  }

  // AXIS (explicit axis order)
  //
  let xyz = Gilbert2D_d2xyz(idx, 0, p0, [w,0,0], [0,h,0], [0,0,1]);
  return [xyz[0], xyz[1]];

}

function Gilbert2DAdapt_xy2d(_q, w,h, adapt_method) {
  adapt_method = ((typeof adapt_method === "undefined") ? 0 : adapt_method);
  let w0 = (w%2);
  let h0 = (h%2);

  let q = [_q[0],_q[1],0];
  let p0 = [0,0,0];

  // prioritize harmonious split
  //
  if (adapt_method == GILBERT_ADAPT_METHOD["HARMONY"]) {
    if (w >= h) { return Gilbert2D_xyz2d(0, q, p0, [w,0,0], [0,h,0], [0,0,1]); }
    return Gilbert2D_xyz2d(0, q, p0, [0,h,0], [w,0,0], [0,0,1]);
  }

  // prioritize no notch hamiltonian path
  //
  else if (adapt_method == GILBERT_ADAPT_METHOD["HAMILTONIAN"]) {
    if (w0 == 0) { return Gilbert2D_xyz2d(0, q, p0, [w,0,0], [0,h,0], [0,0,1]); }
    if (h0 == 0) { return Gilbert2D_xyz2d(0, q, p0, [0,h,0], [w,0,0], [0,0,1]); }
    return Gilbert2D_xyz2d(0, q, p0, [w,0,0], [0,h,0], [0,0,1]);
  }

  // AXIS (explicit axis order)
  //
  return Gilbert2D_xyz2d(0, q, p0, [w,0,0], [0,h,0], [0,0,1]);

}

// Description:
//
// d2e    : divide by 2 but force even (by adding one if need be)
// d2u    : divide by 2 but force odd (by adding one if need be)
// dqe    : divide by q but force even (by adding one if need be)
// dqu    : divide by q but force odd (by adding one if need be)
// v_divq  : integer divide vector entries by q ( sgn(v) floor(|v|/q) )
// v_div2  : v_divq(2)
// _sgn   : return -1,0,1 if value is <0, 0 or >0 respectively
// v_neg   : negate vector (multiply each entry by -1)
// v_add   : add two vectors
// abs_sum_v   : absolute value all vector entries
// v_delta : replace each element in vector by _sgn(.)
// v_print : print vector (debugging)
// v_clone : make a clone of the vector
//
// all vector operations can be done with 2d or 3d vectors (only)
//

// floor version
//
//function _d2e(v) {
//  let v2 = Math.floor(v/2);
//  if (v==0) { return 0; }
//  if ((v2%2)==0) { return v2; }
//  return v2+1;
//}

// round to zero version
//
function d2e(_v) {
  let v = Math.abs(_v);
  let m = ((_v<0)? -1 : 1);
  let v2 = Math.floor(v/2);
  if (v==0) { return 0; }
  if ((v2%2)==0) { return m*v2; }
  return m*(v2+1);
}

// round to zero version
//
function d2u(_v) {
  let v = Math.abs(_v);
  let m = ((_v<0)? -1 : 1);
  let v2 = Math.floor(v/2);
  if (v==0) { return 0; }
  if ((v2%2)==1) { return m*v2; }
  return m*(v2+1);
}

// round to zero version
//
function dqe(_v,q) {
  let v = Math.abs(_v);
  let m = ((_v<0)? -1 : 1);
  let vq = Math.floor(v/q);
  if ((vq%2)==0) { return m*vq; }
  return m*(vq+1);
}


// round to zero
// divide by q, force odd
//
function dqu(_v,q) {
  let v = Math.abs(_v);
  let m = ((_v<0)? -1 : 1);
  let vq = Math.floor(v/q);
  if (v==0) { return 0; }
  if ((vq%2)==1) { return m*vq; }
  return m*(vq+1);
}

// round to zero version
//
function v_divq(v,q) {
  let u = [];
  for (let i=0; i<v.length; i++) {
    let _v = Math.abs(v[i]);
    let m = ((v[i]<0) ? -1 : 1);
    u.push( m*Math.floor(_v / q) );
  }
  return u;
}

function v_div2(v) { return v_divq(v,2); }

function _sgn(v) {
  if (v>0) { return  1; }
  if (v<0) { return -1; }
  return 0;
}

function v_neg(v) {
  if (v.length==2) { return [-v[0], -v[1]]; }
  return [ -v[0], -v[1], -v[2] ];
}

/*
function v_add(u,v) {
  if ((u.length == 2) || (v.length == 2)) {
    return [ u[0]+v[0], u[1]+v[1] ];
  }
  return [ u[0]+v[0], u[1]+v[1], u[2]+v[2] ];
}
*/

function v_add() {
  if (arguments.length == 0) { return []; }
  let u = v_clone(arguments[0]);

  for (let i=1; i<arguments.length; i++) {
    let v = arguments[i];
    let m = Math.min( u.length, v.length );
    for (let j=0; j<m; j++) { u[j] += v[j]; }
  }

  return u;
}

/*
function v_sub(u,v) {
  if ((u.length == 2) || (v.length == 2)) {
    return [ u[0]-v[0], u[1]-v[1] ];
  }
  return [ u[0]-v[0], u[1]-v[1], u[2]-v[2] ];
}
*/

function v_sub() {
  if (arguments.length == 0) { return []; }
  let u = v_clone(arguments[0]);

  for (let i=1; i<arguments.length; i++) {
    let v = arguments[i];
    let m = Math.min( u.length, v.length );
    for (let j=0; j<m; j++) { u[j] -= v[j]; }
  }

  return u;
}


function v_mul(c,v) {
  if (v.length == 2) {
    return [ c*v[0], c*v[1] ];
  }
  return [ c*v[0], c*v[1], c*v[2] ];
}

function dot_v(u,v) {
  if ((u.length == 2) || (v.length == 2)) {
    return  (u[0]*v[0]) + (u[1]*v[1]);
  }
  return (u[0]*v[0]) + (u[1]*v[1]) + (u[2]*v[2]);
}

function abs_sum_v(v) {
  let s = 0;
  for (let i=0; i<v.length; i++) {
    s += Math.abs(v[i]);
  }
  return s;
}

function v_delta(v) {
  let u = [];
  for (let i=0; i<v.length; i++) {
    u.push( _sgn(v[i]) );
  }
  return u;
}

function v_print(v) {
  if (v.length == 2)  { console.log(v[0], v[1]); }
  else                { console.log(v[0], v[1], v[2]); }
}

function v_clone(v) {
  let u = [];
  for (let i=0; i<v.length; i++) {
    u.push(v[i]);
  }
  return u;
}

// Test to see if q is within bounds of volume
// whose corner is at p and volume defined by a,b,g
//
// If volume coordinate is positive, the corresponding p
// coordinate is taken to be lower bound.
// Otherwise, if the volume coordinate is negative,
// corresponding p coordinate is taken to be the
// upper bound.
//
// Works in 2 and 3 dimensions.
// Assumes q,p,a,b,g are all simple arrays (of length 2 or 3)
//
// q - query point
// p - corner point
// a - width like dimension
// b - height like dimension
// g - depth like dimension
//
function _inBounds(q, p, a, b, g) {
  let _a = [0,0,0],
      _b = [0,0,0],
      _g = [0,0,0];

  //let default_g = [0,0,1];
  //let _g = ((typeof g === "undefined") ? default_g : g);
  let _p = [0,0,0],
      _q = [0,0,0];

  _a[0] = a[0];
  _a[1] = a[1];
  _a[2] = ((a.length > 2) ? a[2] : 0);

  _b[0] = b[0];
  _b[1] = b[1];
  _b[2] = ((b.length > 2) ? b[2] : 0);

  _q[0] = q[0];
  _q[1] = q[1];
  _q[2] = ((q.length > 2) ? q[2] : 0);

  _p[0] = p[0];
  _p[1] = p[1];
  _p[2] = ((p.length > 2) ? p[2] : 0);

  if (typeof g === "undefined") {
    if      ((_a[0] == 0) && (_b[0] == 0)) { _g[0] = 1; }
    else if ((_a[1] == 0) && (_b[1] == 0)) { _g[1] = 1; }
    else if ((_a[2] == 0) && (_b[2] == 0)) { _g[2] = 1; }
  }
  else { _g = g; }


  let _d = [
    _a[0] + _b[0] + _g[0],
    _a[1] + _b[1] + _g[1],
    _a[2] + _b[2] + _g[2]
  ];


  for (let xyz=0; xyz<3; xyz++) {
    if ( _d[xyz] < 0 ) {
      if ((q[xyz] >  p[xyz]) ||
          (q[xyz] <= (p[xyz] + _d[xyz]))) { return false; }
    }
    else {
      if ((q[xyz] <  p[xyz]) ||
          (q[xyz] >= (p[xyz] + _d[xyz]))) { return false; }
    }
  }

  return true;

}

//--------------------------------------------------------------
//   ______ ____           __  ___  ___       _____             
//  / ___(_) / /  ___ ____/ /_|_  |/ _ \  ___/ /_  |_ ____ _____
// / (_ / / / _ \/ -_) __/ __/ __// // / / _  / __/\ \ / // /_ /
// \___/_/_/_.__/\__/_/  \__/____/____/  \_,_/____/_\_\\_, //__/
//                                                    /___/     
//--------------------------------------------------------------

// "generalized" 2d gilbert curve
//
// alpha - width-like axis
// beta - height-like axis
//
// Enumerate points for the 2d Gilbert curve
// in alpha and beta axis.
// alpha/beta can be in 3d and should work properly.
//
// recursive, sync
//
function Gilbert2D_d2xyz(dst_idx, cur_idx, p, alpha, beta) {
  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);

  _vprint("#Gilbert2D_d2xyz: dst_idx:", dst_idx, "cur_idx:", cur_idx, "alpha:", alpha, "beta:", beta, "(", a, b, ")");

  let d_alpha = v_delta(alpha);
  let d_beta  = v_delta(beta);

  if (b==1) {

    _vprint("#Gilbert2D_d2xyz.Lb: dst_idx:", dst_idx, "cur_idx:", cur_idx, "alpha:", alpha, "beta:", beta, "(", a, b, ")");

    let d_idx = dst_idx - cur_idx;
    return v_add(p, v_mul(d_idx, d_alpha));
  }


  if (a==1) {

    _vprint("#Gilbert2D_d2xyz.La: dst_idx:", dst_idx, "cur_idx:", cur_idx, "alpha:", alpha, "beta:", beta, "(", a, b, ")");

    let d_idx = dst_idx - cur_idx;
    return v_add(p, v_mul(d_idx, d_beta));
  }

  let alpha2 = v_div2(alpha);
  let beta2  = v_div2(beta);

  let a2 = abs_sum_v(alpha2);
  let b2 = abs_sum_v(beta2);

  _vprint("#  Gilbert2D_d2xyz: dst_idx:", dst_idx, "cur_idx:", cur_idx, "(alpha2,beta2):", alpha2, beta2, "(", a2, b2, ")");

  if ( (2*a) > (3*b) ) {
    if ((a2%2) && (a>2)) {
      alpha2 = v_add(alpha2, d_alpha);
      a2 = abs_sum_v(alpha2);
    }


    _vprint("#Gilbert2D_d2xyz.S0: dst_idx:", dst_idx, "cur_idx:", cur_idx, "(alpha2,beta2):", alpha2, beta2, "(", a2, b2, ")");

    let nxt_idx = cur_idx + (a2*b);
    if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
      return Gilbert2D_d2xyz( dst_idx, cur_idx,
                              p,
                              alpha2,
                              beta );
    }
    cur_idx = nxt_idx;

    _vprint("#Gilbert2D_d2xyz.S1: dst_idx:", dst_idx, "cur_idx:", cur_idx, "(alpha2,beta2):", alpha2, beta2, "(", a2, b2, ")");

    return Gilbert2D_d2xyz( dst_idx, cur_idx,
                            v_add(p, alpha2),
                            v_add(alpha, v_neg(alpha2)),
                            beta );

  }


  if ((b2%2) && (b>2)) {
    beta2 = v_add(beta2, d_beta);
    b2 = abs_sum_v(beta2);
  }


  _vprint("#Gilbert2D_d2xyz.A: dst_idx:", dst_idx, "cur_idx:", cur_idx, "(alpha2,beta2):", alpha2, beta2, "(", a2, b2, ")");

  let nxt_idx = cur_idx + (b2*a2);
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert2D_d2xyz( dst_idx, cur_idx,
                            p,
                            beta2,
                            alpha2 );
  }
  cur_idx = nxt_idx;

  _vprint("#Gilbert2D_d2xyz.B: dst_idx:", dst_idx, "cur_idx:", cur_idx, "(alpha2,beta2):", alpha2, beta2, "(", a2, b2, ")");

  nxt_idx = cur_idx + (a*(b-b2));
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert2D_d2xyz( dst_idx, cur_idx,
                            v_add(p, beta2),
                            alpha,
                            v_add(beta, v_neg(beta2)) );
  }
  cur_idx = nxt_idx;

  _vprint("#Gilbert2D_d2xyz.C: dst_idx:", dst_idx, "cur_idx:", cur_idx, "(alpha2,beta2):", alpha2, beta2, "(", a2, b2, ")");

  return Gilbert2D_d2xyz( dst_idx, cur_idx,
                          v_add(p,
                          v_add( v_add(alpha, v_neg(d_alpha) ),
                                v_add(beta2, v_neg( d_beta) ) ) ),
                          v_neg(beta2),
                          v_add(alpha2, v_neg(alpha)) );
}

//-----------------------------------------------------------------
//   ______ ____           __  ___  ___                  ___     __
//  / ___(_) / /  ___ ____/ /_|_  |/ _ \  __ ____ _____ |_  |___/ /
// / (_ / / / _ \/ -_) __/ __/ __// // /  \ \ / // /_ // __// _  / 
// \___/_/_/_.__/\__/_/  \__/____/____/  /_\_\\_, //__/____/\_,_/  
//                                           /___/                 
//-----------------------------------------------------------------

// "generalized" 2d gilbert curve
//
// alpha - width-like axis
// beta - height-like axis
//
// Enumerate points for the 2d Gilbert curve
// in alpha and beta axis.
// alpha/beta can be in 3d and should work properly.
//
// recursive, synchronous
//
function Gilbert2D_xyz2d(cur_idx, q, p, alpha, beta) {
  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);

  let u = v_clone(p);

  _vprint("#Gilbert2D_xyz2d: cur_idx:", cur_idx, "q:", q, "p:", p, "(alpha:", alpha, "beta:", beta, ") (", a, b, ")");

  let d_alpha = v_delta(alpha);
  let d_beta  = v_delta(beta);

  if ( b == 1 ) {
    return cur_idx + dot_v( d_alpha, v_add(q, v_neg(u)) );
  }

  if ( a == 1 ) {
    return cur_idx + dot_v( d_beta, v_add(q, v_neg(u)) );
  }

  let alpha2 = v_div2(alpha);
  let beta2  = v_div2(beta);

  let a2 = abs_sum_v(alpha2);
  let b2 = abs_sum_v(beta2);

  _vprint("#  Gilbert2D_xyz2d: cur_idx:", cur_idx, "(alpha2,beta2):", alpha2, beta2, "(", a2, b2, ")");

  if ( (2*a) > (3*b) ) {
    if ((a2%2) && (a>2)) {
      alpha2 = v_add(alpha2, d_alpha);
      a2 = abs_sum_v(alpha2);
    }

    _vprint("#  Gilbert2D_xyz2d.W0");

    if (_inBounds(q, u, alpha2, beta)) {
      return Gilbert2D_xyz2d( cur_idx, q,
                              u,
                              alpha2,
                              beta );
    }
    cur_idx += (a2*b);
    u = v_add(u, alpha2);

    _vprint("#  Gilbert2D_xyz2d.W1");

    return Gilbert2D_xyz2d( cur_idx, q,
                            u,
                            v_add(alpha, v_neg(alpha2)),
                            beta );

  }


  if ((b2%2) && (b>2)) {
    beta2 = v_add(beta2, d_beta);
    b2 = abs_sum_v(beta2);
  }

  _vprint("#  Gilbert2D_xyz2d.A: q:", q, "u:", u, "beta2:", beta2, "alpha2:", alpha2);

  if (_inBounds(q, u, beta2, alpha2)) {
    return Gilbert2D_xyz2d( cur_idx, q,
                            u,
                            beta2,
                            alpha2 );
  }
  cur_idx += (b2*a2);

  _vprint("#  Gilbert2D_xyz2d.B");

  u = v_add(p, beta2);
  if (_inBounds(q, u, alpha, v_add(beta, v_neg(beta2)))) {
    return Gilbert2D_xyz2d( cur_idx, q,
                            u,
                            alpha,
                            v_add(beta, v_neg(beta2)) );
  }
  cur_idx += (a*(b-b2));

  _vprint("#  Gilbert2D_xyz2d.C");

  u = v_add(p,
           v_add( v_add(alpha, v_neg(d_alpha) ),
                 v_add(beta2, v_neg( d_beta) ) ) );
  return Gilbert2D_xyz2d( cur_idx, q,
                          u,
                          v_neg(beta2),
                          v_add(alpha2, v_neg(alpha)) );

}


//---------------------------------------------------------------
//   ______ ____           __  ___  ___  ___                    
//  / ___(_) / /  ___ ____/ /_|_  |/ _ \/ _ | ___ __ _____  ____
// / (_ / / / _ \/ -_) __/ __/ __// // / __ |(_-</ // / _ \/ __/
// \___/_/_/_.__/\__/_/  \__/____/____/_/ |_/___/\_, /_//_/\__/ 
//                                              /___/           
//---------------------------------------------------------------

// "generalized" 2d gilbert curve
//
// alpha - width-like axis
// beta - height-like axis
//
// Enumerate points for the 2d Gilbert curve
// in alpha and beta axis.
// alpha/beta can be in 3d and should work properly.
//
// recursive, sync
//
function *Gilbert2DAsync(p, alpha, beta) {
  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);

  _vprint("#Gilbert2DAsync", alpha, beta, "(", a, b, ")");

  let d_alpha = v_delta(alpha);
  let d_beta  = v_delta(beta);

  if (b==1) {
    let u = v_clone(p);
    for (let i=0; i<a; i++) {
      yield u;
      u = v_add(u, d_alpha);
    }
    return;
  }


  if (a==1) {
    let u = v_clone(p);
    for (let i=0; i<b; i++) {
      yield u;
      u = v_add(u, d_beta);
    }
    return;
  }

  let alpha2 = v_div2(alpha);
  let beta2  = v_div2(beta);

  let a2 = abs_sum_v(alpha2);
  let b2 = abs_sum_v(beta2);

  _vprint("#  Gilbert2DAsync: (alpha2,beta2):", alpha2, beta2, "(", a2, b2, ")");

  if ( (2*a) > (3*b) ) {
    if ((a2%2) && (a>2)) { alpha2 = v_add(alpha2, d_alpha); }

    _vprint("#  Gilbert2DAsync: 2a>3b:A");

    yield* Gilbert2DAsync( p, alpha2, beta );

    _vprint("#  Gilbert2DAsync: 2a>3b:B");

    yield* Gilbert2DAsync( v_add(p, alpha2),
                           v_add(alpha, v_neg(alpha2)),
                           beta );

    return;
  }


  if ((b2%2) && (b>2)) { beta2 = v_add(beta2, d_beta); }

  _vprint("#  Gilbert2DAsync: A (alpha:", alpha, "beta:", beta, "alpha2:", alpha2, "beta2:", beta2, ")", "(|a2|:", a2, "|b2|:", b2, ")");

  yield* Gilbert2DAsync( p,
                         beta2,
                         alpha2 );

  _vprint("#  Gilbert2DAsync: B (alpha:", alpha, "beta:", beta, "alpha2:", alpha2, "beta2:", beta2, ")", "(|a2|:", a2, "|b2|:", b2, ")");

  yield* Gilbert2DAsync( v_add(p, beta2),
                         alpha,
                         v_add(beta, v_neg(beta2)) );

  _vprint("#  Gilbert2DAsync: C (alpha:", alpha, "beta:", beta, "alpha2:", alpha2, "beta2:", beta2, ")", "(|a2|:", a2, "|b2|:", b2, ")");

  yield* Gilbert2DAsync( v_add(p,
                         v_add( v_add(alpha, v_neg(d_alpha) ),
                               v_add(beta2, v_neg( d_beta) ) ) ),
                         v_neg(beta2),
                         v_add(alpha2, v_neg(alpha)) );

  return;
}

//----------------------------------------
//                             ____    __
//   ___ __ _____  ____  ___ _|_  /___/ /
//  (_-</ // / _ \/ __/ / _ `//_ </ _  / 
// /___/\_, /_//_/\__/  \_, /____/\_,_/  
//     /___/           /___/             
//----------------------------------------

function Hilbert2x2x2_d2xyz(dst_idx, cur_idx, p, alpha, beta, gamma) {
  let d_alpha = v_delta(alpha);
  let d_beta  = v_delta(beta);
  let d_gamma = v_delta(gamma);

  let d_idx = dst_idx - cur_idx;

  _vprint("#H2x2x2: d_idx:", d_idx, "dst_idx:", dst_idx, "cur_idx:", cur_idx);

  switch (d_idx) {
    case 0: return [ p[0], p[1], p[2] ]; break;
    case 1: return v_add(p, d_beta); break;
    case 2: return v_add(p, v_add(d_beta, d_gamma)); break;
    case 3: return v_add(p, d_gamma); break;
    case 4: return v_add(p, v_add(d_alpha, d_gamma)); break;
    case 5: return v_add(p, v_add(d_alpha, v_add(d_beta, d_gamma))); break;
    case 6: return v_add(p, v_add(d_alpha, d_beta)); break;
    case 7: return v_add(p, d_alpha); break;
    default: return [-1,-1,-1]; break;
  }

  return [-1,-1,-1];
}

function Hilbert2x2x2_xyz2d(idx, q, p, alpha, beta, gamma) {
  let d_alpha = v_delta(alpha);
  let d_beta  = v_delta(beta);
  let d_gamma = v_delta(gamma);

  let lu = [ 0, 7,  1, 6,  3, 4,  2, 5 ];

  let m_qp = v_add(q, v_neg(p));

  let dxyz = [
    dot_v(d_alpha, m_qp),
    dot_v(d_beta, m_qp),
    dot_v(d_gamma, m_qp)
  ];

  let p_idx = (4*dxyz[2]) + (2*dxyz[1]) + dxyz[0];

  _vprint("#Hilbert2x2x2_xyz2d: idx:", idx, "q:", q, "p:", p, "alpha:", alpha, "beta:", beta, "gamma:", gamma, "dxyz:", dxyz);

  if ((p_idx < 0) ||
      (p_idx > 7)) {
    return -1;
  }

  return idx + lu[p_idx];
}

//------------------------------------------------
//    ____    __  _______       _____             
//   |_  /___/ / / __/ _ \  ___/ /_  |_ ____ _____
//  _/_ </ _  / _\ \/ // / / _  / __/\ \ / // /_ /
// /____/\_,_/ /___/\___/  \_,_/____/_\_\\_, //__/
//                                      /___/     
//------------------------------------------------

function Gilbert3DS0_d2xyz(dst_idx, cur_idx, p, alpha, beta, gamma) {

  let alpha2  = v_div2(alpha);
  let d_alpha = v_delta(alpha);

  let a   = abs_sum_v(alpha);
  let a2  = abs_sum_v(alpha2);

  let b   = abs_sum_v(beta);
  let g   = abs_sum_v(gamma);

  _vprint("#S0_d2xyz (a:", abs_sum_v(alpha), "b:", abs_sum_v(beta), "g:", abs_sum_v(gamma), ")");

  if ((a > 2) && ((a2 % 2)==1)) {
    alpha2 = v_add(alpha2, d_alpha);
    a2 = abs_sum_v(alpha2);
  }

  let nxt_idx = cur_idx + (a2*b*g);

  _vprint("#S0.A_d2xyz {dst:",dst_idx, "cur:", cur_idx, "nxt:", nxt_idx, "}");

  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {

    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            p,
                            alpha2, beta, gamma );
  }
  cur_idx = nxt_idx;

  _vprint("#S0.B_d2xyz");

  return Gilbert3D_d2xyz( dst_idx, cur_idx,
                          v_add(p, alpha2),
                          v_add(alpha, v_neg(alpha2)), beta, gamma );
}

//---------------------------------------------------
//    ____    __  _______                  ___     __
//   |_  /___/ / / __/ _ \  __ ____ _____ |_  |___/ /
//  _/_ </ _  / _\ \/ // /  \ \ / // /_ // __// _  / 
// /____/\_,_/ /___/\___/  /_\_\\_, //__/____/\_,_/  
//                             /___/                 
//---------------------------------------------------

function Gilbert3DS0_xyz2d( cur_idx, q, p, alpha, beta, gamma ) {

  let alpha2  = v_div2(alpha);
  let d_alpha = v_delta(alpha);

  let a   = abs_sum_v(alpha);
  let a2  = abs_sum_v(alpha2);

  let b   = abs_sum_v(beta);
  let g   = abs_sum_v(gamma);

  _vprint("#S0_xyz2d (a:", abs_sum_v(alpha), "b:", abs_sum_v(beta), "g:", abs_sum_v(gamma), ")");

  if ((a > 2) && ((a2 % 2)==1)) {
    alpha2 = v_add(alpha2, d_alpha);
    a2 = abs_sum_v(alpha2);
  }

  _vprint("#S0.A_xyz2d");

  let u = v_clone(p);
  if (_inBounds( q, p, alpha2, beta, gamma )) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            alpha2, beta, gamma );
  }
  cur_idx += (a2*b*g);

  _vprint("#S0.B_xyz2d");

  u = v_add(p, alpha2);
  return Gilbert3D_xyz2d( cur_idx, q,
                          u,
                          v_add(alpha, v_neg(alpha2)), beta, gamma );
}

//----------------------------------------------
//    ____    __  _______     _____             
//   |_  /___/ / / __<  / ___/ /_  |_ ____ _____
//  _/_ </ _  / _\ \ / / / _  / __/\ \ / // /_ /
// /____/\_,_/ /___//_/  \_,_/____/_\_\\_, //__/
//                                    /___/     
//----------------------------------------------

function Gilbert3DS1_d2xyz( dst_idx, cur_idx, p, alpha, beta, gamma ) {
  let alpha2 = v_div2(alpha);
  let gamma3 = v_divq(gamma, 3);

  let d_alpha = v_delta(alpha);
  let d_gamma = v_delta(gamma);

  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);
  let g = abs_sum_v(gamma);

  let a2 = abs_sum_v(alpha2);
  let g3 = abs_sum_v(gamma3);

  _vprint("#S1_d2xyz (a:", abs_sum_v(alpha), "b:", abs_sum_v(beta), "g:", abs_sum_v(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 1)) {
    alpha2 = v_add(alpha2, d_alpha);
    a2 = abs_sum_v(alpha2);
  }

  if ((g > 2) && ((g3 % 2) == 1)) {
    gamma3 = v_add(gamma3, d_gamma);
    g3 = abs_sum_v(gamma3);
  }

  _vprint("#S1.A_d2xyz");

  let nxt_idx = cur_idx + (g3*a2*b);
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            p,
                            gamma3, alpha2, beta );
  }
  cur_idx = nxt_idx;

  _vprint("#S1.B_d2xyz");

  nxt_idx = cur_idx + (a*b*(g-g3));
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            v_add(p, gamma3),
                            alpha, beta, v_add(gamma, v_neg(gamma3)) );
  }
  cur_idx = nxt_idx;

  _vprint("#S1.C_d2xyz");

  return Gilbert3D_d2xyz( dst_idx, cur_idx,
                          v_add(p, v_add( v_add(alpha, v_neg(d_alpha)), v_add(gamma3, v_neg(d_gamma)) ) ),
                          v_neg(gamma3), v_neg(v_add(alpha, v_neg(alpha2))), beta );
}

//-------------------------------------------------
//    ____    __  _______                ___     __
//   |_  /___/ / / __<  / __ ____ _____ |_  |___/ /
//  _/_ </ _  / _\ \ / /  \ \ / // /_ // __// _  / 
// /____/\_,_/ /___//_/  /_\_\\_, //__/____/\_,_/  
//                           /___/                 
//-------------------------------------------------

function Gilbert3DS1_xyz2d( cur_idx, q, p, alpha, beta, gamma ) {
  let alpha2 = v_div2(alpha);
  let gamma3 = v_divq(gamma, 3);

  let d_alpha = v_delta(alpha);
  let d_gamma = v_delta(gamma);

  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);
  let g = abs_sum_v(gamma);

  let a2 = abs_sum_v(alpha2);
  let g3 = abs_sum_v(gamma3);

  _vprint("#S1_xyz2d (a:", abs_sum_v(alpha), "b:", abs_sum_v(beta), "g:", abs_sum_v(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 1)) {
    alpha2 = v_add(alpha2, d_alpha);
    a2 = abs_sum_v(alpha2);
  }

  if ((g > 2) && ((g3 % 2) == 1)) {
    gamma3 = v_add(gamma3, d_gamma);
    g3 = abs_sum_v(gamma3);
  }

  _vprint("#S1.A_xyz2d");

  let u = v_clone(p);
  if (_inBounds(q, u, gamma3, alpha2, beta )) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            gamma3, alpha2, beta );
  }
  cur_idx += (g3*a2*b);

  _vprint("#S1.B_xyz2d");

  u = v_add(p, gamma3);
  if (_inBounds(q, u, alpha, beta, v_add(gamma, v_neg(gamma3)) )) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            alpha, beta, v_add(gamma, v_neg(gamma3)) );

  }
  cur_idx += (a*b*(g-g3));

  _vprint("#S1.C_xyz2d");

  u = v_add(p, v_add( v_add(alpha, v_neg(d_alpha)), v_add(gamma3, v_neg(d_gamma)) ) );
  return Gilbert3D_xyz2d( cur_idx, q,
                          u,
                          v_neg(gamma3), v_neg(v_add(alpha, v_neg(alpha2))), beta );
}



//------------------------------------------------
//    ____    __  _______       _____             
//   |_  /___/ / / __/_  |  ___/ /_  |_ ____ _____
//  _/_ </ _  / _\ \/ __/  / _  / __/\ \ / // /_ /
// /____/\_,_/ /___/____/  \_,_/____/_\_\\_, //__/
//                                      /___/     
//------------------------------------------------

function Gilbert3DS2_d2xyz( dst_idx, cur_idx, p, alpha, beta, gamma ) {
  let alpha2 = v_div2(alpha);
  let beta3 = v_divq(beta, 3);

  let d_alpha = v_delta(alpha);
  let d_beta = v_delta(beta);

  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);
  let g = abs_sum_v(gamma);

  let a2 = abs_sum_v(alpha2);
  let b3 = abs_sum_v(beta3);

  _vprint("#S2_d2xyz (a:", abs_sum_v(alpha), "b:", abs_sum_v(beta), "g:", abs_sum_v(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 1)) {
    alpha2 = v_add(alpha2, d_alpha);
    a2 = abs_sum_v(alpha2);
  }

  if ((b > 2) && ((b3 % 2) == 1)) {
    beta3 = v_add(beta3, d_beta);
    b3 = abs_sum_v(beta3);
  }

  _vprint("#S2.A_d2xyz");

  let nxt_idx = cur_idx + (b3*g*a2);
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {

    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            p,
                            beta3, gamma, alpha2 );
  }
  cur_idx = nxt_idx;

  _vprint("#S2.B_d2xyz");

  nxt_idx = cur_idx + (a*(b-b3)*g);
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {

    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            v_add(p, beta3),
                            alpha, v_add(beta, v_neg(beta3)), gamma );

  }
  cur_idx = nxt_idx;

  _vprint("#S2.C_d2xyz");

  return Gilbert3D_d2xyz( dst_idx, cur_idx,
                          v_add( p, v_add( v_add(alpha, v_neg(d_alpha)), v_add(beta3, v_neg(d_beta)) ) ),
                          v_neg(beta3), gamma, v_neg(v_add(alpha, v_neg(alpha2))) );

}


//----------------------------------------------------
//    ____    __  _______                  ___     __
//   |_  /___/ / / __/_  |  __ ____ _____ |_  |___/ /
//  _/_ </ _  / _\ \/ __/   \ \ / // /_ // __// _  / 
// /____/\_,_/ /___/____/  /_\_\\_, //__/____/\_,_/  
//                             /___/                 
//----------------------------------------------------

function Gilbert3DS2_xyz2d(cur_idx, q, p, alpha, beta, gamma) {
  let alpha2 = v_div2(alpha);
  let beta3 = v_divq(beta, 3);

  let d_alpha = v_delta(alpha);
  let d_beta = v_delta(beta);

  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);
  let g = abs_sum_v(gamma);

  let a2 = abs_sum_v(alpha2);
  let b3 = abs_sum_v(beta3);

  _vprint("#S2_xyz2d cur_idx:", cur_idx, "q:", q, "p:", p, "(a:", abs_sum_v(alpha), "b:", abs_sum_v(beta), "g:", abs_sum_v(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 1)) {
    alpha2 = v_add(alpha2, d_alpha);
    a2 = abs_sum_v(alpha2);
  }

  if ((b > 2) && ((b3 % 2) == 1)) {
    beta3 = v_add(beta3, d_beta);
    b3 = abs_sum_v(beta3);
  }

  _vprint("#S2.A_xyz2d");

  let u = v_clone(p);
  if (_inBounds(q, u, beta3, gamma, alpha2 )) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            beta3, gamma, alpha2 );
  }
  cur_idx += (b3*g*a2);

  _vprint("#S2.B_xyz2d");

  u = v_add(p, beta3);
  if (_inBounds(q, u, alpha, v_add(beta, v_neg(beta3)), gamma )) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            alpha, v_add(beta, v_neg(beta3)), gamma );
  }
  cur_idx += (a*(b-b3)*g);

  _vprint("#S2.C_xyz2d");

  u = v_add( p, v_add( v_add(alpha, v_neg(d_alpha)), v_add(beta3, v_neg(d_beta)) ) );
  return Gilbert3D_xyz2d( cur_idx, q,
                          u,
                          v_neg(beta3), gamma, v_neg(v_add(alpha, v_neg(alpha2))) );

}


//-------------------------------------------------
//    ____    __     _____       _____             
//   |_  /___/ / __ / / _ \  ___/ /_  |_ ____ _____
//  _/_ </ _  / / // / // / / _  / __/\ \ / // /_ /
// /____/\_,_/  \___/\___/  \_,_/____/_\_\\_, //__/
//                                       /___/     
//-------------------------------------------------

function Gilbert3DJ0_d2xyz(dst_idx, cur_idx, p, alpha, beta, gamma) {
  let alpha2  = v_div2(alpha);
  let beta2   = v_div2(beta);
  let gamma2  = v_div2(gamma);

  let d_alpha  = v_delta(alpha);
  let d_beta   = v_delta(beta);
  let d_gamma  = v_delta(gamma);

  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);
  let g = abs_sum_v(gamma);

  let a2 = abs_sum_v(alpha2);
  let b2 = abs_sum_v(beta2);
  let g2 = abs_sum_v(gamma2);

  _vprint("#J0_d2xyz (a:", abs_sum_v(alpha), "b:", abs_sum_v(beta), "g:", abs_sum_v(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 1)) { alpha2 = v_add(alpha2, d_alpha); a2 = abs_sum_v(alpha2); }
  if ((b > 2) && ((b2 % 2) == 1)) { beta2  = v_add(beta2, d_beta);   b2 = abs_sum_v(beta2); }
  if ((g > 2) && ((g2 % 2) == 1)) { gamma2 = v_add(gamma2, d_gamma); g2 = abs_sum_v(gamma2); }

  _vprint("#J0.A_d2xyz");

  let nxt_idx = cur_idx + (b2*g2*a2);
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            p,
                            beta2, gamma2, alpha2 );
  }
  cur_idx = nxt_idx;

  _vprint("#J0.B_d2xyz");

  nxt_idx = cur_idx + (g*a2*(b-b2));
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            v_add(p, beta2),
                            gamma, alpha2, v_add(beta, v_neg(beta2)) );
  }
  cur_idx = nxt_idx;

  _vprint("#J0.C_d2xyz");

  nxt_idx = cur_idx + (a*b2*(g-g2));
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            v_add( p, v_add( v_add(beta2, v_neg(d_beta)), v_add(gamma, v_neg(d_gamma)) ) ),
                            alpha, v_neg(beta2), v_neg( v_add(gamma, v_neg(gamma2)) ) );
  }
  cur_idx = nxt_idx;

  _vprint("#J0.D_d2xyz");

  nxt_idx = cur_idx + (g*(a-a2)*(b-b2));
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            v_add( p, v_add( v_add(alpha, v_neg(d_alpha)), v_add(beta2, v_add(gamma, v_neg(d_gamma))) ) ),
                            v_neg(gamma), v_neg( v_add(alpha, v_neg(alpha2)) ), v_add(beta, v_neg(beta2)) );
  }
  cur_idx = nxt_idx;

  _vprint("#J0.E_d2xyz");

  return Gilbert3D_d2xyz( dst_idx, cur_idx,
                          v_add( p, v_add( v_add(alpha, v_neg(d_alpha)), v_add(beta2, v_neg(d_beta)) ) ),
                          v_neg(beta2), gamma2, v_neg( v_add(alpha, v_neg(alpha2)) ) );
}

//----------------------------------------------------
//    ____    __     _____                  ___     __
//   |_  /___/ / __ / / _ \  __ ____ _____ |_  |___/ /
//  _/_ </ _  / / // / // /  \ \ / // /_ // __// _  / 
// /____/\_,_/  \___/\___/  /_\_\\_, //__/____/\_,_/  
//                              /___/                 
//----------------------------------------------------

function Gilbert3DJ0_xyz2d(cur_idx, q, p, alpha, beta, gamma) {
  let alpha2  = v_div2(alpha);
  let beta2   = v_div2(beta);
  let gamma2  = v_div2(gamma);

  let d_alpha  = v_delta(alpha);
  let d_beta   = v_delta(beta);
  let d_gamma  = v_delta(gamma);

  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);
  let g = abs_sum_v(gamma);

  let a2 = abs_sum_v(alpha2);
  let b2 = abs_sum_v(beta2);
  let g2 = abs_sum_v(gamma2);

  _vprint("#J0_xyz2d (a:", abs_sum_v(alpha), "b:", abs_sum_v(beta), "g:", abs_sum_v(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 1)) { alpha2 = v_add(alpha2, d_alpha); a2 = abs_sum_v(alpha2); }
  if ((b > 2) && ((b2 % 2) == 1)) { beta2  = v_add(beta2, d_beta);   b2 = abs_sum_v(beta2); }
  if ((g > 2) && ((g2 % 2) == 1)) { gamma2 = v_add(gamma2, d_gamma); g2 = abs_sum_v(gamma2); }

  _vprint("#J0.A_xyz2d");

  let u = v_clone(p);
  if (_inBounds(q, u, beta2, gamma2, alpha2)) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            beta2, gamma2, alpha2 );
  }
  cur_idx += (b2*g2*a2);

  _vprint("#J0.B_xyz2d");

  u = v_add(p, beta2);
  if (_inBounds(q, u, gamma, alpha2, v_add(beta, v_neg(beta2)) )) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            gamma, alpha2, v_add(beta, v_neg(beta2)) );
  }
  cur_idx += (g*a2*(b-b2));

  _vprint("#J0.C_xyz2d");

  u = v_add( p, v_add( v_add(beta2, v_neg(d_beta)), v_add(gamma, v_neg(d_gamma)) ) );
  if (_inBounds(q, u, alpha, v_neg(beta2), v_neg( v_add(gamma, v_neg(gamma2)) ) )) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            alpha, v_neg(beta2), v_neg( v_add(gamma, v_neg(gamma2)) ) );
  }
  cur_idx += (a*b2*(g-g2));

  _vprint("#J0.D_xyz2d");

  u = v_add( p, v_add( v_add(alpha, v_neg(d_alpha)), v_add(beta2, v_add(gamma, v_neg(d_gamma))) ) );
  if (_inBounds(q, u, v_neg(gamma), v_neg( v_add(alpha, v_neg(alpha2)) ), v_add(beta, v_neg(beta2)) )) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            v_neg(gamma), v_neg( v_add(alpha, v_neg(alpha2)) ), v_add(beta, v_neg(beta2)) );
  }
  cur_idx += (g*(a-a2)*(b-b2));

  _vprint("#J0.E_xyz2d");

  u = v_add( p, v_add( v_add(alpha, v_neg(d_alpha)), v_add(beta2, v_neg(d_beta)) ) );
  return Gilbert3D_xyz2d( cur_idx, q,
                          u,
                          v_neg(beta2), gamma2, v_neg( v_add(alpha, v_neg(alpha2)) ) );
}

//-----------------------------------------------
//    ____    __     _____     _____             
//   |_  /___/ / __ / <  / ___/ /_  |_ ____ _____
//  _/_ </ _  / / // // / / _  / __/\ \ / // /_ /
// /____/\_,_/  \___//_/  \_,_/____/_\_\\_, //__/
//                                     /___/     
//-----------------------------------------------

function Gilbert3DJ1_d2xyz(dst_idx, cur_idx, p, alpha, beta, gamma) {

  let alpha2  = v_div2(alpha);
  let beta2   = v_div2(beta);
  let gamma2  = v_div2(gamma);

  let d_alpha  = v_delta(alpha);
  let d_beta   = v_delta(beta);
  let d_gamma  = v_delta(gamma);

  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);
  let g = abs_sum_v(gamma);

  let a2 = abs_sum_v(alpha2);
  let b2 = abs_sum_v(beta2);
  let g2 = abs_sum_v(gamma2);

  _vprint("#J1_d2xyz (a:", abs_sum_v(alpha), "b:", abs_sum_v(beta), "g:", abs_sum_v(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 0)) { alpha2 = v_add(alpha2, d_alpha); a2 = abs_sum_v(alpha2); }
  if ((b > 2) && ((b2 % 2) == 1)) { beta2  = v_add(beta2, d_beta);   b2 = abs_sum_v(beta2); }
  if ((g > 2) && ((g2 % 2) == 1)) { gamma2 = v_add(gamma2, d_gamma); g2 = abs_sum_v(gamma2); }

  _vprint("#J1.A_d2xyz");

  let nxt_idx = cur_idx + (g2*a2*b2);
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            p,
                            gamma2, alpha2, beta2 );
  }
  cur_idx = nxt_idx;

  _vprint("#J1.B_d2xyz");

  nxt_idx = cur_idx + (b*(g-g2)*a2);
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            v_add( p, gamma2 ),
                            beta, v_add(gamma, v_neg(gamma2)), alpha2 );
  }
  cur_idx = nxt_idx;

  _vprint("#J1.C_d2xyz");

  nxt_idx = cur_idx + (a*(b-b2)*g2);
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            v_add( p, v_add( v_add(gamma2, v_neg(d_gamma)), v_add(beta, v_neg(d_beta)) ) ),
                            alpha, v_neg(v_add(beta, v_neg(beta2))), v_neg(gamma2) );
  }
  cur_idx = nxt_idx;

  _vprint("#J1.D_d2xyz");

  nxt_idx = cur_idx + (b*(g-g2)*(a-a2));
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            v_add( p , v_add( v_add(alpha, v_neg(d_alpha)), v_add( v_add(beta, v_neg(d_beta)), gamma2 ) ) ),
                            v_neg(beta), v_add(gamma, v_neg(gamma2)), v_neg(v_add(alpha, v_neg(alpha2))) );
  }
  cur_idx = nxt_idx;

  _vprint("#J1.E_d2xyz");

  return Gilbert3D_d2xyz( dst_idx, cur_idx,
                          v_add( p, v_add( v_add(alpha, v_neg(d_alpha)), v_add(gamma2, v_neg(d_gamma)) ) ),
                          v_neg(gamma2), v_neg(v_add(alpha, v_neg(alpha2))), beta2 );

}

//--------------------------------------------------
//    ____    __     _____                ___     __
//   |_  /___/ / __ / <  / __ ____ _____ |_  |___/ /
//  _/_ </ _  / / // // /  \ \ / // /_ // __// _  / 
// /____/\_,_/  \___//_/  /_\_\\_, //__/____/\_,_/  
//                            /___/                 
//--------------------------------------------------

function Gilbert3DJ1_xyz2d(cur_idx, q, p, alpha, beta, gamma) {

  let alpha2  = v_div2(alpha);
  let beta2   = v_div2(beta);
  let gamma2  = v_div2(gamma);

  let d_alpha  = v_delta(alpha);
  let d_beta   = v_delta(beta);
  let d_gamma  = v_delta(gamma);

  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);
  let g = abs_sum_v(gamma);

  let a2 = abs_sum_v(alpha2);
  let b2 = abs_sum_v(beta2);
  let g2 = abs_sum_v(gamma2);

  _vprint("#J1_xyz2d (a:", abs_sum_v(alpha), "b:", abs_sum_v(beta), "g:", abs_sum_v(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 0)) { alpha2 = v_add(alpha2, d_alpha); a2 = abs_sum_v(alpha2); }
  if ((b > 2) && ((b2 % 2) == 1)) { beta2  = v_add(beta2, d_beta);   b2 = abs_sum_v(beta2); }
  if ((g > 2) && ((g2 % 2) == 1)) { gamma2 = v_add(gamma2, d_gamma); g2 = abs_sum_v(gamma2); }

  _vprint("#J1.A_xyz2d");

  let u = v_clone(p);
  if (_inBounds(q, u, gamma2, alpha2, beta2)) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            p,
                            gamma2, alpha2, beta2 );
  }
  cur_idx += (g2*a2*b2);

  _vprint("#J1.B_xyz2d");

  u = v_add(p, gamma2);
  if (_inBounds(q, u, beta, v_add(gamma, v_neg(gamma2)), alpha2)) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            beta, v_add(gamma, v_neg(gamma2)), alpha2 );
  }
  cur_idx += b*(g-g2)*a2;

  _vprint("#J1.C_xyz2d");

  u = v_add( p, v_add( v_add(gamma2, v_neg(d_gamma)), v_add(beta, v_neg(d_beta)) ) );
  if (_inBounds(q, u, alpha, v_neg(v_add(beta, v_neg(beta2))), v_neg(gamma2) )) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            alpha, v_neg(v_add(beta, v_neg(beta2))), v_neg(gamma2) );
  }
  cur_idx += a*(b-b2)*g2;

  _vprint("#J1.D_xyz2d");

  u = v_add( p , v_add( v_add(alpha, v_neg(d_alpha)), v_add( v_add(beta, v_neg(d_beta)), gamma2 ) ) );
  if (_inBounds(q, u, v_neg(beta), v_add(gamma, v_neg(gamma2)), v_neg(v_add(alpha, v_neg(alpha2))) )) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            v_neg(beta), v_add(gamma, v_neg(gamma2)), v_neg(v_add(alpha, v_neg(alpha2))) );
  }
  cur_idx += (b*(g-g2)*(a-a2));

  _vprint("#J1.E_xyz2d");

  u = v_add( p, v_add( v_add(alpha, v_neg(d_alpha)), v_add(gamma2, v_neg(d_gamma)) ) );
  return Gilbert3D_xyz2d( cur_idx, q,
                          u,
                          v_neg(gamma2), v_neg(v_add(alpha, v_neg(alpha2))), beta2 );

}

//-----------------------------------------------
//    ____    __     _____       _____             
//   |_  /___/ / __ / /_  |  ___/ /_  |_ ____ _____
//  _/_ </ _  / / // / __/  / _  / __/\ \ / // /_ /
// /____/\_,_/  \___/____/  \_,_/____/_\_\\_, //__/
//                                       /___/     
//-----------------------------------------------

function Gilbert3DJ2_d2xyz(dst_idx, cur_idx, p, alpha, beta, gamma) {

  let alpha2  = v_div2(alpha);
  let beta2   = v_div2(beta);
  let gamma2  = v_div2(gamma);

  let d_alpha  = v_delta(alpha);
  let d_beta   = v_delta(beta);
  let d_gamma  = v_delta(gamma);

  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);
  let g = abs_sum_v(gamma);

  let a2 = abs_sum_v(alpha2);
  let b2 = abs_sum_v(beta2);
  let g2 = abs_sum_v(gamma2);

  _vprint("#J2_d2xyz (a:", abs_sum_v(alpha), "b:", abs_sum_v(beta), "g:", abs_sum_v(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 0)) { alpha2 = v_add(alpha2, d_alpha); a2 = abs_sum_v(alpha2); }
  if ((b > 2) && ((b2 % 2) == 1)) { beta2  = v_add(beta2, d_beta);   b2 = abs_sum_v(beta2); }
  if ((g > 2) && ((g2 % 2) == 1)) { gamma2 = v_add(gamma2, d_gamma); g2 = abs_sum_v(gamma2); }

  _vprint("#J2.A_d2xyz");

  let nxt_idx = cur_idx + (b2*g*a2);
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            p,
                            beta2, gamma, alpha2 );
  }
  cur_idx = nxt_idx;

  _vprint("#J2.B_d2xyz");

  nxt_idx = cur_idx + (g2*a*(b-b2));
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            v_add(p, beta2),
                            gamma2, alpha, v_add(beta, v_neg(beta2)) );
  }
  cur_idx = nxt_idx;

  _vprint("#J2.C_d2xyz");

  nxt_idx = cur_idx + (a*(b-b2)*(g-g2));
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            v_add(p, v_add(beta2, gamma2)),
                            alpha, v_add(beta, v_neg(beta2)), v_add(gamma, v_neg(gamma2)) );
  }
  cur_idx = nxt_idx;

  _vprint("#J2.D_d2xyz");

  nxt_idx = cur_idx + (b2*(g-g2)*(a-a2));
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            v_add( p, v_add( v_add( alpha, v_neg(d_alpha) ), v_add( v_add(beta2, v_neg(d_beta)), gamma2 ) ) ),
                            v_neg(beta2), v_add(gamma, v_neg(gamma2)), v_neg(v_add(alpha, v_neg(alpha2))) );
  }
  cur_idx = nxt_idx;

  _vprint("#J2.E_d2xyz");

  return Gilbert3D_d2xyz( dst_idx, cur_idx,
                          v_add( p, v_add( v_add(alpha, v_neg(d_alpha)), v_add( gamma2, v_neg(d_gamma) ) ) ),
                          v_neg(gamma2), v_neg(v_add(alpha, v_neg(alpha2))), beta2);

}

//----------------------------------------------------
//    ____    __     _____                  ___     __
//   |_  /___/ / __ / /_  |  __ ____ _____ |_  |___/ /
//  _/_ </ _  / / // / __/   \ \ / // /_ // __// _  / 
// /____/\_,_/  \___/____/  /_\_\\_, //__/____/\_,_/  
//                              /___/                 
//----------------------------------------------------


function Gilbert3DJ2_xyz2d(cur_idx, q, p, alpha, beta, gamma) {

  let alpha2  = v_div2(alpha);
  let beta2   = v_div2(beta);
  let gamma2  = v_div2(gamma);

  let d_alpha  = v_delta(alpha);
  let d_beta   = v_delta(beta);
  let d_gamma  = v_delta(gamma);

  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);
  let g = abs_sum_v(gamma);

  let a2 = abs_sum_v(alpha2);
  let b2 = abs_sum_v(beta2);
  let g2 = abs_sum_v(gamma2);


  _vprint("#J2_xyz2d (a:", abs_sum_v(alpha), "b:", abs_sum_v(beta), "g:", abs_sum_v(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 0)) { alpha2 = v_add(alpha2, d_alpha); a2 = abs_sum_v(alpha2); }
  if ((b > 2) && ((b2 % 2) == 1)) { beta2  = v_add(beta2, d_beta);   b2 = abs_sum_v(beta2); }
  if ((g > 2) && ((g2 % 2) == 1)) { gamma2 = v_add(gamma2, d_gamma); g2 = abs_sum_v(gamma2); }

  _vprint("#J2.A_xyz2d");

  let u = v_clone(p);
  if (_inBounds(q, u, beta2, gamma, alpha2)) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            beta2, gamma, alpha2 );
  }
  cur_idx += (b2*g*a2);

  _vprint("#J2.B_xyz2d");

  u = v_add(p, beta2);
  if (_inBounds(q, u, gamma2, alpha, v_add(beta, v_neg(beta2)))) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            gamma2, alpha, v_add(beta, v_neg(beta2)) );
  }
  cur_idx += (g2*a*(b-b2));

  _vprint("#J2.C_xyz2d");

  u = v_add(p, v_add(beta2, gamma2));
  if (_inBounds(q, u, alpha, v_add(beta, v_neg(beta2)), v_add(gamma, v_neg(gamma2)))) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            alpha, v_add(beta, v_neg(beta2)), v_add(gamma, v_neg(gamma2)) );
  }
  cur_idx += (a*(b-b2)*(g-g2));

  _vprint("#J2.D_xyz2d");

  u = v_add( p, v_add( v_add( alpha, v_neg(d_alpha) ), v_add( v_add(beta2, v_neg(d_beta)), gamma2 ) ) );
  if (_inBounds(q, u, v_neg(beta2), v_add(gamma, v_neg(gamma2)), v_neg(v_add(alpha, v_neg(alpha2))))) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            v_neg(beta2), v_add(gamma, v_neg(gamma2)), v_neg(v_add(alpha, v_neg(alpha2))) );
  }
  cur_idx += (b2*(g-g2)*(a-a2));

  _vprint("#J2.E_xyz2d");

  u = v_add( p, v_add( v_add(alpha, v_neg(d_alpha)), v_add( gamma2, v_neg(d_gamma) ) ) );
  return Gilbert3D_xyz2d( cur_idx, q,
                          u,
                          v_neg(gamma2), v_neg(v_add(alpha, v_neg(alpha2))), beta2);

}

//--------------------------------------------------------------
//   ______ ____           __  ____ ___       _____             
//  / ___(_) / /  ___ ____/ /_|_  // _ \  ___/ /_  |_ ____ _____
// / (_ / / / _ \/ -_) __/ __//_ </ // / / _  / __/\ \ / // /_ /
// \___/_/_/_.__/\__/_/  \__/____/____/  \_,_/____/_\_\\_, //__/
//                                                    /___/     
//--------------------------------------------------------------

// Gilbert3d d2xyz
//
function Gilbert3D_d2xyz(dst_idx, cur_idx, p, alpha, beta, gamma) {
  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);
  let g = abs_sum_v(gamma);

  let a0 = (a % 2);
  let b0 = (b % 2);
  let g0 = (g % 2);

  _vprint("#Gilbert3D_d2xyz: dst_idx:", dst_idx, "cur_idx:", cur_idx, "p:", p, "a:", alpha, "b:", beta, "g:", gamma);

  // base cases
  //
  if ((a == 2) &&
      (b == 2) &&
      (g == 2)) {

    _vprint("#H2x2x2_d2xyz:");

    return Hilbert2x2x2_d2xyz(dst_idx, cur_idx, p, alpha, beta, gamma);
  }

  if (a == 1) { return Gilbert2D_d2xyz(dst_idx, cur_idx, p, beta, gamma); }
  if (b == 1) { return Gilbert2D_d2xyz(dst_idx, cur_idx, p, alpha, gamma); }
  if (g == 1) { return Gilbert2D_d2xyz(dst_idx, cur_idx, p, alpha, beta); }

  // eccentric cases
  //
  if (((3*a) > (5*b)) &&
      ((3*a) > (5*g))) {

    _vprint("#S0_d2xyz:");

    return Gilbert3DS0_d2xyz(dst_idx, cur_idx, p, alpha, beta, gamma);
  }

  if (((2*b) > (3*g)) ||
      ((2*b) > (3*a))) {

    _vprint("#S2_d2xyz:");

    return Gilbert3DS2_d2xyz(dst_idx, cur_idx, p, alpha, beta, gamma);
  }

  if ((2*g) > (3*b)) {

    _vprint("#S1_d2xyz:");

    return Gilbert3DS1_d2xyz(dst_idx, cur_idx, p, alpha, beta, gamma);
  }

  // bulk recursion
  //
  if (g0 == 0) {

    _vprint("#J0_d2xyz:");

    return Gilbert3DJ0_d2xyz(dst_idx, cur_idx, p, alpha, beta, gamma);
  }

  if ((a0 == 0) || (b0 == 0)) {

    _vprint("#J1_d2xyz:");

    return Gilbert3DJ1_d2xyz(dst_idx, cur_idx, p, alpha, beta, gamma);
  }

  _vprint("#J2_d2xyz:");

  // a0 == b0 == g0 == 1
  //
  return Gilbert3DJ2_d2xyz(dst_idx, cur_idx, p, alpha, beta, gamma);
}

//-----------------------------------------------------------------
//   ______ ____           __  ____ ___                  ___     __
//  / ___(_) / /  ___ ____/ /_|_  // _ \  __ ____ _____ |_  |___/ /
// / (_ / / / _ \/ -_) __/ __//_ </ // /  \ \ / // /_ // __// _  / 
// \___/_/_/_.__/\__/_/  \__/____/____/  /_\_\\_, //__/____/\_,_/  
//                                           /___/                 
//-----------------------------------------------------------------

// Gilbert3d xyz2d
//
function Gilbert3D_xyz2d(cur_idx, q, p, alpha, beta, gamma) {
  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);
  let g = abs_sum_v(gamma);

  let a0 = (a % 2);
  let b0 = (b % 2);
  let g0 = (g % 2);

  _vprint("#Gilbert3D_xyz2d: cur_idx:", cur_idx, "p:", p, "a:", alpha, "b:", beta, "g:", gamma);

  // base cases
  //
  if ((a == 2) &&
      (b == 2) &&
      (g == 2)) {

    _vprint("#H2x2x2_xyz2d:");

    return Hilbert2x2x2_xyz2d(cur_idx, q, p, alpha, beta, gamma);
  }

  if (a == 1) { return Gilbert2D_xyz2d(cur_idx, q, p, beta, gamma); }
  if (b == 1) { return Gilbert2D_xyz2d(cur_idx, q, p, alpha, gamma); }
  if (g == 1) { return Gilbert2D_xyz2d(cur_idx, q, p, alpha, beta); }

  // eccentric cases
  //
  if (((3*a) > (5*b)) &&
      ((3*a) > (5*g))) {

    _vprint("#S0_xyz2d:");

    return Gilbert3DS0_xyz2d(cur_idx, q, p, alpha, beta, gamma);
  }

  if (((2*b) > (3*g)) ||
      ((2*b) > (3*a))) {

    _vprint("#S2_xyz2d:");

    return Gilbert3DS2_xyz2d(cur_idx, q, p, alpha, beta, gamma);
  }

  if ((2*g) > (3*b)) {

    _vprint("#S1_xyz2d:");

    return Gilbert3DS1_xyz2d(cur_idx, q, p, alpha, beta, gamma);
  }

  // bulk recursion
  //
  if (g0 == 0) {

    _vprint("#J0_xyz2d:");

    return Gilbert3DJ0_xyz2d(cur_idx, q, p, alpha, beta, gamma);
  }

  if ((a0 == 0) || (b0 == 0)) {

    _vprint("#J1_xyz2d:");

    return Gilbert3DJ1_xyz2d(cur_idx, q, p, alpha, beta, gamma);
  }

  _vprint("#J2_xyz2d:");

  // a0 == b0 == g0 == 1
  //
  return Gilbert3DJ2_xyz2d(cur_idx, q, p, alpha, beta, gamma);
}


//--------------------------------------------
//                                 ____    __
//  ___ ____ __ _____  ____  ___ _|_  /___/ /
// / _ `(_-</ // / _ \/ __/ / _ `//_ </ _  / 
// \_,_/___/\_, /_//_/\__/  \_, /____/\_,_/  
//         /___/           /___/             
//--------------------------------------------


function *Hilbert2x2x2Async(p, alpha, beta, gamma) {
  let xyz = v_clone(p);

  let d_alpha = v_delta(alpha);
  let d_beta  = v_delta(beta);
  let d_gamma = v_delta(gamma);

  yield [ xyz[0], xyz[1], xyz[2] ];

  xyz = v_add(xyz, d_beta);
  yield [ xyz[0], xyz[1], xyz[2] ];

  xyz = v_add(xyz, d_gamma);
  yield [ xyz[0], xyz[1], xyz[2] ];

  xyz = v_add(xyz, v_neg(d_beta));
  yield [ xyz[0], xyz[1], xyz[2] ];

  xyz = v_add(xyz, d_alpha);
  yield [ xyz[0], xyz[1], xyz[2] ];

  xyz = v_add(xyz, d_beta);
  yield [ xyz[0], xyz[1], xyz[2] ];

  xyz = v_add(xyz, v_neg(d_gamma));
  yield [ xyz[0], xyz[1], xyz[2] ];

  xyz = v_add(xyz, v_neg(d_beta));
  yield [ xyz[0], xyz[1], xyz[2] ];
}

function *Gilbert3DS0Async(p, alpha, beta, gamma) {

  let alpha2  = v_div2(alpha);
  let d_alpha = v_delta(alpha);

  let a   = abs_sum_v(alpha);
  let a2  = abs_sum_v(alpha2);

  _vprint("#S0 (a:", abs_sum_v(alpha), "b:", abs_sum_v(beta), "g:", abs_sum_v(gamma), ")");

  if ((a > 2) && ((a2 % 2)==1)) {
    alpha2 = v_add(alpha2, d_alpha);
  }

  _vprint("#S0.A");

  yield *Gilbert3DAsync( p,
                         alpha2, beta, gamma );

  _vprint("#S0.B");

  yield *Gilbert3DAsync( v_add(p, alpha2),
                         v_add(alpha, v_neg(alpha2)), beta, gamma );
}

function *Gilbert3DS1Async(p, alpha, beta, gamma) {
  let alpha2 = v_div2(alpha);
  let gamma3 = v_divq(gamma, 3);

  let d_alpha = v_delta(alpha);
  let d_gamma = v_delta(gamma);

  let a = abs_sum_v(alpha);
  let g = abs_sum_v(gamma);

  let a2 = abs_sum_v(alpha2);
  let g3 = abs_sum_v(gamma3);

  _vprint("#S1 (a:", abs_sum_v(alpha), "b:", abs_sum_v(beta), "g:", abs_sum_v(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 1)) {
    alpha2 = v_add(alpha2, d_alpha);
  }

  if ((g > 2) && ((g3 % 2) == 1)) {
    gamma3 = v_add(gamma3, d_gamma);
  }

  _vprint("#S1.A");

  yield *Gilbert3DAsync( p,
                         gamma3, alpha2, beta );

  _vprint("#S1.B");

  yield *Gilbert3DAsync( v_add(p, gamma3),
                         alpha, beta, v_add(gamma, v_neg(gamma3)) );

  _vprint("#S1.C");

  yield *Gilbert3DAsync( v_add(p, v_add( v_add(alpha, v_neg(d_alpha)), v_add(gamma3, v_neg(d_gamma)) ) ),
                         v_neg(gamma3), v_neg(v_add(alpha, v_neg(alpha2))), beta );
}

function *Gilbert3DS2Async(p, alpha, beta, gamma) {
  let alpha2 = v_div2(alpha);
  let beta3 = v_divq(beta, 3);

  let d_alpha = v_delta(alpha);
  let d_beta = v_delta(beta);

  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);

  let a2 = abs_sum_v(alpha2);
  let b3 = abs_sum_v(beta3);

  _vprint("#S2 (a:", abs_sum_v(alpha), "b:", abs_sum_v(beta), "g:", abs_sum_v(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 1)) {
    alpha2 = v_add(alpha2, d_alpha);
  }

  if ((b > 2) && ((b3 % 2) == 1)) {
    beta3 = v_add(beta3, d_beta);
  }

  _vprint("#S2.A");

  yield *Gilbert3DAsync( p,
                         beta3, gamma, alpha2 );

  _vprint("#S2.B");

  yield *Gilbert3DAsync( v_add(p, beta3),
                         alpha, v_add(beta, v_neg(beta3)), gamma );

  _vprint("#S2.C");

  yield *Gilbert3DAsync( v_add( p, v_add( v_add(alpha, v_neg(d_alpha)), v_add(beta3, v_neg(d_beta)) ) ),
                         v_neg(beta3), gamma, v_neg(v_add(alpha, v_neg(alpha2))) );

}

function *Gilbert3DJ0Async(p, alpha, beta, gamma) {
  let alpha2  = v_div2(alpha);
  let beta2   = v_div2(beta);
  let gamma2  = v_div2(gamma);

  let d_alpha  = v_delta(alpha);
  let d_beta   = v_delta(beta);
  let d_gamma  = v_delta(gamma);

  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);
  let g = abs_sum_v(gamma);

  let a2 = abs_sum_v(alpha2);
  let b2 = abs_sum_v(beta2);
  let g2 = abs_sum_v(gamma2);

  _vprint("#J0 (a:", abs_sum_v(alpha), "b:", abs_sum_v(beta), "g:", abs_sum_v(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 1)) { alpha2 = v_add(alpha2, d_alpha); }
  if ((b > 2) && ((b2 % 2) == 1)) { beta2  = v_add(beta2, d_beta); }
  if ((g > 2) && ((g2 % 2) == 1)) { gamma2 = v_add(gamma2, d_gamma); }

  _vprint("#J0.A");

  yield *Gilbert3DAsync( p,
                         beta2, gamma2, alpha2 );

  _vprint("#J0.B");

  yield *Gilbert3DAsync( v_add(p, beta2),
                         gamma, alpha2, v_add(beta, v_neg(beta2)) );

  _vprint("#J0.C");

  yield *Gilbert3DAsync( v_add( p, v_add( v_add(beta2, v_neg(d_beta)), v_add(gamma, v_neg(d_gamma)) ) ),
                         alpha, v_neg(beta2), v_neg( v_add(gamma, v_neg(gamma2)) ) );

  _vprint("#J0.D");

  yield *Gilbert3DAsync( v_add( p, v_add( v_add(alpha, v_neg(d_alpha)), v_add(beta2, v_add(gamma, v_neg(d_gamma))) ) ),
                         v_neg(gamma), v_neg( v_add(alpha, v_neg(alpha2)) ), v_add(beta, v_neg(beta2)) );

  _vprint("#J0.E");

  yield *Gilbert3DAsync( v_add( p, v_add( v_add(alpha, v_neg(d_alpha)), v_add(beta2, v_neg(d_beta)) ) ),
                         v_neg(beta2), gamma2, v_neg( v_add(alpha, v_neg(alpha2)) ) );
}

function *Gilbert3DJ1Async(p, alpha, beta, gamma) {

  let alpha2  = v_div2(alpha);
  let beta2   = v_div2(beta);
  let gamma2  = v_div2(gamma);

  let d_alpha  = v_delta(alpha);
  let d_beta   = v_delta(beta);
  let d_gamma  = v_delta(gamma);

  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);
  let g = abs_sum_v(gamma);

  let a2 = abs_sum_v(alpha2);
  let b2 = abs_sum_v(beta2);
  let g2 = abs_sum_v(gamma2);

  _vprint("#J1 (a:", abs_sum_v(alpha), "b:", abs_sum_v(beta), "g:", abs_sum_v(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 0)) { alpha2 = v_add(alpha2, d_alpha); }
  if ((b > 2) && ((b2 % 2) == 1)) { beta2  = v_add(beta2, d_beta); }
  if ((g > 2) && ((g2 % 2) == 1)) { gamma2 = v_add(gamma2, d_gamma); }

  _vprint("#J1.A");

  yield *Gilbert3DAsync(p,
                        gamma2, alpha2, beta2 );


  _vprint("#J1.B");

  yield *Gilbert3DAsync(v_add( p, gamma2 ),
                        beta, v_add(gamma, v_neg(gamma2)), alpha2 );

  _vprint("#J1.C");

  yield *Gilbert3DAsync(v_add( p, v_add( v_add(gamma2, v_neg(d_gamma)), v_add(beta, v_neg(d_beta)) ) ),
                        alpha, v_neg(v_add(beta, v_neg(beta2))), v_neg(gamma2) );

  _vprint("#J1.D");

  yield *Gilbert3DAsync(v_add( p , v_add( v_add(alpha, v_neg(d_alpha)), v_add( v_add(beta, v_neg(d_beta)), gamma2 ) ) ),
                        v_neg(beta), v_add(gamma, v_neg(gamma2)), v_neg(v_add(alpha, v_neg(alpha2))) );

  _vprint("#J1.E");

  yield *Gilbert3DAsync(v_add( p, v_add( v_add(alpha, v_neg(d_alpha)), v_add(gamma2, v_neg(d_gamma)) ) ),
                        v_neg(gamma2), v_neg(v_add(alpha, v_neg(alpha2))), beta2 );

}

function *Gilbert3DJ2Async(p, alpha, beta, gamma) {

  let alpha2  = v_div2(alpha);
  let beta2   = v_div2(beta);
  let gamma2  = v_div2(gamma);

  let d_alpha  = v_delta(alpha);
  let d_beta   = v_delta(beta);
  let d_gamma  = v_delta(gamma);

  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);
  let g = abs_sum_v(gamma);

  let a2 = abs_sum_v(alpha2);
  let b2 = abs_sum_v(beta2);
  let g2 = abs_sum_v(gamma2);

  _vprint("#J2 (a:", abs_sum_v(alpha), "b:", abs_sum_v(beta), "g:", abs_sum_v(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 0)) { alpha2 = v_add(alpha2, d_alpha); }
  if ((b > 2) && ((b2 % 2) == 1)) { beta2  = v_add(beta2, d_beta); }
  if ((g > 2) && ((g2 % 2) == 1)) { gamma2 = v_add(gamma2, d_gamma); }

  _vprint("#J2.A");

  yield *Gilbert3DAsync( p,
                         beta2, gamma, alpha2 );

  _vprint("#J2.B");

  yield *Gilbert3DAsync( v_add(p, beta2),
                         gamma2, alpha, v_add(beta, v_neg(beta2)) );

  _vprint("#J2.C");

  yield *Gilbert3DAsync( v_add(p, v_add(beta2, gamma2)),
                         alpha, v_add(beta, v_neg(beta2)), v_add(gamma, v_neg(gamma2)) );

  _vprint("#J2.D");

  yield *Gilbert3DAsync( v_add( p, v_add( v_add( alpha, v_neg(d_alpha) ), v_add( v_add(beta2, v_neg(d_beta)), gamma2 ) ) ),
                         v_neg(beta2), v_add(gamma, v_neg(gamma2)), v_neg(v_add(alpha, v_neg(alpha2))) );

  _vprint("#J2.E");

  yield *Gilbert3DAsync( v_add( p, v_add( v_add(alpha, v_neg(d_alpha)), v_add( gamma2, v_neg(d_gamma) ) ) ),
                         v_neg(gamma2), v_neg(v_add(alpha, v_neg(alpha2))), beta2);

}

// Gilbert3dAsync
//
function *Gilbert3DAsync(p, alpha, beta, gamma) {
  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);
  let g = abs_sum_v(gamma);

  let a0 = (a % 2);
  let b0 = (b % 2);
  let g0 = (g % 2);

  _vprint("#Gilbert3DAsync: p:", p, "a:", alpha, "b:", beta, "g:", gamma);

  // base cases
  //
  if ((a == 2) &&
      (b == 2) &&
      (g == 2)) {

    _vprint("#H2x2x2:");

    yield *Hilbert2x2x2Async(p, alpha, beta, gamma);
    return;
  }

  if (a == 1) { yield *Gilbert2DAsync(p, beta, gamma); return; }
  if (b == 1) { yield *Gilbert2DAsync(p, alpha, gamma); return; }
  if (g == 1) { yield *Gilbert2DAsync(p, alpha, beta); return; }

  // eccentric cases
  //
  if (((3*a) > (5*b)) &&
      ((3*a) > (5*g))) {

    _vprint("#S0:");

    yield *Gilbert3DS0Async(p, alpha, beta, gamma);
    return;
  }

  if (((2*b) > (3*g)) ||
      ((2*b) > (3*a))) {

    _vprint("#S2:");

    yield *Gilbert3DS2Async(p, alpha, beta, gamma);
    return;
  }

  if ((2*g) > (3*b)) {

    _vprint("#S1:");

    yield *Gilbert3DS1Async(p, alpha, beta, gamma);
    return;
  }

  // bulk recursion
  //
  if (g0 == 0) {

    _vprint("#J0:");

    yield *Gilbert3DJ0Async(p, alpha, beta, gamma);
    return;
  }

  if ((a0 == 0) || (b0 == 0)) {

    _vprint("#J1:");

    yield *Gilbert3DJ1Async(p, alpha, beta, gamma);
    return;
  }

  _vprint("#J2:");

  // a0 == b0 == g0 == 1
  //
  yield *Gilbert3DJ2Async(p, alpha, beta, gamma);
}


//--------------------------------------------

//---
//---
//---

//---
//---
//---

// Gilbert3D++
//
function Gilbert3D(w, h, d) {
  let p = [0,0,0],
      alpha = [w,0,0],
      beta = [0,h,0],
      gamma = [0,0,d];

  let pnt = [];

  let g3xyz = Gilbert3DAsync(p, alpha, beta, gamma);
  for (let hv = g3xyz.next() ; !hv.done ; hv = g3xyz.next()) {
    let v = hv.value;
    pnt.push( [v[0], v[1], v[2]] );
  }

  return pnt;
}

function Gilbert2D(w,h) {
  let p = [0,0,0],
      alpha = [w,0,0],
      beta = [0,h,0];

  let pnt = [];

  let g2xy = Gilbert2DAsync(p, alpha, beta);
  for (let hv = g2xy.next() ; !hv.done ; hv = g2xy.next()) {
    let v = hv.value;
    pnt.push( [v[0], v[1]] );
  }

  return pnt;
}


//--------------------------------------//
//            _                         //
//  __ _ _  _(_)___ ___ _ __ _ __  ___  //
// / _` | || | (_-</ -_) '_ \ '_ \/ -_) //
// \__, |\_,_|_/__/\___| .__/ .__/\___| //
// |___/               |_|  |_|         //
//--------------------------------------//

function *Guiseppe2DAsync_line(p, alpha, beta) {
  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);

  let d_alpha = v_delta(alpha);
  let d_beta = v_delta(beta);

  if (b == 1) {
    let u = v_clone(p);
    for (let i=0; i<a; i++) {
      yield u;
      u = v_add(u, d_alpha);
    }
    return;
  }

  if (a == 1) {
    let u = v_clone(p);
    for (let i=0; i<b; i++) {
      yield u;
      u = v_add(u, d_beta);
    }
    return;
  }

  return;
}

function *Guiseppe2DAsync_base(p, alpha, beta) {

  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);

  let d_alpha = v_delta(alpha);
  let d_beta = v_delta(beta);

  let d_2x2 = [ [0,0], [1,0],
                [0,1], [1,1] ];

  let d_3x2 = [ [0,0], [0,1],
                [1,1], [1,0],
                [2,0], [2,1] ];

  let d_2x3 = [ [0,0], [1,0], [1,1],
                [0,1], [0,2],[1,2] ];

  let d_3x3 = [ [0,0], [1,0], [2,0],
                [2,1], [1,1], [0,1],
                [0,2], [1,2], [2,2] ];

  let d_m = [];

  if ((a == 1) || (b == 1)) {
    yield* Guiseppe2DAsync_line(p, alpha, beta);
    return;
  }

  if      ((a == 2) && (b == 2)) { d_m = d_2x2; }
  else if ((a == 2) && (b == 3)) { d_m = d_2x3; }
  else if ((a == 3) && (b == 2)) { d_m = d_3x2; }
  else if ((a == 3) && (b == 3)) { d_m = d_3x3; }

  for (let i = 0; i < d_m.length; i++) {
    yield v_add(p, v_add( v_mul(d_m[i][0], d_alpha), v_mul(d_m[i][1], d_beta) ) );
  }

  return;
}

// we assume point starts at p and ends at diagonal
//
function *Guiseppe2DAsync(p, alpha, beta) {
  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);

  _vprint("#Guiseppe2dasync: p:", p, "alpha:", alpha, "beta:", beta);

  if ((a == 1) || (b == 1)) {
    yield* Guiseppe2DAsync_line(p, alpha, beta);
    return;
  }

  if ((a <= 3) && (b <= 3)) {
    yield* Guiseppe2DAsync_base(p, alpha, beta);
    return;
  }

  if (b > a) {
    let u = alpha;
    alpha = beta;
    beta = u;

    a = abs_sum_v(alpha);
    b = abs_sum_v(beta);
  }

  let d_alpha = v_delta(alpha);
  let d_beta = v_delta(beta);

  let alpha3_0 = v_divq(alpha, 3);
  let alpha3_1 = v_div2( v_sub( alpha, alpha3_0 ) );
  let alpha3_2 = v_sub( alpha, v_add(alpha3_0, alpha3_1) );

  let a3_0 = abs_sum_v(alpha3_0);
  let a3_1 = abs_sum_v(alpha3_1);
  let a3_2 = abs_sum_v(alpha3_2);

  if ((b%2) == 0) {

    if ((a3_0%2) == 0) {
      alpha3_0 = v_add(alpha3_0, d_alpha);
      alpha3_1 = v_sub(alpha3_1, d_alpha);

      a3_0 = abs_sum_v(alpha3_0);
      a3_1 = abs_sum_v(alpha3_1);
    }

    if ((a3_1%2) == 0) {
      alpha3_1 = v_add(alpha3_1, d_alpha);
      alpha3_2 = v_sub(alpha3_2, d_alpha);

      a3_1 = abs_sum_v(alpha3_1);
      a3_2 = abs_sum_v(alpha3_2);
    }

  }

  let q = v_clone(p);
  yield* Guiseppe2DAsync( q,
                          alpha3_0,
                          beta );

  q = v_add( p, v_add(alpha3_0, v_sub(beta, d_beta)) );
  yield* Guiseppe2DAsync( q,
                          alpha3_1,
                          v_neg(beta) );

  q = v_add( p, v_add(alpha3_0, alpha3_1) );
  yield* Guiseppe2DAsync( q,
                          alpha3_2,
                          beta );

  return;
}

function *Guiseppe3DAsync_base(p, alpha, beta, gamma) {
  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);
  let g = abs_sum_v(gamma);


  if (a == 1) { yield* Guiseppe2DAsync(p, beta, gamma); return; }
  if (b == 1) { yield* Guiseppe2DAsync(p, alpha, gamma); return; }
  if (g == 1) { yield* Guiseppe2DAsync(p, alpha, beta); return; }

  let d_alpha = v_delta(alpha);
  let d_beta  = v_delta(beta);
  let d_gamma = v_delta(gamma);

  let s = a + b + g;

  _vprint("#  guisepped3dasync_base: s:", s);

  // 3x3x3
  //
  if (s == 9) {

    let u = v_clone(p);
    yield* Guiseppe2DAsync(u, beta, gamma);

    u = v_add(p, v_add( v_add( v_sub(beta, d_beta), v_sub(gamma, d_gamma) ), d_alpha ) );
    yield* Guiseppe2DAsync(u, v_neg(beta), v_neg(gamma));

    u = v_add(p, v_mul(2, d_alpha));
    yield* Guiseppe2DAsync(u, beta, gamma);

    return;
  }

  // 3x3x2, 3x2x3, 2x3x3
  //
  if (s == 8) {

    let sched = [
      [0,0,0], [1,0,0], [1,0,1], [0,0,1], [0,0,2], [1,0,2],
      [1,1,2], [0,1,2], [0,1,1], [1,1,1], [1,1,0], [0,1,0],
      [0,2,0], [1,2,0], [1,2,1], [0,2,1], [0,2,2], [1,2,2]
    ];

    // force alpha to be the len 2 vector
    //
    if (b == 2) {
      let _v = alpha;
      alpha = beta;
      beta = _v;

      let _d = d_alpha;
      d_alpha = d_beta;
      d_beta = _d;
    }

    else if (g == 2) {
      let _v = alpha;
      alpha = gamma;
      gamma = _v;

      let _d = d_alpha;
      d_alpha = d_gamma;
      d_gamma = _d;
    }


    let u = v_clone(p);
    for (let i=0; i<sched.length; i++) {
      u = v_add(p, v_add( v_mul(sched[i][0], d_alpha), v_add( v_mul(sched[i][1], d_beta), v_mul(sched[i][2], d_gamma) ) ) );
      yield u;
    }

    return;
  }

  else if (s == 7) {

    // s == 7 (2x2x3, 2x3x2, 3x2x2) only condition that remains
    //
    let sched = [
      [0,0,0], [0,0,1], [0,1,1], [0,1,0],
      [1,1,0], [1,1,1], [1,0,1], [1,0,0],
      [2,0,0], [2,0,1], [2,1,0], [2,1,1]
    ];

    // shuffle around so alpha is the length 3 dimension
    //

    if (b == 3) {
      let _v = alpha;
      alpha = beta;
      beta = _v;

      let _d = d_alpha;
      d_alpha = d_beta;
      d_beta = _d;
    }

    else if (g == 3) {
      let _v = alpha;
      alpha = gamma;
      gamma = _v;

      let _d = d_alpha;
      d_alpha = d_gamma;
      d_gamma = _d;
    }

    let u = v_clone(p);
    for (let i=0; i<sched.length; i++) {
      u = v_add(p, v_add( v_mul(sched[i][0], d_alpha), v_add( v_mul(sched[i][1], d_beta), v_mul(sched[i][2], d_gamma) ) ) );
      yield u;
    }

    return;
  }

  // s == 6 (2x2x2)
  
  let sched = [
    [0,0,0], [0,1,0], [0,1,1], [0,0,1],
    [1,0,1], [1,0,0], [1,1,0], [1,1,1]
  ];

  let u = v_clone(p);
  for (let i=0; i<sched.length; i++) {
    u = v_add(p, v_add( v_mul(sched[i][0], d_alpha), v_add( v_mul(sched[i][1], d_beta), v_mul(sched[i][2], d_gamma) ) ) );
    yield u;
  }

}

// we assume point starts at p and ends at
// diagonal (alpha + beta + gamma).
//
function *Guiseppe3DAsync(p, alpha, beta, gamma) {
  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);
  let g = abs_sum_v(gamma);

  _vprint("#Guiseppe3dasync: p:", p, "alpha:", alpha, "beta:", beta, "gamma:", gamma);

  if (a == 1) { yield* Guiseppe2DAsync(p, beta, gamma); return; }
  if (b == 1) { yield* Guiseppe2DAsync(p, alpha, gamma); return; }
  if (g == 1) { yield* Guiseppe2DAsync(p, alpha, beta); return; }

  if ((a <= 3) && (b <= 3) && (g <= 3)) {
    yield* Guiseppe3DAsync_base(p, alpha, beta, gamma);
    return;
  }

  // Swap to make alpha prime subdivision axis.
  // Recalculate size.
  //
  if      ((b >= a) && (b >= g)) { let u = alpha; alpha = beta;  beta = u;  }
  else if ((g >= a) && (g >= b)) { let u = alpha; alpha = gamma; gamma = u; }
  a = abs_sum_v(alpha);
  b = abs_sum_v(beta);
  g = abs_sum_v(gamma);

  let d_alpha = v_delta(alpha);
  let d_beta  = v_delta(beta);
  let d_gamma = v_delta(gamma);

  let alpha3_0 = v_divq(alpha, 3);
  let alpha3_1 = v_div2( v_sub( alpha, alpha3_0 ) );
  let alpha3_2 = v_sub( alpha, v_add(alpha3_0, alpha3_1) );

  let a3_0 = abs_sum_v(alpha3_0);
  let a3_1 = abs_sum_v(alpha3_1);
  let a3_2 = abs_sum_v(alpha3_2);

  let path_parity0 = (a3_0 + b + g) % 2;
  let path_parity1 = (a3_1 + b + g) % 2;
  let path_parity2 = (a3_2 + b + g) % 2;

  let cuboid_parity0 = (a3_0 * b * g) % 2;
  let cuboid_parity1 = (a3_1 * b * g) % 2;
  let cuboid_parity2 = (a3_2 * b * g) % 2;

  _vprint("#  path_parity:", path_parity0, path_parity1, path_parity2,
    "cuboid_parity:", cuboid_parity0, cuboid_parity1, cuboid_parity2);

  // fix parity for first and secnd subdivided
  // surface, leaving the top surface to absorb
  // the notch, if present.
  //
  if (path_parity0 != cuboid_parity0) {
    alpha3_0 = v_add(alpha3_0, d_alpha);
    alpha3_1 = v_sub(alpha3_1, d_alpha);

    a3_0 = abs_sum_v(alpha3_0);
    a3_1 = abs_sum_v(alpha3_1);

    path_parity0 = (a3_0 + b + g) % 2;
    path_parity1 = (a3_1 + b + g) % 2;

    cuboid_parity0 = (a3_0 * b * g) % 2;
    cuboid_parity1 = (a3_1 * b * g) % 2;
  }

  if (path_parity1 != cuboid_parity1) {
    alpha3_1 = v_add(alpha3_1, d_alpha);
    alpha3_2 = v_sub(alpha3_2, d_alpha);

    a3_1 = abs_sum_v(alpha3_1);
    a3_2 = abs_sum_v(alpha3_2);

    path_parity1 = (a3_1 + b + g) % 2;
    path_parity2 = (a3_2 + b + g) % 2;

    cuboid_parity1 = (a3_1 * b * g) % 2;
    cuboid_parity2 = (a3_2 * b * g) % 2;
  }

  _vprint("#  >>Guiseppe3dasync: alpha3[]:", alpha3_0, alpha3_1, alpha3_2);

  if ( a3_1 == 0 ) {

    let q = v_clone(p);
    yield* Hibiscus3DAsync( q,
                            alpha3_0,
                            beta,
                            gamma );

    q = v_add( p, alpha3_0 );
    yield* Guiseppe3DAsync( q,
                            alpha3_2,
                            beta,
                            gamma );


    return;
  }


  let q = v_clone(p);
  yield* Guiseppe3DAsync( q,
                          alpha3_0,
                          beta,
                          gamma );

  q = v_add( p, alpha3_0, v_sub(beta, d_beta), v_sub(gamma, d_gamma) );
  yield* Guiseppe3DAsync( q,
                          alpha3_1,
                          v_neg(beta),
                          v_neg(gamma) );

  q = v_add( p, alpha3_0, alpha3_1);
  yield* Guiseppe3DAsync( q,
                          alpha3_2,
                          beta,
                          gamma );

  return;
}


function Guiseppe2D(width, height) {
  let p = [0,0,0],
      alpha = [width,0,0],
      beta = [0,height,0];

  let pnt = [];

  let g2xy = Guiseppe2DAsync(p, alpha, beta);
  for (let hv = g2xy.next() ; !hv.done ; hv = g2xy.next()) {
    let v = hv.value;
    pnt.push( [v[0], v[1]] );
  }

  return pnt;
}

function Guiseppe3D(width, height,depth) {
  let p = [0,0,0],
      alpha = [width,0,0],
      beta = [0,height,0],
      gamma = [0,0,depth] ;

  let pnt = [];

  let g2xyz = Guiseppe3DAsync(p, alpha, beta, gamma);
  for (let hv = g2xyz.next() ; !hv.done ; hv = g2xyz.next()) {
    let v = hv.value;
    pnt.push( [v[0], v[1],v[2]] );
  }

  return pnt;
}

//-------------------------------
//  _    _ _    _                
// | |_ (_) |__(_)___ __ _  _ ___
// | ' \| | '_ \ (_-</ _| || (_-<
// |_||_|_|_.__/_/__/\__|\_,_/__/
//-------------------------------


// start and end point are on alpha axis
// ( p(0,0,0) -> q( |alpha|-1, 0, 0 )
//
function *Hibiscus3DAsync(p, alpha, beta, gamma) {
  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);
  let g = abs_sum_v(gamma);

  _vprint("#Hibiscus3dasync: p:", p, "alpha:", alpha, "beta:", beta, "gamma:", gamma);

  if (a == 1) { yield* Gilbert2DAsync(p, beta, gamma); return; }
  if (b == 1) { yield* Gilbert2DAsync(p, alpha, gamma); return; }
  if (g == 1) { yield* Gilbert2DAsync(p, alpha, beta); return; }

  let d_alpha = v_delta(alpha);
  let d_beta  = v_delta(beta);
  let d_gamma = v_delta(gamma);

  if ( (a==2) && (b==2) && (g==2) ) {
    yield* Hilbert2x2x2Async(p, alpha, beta, gamma);
    return;
  }

  let alpha2 = v_div2(alpha);
  let beta2 = v_div2(beta);
  let gamma2 = v_div2(gamma);

  let a2 = abs_sum_v(alpha2);
  let b2 = abs_sum_v(beta2);
  let g2 = abs_sum_v(gamma2);

  let parity_alpha  = a%2;
  let parity_beta   = b%2;
  let parity_gamma  = g%2;

  // eccentric cases
  //

  // S0
  //
  if ( ((3*a) > (5*b)) ||
       ((3*a) > (5*g)) ) {

    if ((a > 2) && ((a2 % 2) == 1)) {
      alpha2 = v_add(alpha2, d_alpha);
      a2 = abs_sum_v(alpha2);
    }

    _vprint("#  Hibiscus3dasync.S0: p:", p, "alpha:", alpha, "beta:", beta, "gamma:", gamma, "alpha2:", alpha2);

    let u = v_clone(p);
    yield* Hibiscus3DAsync( u, alpha2, beta, gamma );

    u = v_add(p, alpha2);
    yield* Hibiscus3DAsync( u, v_sub(alpha, alpha2), beta, gamma );

    return;
  }

  // S2
  //
  if ( ((2*b) >= (3*g)) ||
       ((2*b) >= (3*a)) ) {

    let beta3 = v_divq(beta, 3);
    let b3 = abs_sum_v(beta3);

    if ((a > 2) && ((a2 % 2) == 1)) {
      alpha2 = v_add(alpha2, d_alpha);
      a2 = abs_sum_v(alpha2);
    }

    _vprint("#  Hibiscus3dasync.S1: p:", p, "alpha:", alpha, "beta:", beta, "gamma:", gamma, "alpha2:", alpha2, "beta3:", beta3);

    if ((b > 2) && ((b3 % 2) == 1)) {
      beta3 = v_add(beta3, d_beta);
      b3 = abs_sum_v(beta3);
    }

    let u = v_clone(p);
    yield *Hibiscus3DAsync( u, beta3, gamma, alpha2 );

    u = v_add(p, beta3);
    yield *Hibiscus3DAsync( u, alpha, v_sub(beta, beta3), gamma );

    u = v_add( p, v_sub(alpha, d_alpha), v_sub(beta3, d_beta) );
    yield *Hibiscus3DAsync( u, v_neg(beta3), gamma, v_sub(alpha2, alpha) );


    return;
  }

  // S1
  //
  if ((2*g) >= (3*b)) {

    let gamma3 = v_divq(gamma, 3);
    let g3 = abs_sum_v(gamma3);

    if ((a > 2) && ((a2 % 2) == 1)) {
      alpha2 = v_add(alpha2, d_alpha);
      a2 = abs_sum_v(alpha2);
    }

    if ((g > 2) && ((g3 % 2) == 1)) {
      gamma3 = v_add(gamma3, d_gamma);
      g3 = abs_sum_v(gamma3);
    }

    _vprint("#  Hibiscus3dasync.S2: p:", p, "alpha:", alpha, "beta:", beta, "gamma:", gamma, "alpha2:", alpha2, "gamma3:", gamma3);

    let u = v_clone(p);
    yield *Hibiscus3DAsync( u, gamma3, alpha2, beta );

    u = v_add(p, gamma3);
    yield *Hibiscus3DAsync( u, alpha, beta, v_sub(gamma, gamma3) );

    u = v_add( p, v_sub(alpha, d_alpha), v_sub(gamma3, d_gamma) );
    yield *Hibiscus3DAsync( u, v_neg(gamma3), v_sub(alpha2, alpha), beta );

    return;
  }


  if ( (b > 2) &&
       ((b2%2) != parity_gamma) ) {
    beta2 = v_add(beta2, d_beta);
    b2 = abs_sum_v(beta2);
  }

  if ( (g > 2) &&
       ((g2%2) == parity_beta) ) {
    gamma2 = v_add(gamma2, d_gamma);
    g2 = abs_sum_v(gamma2);
  }

  _vprint("#  Hibiscus3dasync: p:", p, "alpha:", alpha, "beta:", beta, "gamma:", gamma, "a2:", alpha2, "b2:", beta2, "g2:", gamma2);

  _vprint("#    Hibiscus3dasync.A");

  let u = v_clone(p);
  yield* Peony3DAsync(u, beta, gamma2, alpha2);

  _vprint("#    Hibiscus3dasync.B");

  u = v_add(p, v_sub(beta, d_beta), gamma2);
  yield* Peony3DAsync(u, v_sub(gamma, gamma2), v_sub(beta2, beta), alpha2);

  _vprint("#    Hibiscus3dasync.C");

  u = v_add(p, v_sub(beta2, d_beta), v_sub(gamma, d_gamma));
  yield* Hibiscus3DAsync(u, alpha, v_neg(beta2), v_sub(gamma2, gamma));

  _vprint("#    Hibiscus3dasync.D");

  u = v_add(p, v_sub(alpha, d_alpha), beta2, v_sub(gamma, d_gamma));
  yield* Peony3DAsync(u, v_sub(beta, beta2), v_sub(gamma2, gamma), v_sub(alpha2, alpha));

  _vprint("#    Hibiscus3dasync.E");

  u = v_add(p, v_sub(alpha, d_alpha), v_sub(beta, d_beta), v_sub(gamma2, d_gamma));
  yield* Peony3DAsync(u, v_neg(beta), v_neg(gamma2), v_sub(alpha2, alpha));

  return;
}

function Hibiscus3D(width, height, depth) {
  let p = [0,0,0],
      alpha = [width,0,0],
      beta = [0,height,0],
      gamma = [0,0,depth];

  let pnt = [];

  let p3xyz = Hibiscus3DAsync(p, alpha, beta, gamma);
  for (let hv = p3xyz.next() ; !hv.done ; hv = p3xyz.next()) {
    let v = hv.value;
    pnt.push(v);
  }

  return pnt;
}



//--------------------------//
//  _ __  ___ ___ _ _ _  _  //
// | '_ \/ -_) _ \ ' \ || | //
// | .__/\___\___/_||_\_, | //
// |_|                |__/  //
//--------------------------//

/*
 * abg | |a|+|b|-1 | |a|+|b|+|g| | |a|.|b|.|g| | P | D |
 * -----------------------------------------------------
 * 000 |    1      |      0      |      0      | x |   |
 * 001 |    1      |      1      |      0      | x | x |
 * 010 |    0      |      1      |      0      |   | x |
 * 011 |    0      |      0      |      0      |   |   |
 * 100 |    0      |      1      |      0      |   | x |
 * 101 |    0      |      0      |      0      |   |   |
 * 110 |    1      |      0      |      0      | x |   |
 * 111 |    1      |      1      |      1      |   |   |
 *
 *
 * -> ______@_____________
 *   /     /      /      /|
 *  /------------------o/ |
 *  | a_2 | a_ 1 | a_0 | /
 *  o------------@------/
 *
 *  o - start/end point
 *  @ - intermediate points
 *
 *  Guiseppe for a_2 a_1, Peony for a_0
 *
 *  abg | a_2 | a_1 |  a_0    |
 *  ---------------------------
 *  000 |  0  |  0  |   0 (x) |
 *  001 |  1  |  1  |   0 (x) |
 *  010 |  1  |  1  |   1     |
 *  011 |  0  |  0  |   0     |
 *  100 |  0  |  0  |   1     |
 *  101 |  1  |  1  |   1     |
 *  110 |  1  |  1  |   1 (x) |
 *  111 |  0  |  0  |   1     |
 *
 *  I think the edge cases are when:
 *
 *  |alpha| = 2 (|beta| = 2)
 *  |alpha| = 4 (|beta| = 2,3,4)
 *  |alpha| = 3 (|beta| = 2,3)
 *
 *  We choose |alpha| >= |beta|.
 *  When |alpha| even, alpha_{1,2,3} split into
 *   000 or 110, for |alpha| = 6 -> 222, 114,
 *   leaving |alpha| = 4 and 2 to handle.
 *  When |alpha| odd, alpha_{1,2,3} split into
 *   001, 111, for |alpha| = 5 -> 221, 113,
 *   leaving |alpha| = 3.
 *
 *
 */

/* UPDATE:
 *
 * Simplified to:
 *
 * -> ____________________
 *   /            /      /|
 *  /-------------------/ o
 *  |    a_1     | a_0 | /
 *  o------------@------/
 *
 *  using the Gilbert curve (alpha endpoints) for o-@ (a_1)
 *  and recursive Peony for @-0 (a_0).
 *
 *  We force a_1 even and let a_0 soak the remainder.
 *
 *  alpha is swapped for beta if its intiially smaller.
 *
 *
 */


// base case for when |alpha| == 2 and |beta| == 2
//
function *Peony3DAsync_2x2(p, alpha, beta, gamma) {

  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);
  let g = abs_sum_v(gamma);

  let d_alpha = v_delta(alpha);
  let d_beta  = v_delta(beta);
  let d_gamma = v_delta(gamma);

  let g_idx = 0;

  let u = v_clone(p);

  yield u;
  u = v_add(u, d_alpha);
  yield u;

  for (g_idx=1; g_idx<g; g_idx++) {
    u = v_add(u, d_gamma);

    yield u;

    u = ( (g_idx%2) ? v_add(u, v_neg(d_alpha)) : v_add(u, d_alpha) );
    yield u;
  }

  u = v_add(u, d_beta);
  for ( ; g_idx > 1; g_idx--) {
    yield u;

    u = ( (g_idx%2) ? v_add(u, v_neg(d_alpha)) : v_add(u, d_alpha) );
    yield u;

    u = v_sub(u, d_gamma);
  }

  yield v_add(p, d_beta);
  yield v_add(p, v_add(d_alpha, d_beta));
  return;
}


function Peony3D(width, height, depth) {
  let p = [0,0,0],
      alpha = [width,0,0],
      beta = [0,height,0],
      gamma = [0,0,depth];

  let pnt = [];

  let p3xyz = Peony3DAsync(p, alpha, beta, gamma);
  for (let hv = p3xyz.next() ; !hv.done ; hv = p3xyz.next()) {
    let v = hv.value;
    pnt.push(v);
  }

  return pnt;
}


// we assume point starts at p and ends at
// plane diagonal (alpha + beta).
//
function *Peony3DAsync(p, alpha, beta, gamma) {
  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);
  let g = abs_sum_v(gamma);

  _vprint("#Peony3dasync: p:", p, "alpha:", alpha, "beta:", beta, "gamma:", gamma);

  if (a == 1) { yield* Gilbert2DAsync(p, beta, gamma); return; }
  if (b == 1) { yield* Gilbert2DAsync(p, alpha, gamma); return; }
  if (g == 1) { yield* Guiseppe2DAsync(p, alpha, beta); return; }

  // make alpha largest of alpha, beta
  //
  if (a < b) { let u = alpha; alpha = beta; beta = u; }
  a = abs_sum_v(alpha);
  b = abs_sum_v(beta);
  g = abs_sum_v(gamma);

  _vprint("#  -->Peony3dasync: p:", p, "alpha:", alpha, "beta:", beta, "gamma:", gamma);

  if (a < 3) {
    yield* Peony3DAsync_2x2(p, alpha, beta, gamma);
    return;
  }

  let d_alpha = v_delta(alpha);
  let d_beta  = v_delta(beta);
  let d_gamma = v_delta(gamma);

  let alpha3_1 = v_divq(alpha, 3);
  let alpha3_0 = v_sub(alpha, alpha3_1);

  let a3_1 = abs_sum_v(alpha3_1);
  let a3_0 = abs_sum_v(alpha3_0);

  if (a3_0%2) {
    alpha3_1 = v_add(alpha3_1, d_alpha);
    alpha3_0 = v_sub(alpha3_0, d_alpha);

    a3_1 = abs_sum_v(alpha3_1);
    a3_0 = abs_sum_v(alpha3_0);
  }

  let u = v_clone(p);
  yield* Hibiscus3DAsync(u, alpha3_0, beta, gamma);

  u = v_add(p, alpha3_0);
  yield* Peony3DAsync(u, alpha3_1, beta, gamma);


  return;

}

function Peony3D(width, height, depth) {
  let p = [0,0,0],
      alpha = [width,0,0],
      beta = [0,height,0],
      gamma = [0,0,depth] ;

  let pnt = [];

  let g2xyz = Peony3DAsync(p, alpha, beta, gamma);
  for (let hv = g2xyz.next() ; !hv.done ; hv = g2xyz.next()) {
    let v = hv.value;
    pnt.push( [v[0], v[1],v[2]] );
  }

  return pnt;
}

//------------------------
//        _ _  __     _ _ 
//  _ __ (_) |/ _|___(_) |
// | '  \| | |  _/ _ \ | |
// |_|_|_|_|_|_| \___/_|_|
//------------------------

function *Milfoil2x2x2Async(p, alpha, beta, gamma) {
  let xyz = v_clone(p);

  let d_alpha = v_delta(alpha);
  let d_beta  = v_delta(beta);
  let d_gamma = v_delta(gamma);

  yield [ xyz[0], xyz[1], xyz[2] ];

  xyz = v_add(xyz, d_beta);
  yield [ xyz[0], xyz[1], xyz[2] ];

  xyz = v_add(xyz, d_gamma);
  yield [ xyz[0], xyz[1], xyz[2] ];

  xyz = v_add(xyz, v_neg(d_beta));
  yield [ xyz[0], xyz[1], xyz[2] ];

  xyz = v_add(xyz, d_alpha);
  yield [ xyz[0], xyz[1], xyz[2] ];

  xyz = v_add(xyz, v_neg(d_gamma));
  yield [ xyz[0], xyz[1], xyz[2] ];

  xyz = v_add(xyz, d_beta);
  yield [ xyz[0], xyz[1], xyz[2] ];

  xyz = v_add(xyz, d_gamma);
  yield [ xyz[0], xyz[1], xyz[2] ];

}

// subdivision scheme:
//
// 2x1x1 (+z) 1x1x1 (-x) 1x2x1 (-z) 1x1x1 (+x) 1x1x2
//
//                ___o
//               /  /|
//            o_/__/ |
//           /__|  | |
//           |D | E|/
//      ___   --o-- 
//     /  /|
//    / o/__
//   /  /  /|
//  /__o__/ o
//  |C | B|/|
//  |-----| |
//  |  A  |/
//  o-----
//
//
// | a/b/g | A B C D E |  | a/b/g | A B C D E |
// | ------------------|  |-------------------|
// |   0   | 0 0 0 0 0 |  |   1   | 1 1 0 0 1 |
// |   0   | 0 0 0 0 0 |  |   1   | 1 1 1 0 0 |
// |   0   | 0 0 0 0 0 |  |   1   | 0 1 1 0 1 |
// |       |           |  |                   |
// |-------------------|  |-------------------|
// |   0   | 0 1 1 1 1 |  |   1   | 1 1 0 0 1 |
// |   0   | 1 1 0 1 1 |  |   1   | 0 0 1 1 1 |
// |   1   | 0 1 1 0 1 |  |   0   | 1 1 1 1 0 |
// | X     | x         |  |                   |
// |-------------------|  |-------------------|
// |   0   | 0 1 1 1 1 |  |   1   | 1 0 1 1 0 |
// |   1   | 0 0 1 1 1 |  |   0   | 1 1 0 1 1 |
// |   0   | 1 1 1 1 0 |  |   1   | 0 1 1 0 1 |
// | X     | x         |  |                   |
// |-------------------|  |-------------------|
// |   1   | 1 1 0 0 1 |  |   0   | 0 1 1 1 1 |
// |   0   | 1 1 0 1 1 |  |   1   | 1 1 1 0 0 |
// |   0   | 1 1 1 1 0 |  |   1   | 1 0 0 1 1 |
// | X     |     x     |  |                   |
// |-------------------|  |-------------------|

function *Milfoil3DAsync(p, alpha, beta, gamma) {

  // 4*alpha + 2*beta + gamma
  //
  let parity_schedule = [
    [0,0,0], [1,1,0], [1,0,1], [1,1,1],
    [0,1,1], [1,1,0], [0,0,1], [0,1,0]
  ]

  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);
  let g = abs_sum_v(gamma);

  _vprint("#Milfoil3dasync: p:", p, "alpha:", alpha, "beta:", beta, "gamma:", gamma);

  if (a == 1) { yield* Guiseppe2DAsync(p, beta, gamma); return; }
  if (b == 1) { yield* Guiseppe2DAsync(p, alpha, gamma); return; }
  if (g == 1) { yield* Guiseppe2DAsync(p, alpha, beta); return; }

  let d_alpha = v_delta(alpha);
  let d_beta  = v_delta(beta);
  let d_gamma = v_delta(gamma);

  if ( (a==2) && (b==2) && (g==2) ) {
    yield* Milfoil2x2x2Async(p, alpha, beta, gamma);
    return;
  }

  let alpha2 = v_div2(alpha);
  let beta2  = v_div2(beta);
  let gamma2 = v_div2(gamma);

  let a2 = abs_sum_v(alpha2);
  let b2 = abs_sum_v(beta2);
  let g2 = abs_sum_v(gamma2);

  let parity_alpha  = a%2;
  let parity_beta   = b%2;
  let parity_gamma  = g%2;

  // S0.a
  //
  if ( ((3*a) > (5*b)) ||
       ((3*a) > (5*g)) ) {

    if ((a > 2) && ((a2 % 2) == 1)) {
      alpha2 = v_add(alpha2, d_alpha);
      a2 = abs_sum_v(alpha2);
    }

    _vprint("#  Milfoil3dasync.S0.a: p:", p, "alpha:", alpha, "beta:", beta, "gamma:", gamma, "alpha2:", alpha2);

    let u = v_clone(p);
    yield* Hibiscus3DAsync( u, alpha2, beta, gamma );

    u = v_add(p, alpha2);
    yield* Milfoil3DAsync( u, v_sub(alpha, alpha2), beta, gamma );

    return;
  }

  // S0.b
  //
  if ( ((3*b) > (5*a)) ||
       ((3*b) > (5*g)) ) {

    if ((b > 2) && ((b2 % 2) == 1)) {
      beta2 = v_add(beta2, d_beta);
      b2 = abs_sum_v(beta2);
    }

    _vprint("#  Milfoil3dasync.S0.b: p:", p, "alpha:", alpha, "beta:", beta, "gamma:", gamma, "alpha2:", alpha2);

    let u = v_clone(p);
    yield* Hibiscus3DAsync( u, beta2, gamma, alpha);

    u = v_add(p, beta2);
    yield* Milfoil3DAsync( u, v_sub(beta, beta2), gamma, alpha);

    return;
  }

  // S0.g
  //
  if ( ((3*g) > (5*b)) ||
       ((3*g) > (5*a)) ) {

    if ((g > 2) && ((g2 % 2) == 1)) {
      gamma2 = v_add(gamma2, d_gamma);
      g2 = abs_sum_v(gamma2);
    }

    _vprint("#  Milfoil3dasync.S0.g: p:", p, "alpha:", alpha, "beta:", beta, "gamma:", gamma, "alpha2:", alpha2);

    let u = v_clone(p);
    yield* Hibiscus3DAsync( u, gamma2, beta, alpha);

    u = v_add(p, gamma2);
    yield* Milfoil3DAsync( u, alpha, beta, v_sub(gamma, gamma2) );

    return;
  }


  let psidx = (4*(a%2)) + (2*(b%2)) + (g%2);
  let psched = parity_schedule[psidx];
  if ((a2%2) != psched[0]) { alpha2 = v_add(alpha2, d_alpha); a2++; }
  if ((b2%2) != psched[1]) { beta2  = v_add(beta2, d_beta);   b2++; }
  if ((g2%2) != psched[2]) { gamma2 = v_add(gamma2, d_gamma); g2++; }

  let u = v_clone(p);
  yield* Milfoil3DAsync(u, alpha, beta2, gamma2);

  u = v_add(p, v_sub(alpha, d_alpha), v_sub(beta2, d_beta), gamma2);
  yield* Milfoil3DAsync(u, v_sub(alpha2, alpha), v_neg(beta2), v_sub(gamma, gamma2));

  u = v_add(p, v_sub(alpha2, d_alpha), v_sub(gamma, d_gamma));
  yield* Milfoil3DAsync(u, beta, v_neg(alpha2), v_sub(gamma2, gamma));

  u = v_add(p, v_sub(beta, d_beta), v_sub(gamma2, d_gamma));
  yield* Milfoil3DAsync(u, alpha2, v_sub(beta2, beta), v_neg(gamma2));

  u = v_add(p, alpha2, beta2);
  yield* Milfoil3DAsync(u, v_sub(alpha, alpha2), v_sub(beta, beta2), gamma);

  return;
}

function Milfoil3D(width, height, depth) {
  let p = [0,0,0],
      alpha = [width,0,0],
      beta = [0,height,0],
      gamma = [0,0,depth] ;

  let pnt = [];

  let g2xyz = Milfoil3DAsync(p, alpha, beta, gamma);
  for (let hv = g2xyz.next() ; !hv.done ; hv = g2xyz.next()) {
    let v = hv.value;
    pnt.push( [v[0], v[1],v[2]] );
  }

  return pnt;
}


//-------------------------------------
//  _        _ _     _                 
// | |_  ___| | |___| |__  ___ _ _ ___ 
// | ' \/ -_) | / -_) '_ \/ _ \ '_/ -_)
// |_||_\___|_|_\___|_.__/\___/_| \___|
//-------------------------------------

// attempts at a generalized Moore curve.
//

// all side lengths odd, notch is forced.
// I don't know how to make it stable with the recursive
// subdivision sttrategy for the non-notch case.
// Instead, this is something that works.
//
// Attach two Peony curves together (diagonal endpoints in
// plane), taking the maximum length to be the split point.
// The subdivision will create an (even,odd,odd) and an
// (odd,odd,odd) subdivision, where the (even,odd,odd)
// Peony curve will have a notch in it.
//
function *Hellebore3DAsync_111(p, alpha, beta, gamma) {
  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);
  let g = abs_sum_v(gamma);

  if ( ((a%2)==0) ||
       ((b%2)==0) ||
       ((g%2)==0) ) { return -1; }

  if ((a >= b) && (a >= g)) {
    ///
  }
  else if ((b >= a) && (b >= g)) {
    let _alpha = beta;
    let _beta = gamma;
    let _gamma = alpha;
    alpha = _alpha;
    beta = _beta;
    gamma = _gamma;
  }
  else if ((g >= a) && (g >= b)) {
    let _alpha = gamma;
    let _beta = beta;
    let _gamma = alpha;
    alpha = _alpha;
    beta = _beta;
    gamma = _gamma;
  }

  a = abs_sum_v(alpha);
  b = abs_sum_v(beta);
  g = abs_sum_v(gamma);

  let d_alpha = v_delta(alpha);
  let d_beta  = v_delta(beta);
  let d_gamma = v_delta(gamma);

  let alpha2 = v_div2(alpha);
  let q = v_add(p, alpha2);
  yield *Peony3DAsync(q, gamma, beta, v_neg(alpha2));

  q = v_add(p, alpha2, d_alpha, v_sub(beta, d_beta), v_sub(gamma, d_gamma));
  yield *Peony3DAsync(q, v_neg(beta), v_neg(gamma), v_sub(alpha, alpha2));

  return;
}

function *Hellebore3DAsync_011(p, alpha, beta, gamma) {
  let d_alpha = v_delta(alpha);
  let d_beta = v_delta(beta);
  let d_gamma = v_delta(gamma);

  let alpha2 = v_div2(alpha);
  let beta2 = v_div2(beta);
  let gamma2 = v_div2(gamma);

  let a2 = abs_sum_v(alpha2);
  let b2 = abs_sum_v(beta2);
  let g2 = abs_sum_v(gamma2);

  let alpha2_odd = v_add(alpha2, d_alpha);;
  if (a2%2) {
    alpha2_odd = v_clone(alpha2);
    alpha2 = v_add(alpha2, d_alpha);
  }

  if ((b2%2) == 1) { beta2 = v_add(beta2, d_beta); }
  if ((g2%2) == 1) { gamma2 = v_add(gamma2, d_gamma); }

  // A
  //
  let u = v_add(p, v_sub(alpha2, d_alpha), v_sub(beta2, d_beta));
  yield* Milfoil3DAsync(u, v_neg(alpha2), v_neg(beta2), gamma2);

  // B
  //
  u = v_add(p, gamma2);
  yield* Milfoil3DAsync(u, alpha2_odd, beta2, v_sub(gamma, gamma2));

  // C
  //
  u = v_add(p, v_sub(alpha2_odd, d_alpha), beta2, v_sub(gamma, d_gamma));
  yield* Milfoil3DAsync(u, v_neg(alpha2_odd), v_sub(beta, beta2), v_sub(gamma2, gamma));

  // D
  //
  u = v_add(p, v_sub(beta, d_beta), v_sub(gamma2, d_gamma));
  yield* Milfoil3DAsync(u, alpha2_odd, v_sub(beta2, beta), v_neg(gamma2));

  // E
  //
  u = v_add(p, alpha2_odd, beta2);
  yield* Milfoil3DAsync(u, v_sub(alpha, alpha2_odd), v_sub(beta, beta2), gamma2);

  // F
  //
  u = v_add(p, v_sub(alpha, d_alpha), v_sub(beta, d_beta), gamma2);
  yield* Milfoil3DAsync(u, v_sub(alpha2_odd, alpha), v_sub(beta2, beta), v_sub(gamma, gamma2));

  // G
  //
  u = v_add(p, alpha2_odd, v_sub(beta2, d_beta), v_sub(gamma, d_gamma));
  yield* Milfoil3DAsync(u, v_sub(alpha, alpha2_odd), v_neg(beta2), v_sub(gamma2, gamma));

  // H
  //
  u = v_add(p, v_sub(alpha, d_alpha), v_sub(gamma2, d_gamma));
  yield* Milfoil3DAsync(u, v_sub(alpha2, alpha), beta2, v_neg(gamma2));

  return;
}

function *Hellebore3DAsync_101(p, alpha, beta, gamma) {
  let d_alpha = v_delta(alpha);
  let d_beta = v_delta(beta);
  let d_gamma = v_delta(gamma);

  let alpha2 = v_div2(alpha);
  let beta2 = v_div2(beta);
  let gamma2 = v_div2(gamma);

  let a2 = abs_sum_v(alpha2);
  let b2 = abs_sum_v(beta2);
  let g2 = abs_sum_v(gamma2);

  let beta2_odd = v_add(beta2, d_beta);;
  if (b2%2) {
    beta2_odd = v_clone(beta2);
    beta2 = v_add(beta2, d_beta);
  }

  if ((a2%2) == 1) { alpha2 = v_add(alpha2, d_alpha); }
  if ((g2%2) == 0) { gamma2 = v_add(gamma2, d_gamma); }

  // A
  //
  let u = v_add(p, v_sub(alpha2, d_alpha), v_sub(beta2_odd, d_beta));
  yield* Milfoil3DAsync(u, v_neg(alpha2), v_neg(beta2_odd), gamma2);

  // B
  //
  u = v_add(p, gamma2);
  yield* Milfoil3DAsync(u, alpha2, beta2, v_sub(gamma, gamma2));

  // C
  //
  u = v_add(p, v_sub(alpha2, d_alpha), beta2, v_sub(gamma, d_gamma));
  yield* Milfoil3DAsync(u, v_neg(alpha2), v_sub(beta, beta2), v_sub(gamma2, gamma));

  // D
  //
  u = v_add(p, v_sub(beta, d_beta), v_sub(gamma2, d_gamma));
  yield* Milfoil3DAsync(u, alpha2, v_sub(beta2_odd, beta), v_neg(gamma2));

  // E
  //
  u = v_add(p, alpha2, beta2_odd);
  yield* Milfoil3DAsync(u, v_sub(alpha, alpha2), v_sub(beta, beta2_odd), gamma2);

  // F
  //
  u = v_add(p, v_sub(alpha, d_alpha), v_sub(beta, d_beta), gamma2);
  yield* Milfoil3DAsync(u, v_sub(alpha2, alpha), v_sub(beta2_odd, beta), v_sub(gamma, gamma2));

  // G
  //
  u = v_add(p, alpha2, v_sub(beta2_odd, d_beta), v_sub(gamma, d_gamma));
  yield* Milfoil3DAsync(u, v_sub(alpha, alpha2), v_neg(beta2_odd), v_sub(gamma2, gamma));

  // H
  //
  u = v_add(p, v_sub(alpha, d_alpha), v_sub(gamma2, d_gamma));
  yield* Milfoil3DAsync(u, v_sub(alpha2, alpha), beta2_odd, v_neg(gamma2));

}

function *Hellebore3DAsync_110(p, alpha, beta, gamma) {
  let d_alpha = v_delta(alpha);
  let d_beta = v_delta(beta);
  let d_gamma = v_delta(gamma);

  let alpha2 = v_div2(alpha);
  let beta2 = v_div2(beta);
  let gamma2 = v_div2(gamma);

  let a2 = abs_sum_v(alpha2);
  let b2 = abs_sum_v(beta2);
  let g2 = abs_sum_v(gamma2);

  let gamma2_odd = v_add(gamma2, d_gamma);;
  if (g2%2) {
    gamma2_odd = v_clone(gamma2);
    gamma2 = v_add(gamma2, d_gamma);
  }

  if ((a2%2) == 1) { alpha2 = v_add(alpha2, d_alpha); }
  if ((b2%2) == 1) { beta2 = v_add(beta2, d_beta); }

  // A
  //
  let u = v_add(p, v_sub(alpha2, d_alpha), v_sub(beta2, d_beta));
  yield* Milfoil3DAsync(u, v_neg(alpha2), v_neg(beta2), gamma2);

  // B
  //
  u = v_add(p, gamma2);
  yield* Milfoil3DAsync(u, alpha2, beta2, v_sub(gamma, gamma2));

  // C
  //
  u = v_add(p, v_sub(alpha2, d_alpha), beta2, v_sub(gamma, d_gamma));
  yield* Milfoil3DAsync(u, v_neg(alpha2), v_sub(beta, beta2), v_sub(gamma2_odd, gamma));

  // D
  //
  u = v_add(p, v_sub(beta, d_beta), v_sub(gamma2_odd, d_gamma));
  yield* Milfoil3DAsync(u, alpha2, v_sub(beta2, beta), v_neg(gamma2_odd));

  // E
  //
  u = v_add(p, alpha2, beta2);
  yield* Milfoil3DAsync(u, v_sub(alpha, alpha2), v_sub(beta, beta2), gamma2_odd);

  // F
  //
  u = v_add(p, v_sub(alpha, d_alpha), v_sub(beta, d_beta), gamma2_odd);
  yield* Milfoil3DAsync(u, v_sub(alpha2, alpha), v_sub(beta2, beta), v_sub(gamma, gamma2_odd));

  // G
  //
  u = v_add(p, alpha2, v_sub(beta2, d_beta), v_sub(gamma, d_gamma));
  yield* Milfoil3DAsync(u, v_sub(alpha, alpha2), v_neg(beta2), v_sub(gamma2_odd, gamma));

  // H
  //
  u = v_add(p, v_sub(alpha, d_alpha), v_sub(gamma2_odd, d_gamma));
  yield* Milfoil3DAsync(u, v_sub(alpha2, alpha), beta2, v_neg(gamma2_odd));

}

// this subdivision method won't work
//
function *Hellebore3DAsync(p, alpha, beta, gamma) {
  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);
  let g = abs_sum_v(gamma);

  // notch case, fall through to simple Peony glue case.
  //
  if ((a%2) && (b%2) && (g%2)) {
    yield *Hellebore3DAsync_111(p, alpha, beta, gamma);
    return;
  }

  let d_alpha = v_delta(alpha);
  let d_beta = v_delta(beta);
  let d_gamma = v_delta(gamma);

  let alpha2 = v_div2(alpha);
  let beta2 = v_div2(beta);
  let gamma2 = v_div2(gamma);

  let a2 = abs_sum_v(alpha2);
  let b2 = abs_sum_v(beta2);
  let g2 = abs_sum_v(gamma2);

  let s = ((a%2) + (b%2) + (g%2));

  if (s == 2) {
    if      ((a%2) == 0) { yield* Hellebore3DAsync_011(p, alpha, beta, gamma); }
    else if ((b%2) == 0) { yield* Hellebore3DAsync_101(p, alpha, beta, gamma); }
    else if ((g%2) == 0) { yield* Hellebore3DAsync_110(p, alpha, beta, gamma); }
    return;
  }

  if (s == 0) {
    if (a2%2) { alpha2  = v_add(alpha2, d_alpha); }
    if (b2%2) { beta2   = v_add(beta2, d_beta); }
    if (g2%2) { gamma2  = v_add(gamma2, d_gamma); }
  }
  else if (s == 1) {
    if ((a2%2) == 0) { alpha2  = v_add(alpha2, d_alpha); }
    if ((b2%2) == 0) { beta2   = v_add(beta2, d_beta); }
    if ((g2%2) == 0) { gamma2  = v_add(gamma2, d_gamma); }
  }

  a2 = abs_sum_v(alpha2);
  b2 = abs_sum_v(beta2);
  g2 = abs_sum_v(gamma2);

  let u = v_add(p, v_sub(alpha2, d_alpha), v_sub(beta2, d_beta));
  yield* Milfoil3DAsync(u, v_neg(alpha2), v_neg(beta2), gamma2);

  u = v_add(p, gamma2);
  yield* Milfoil3DAsync(u, alpha2, beta2, v_sub(gamma, gamma2));


  u = v_add(p, v_sub(alpha2, d_alpha), beta2, v_sub(gamma, d_gamma));
  yield* Milfoil3DAsync(u, v_neg(alpha2), v_sub(beta, beta2), v_sub(gamma2, gamma));

  u = v_add(p, v_sub(beta, d_beta), v_sub(gamma2, d_gamma));
  yield* Milfoil3DAsync(u, alpha2, v_sub(beta2, beta), v_neg(gamma2));


  u = v_add(p, alpha2, beta2);
  yield* Milfoil3DAsync(u, v_sub(alpha, alpha2), v_sub(beta, beta2), gamma2);

  u = v_add(p, v_sub(alpha, d_alpha), v_sub(beta, d_beta), gamma2);
  yield* Milfoil3DAsync(u, v_sub(alpha2, alpha), v_sub(beta2, beta), v_sub(gamma, gamma2));


  u = v_add(p, alpha2, v_sub(beta2, d_beta), v_sub(gamma, d_gamma));
  yield* Milfoil3DAsync(u, v_sub(alpha, alpha2), v_neg(beta2), v_sub(gamma2, gamma));

  u = v_add(p, v_sub(alpha, d_alpha), v_sub(gamma2, d_gamma));
  yield* Milfoil3DAsync(u, v_sub(alpha2, alpha), beta2, v_neg(gamma2));

}

// Generalized Moore curve (2d)
//
function *Hellebore2DAsync(p, alpha, beta) {

  let a = abs_sum_v(alpha);
  let b = abs_sum_v(beta);

  let d_alpha = v_delta(alpha);
  let d_beta = v_delta(beta);


  let alpha2 = v_div2(alpha);
  let beta2 = v_div2(beta);

  let a2 = abs_sum_v(alpha2);
  let b2 = abs_sum_v(beta2);

  if ((a <= 2) && (b <= 2)) {
    yield* Gilbert2DAsync( p, alpha, beta );
    return;
  }

  if ( (a > 2) &&
       ((a2 % 2) == 0) ) {
    alpha2 = v_add(alpha2, d_alpha);
    a2++;
  }

  if ( (b > 2) &&
       ((b2 % 2) == 0) ) {
    beta2 = v_add(beta2, d_beta);
    b2++;
  }

  _vprint("#Hellebore2d: p:", p, "alpha:", alpha, "beta:", beta, "alpha2:", alpha2, "beta2:", beta2);

  let u = v_add(p, v_sub(alpha2, d_alpha));
  yield* Guiseppe2DAsync( u, v_neg(alpha2), beta2 );

  u = v_add(p, beta2);
  yield* Guiseppe2DAsync( u, alpha2, v_sub(beta, beta2) );

  u = v_add(p, alpha2, v_sub(beta, d_beta));
  yield* Guiseppe2DAsync( u, v_sub(alpha, alpha2), v_sub(beta2, beta) );

  u = v_add(p, v_sub(alpha, d_alpha), v_sub(beta2, d_beta));
  yield* Guiseppe2DAsync( u, v_sub(alpha2, alpha), v_neg(beta2) );

  return;
}

function Hellebore2D(width, height) {
  let p = [0,0,0],
      alpha = [width,0,0],
      beta = [0,height,0];

  let pnt = [];

  let g2xyz = Hellebore2DAsync(p, alpha, beta);
  for (let hv = g2xyz.next() ; !hv.done ; hv = g2xyz.next()) {
    let v = hv.value;
    pnt.push( [v[0], v[1]] );
  }

  return pnt;
}

function Hellebore3D(width, height, depth) {
  let p = [0,0,0],
      alpha = [width,0,0],
      beta = [0,height,0],
      gamma = [0, 0, depth];

  let pnt = [];

  let g2xyz = Hellebore3DAsync(p, alpha, beta, gamma);
  for (let hv = g2xyz.next() ; !hv.done ; hv = g2xyz.next()) {
    let v = hv.value;
    pnt.push( [v[0], v[1],v[2]] );
  }

  return pnt;
}

//--------------------------
//                  _       
//  _ __ ___   __ _(_)_ __  
// | '_ ` _ \ / _` | | '_ \ 
// | | | | | | (_| | | | | |
// |_| |_| |_|\__,_|_|_| |_|
//--------------------------


var OP_LIST = [
  "xy", "xyz", "xyzp",
  "xy2d", "d2xy",
  "xyz2d", "d2xyz",

  "xyz2da", "d2xyza",
  "xy2da", "d2xya",

  "guiseppe2d",
  "guiseppe3d",

  "milfoil3d",

  "peony3d",
  "peony_test",

  "hibiscus3d",

  "hellebore2d",
  "hellebore3d"

];


function _show_help(msg) {
  msg = ((typeof msg !== "undefined") ? msg : "");
  if (msg.length > 0) { console.log(msg, "\n"); }

  let op_list = OP_LIST;

  console.log("");
  console.log("usage:");
  console.log("");
  console.log("  node ./gilbert3dpp.js [OP] [W] [H] [D]");
  console.log("");
  console.log("  OP   one of '" + op_list.join("', '") + "'.");
  console.log("       For adapative methods (xy2da,d2xya,xyz2da,d2xyza), the suffix '.0', '.1' or '.2'");
  console.log("       can be added to indicate which adapted method to use (0:harmony,1:hamiltonian,2:axis).");
  console.log("  W    width");
  console.log("  H    height");
  console.log("  D    depth");
  console.log("");
  console.log("example:");
  console.log("");
  console.log("  node ./gilbert3dpp.js d2xya.1 10 12");
  console.log("");
}

function _main(argv) {
  let op = "xyz";
  let w = 0;
  let h = 0;
  let d = 1;

  let arg_idx = 1;

  let op_list = OP_LIST;

  if (argv.length <= 1) {
    _show_help();
  }
  else {

    if (argv.length > 1) { op = argv[1]; }
    if (argv.length > 2) { w = parseInt(argv[2]); }
    if (argv.length > 3) { h = parseInt(argv[3]); }
    if (argv.length > 4) { d = parseInt(argv[4]); }

    let adapt_method = GILBERT_ADAPT_METHOD.HARMONY;

    let op_tok = op.split(".");
    if (op_tok.length > 1) {
      op = op_tok[0];

      for (let i=1; i<op_tok.length; i++) {
        if (op_tok[i] == 'v') {
          VERBOSE++;
        }
        else {
          adapt_method = parseInt(op_tok[1]);
        }
      }
    }

    let op_found = false
    for (let i=0; i<op_list.length; i++) {
      if (op == op_list[i]) { op_found = true; break; }
    }
    if (!op_found) {
      _show_help();
      return;
    }

    if (isNaN(w) || (w==0) ||
        isNaN(h) || (h==0) ||
        isNaN(d) || (d==0)) {
      _show_help();
      return;
    }

    if (op == "xy") {
      let p = Gilbert2D(w,h);
      for (let i=0; i<p.length; i++) {
        console.log(p[i][0], p[i][1]);
      }
    }
    else if (op == "xyz") {
      let p = Gilbert3D(w,h,d);
      for (let i=0; i<p.length; i++) {
        console.log(p[i][0], p[i][1], p[i][2]);
      }
    }

    else if (op == "xy2d") {

      for (let y=0; y<h; y++) {
        for (let x=0; x<w; x++) {
          let idx = Gilbert2D_xyz2d(0, [x,y,0], [0,0,0], [w,0,0], [0,h,0]);
          console.log(idx, x,y);
        }
      }

    }

    else if (op == "d2xy") {

      for (let idx=0; idx<(w*h); idx++) {
        let xyz = Gilbert2D_d2xyz(idx, 0, [0,0,0], [w,0,0], [0,h,0]);
        console.log(xyz[0], xyz[1]);
      }

    }

    else if (op == "xyz2d") {

      for (let z=0; z<d; z++) {
        for (let y=0; y<h; y++) {
          for (let x=0; x<w; x++) {
            let idx = Gilbert3D_xyz2d(0, [x,y,z], [0,0,0], [w,0,0], [0,h,0], [0,0,d]);
            console.log(idx, x,y,z);
          }
        }
      }

    }

    else if (op == "d2xyz") {

      for (let idx=0; idx<(w*h*d); idx++) {
        let xyz = Gilbert3D_d2xyz(idx, 0, [0,0,0], [w,0,0], [0,h,0], [0,0,d]);
        console.log(xyz[0], xyz[1], xyz[2]);
      }

    }


    // "dynamic" functions that adjust the endpoints to create a Hamiltonian path
    //

    else if (op == "d2xyza") {

      for (let idx=0; idx<(w*h*d); idx++) {
        let xyz = Gilbert3DAdapt_d2xyz(idx, w,h,d, adapt_method);
        console.log(xyz[0], xyz[1], xyz[2]);
      }

    }

    else if (op == "xyz2da") {

      for (let z=0; z<d; z++) {
        for (let y=0; y<h; y++) {
          for (let x=0; x<w; x++) {
            let idx = Gilbert3DAdapt_xyz2d([x,y,z], w,h,d, adapt_method);
            console.log(idx, x,y,z);
          }
        }
      }

    }

    else if (op == "d2xya") {

      for (let idx=0; idx<(w*h*d); idx++) {
        let xyz = Gilbert2DAdapt_d2xy(idx, w,h, adapt_method);
        console.log(xyz[0], xyz[1]);
      }

    }

    else if (op == "xy2da") {

      for (let y=0; y<h; y++) {
        for (let x=0; x<w; x++) {
          let idx = Gilbert2DAdapt_xy2d([x,y], w,h, adapt_method);
          console.log(idx, x,y);
        }
      }

    }

    else if (op == "guiseppe2d") {

      let p = Guiseppe2D(w,h);
      for (let i=0; i<p.length; i++) {
        console.log(p[i][0],p[i][1]);
      }

    }

    else if (op == "guiseppe3d") {

      let p = Guiseppe3D(w,h,d);
      for (let i=0; i<p.length; i++) {
        console.log(p[i][0],p[i][1], p[i][2]);
      }

    }

    else if (op == "peony_test") {

      _test_peony();

    }

    else if (op == "milfoil3d") {

      let p = Milfoil3D(w,h,d);
      for (let i=0; i<p.length; i++) {
        console.log(p[i][0],p[i][1], p[i][2]);
      }

    }

    else if (op == "peony3d") {

      let p = Peony3D(w,h,d);
      for (let i=0; i<p.length; i++) {
        console.log(p[i][0],p[i][1], p[i][2]);
      }

    }

    else if (op == "hibiscus3d") {

      let p = Hibiscus3D(w,h,d);
      for (let i=0; i<p.length; i++) {
        console.log(p[i][0],p[i][1], p[i][2]);
      }

    }

    else if (op == "hellebore2d") {

      let p = Hellebore2D(w,h);
      for (let i=0; i<p.length; i++) {
        console.log(p[i][0],p[i][1]);
      }

    }

    else if (op == "hellebore3d") {

      let p = Hellebore3D(w,h,d);
      for (let i=0; i<p.length; i++) {

        if (p[i][0] < 0) { console.log("\n"); continue; }

        console.log(p[i][0],p[i][1], p[i][2]);
      }

    }

  }
}

if (typeof module !== "undefined") {
  module.exports["Gilbert2D"] = Gilbert2D;
  module.exports["Gilbert3D"] = Gilbert3D;

  module.exports["Gilbert2DAsync"] = Gilbert2DAsync;
  module.exports["Gilbert3DAsync"] = Gilbert3DAsync;

  module.exports["Gilbert2D_d2xyz"] = Gilbert2D_d2xyz;
  module.exports["Gilbert2D_xyz2d"] = Gilbert2D_xyz2d;

  module.exports["Gilbert3D_d2xyz"] = Gilbert3D_d2xyz;
  module.exports["Gilbert3D_xyz2d"] = Gilbert3D_xyz2d;

  module.exports["Gilbert2DAdapt_d2xyz"] = Gilbert2DAdapt_d2xy;
  module.exports["Gilbert2DAdapt_xyz2d"] = Gilbert2DAdapt_xy2d;

  module.exports["Gilbert3DAdapt_d2xyz"] = Gilbert3DAdapt_d2xyz;
  module.exports["Gilbert3DAdapt_xyz2d"] = Gilbert3DAdapt_xyz2d;

  module.exports["Guiseppe2DAsync"] = Guiseppe2DAsync;
  module.exports["Guiseppe2D"] = Guiseppe2D;

  // cuboid diagonal start/end
  // p(0,0,0) -> q( |alpha|-1, |beta|-1, |gamma|-1 )
  //
  // * stable
  //   - swap so that alpha is the longest axis
  //   - bulk recursion: (1x3x3, 1x3x3, 1x3x3) Guiseppe3d x 3
  //   - reduces to (hibiscus, guiseppe) when middle troche is 0
  // * pushes notch to last troche by ensuring valid cuboid
  //   dimensions for all but the last troche
  // * base case is a bit complicated as it takes into account
  //   all 3x3x3 and smaller cuboids
  // * has displeasing 'stacking' so probably shouldn't be used
  //
  //
  module.exports["Guiseppe3DAsync"] = Guiseppe3DAsync;
  module.exports["Guiseppe3D"] = Guiseppe3D;

  // generalized Hilbert curve
  // p(0,0,0) -> q( |alpha|-1, 0, 0)
  //
  // That is, start and end point are on the |alpha| axis.
  //
  // * stable
  //   - (1x2x1, 1x1x1, 2x1x1, 1x1x1, 1x2x1)
  //   - (peony, peony, hibiscus, peony, peony)
  // * reduces to Hilbert for 2x2x2
  // * uses S_0, S_1 and S_2 harmony subdivision
  //
  module.exports["Hibiscus3DAsync"] = Hibiscus3DAsync;
  module.exports["Hibiscus3D"] = Hibiscus3D;

  // In plane diagonal
  // p(0,0,0) -> q( |alpha|-1, |beta|-1, 0)
  //
  // * stable
  // * this might be in a state of "just to get something working"
  //   as it looks like it's a 1/3 Hibiscus split and 2/3 Peony remainder
  //
  module.exports["Peony3DAsync"] = Peony3DAsync;
  module.exports["Peony3D"] = Peony3D;

  // Cuboid diagonal
  // p(0,0,0) -> q( |alpha|-1, |beta|-1, |gamma|-1)
  //
  // * stable
  // * only uses S_0 subdivision sscheme
  //
  module.exports["Milfoil3DAsync"] = Milfoil3DAsync;
  module.exports["Milfoil3D"] = Milfoil3D;

  // generalized Moore curve (wip)
  //
  // * stable for all non-notch cases
  // * notch case reduces to two Peony curvse stacked
  // * still needs some validation
  //
  module.exports["Hellebore3DAsync"] = Hellebore3DAsync;
  module.exports["Hellebore3D"] = Hellebore3D;

  module.exports["ADAPT_METHOD"] = GILBERT_ADAPT_METHOD;
}

//---
// see https://stackoverflow.com/questions/4981891/node-js-equivalent-of-pythons-if-name-main
//
if ((typeof require !== "undefined")  &&
    (require.main === module)) {
  _main(process.argv.slice(1));
}
//---

