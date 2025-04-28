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

var DEBUG = 0;

function _dprint() {
  let _debug = ((typeof DEBUG === "undefined") ? false : DEBUG );
  if (_debug) {
    console.log.apply(this,Array.prototype.slice.call(arguments));
  }
}

function Gilbert3DAdapt_d2xyz(idx, w,h,d, force_w) {
  force_w = ((typeof force_w === "undefined") ? false : force_w);
  let w0 = (w%2);
  let h0 = (h%2);
  let d0 = (d%2);

  let p0 = [0,0,0];

  if (force_w || (w0 == 0)) {
    return Gilbert3D_d2xyz(idx, 0, p0, [w,0,0], [0,h,0], [0,0,d]);
  }

  if (h0 == 0) {
    return Gilbert3D_d2xyz(idx, 0, p0, [0,h,0], [w,0,0], [0,0,d]);
  }

  if (d0 == 0) {
    return Gilbert3D_d2xyz(idx, 0, p0, [0,0,d], [w,0,0], [0,h,0]);
  }

  return Gilbert3D_d2xyz(idx, 0, p0, [w,0,0], [0,h,0], [0,0,d]);

}

function Gilbert3DAdapt_xyz2d(q, w,h,d) {
  force_w = ((typeof force_w === "undefined") ? false : force_w);
  let w0 = (w%2);
  let h0 = (h%2);
  let d0 = (d%2);

  if (force_w || (w0 == 0)) {
    return Gilbert3D_xyz2d(0, q, [0,0,0], [w,0,0], [0,h,0], [0,0,d]);
  }

  if (h0 == 0) {
    return Gilbert3D_xyz2d(0, q, [0,0,0], [0,h,0], [w,0,0], [0,0,d]);
  }

  if (d0 == 0) {
    return Gilbert3D_xyz2d(0, q, [0,0,0], [0,0,d], [w,0,0], [0,h,0]);
  }

  return Gilbert3D_xyz2d(0, q, [0,0,0], [w,0,0], [0,h,0], [0,0,d]);

}


function Gilbert2DAdapt_d2xy(idx, w,h, force_w) {
  force_w = ((typeof force_w === "undefined") ? false : force_w);
  let w0 = (w%2);
  let h0 = (h%2);

  let p0 = [0,0,0];

  if (force_w || (w0 == 0)) {
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

function Gilbert2DAdapt_xy2d(_q, w,h) {
  force_w = ((typeof force_w === "undefined") ? false : force_w);
  let w0 = (w%2);
  let h0 = (h%2);

  let q = [_q[0],_q[1],0];
  let p0 = [0,0,0];

  if (force_w || (w0 == 0)) {
    return Gilbert2D_xyz2d(0, q, p0, [w,0,0], [0,h,0], [0,0,1]);
  }

  if (h0 == 0) {
    return Gilbert2D_xyz2d(0, q, p0, [0,h,0], [w,0,0], [0,0,1]);
  }

  return Gilbert2D_xyz2d(0, q, p0, [w,0,0], [0,h,0], [0,0,1]);
}

// Description:
//
// d2e    : divide by 2 but force even (by adding one if need be)
// d2u    : divide by 2 but force odd (by adding one if need be)
// dqe    : divide by q but force even (by adding one if need be)
// dqu    : divide by q but force odd (by adding one if need be)
// _divq  : integer divide vector entries by q ( sgn(v) floor(|v|/q) )
// _div2  : _divq(2)
// _sgn   : return -1,0,1 if value is <0, 0 or >0 respectively
// _neg   : negate vector (multiply each entry by -1)
// _add   : add two vectors
// _abs   : absolute value all vector entries
// _delta : replace each element in vector by _sgn(.)
// _print : print vector (debugging)
// _clone : make a clone of the vector
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

// floor version
//
//function d2u_floor(v) {
//  let v2 = Math.floor(v/2);
//  if (v==0) { return 0; }
//  if ((v2%2)==1) { return v2; }
//  return v2+1;
//}

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

// floor version
//
//function dqe_floor(v,q) {
//  let vq = Math.floor(v/q);
//  if ((vq%2)==0) { return vq; }
//  return vq+1;
//}

// round to zero version
//
function dqe(_v,q) {
  let v = Math.abs(_v);
  let m = ((_v<0)? -1 : 1);
  let vq = Math.floor(v/q);
  if ((vq%2)==0) { return m*vq; }
  return m*(vq+1);
}

// floor version
//
//function dqu_floor(v,q) {
//  let vq = Math.floor(v/q);
//  if (v==0) { return 0; }
//  if ((vq%2)==1) { return vq; }
//  return vq+1;
//}


function dqu(_v,q) {
  let v = Math.abs(_v);
  let m = ((_v<0)? -1 : 1);
  let vq = Math.floor(v/q);
  if (v==0) { return 0; }
  if ((vq%2)==1) { return m*vq; }
  return m*(vq+1);
}

// floor version
//
//function _divq_floor(v,q) {
// let u = [];
//  for (let i=0; i<v.length; i++) {
//    u.push( Math.floor(v[i] / q) );
//  }
//  return u;
//}

// round to zero version
//
function _divq(v,q) {
  let u = [];
  for (let i=0; i<v.length; i++) {
    let _v = Math.abs(v[i]);
    let m = ((v[i]<0) ? -1 : 1);
    u.push( m*Math.floor(_v / q) );
  }
  return u;
}

function _div2(v) { return _divq(v,2); }

function _sgn(v) {
  if (v>0) { return  1; }
  if (v<0) { return -1; }
  return 0;
}

function _neg(v) {
  if (v.length==2) {
    return [-v[0], -v[1]];
  }
  return [ -v[0], -v[1], -v[2] ];
}

function _add(u,v) {
  if ((u.length == 2) || (v.length == 2)) {
    return [ u[0]+v[0], u[1]+v[1] ];
  }
  return [ u[0]+v[0], u[1]+v[1], u[2]+v[2] ];
}

function _mul(c,v) {
  if (v.length == 2) {
    return [ c*v[0], c*v[1] ];
  }
  return [ c*v[0], c*v[1], c*v[2] ];
}

function _dot(u,v) {
  if ((u.length == 2) || (v.length == 2)) {
    return  (u[0]*v[0]) + (u[1]*v[1]);
  }
  return (u[0]*v[0]) + (u[1]*v[1]) + (u[2]*v[2]);
}

function _abs(v) {
  let s = 0;
  for (let i=0; i<v.length; i++) {
    s += Math.abs(v[i]);
  }
  return s;
}

function _delta(v) {
  let u = [];
  for (let i=0; i<v.length; i++) {
    u.push( _sgn(v[i]) );
  }
  return u;
}

function _print(v) {
  if (v.length == 2)  { console.log(v[0], v[1]); }
  else                { console.log(v[0], v[1], v[2]); }
}

function _clone(v) {
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

//-------------------
//         ___     __
//   ___ _|_  |___/ /
//  / _ `/ __// _  / 
//  \_, /____/\_,_/  
// /___/             
//-------------------


// "generalized" 2d gilbert curve
//
// alpha - width-like axis
// beta - height-like axis
//
// Enumerate points for the 2d Gilbert curve
// in alpha and beta axis.
// alpha/beta can be in 3d and should work properly.
//
// first prototype/reference implementation, single function, print only
//
function g2d_p(p, alpha, beta) {
  let a = _abs(alpha);
  let b = _abs(beta);

  let alpha2 = _div2(alpha);
  let beta2  = _div2(beta);

  let a2 = _abs(alpha2);
  let b2 = _abs(beta2);

  let d_alpha = _delta(alpha);
  let d_beta  = _delta(beta);

  if (b==1) {

    let u = _clone(p);
    for (let i=0; i<a; i++) {
      _print(u);
      u = _add(u, d_alpha);
    }
    return;
  }

  if (a==1) {
    let u = _clone(p);
    for (let i=0; i<b; i++) {
      _print(u);
      u = _add(u, d_beta);
    }
    return;
  }

  if ( (2*a) > (3*b) ) {
    if ((a2%2) && (a>2)) { alpha2 = _add(alpha2, d_alpha); }


    g2d_p(p, alpha2, beta);
    g2d_p( _add(p, alpha2),
           _add(alpha, _neg(alpha2)),
           beta);

    return;
  }


  if ((b2%2) && (b>2)) { beta2 = _add(beta2, d_beta); }

  g2d_p( p,
         beta2,
         alpha2);
  g2d_p( _add(p, beta2),
         alpha,
         _add(beta, _neg(beta2)) );
  g2d_p( _add(p,
              _add( _add(alpha, _neg(d_alpha) ),
                    _add(beta2, _neg( d_beta) ) ) ),
         _neg(beta2),
         _add(alpha2, _neg(alpha)) );

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
// recursive, async
//
function Gilbert2D_d2xyz(dst_idx, cur_idx, p, alpha, beta) {
  let a = _abs(alpha);
  let b = _abs(beta);

  _dprint("#Gilbert2D_d2xyz: dst_idx:", dst_idx, "cur_idx:", cur_idx, "alpha:", alpha, "beta:", beta, "(", a, b, ")");

  let d_alpha = _delta(alpha);
  let d_beta  = _delta(beta);

  if (b==1) {

    _dprint("#Gilbert2D_d2xyz.Lb: dst_idx:", dst_idx, "cur_idx:", cur_idx, "alpha:", alpha, "beta:", beta, "(", a, b, ")");

    let d_idx = dst_idx - cur_idx;
    return _add(p, _mul(d_idx, d_alpha));
  }


  if (a==1) {

    _dprint("#Gilbert2D_d2xyz.La: dst_idx:", dst_idx, "cur_idx:", cur_idx, "alpha:", alpha, "beta:", beta, "(", a, b, ")");

    let d_idx = dst_idx - cur_idx;
    return _add(p, _mul(d_idx, d_beta));
  }

  let alpha2 = _div2(alpha);
  let beta2  = _div2(beta);

  let a2 = _abs(alpha2);
  let b2 = _abs(beta2);

  _dprint("#  Gilbert2D_d2xyz: dst_idx:", dst_idx, "cur_idx:", cur_idx, "(alpha2,beta2):", alpha2, beta2, "(", a2, b2, ")");

  if ( (2*a) > (3*b) ) {
    if ((a2%2) && (a>2)) {
      alpha2 = _add(alpha2, d_alpha);
      a2 = _abs(alpha2);
    }


    _dprint("#Gilbert2D_d2xyz.S0: dst_idx:", dst_idx, "cur_idx:", cur_idx, "(alpha2,beta2):", alpha2, beta2, "(", a2, b2, ")");

    let nxt_idx = cur_idx + (a2*b);
    if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
      return Gilbert2D_d2xyz( dst_idx, cur_idx,
                              p,
                              alpha2,
                              beta );
    }
    cur_idx = nxt_idx;

    _dprint("#Gilbert2D_d2xyz.S1: dst_idx:", dst_idx, "cur_idx:", cur_idx, "(alpha2,beta2):", alpha2, beta2, "(", a2, b2, ")");

    return Gilbert2D_d2xyz( dst_idx, cur_idx,
                            _add(p, alpha2),
                            _add(alpha, _neg(alpha2)),
                            beta );

  }


  if ((b2%2) && (b>2)) {
    beta2 = _add(beta2, d_beta);
    b2 = _abs(beta2);
  }


  _dprint("#Gilbert2D_d2xyz.A: dst_idx:", dst_idx, "cur_idx:", cur_idx, "(alpha2,beta2):", alpha2, beta2, "(", a2, b2, ")");

  let nxt_idx = cur_idx + (b2*a2);
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert2D_d2xyz( dst_idx, cur_idx,
                            p,
                            beta2,
                            alpha2 );
  }
  cur_idx = nxt_idx;

  _dprint("#Gilbert2D_d2xyz.B: dst_idx:", dst_idx, "cur_idx:", cur_idx, "(alpha2,beta2):", alpha2, beta2, "(", a2, b2, ")");

  nxt_idx = cur_idx + (a*(b-b2));
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert2D_d2xyz( dst_idx, cur_idx,
                            _add(p, beta2),
                            alpha,
                            _add(beta, _neg(beta2)) );
  }
  cur_idx = nxt_idx;

  _dprint("#Gilbert2D_d2xyz.C: dst_idx:", dst_idx, "cur_idx:", cur_idx, "(alpha2,beta2):", alpha2, beta2, "(", a2, b2, ")");

  return Gilbert2D_d2xyz( dst_idx, cur_idx,
                          _add(p,
                          _add( _add(alpha, _neg(d_alpha) ),
                                _add(beta2, _neg( d_beta) ) ) ),
                          _neg(beta2),
                          _add(alpha2, _neg(alpha)) );
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
  let a = _abs(alpha);
  let b = _abs(beta);

  let u = _clone(p);

  _dprint("#Gilbert2D_xyz2d: cur_idx:", cur_idx, "q:", q, "p:", p, "(alpha:", alpha, "beta:", beta, ") (", a, b, ")");

  let d_alpha = _delta(alpha);
  let d_beta  = _delta(beta);

  if ( b == 1 ) {
    return cur_idx + _dot( d_alpha, _add(q, _neg(u)) );
  }

  if ( a == 1 ) {
    return cur_idx + _dot( d_beta, _add(q, _neg(u)) );
  }

  let alpha2 = _div2(alpha);
  let beta2  = _div2(beta);

  let a2 = _abs(alpha2);
  let b2 = _abs(beta2);

  _dprint("#  Gilbert2D_xyz2d: cur_idx:", cur_idx, "(alpha2,beta2):", alpha2, beta2, "(", a2, b2, ")");

  if ( (2*a) > (3*b) ) {
    if ((a2%2) && (a>2)) {
      alpha2 = _add(alpha2, d_alpha);
      a2 = _abs(alpha2);
    }

    _dprint("#  Gilbert2D_xyz2d.W0");

    if (_inBounds(q, u, alpha2, beta)) {
      return Gilbert2D_xyz2d( cur_idx, q,
                              u,
                              alpha2,
                              beta );
    }
    cur_idx += (a2*b);
    u = _add(u, alpha2);

    _dprint("#  Gilbert2D_xyz2d.W1");

    return Gilbert2D_xyz2d( cur_idx, q,
                            u,
                            _add(alpha, _neg(alpha2)),
                            beta );

  }


  if ((b2%2) && (b>2)) {
    beta2 = _add(beta2, d_beta);
    b2 = _abs(beta2);
  }

  _dprint("#  Gilbert2D_xyz2d.A: q:", q, "u:", u, "beta2:", beta2, "alpha2:", alpha2);

  if (_inBounds(q, u, beta2, alpha2)) {
    return Gilbert2D_xyz2d( cur_idx, q,
                            u,
                            beta2,
                            alpha2 );
  }
  cur_idx += (b2*a2);

  _dprint("#  Gilbert2D_xyz2d.B");

  u = _add(p, beta2);
  if (_inBounds(q, u, alpha, _add(beta, _neg(beta2)))) {
    return Gilbert2D_xyz2d( cur_idx, q,
                            u,
                            alpha,
                            _add(beta, _neg(beta2)) );
  }
  cur_idx += (a*(b-b2));

  _dprint("#  Gilbert2D_xyz2d.C");

  u = _add(p,
           _add( _add(alpha, _neg(d_alpha) ),
                 _add(beta2, _neg( d_beta) ) ) );
  return Gilbert2D_xyz2d( cur_idx, q,
                          u,
                          _neg(beta2),
                          _add(alpha2, _neg(alpha)) );

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
// recursive, async
//
function *Gilbert2DAsync(p, alpha, beta) {
  let a = _abs(alpha);
  let b = _abs(beta);

  _dprint("#Gilbert2DAsync", alpha, beta, "(", a, b, ")");

  let d_alpha = _delta(alpha);
  let d_beta  = _delta(beta);

  if (b==1) {
    let u = _clone(p);
    for (let i=0; i<a; i++) {
      yield u;
      u = _add(u, d_alpha);
    }
    return;
  }


  if (a==1) {
    let u = _clone(p);
    for (let i=0; i<b; i++) {
      yield u;
      u = _add(u, d_beta);
    }
    return;
  }

  let alpha2 = _div2(alpha);
  let beta2  = _div2(beta);

  let a2 = _abs(alpha2);
  let b2 = _abs(beta2);

  _dprint("#  Gilbert2DAsync: (alpha2,beta2):", alpha2, beta2, "(", a2, b2, ")");

  if ( (2*a) > (3*b) ) {
    if ((a2%2) && (a>2)) { alpha2 = _add(alpha2, d_alpha); }

    _dprint("#  Gilbert2DAsync: 2a>3b:A");

    yield* Gilbert2DAsync( p, alpha2, beta );

    _dprint("#  Gilbert2DAsync: 2a>3b:B");

    yield* Gilbert2DAsync( _add(p, alpha2),
                           _add(alpha, _neg(alpha2)),
                           beta );

    return;
  }


  if ((b2%2) && (b>2)) { beta2 = _add(beta2, d_beta); }

  _dprint("#  Gilbert2DAsync: A (alpha:", alpha, "beta:", beta, "alpha2:", alpha2, "beta2:", beta2, ")", "(|a2|:", a2, "|b2|:", b2, ")");

  yield* Gilbert2DAsync( p,
                         beta2,
                         alpha2 );

  _dprint("#  Gilbert2DAsync: B (alpha:", alpha, "beta:", beta, "alpha2:", alpha2, "beta2:", beta2, ")", "(|a2|:", a2, "|b2|:", b2, ")");

  yield* Gilbert2DAsync( _add(p, beta2),
                         alpha,
                         _add(beta, _neg(beta2)) );

  _dprint("#  Gilbert2DAsync: C (alpha:", alpha, "beta:", beta, "alpha2:", alpha2, "beta2:", beta2, ")", "(|a2|:", a2, "|b2|:", b2, ")");

  yield* Gilbert2DAsync( _add(p,
                         _add( _add(alpha, _neg(d_alpha) ),
                               _add(beta2, _neg( d_beta) ) ) ),
                         _neg(beta2),
                         _add(alpha2, _neg(alpha)) );

  return;
}

//-------------------
//         ____    __
//   ___ _|_  /___/ /
//  / _ `//_ </ _  / 
//  \_, /____/\_,_/  
// /___/             
//-------------------

// proof of concept hilbert2x2x2, single function, print out only
//
function g2x2x2p(p, alpha, beta, gamma) {

  let xyz = _clone(p);

  let d_alpha = _delta(alpha);
  let d_beta  = _delta(beta);
  let d_gamma = _delta(gamma);

  console.log(xyz[0], xyz[1], xyz[2]);

  xyz = _add(xyz, d_beta);
  console.log(xyz[0], xyz[1], xyz[2]);

  xyz = _add(xyz, d_gamma);
  console.log(xyz[0], xyz[1], xyz[2]);

  xyz = _add(xyz, _neg(d_beta));
  console.log(xyz[0], xyz[1], xyz[2]);

  xyz = _add(xyz, d_alpha);
  console.log(xyz[0], xyz[1], xyz[2]);

  xyz = _add(xyz, d_beta);
  console.log(xyz[0], xyz[1], xyz[2]);

  xyz = _add(xyz, _neg(d_gamma));
  console.log(xyz[0], xyz[1], xyz[2]);

  xyz = _add(xyz, _neg(d_beta));
  console.log(xyz[0], xyz[1], xyz[2]);
}

// proof of concept implimentation (single function (mostly), print out only
//
function g3d_p(p, alpha, beta, gamma) {

  console.log("##>>", p, alpha, beta, gamma);

  // forced even axis
  //
  let alpha_2e = [ d2e(alpha[0]), d2e(alpha[1]), d2e(alpha[2]) ];
  let beta_2e  = [ d2e( beta[0]), d2e( beta[1]), d2e( beta[2]) ];
  let gamma_2e = [ d2e(gamma[0]), d2e(gamma[1]), d2e(gamma[2]) ];

  // remainder of even axis
  //
  let alpha_2s = [ alpha[0] - alpha_2e[0], alpha[1] - alpha_2e[1], alpha[2] - alpha_2e[2] ];
  let beta_2s  = [  beta[0] -  beta_2e[0],  beta[1] -  beta_2e[1],  beta[2] -  beta_2e[2]  ];
  let gamma_2s = [ gamma[0] - gamma_2e[0], gamma[1] - gamma_2e[1], gamma[2] - gamma_2e[2] ];

  // forced odd axis
  //
  let alpha_2u = [ d2u(alpha[0]), d2u(alpha[1]), d2u(alpha[2]) ];
  let beta_2u  = [ d2u( beta[0]), d2u( beta[1]), d2u( beta[2]) ];
  let gamma_2u = [ d2u(gamma[0]), d2u(gamma[1]), d2u(gamma[2]) ];

  // remainder of forced odd axis
  //
  let alpha_2up = [ alpha[0] - alpha_2u[0], alpha[1] - alpha_2u[1], alpha[2] - alpha_2u[2] ];
  let beta_2up  = [  beta[0] -  beta_2u[0],  beta[1] -  beta_2u[1],  beta[2] -  beta_2u[2] ];
  let gamma_2up = [ gamma[0] - gamma_2u[0], gamma[1] - gamma_2u[1], gamma[2] - gamma_2u[2] ];


  // length of each axis
  //
  let a = _abs(alpha);
  let b = _abs(beta);
  let g = _abs(gamma);

  if ((a==0) ||
      (b==0) ||
      (g==0)) {
    console.log("###!!!Z", a, b, g);
    return;
  }

  if ((a==2) &&
      (b==2) &&
      (g==2)) {
    g2x2x2p(p, alpha, beta, gamma);
    return;
  }

  // (unit) direction of each axis
  //
  let d_alpha = _delta(alpha);
  let d_beta  = _delta(beta);
  let d_gamma = _delta(gamma);


  let xyz = [ p[0], p[1], p[2] ];

  // Two dimensions are 1, linear in the other,
  // so enumerate.
  //
  if ((a==1) && (b==1)) {

    console.log("#L_ab");

    for (let i=0; i<g; i++) {
      console.log(xyz[0], xyz[1], xyz[2]);
      xyz = _add( xyz, d_gamma );
    }
    return;
  }

  else if ((a==1) && (g==1)) {

    console.log("#L_ag");

    for (let i=0; i<b; i++) {
      console.log(xyz[0], xyz[1], xyz[2]);
      xyz = _add( xyz, d_beta );
    }
    return;
  }

  else if ((b==1) && (g==1)) {

    console.log("#L_bg");

    for (let i=0; i<a; i++) {
      console.log(xyz[0], xyz[1], xyz[2]);
      xyz = _add( xyz, d_alpha );
    }
    return;
  }

  // This is a pathological case.
  // If we have |alpha| = 1, it means
  // the start and end are the same point
  // but the region is non-trivial.
  //
  else if (a==1) {

    console.log("#A_1", p, beta, gamma);

    g2d_p( p, beta, gamma );
    return;
  }

  // Otherwse, we have a plane sheet,
  // so reduce to the 2d Gilbert case.
  //
  else if (b==1) {

    console.log("#B_1", p, alpha, gamma);

    g2d_p( p , alpha, gamma );
    return;
  }

  else if (g==1) {

    console.log("#G_1", p, alpha, beta);

    g2d_p( p, alpha, beta );
    return;
  }


  let alpha2  = ( (a==2) ? _div2(alpha) : alpha_2e );
  let beta2   = ( (b==2) ?  _div2(beta) :  beta_2e );
  let gamma2  = ( (g==2) ? _div2(gamma) : gamma_2e );

  let alpha2p = _add( alpha, _neg(alpha2) );
  let beta2p  = _add( beta, _neg(beta2) );
  let gamma2p = _add( gamma, _neg(gamma2) );

  if ((a>2) && (g%2)) {
    alpha2  = alpha_2u;
    alpha2p = _add( alpha, _neg(alpha2) );
  }

  console.log("#a2/b2/g2:", alpha2, beta2, gamma2);
  console.log("#a2e/b2e/g2e:", alpha_2e, beta_2e, gamma_2e);
  console.log("#a2s/b2s/g2s:", alpha_2s, beta_2s, gamma_2s);
  console.log("#a2u/b2u/g2u:", alpha_2u, beta_2u, gamma_2u);
  console.log("#a2up/b2up/g2up:", alpha_2up, beta_2up, gamma_2up);


  // Eccentric tests
  //

  // note order is important:
  // - first test for w greater than both d,h (S_0, 1 case)
  // - test for h bigger then either w,d (S_2, 3 cases)
  // - test for d bigger than h (S_1, 2 cases)
  //

  // S_0
  //
  // width (\alpha) is larger than height/depth (\beta/\gamma)
  // (long skinny horizontal column)
  //
  // Split \alpha at halfway point.
  //
  if ( ((2*a) > (3*b)) &&
       ((2*a) > (3*g)) ) {

    console.log("#S_0.A");

    g3d_p( p, alpha_2e, beta, gamma );

    console.log("#S_0.B");

    g3d_p( _add(p, alpha_2e), alpha_2s, beta, gamma );
    return;
  }


  // S_2
  //
  // height (\beta) is too long
  // (long skinny height column or height/width sheet)
  //
  // Split by \rho = 2/3 in \beta axis
  //   and by 1/2 in \alpha axis
  //
  //
  else if ( ((2*b) > (3*g)) ||
            ((2*b) > (3*a)) ) {

    let beta_13e  = [ dqe(beta[0],3), dqe(beta[1],3), dqe(beta[2],3) ];
    let beta_23s  = [ beta[0] - beta_13e[0], beta[1] - beta_13e[1], beta[2] - beta_13e[2] ];

    console.log("##b13e/b23s:", beta_13e, beta_23s);

    console.log("#S_2.A");

    g3d_p( p, beta_13e, gamma, alpha2 );

    console.log("#S_2.B");

    g3d_p( _add(p, beta_13e),
          alpha,
          beta_23s,
          gamma);

    console.log("#S_2.C");

    g3d_p(_add(p, _add( _add(alpha, _neg(d_alpha)), _add(beta_13e, _neg(d_beta)) )),
          _neg(beta_13e),
          gamma,
          _neg(alpha2p));

    return;
  }

  // S_1
  //
  // depth (\gamma) too long
  //
  // Split by \rho = 2/3 in \gamma dimension
  // and then again by 1/2 in \alpha dimension
  //
  else if ( (2*g) > (3*b) ) {

    let gamma_13e  = [ dqe(gamma[0],3), dqe(gamma[1],3), dqe(gamma[2],3) ];
    let gamma_23s  = [ gamma[0] - gamma_13e[0], gamma[1] - gamma_13e[1], gamma[2] - gamma_13e[2] ];

    console.log("#S_1.A");

    g3d_p(p,
          gamma_13e,
          alpha2,
          beta);

    console.log("#S_1.B");

    g3d_p(_add(p, gamma_13e),
          alpha,
          beta,
          gamma_23s);

    console.log("#S_1.C");

    g3d_p(_add(p, _add( _add(alpha, _neg(d_alpha)), _add(gamma_13e, _neg(d_gamma)) )),
          _neg(gamma_13e),
          _neg(alpha2p),
          beta);

    return;

  }



  // bulk recursion
  //
  //

  // J_2 (a==1, b==1, g==1)
  //
  if (((a%2) == 1) &&
      ((b%2) == 1) &&
      ((g%2) == 1)) {


    console.log("#J_2.A");

    xyz = [ p[0], p[1], p[2] ];
    g3d_p( xyz, beta2, gamma, alpha2 );

    console.log("#J_2.B");

    xyz = _add( p, beta2 );
    g3d_p( xyz, gamma2, alpha, beta2p );

    console.log("#J_2.C");

    xyz = _add( _add( p, beta2 ), gamma2 );
    g3d_p( xyz, alpha, beta2p, gamma2p );

    console.log("#J_2.D");

    xyz = _add( _add( _add( p, _add(beta2, _neg(d_beta)) ), gamma2 ), _add(alpha, _neg(d_alpha)) );
    g3d_p( xyz, _neg(beta2), gamma2p, _neg(alpha2p) );

    console.log("#J_2.E");

    xyz = _add( _add( p, _add(alpha, _neg(d_alpha)) ), _add(gamma2, _neg(d_gamma)) );
    g3d_p( xyz, _neg(gamma2), _neg(alpha2p), beta2 );

    return;
  }


  // J_1 (a/b/g = {001, 011, 101})
  //
  else if ((g%2) == 1) {

    console.log("#J_1.A");

    // A
    xyz = [ p[0], p[1], p[2] ];
    g3d_p( xyz, gamma2, alpha2, beta2);

    console.log("#J_1.B");

    // B
    xyz = _add( p, gamma2 );
    g3d_p( xyz, beta, gamma2p, alpha2);

    console.log("#J_1.C");

    // C
    xyz = _add( _add( p, _add(gamma2, _neg(d_gamma)) ), _add(beta, _neg(d_beta)) );
    g3d_p( xyz, alpha, _neg(beta2p), _neg(gamma2) );

    console.log("#J_1.D");

    // D
    xyz = _add( _add( _add( p, gamma2 ), _add(beta, _neg(d_beta)) ), _add(alpha, _neg(d_alpha)) );
    g3d_p( xyz, _neg(beta), gamma2p, _neg(alpha2p) );

    console.log("#J_1.E");

    // E
    xyz = _add( _add( p, _add(alpha, _neg(d_alpha)) ), _add(gamma2, _neg(d_gamma)) );
    g3d_p( xyz, _neg(gamma2), _neg(alpha2p), beta2);

    return;
  }


  //----
  // P_0 (g==0)
  //----

  console.log("#P_0.A");

  xyz = [ p[0], p[1], p[2] ];
  g3d_p( xyz, beta2, gamma2, alpha2 );

  console.log("#P_0.B");

  xyz = _add(p, beta2);
  g3d_p( xyz, gamma, alpha2, beta2p );

  console.log("#P_0.C");

  xyz = _add( _add( p, _add(beta2, _neg(d_beta)) ), _add(gamma, _neg(d_gamma)) );
  g3d_p( xyz, alpha, _neg(beta2), _neg(gamma2p) );

  console.log("#P_0.D");

  xyz = _add( _add( _add(p, beta2), _add(alpha, _neg(d_alpha)) ), _add(gamma, _neg(d_gamma)) );
  g3d_p( xyz, _neg(gamma), _neg(alpha2p), beta2p);

  console.log("#P_0.E");

  xyz = _add( _add(p, _add(beta2, _neg(d_beta)) ), _add(alpha, _neg(d_alpha)) );
  g3d_p( xyz, _neg(beta2), gamma2, _neg(alpha2p) );

}

//----------------------------------------
//                             ____    __
//   ___ __ _____  ____  ___ _|_  /___/ /
//  (_-</ // / _ \/ __/ / _ `//_ </ _  / 
// /___/\_, /_//_/\__/  \_, /____/\_,_/  
//     /___/           /___/             
//----------------------------------------

function Hilbert2x2x2_d2xyz(dst_idx, cur_idx, p, alpha, beta, gamma) {
  let d_alpha = _delta(alpha);
  let d_beta  = _delta(beta);
  let d_gamma = _delta(gamma);

  let d_idx = dst_idx - cur_idx;

  _dprint("#H2x2x2: d_idx:", d_idx, "dst_idx:", dst_idx, "cur_idx:", cur_idx);

  switch (d_idx) {
    case 0: return [ p[0], p[1], p[2] ]; break;
    case 1: return _add(p, d_beta); break;
    case 2: return _add(p, _add(d_beta, d_gamma)); break;
    case 3: return _add(p, d_gamma); break;
    case 4: return _add(p, _add(d_alpha, d_gamma)); break;
    case 5: return _add(p, _add(d_alpha, _add(d_beta, d_gamma))); break;
    case 6: return _add(p, _add(d_alpha, d_beta)); break;
    case 7: return _add(p, d_alpha); break;
    default: return [-1,-1,-1]; break;
  }

  return [-1,-1,-1];
}

function Hilbert2x2x2_xyz2d(idx, q, p, alpha, beta, gamma) {
  let d_alpha = _delta(alpha);
  let d_beta  = _delta(beta);
  let d_gamma = _delta(gamma);

  let lu = [ 0, 7,  1, 6,  3, 4,  2, 5 ];

  let dxyz = [
    q[0] - p[0],
    q[1] - p[1],
    q[2] - p[2]
  ];

  let m_qp = _add(q, _neg(p));

  dxyz = [
    _dot(d_alpha, m_qp),
    _dot(d_beta, m_qp),
    _dot(d_gamma, m_qp)
  ];

  let p_idx = (4*dxyz[2]) + (2*dxyz[1]) + dxyz[0];

  _dprint("#Hilbert2x2x2_xyz2d: idx:", idx, "q:", q, "p:", p, "alpha:", alpha, "beta:", beta, "gamma:", gamma, "dxyz:", dxyz);

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

  let alpha2  = _div2(alpha);
  let d_alpha = _delta(alpha);

  let a   = _abs(alpha);
  let a2  = _abs(alpha2);

  let b   = _abs(beta);
  let g   = _abs(gamma);

  _dprint("#S0_d2xyz (a:", _abs(alpha), "b:", _abs(beta), "g:", _abs(gamma), ")");

  if ((a > 2) && ((a2 % 2)==1)) {
    alpha2 = _add(alpha2, d_alpha);
    a2 = _abs(alpha2);
  }

  let nxt_idx = cur_idx + (a2*b*g);

  _dprint("#S0.A_d2xyz {dst:",dst_idx, "cur:", cur_idx, "nxt:", nxt_idx, "}");

  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {

    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            p,
                            alpha2, beta, gamma );
  }
  cur_idx = nxt_idx;

  _dprint("#S0.B_d2xyz");

  return Gilbert3D_d2xyz( dst_idx, cur_idx,
                          _add(p, alpha2),
                          _add(alpha, _neg(alpha2)), beta, gamma );
}

//---------------------------------------------------
//    ____    __  _______                  ___     __
//   |_  /___/ / / __/ _ \  __ ____ _____ |_  |___/ /
//  _/_ </ _  / _\ \/ // /  \ \ / // /_ // __// _  / 
// /____/\_,_/ /___/\___/  /_\_\\_, //__/____/\_,_/  
//                             /___/                 
//---------------------------------------------------

function Gilbert3DS0_xyz2d( cur_idx, q, p, alpha, beta, gamma ) {

  let alpha2  = _div2(alpha);
  let d_alpha = _delta(alpha);

  let a   = _abs(alpha);
  let a2  = _abs(alpha2);

  let b   = _abs(beta);
  let g   = _abs(gamma);

  _dprint("#S0_xyz2d (a:", _abs(alpha), "b:", _abs(beta), "g:", _abs(gamma), ")");

  if ((a > 2) && ((a2 % 2)==1)) {
    alpha2 = _add(alpha2, d_alpha);
    a2 = _abs(alpha2);
  }

  _dprint("#S0.A_xyz2d");

  let u = _clone(p);
  if (_inBounds( q, p, alpha2, beta, gamma )) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            alpha2, beta, gamma );
  }
  cur_idx += (a2*b*g);

  _dprint("#S0.B_xyz2d");

  u = _add(p, alpha2);
  return Gilbert3D_xyz2d( cur_idx, q,
                          u,
                          _add(alpha, _neg(alpha2)), beta, gamma );
}

//----------------------------------------------
//    ____    __  _______     _____             
//   |_  /___/ / / __<  / ___/ /_  |_ ____ _____
//  _/_ </ _  / _\ \ / / / _  / __/\ \ / // /_ /
// /____/\_,_/ /___//_/  \_,_/____/_\_\\_, //__/
//                                    /___/     
//----------------------------------------------

function Gilbert3DS1_d2xyz( dst_idx, cur_idx, p, alpha, beta, gamma ) {
  let alpha2 = _div2(alpha);
  let gamma3 = _divq(gamma, 3);

  let d_alpha = _delta(alpha);
  let d_gamma = _delta(gamma);

  let a = _abs(alpha);
  let b = _abs(beta);
  let g = _abs(gamma);

  let a2 = _abs(alpha2);
  let g3 = _abs(gamma3);

  _dprint("#S1_d2xyz (a:", _abs(alpha), "b:", _abs(beta), "g:", _abs(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 1)) {
    alpha2 = _add(alpha2, d_alpha);
    a2 = _abs(alpha2);
  }

  if ((g > 2) && ((g3 % 2) == 1)) {
    gamma3 = _add(gamma3, d_gamma);
    g3 = _abs(gamma3);
  }

  _dprint("#S1.A_d2xyz");

  let nxt_idx = cur_idx + (g3*a2*b);
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            p,
                            gamma3, alpha2, beta );
  }
  cur_idx = nxt_idx;

  _dprint("#S1.B_d2xyz");

  nxt_idx = cur_idx + (a*b*(g-g3));
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            _add(p, gamma3),
                            alpha, beta, _add(gamma, _neg(gamma3)) );
  }
  cur_idx = nxt_idx;

  _dprint("#S1.C_d2xyz");

  return Gilbert3D_d2xyz( dst_idx, cur_idx,
                          _add(p, _add( _add(alpha, _neg(d_alpha)), _add(gamma3, _neg(d_gamma)) ) ),
                          _neg(gamma3), _neg(_add(alpha, _neg(alpha2))), beta );
}

//-------------------------------------------------
//    ____    __  _______                ___     __
//   |_  /___/ / / __<  / __ ____ _____ |_  |___/ /
//  _/_ </ _  / _\ \ / /  \ \ / // /_ // __// _  / 
// /____/\_,_/ /___//_/  /_\_\\_, //__/____/\_,_/  
//                           /___/                 
//-------------------------------------------------

function Gilbert3DS1_xyz2d( cur_idx, q, p, alpha, beta, gamma ) {
  let alpha2 = _div2(alpha);
  let gamma3 = _divq(gamma, 3);

  let d_alpha = _delta(alpha);
  let d_gamma = _delta(gamma);

  let a = _abs(alpha);
  let b = _abs(beta);
  let g = _abs(gamma);

  let a2 = _abs(alpha2);
  let g3 = _abs(gamma3);

  _dprint("#S1_xyz2d (a:", _abs(alpha), "b:", _abs(beta), "g:", _abs(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 1)) {
    alpha2 = _add(alpha2, d_alpha);
    a2 = _abs(alpha2);
  }

  if ((g > 2) && ((g3 % 2) == 1)) {
    gamma3 = _add(gamma3, d_gamma);
    g3 = _abs(gamma3);
  }

  _dprint("#S1.A_xyz2d");

  let u = _clone(p);
  if (_inBounds(q, u, gamma3, alpha2, beta )) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            gamma3, alpha2, beta );
  }
  cur_idx += (g3*a2*b);

  _dprint("#S1.B_xyz2d");

  u =_add(p, gamma3);
  if (_inBounds(q, u, alpha, beta, _add(gamma, _neg(gamma3)) )) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            alpha, beta, _add(gamma, _neg(gamma3)) );

  }
  cur_idx += (a*b*(g-g3));

  _dprint("#S1.C_xyz2d");

  u = _add(p, _add( _add(alpha, _neg(d_alpha)), _add(gamma3, _neg(d_gamma)) ) );
  return Gilbert3D_xyz2d( cur_idx, q,
                          u,
                          _neg(gamma3), _neg(_add(alpha, _neg(alpha2))), beta );
}



//------------------------------------------------
//    ____    __  _______       _____             
//   |_  /___/ / / __/_  |  ___/ /_  |_ ____ _____
//  _/_ </ _  / _\ \/ __/  / _  / __/\ \ / // /_ /
// /____/\_,_/ /___/____/  \_,_/____/_\_\\_, //__/
//                                      /___/     
//------------------------------------------------

function Gilbert3DS2_d2xyz( dst_idx, cur_idx, p, alpha, beta, gamma ) {
  let alpha2 = _div2(alpha);
  let beta3 = _divq(beta, 3);

  let d_alpha = _delta(alpha);
  let d_beta = _delta(beta);

  let a = _abs(alpha);
  let b = _abs(beta);
  let g = _abs(gamma);

  let a2 = _abs(alpha2);
  let b3 = _abs(beta3);

  _dprint("#S2_d2xyz (a:", _abs(alpha), "b:", _abs(beta), "g:", _abs(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 1)) {
    alpha2 = _add(alpha2, d_alpha);
    a2 = _abs(alpha2);
  }

  if ((b > 2) && ((b3 % 2) == 1)) {
    beta3 = _add(beta3, d_beta);
    b3 = _abs(beta3);
  }

  _dprint("#S2.A_d2xyz");

  let nxt_idx = cur_idx + (b3*g*a2);
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {

    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            p,
                            beta3, gamma, alpha2 );
  }
  cur_idx = nxt_idx;

  _dprint("#S2.B_d2xyz");

  nxt_idx = cur_idx + (a*(b-b3)*g);
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {

    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            _add(p, beta3),
                            alpha, _add(beta, _neg(beta3)), gamma );

  }
  cur_idx = nxt_idx;

  _dprint("#S2.C_d2xyz");

  return Gilbert3D_d2xyz( dst_idx, cur_idx,
                          _add( p, _add( _add(alpha, _neg(d_alpha)), _add(beta3, _neg(d_beta)) ) ),
                          _neg(beta3), gamma, _neg(_add(alpha, _neg(alpha2))) );

}


//----------------------------------------------------
//    ____    __  _______                  ___     __
//   |_  /___/ / / __/_  |  __ ____ _____ |_  |___/ /
//  _/_ </ _  / _\ \/ __/   \ \ / // /_ // __// _  / 
// /____/\_,_/ /___/____/  /_\_\\_, //__/____/\_,_/  
//                             /___/                 
//----------------------------------------------------

function Gilbert3DS2_xyz2d(cur_idx, q, p, alpha, beta, gamma) {
  let alpha2 = _div2(alpha);
  let beta3 = _divq(beta, 3);

  let d_alpha = _delta(alpha);
  let d_beta = _delta(beta);

  let a = _abs(alpha);
  let b = _abs(beta);
  let g = _abs(gamma);

  let a2 = _abs(alpha2);
  let b3 = _abs(beta3);

  _dprint("#S2_xyz2d cur_idx:", cur_idx, "q:", q, "p:", p, "(a:", _abs(alpha), "b:", _abs(beta), "g:", _abs(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 1)) {
    alpha2 = _add(alpha2, d_alpha);
    a2 = _abs(alpha2);
  }

  if ((b > 2) && ((b3 % 2) == 1)) {
    beta3 = _add(beta3, d_beta);
    b3 = _abs(beta3);
  }

  _dprint("#S2.A_xyz2d");

  let u = _clone(p);
  if (_inBounds(q, u, beta3, gamma, alpha2 )) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            beta3, gamma, alpha2 );
  }
  cur_idx += (b3*g*a2);

  _dprint("#S2.B_xyz2d");

  u = _add(p, beta3);
  if (_inBounds(q, u, alpha, _add(beta, _neg(beta3)), gamma )) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            alpha, _add(beta, _neg(beta3)), gamma );
  }
  cur_idx += (a*(b-b3)*g);

  _dprint("#S2.C_xyz2d");

  u = _add( p, _add( _add(alpha, _neg(d_alpha)), _add(beta3, _neg(d_beta)) ) );
  return Gilbert3D_xyz2d( cur_idx, q,
                          u,
                          _neg(beta3), gamma, _neg(_add(alpha, _neg(alpha2))) );

}


//-------------------------------------------------
//    ____    __     _____       _____             
//   |_  /___/ / __ / / _ \  ___/ /_  |_ ____ _____
//  _/_ </ _  / / // / // / / _  / __/\ \ / // /_ /
// /____/\_,_/  \___/\___/  \_,_/____/_\_\\_, //__/
//                                       /___/     
//-------------------------------------------------

function Gilbert3DJ0_d2xyz(dst_idx, cur_idx, p, alpha, beta, gamma) {
  let alpha2  = _div2(alpha);
  let beta2   = _div2(beta);
  let gamma2  = _div2(gamma);

  let d_alpha  = _delta(alpha);
  let d_beta   = _delta(beta);
  let d_gamma  = _delta(gamma);

  let a = _abs(alpha);
  let b = _abs(beta);
  let g = _abs(gamma);

  let a2 = _abs(alpha2);
  let b2 = _abs(beta2);
  let g2 = _abs(gamma2);

  _dprint("#J0_d2xyz (a:", _abs(alpha), "b:", _abs(beta), "g:", _abs(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 1)) { alpha2 = _add(alpha2, d_alpha); a2 = _abs(alpha2); }
  if ((b > 2) && ((b2 % 2) == 1)) { beta2  = _add(beta2, d_beta);   b2 = _abs(beta2); }
  if ((g > 2) && ((g2 % 2) == 1)) { gamma2 = _add(gamma2, d_gamma); g2 = _abs(gamma2); }

  _dprint("#J0.A_d2xyz");

  let nxt_idx = cur_idx + (b2*g2*a2);
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            p,
                            beta2, gamma2, alpha2 );
  }
  cur_idx = nxt_idx;

  _dprint("#J0.B_d2xyz");

  nxt_idx = cur_idx + (g*a2*(b-b2));
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            _add(p, beta2),
                            gamma, alpha2, _add(beta, _neg(beta2)) );
  }
  cur_idx = nxt_idx;

  _dprint("#J0.C_d2xyz");

  nxt_idx = cur_idx + (a*b2*(g-g2));
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            _add( p, _add( _add(beta2, _neg(d_beta)), _add(gamma, _neg(d_gamma)) ) ),
                            alpha, _neg(beta2), _neg( _add(gamma, _neg(gamma2)) ) );
  }
  cur_idx = nxt_idx;

  _dprint("#J0.D_d2xyz");

  nxt_idx = cur_idx + (g*(a-a2)*(b-b2));
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            _add( p, _add( _add(alpha, _neg(d_alpha)), _add(beta2, _add(gamma, _neg(d_gamma))) ) ),
                            _neg(gamma), _neg( _add(alpha, _neg(alpha2)) ), _add(beta, _neg(beta2)) );
  }
  cur_idx = nxt_idx;

  _dprint("#J0.E_d2xyz");

  return Gilbert3D_d2xyz( dst_idx, cur_idx,
                          _add( p, _add( _add(alpha, _neg(d_alpha)), _add(beta2, _neg(d_beta)) ) ),
                          _neg(beta2), gamma2, _neg( _add(alpha, _neg(alpha2)) ) );
}

//----------------------------------------------------
//    ____    __     _____                  ___     __
//   |_  /___/ / __ / / _ \  __ ____ _____ |_  |___/ /
//  _/_ </ _  / / // / // /  \ \ / // /_ // __// _  / 
// /____/\_,_/  \___/\___/  /_\_\\_, //__/____/\_,_/  
//                              /___/                 
//----------------------------------------------------

function Gilbert3DJ0_xyz2d(cur_idx, q, p, alpha, beta, gamma) {
  let alpha2  = _div2(alpha);
  let beta2   = _div2(beta);
  let gamma2  = _div2(gamma);

  let d_alpha  = _delta(alpha);
  let d_beta   = _delta(beta);
  let d_gamma  = _delta(gamma);

  let a = _abs(alpha);
  let b = _abs(beta);
  let g = _abs(gamma);

  let a2 = _abs(alpha2);
  let b2 = _abs(beta2);
  let g2 = _abs(gamma2);

  _dprint("#J0_xyz2d (a:", _abs(alpha), "b:", _abs(beta), "g:", _abs(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 1)) { alpha2 = _add(alpha2, d_alpha); a2 = _abs(alpha2); }
  if ((b > 2) && ((b2 % 2) == 1)) { beta2  = _add(beta2, d_beta);   b2 = _abs(beta2); }
  if ((g > 2) && ((g2 % 2) == 1)) { gamma2 = _add(gamma2, d_gamma); g2 = _abs(gamma2); }

  _dprint("#J0.A_xyz2d");

  let u = _clone(p);
  if (_inBounds(q, u, beta2, gamma2, alpha2)) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            beta2, gamma2, alpha2 );
  }
  cur_idx += (b2*g2*a2);

  _dprint("#J0.B_xyz2d");

  u = _add(p, beta2);
  if (_inBounds(q, u, gamma, alpha2, _add(beta, _neg(beta2)) )) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            gamma, alpha2, _add(beta, _neg(beta2)) );
  }
  cur_idx += (g*a2*(b-b2));

  _dprint("#J0.C_xyz2d");

  u = _add( p, _add( _add(beta2, _neg(d_beta)), _add(gamma, _neg(d_gamma)) ) );
  if (_inBounds(q, u, alpha, _neg(beta2), _neg( _add(gamma, _neg(gamma2)) ) )) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            alpha, _neg(beta2), _neg( _add(gamma, _neg(gamma2)) ) );
  }
  cur_idx += (a*b2*(g-g2));

  _dprint("#J0.D_xyz2d");

  u = _add( p, _add( _add(alpha, _neg(d_alpha)), _add(beta2, _add(gamma, _neg(d_gamma))) ) );
  if (_inBounds(q, u, _neg(gamma), _neg( _add(alpha, _neg(alpha2)) ), _add(beta, _neg(beta2)) )) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            _neg(gamma), _neg( _add(alpha, _neg(alpha2)) ), _add(beta, _neg(beta2)) );
  }
  cur_idx += (g*(a-a2)*(b-b2));

  _dprint("#J0.E_xyz2d");

  u = _add( p, _add( _add(alpha, _neg(d_alpha)), _add(beta2, _neg(d_beta)) ) );
  return Gilbert3D_xyz2d( cur_idx, q,
                          u,
                          _neg(beta2), gamma2, _neg( _add(alpha, _neg(alpha2)) ) );
}

//-----------------------------------------------
//    ____    __     _____     _____             
//   |_  /___/ / __ / <  / ___/ /_  |_ ____ _____
//  _/_ </ _  / / // // / / _  / __/\ \ / // /_ /
// /____/\_,_/  \___//_/  \_,_/____/_\_\\_, //__/
//                                     /___/     
//-----------------------------------------------

function Gilbert3DJ1_d2xyz(dst_idx, cur_idx, p, alpha, beta, gamma) {

  let alpha2  = _div2(alpha);
  let beta2   = _div2(beta);
  let gamma2  = _div2(gamma);

  let d_alpha  = _delta(alpha);
  let d_beta   = _delta(beta);
  let d_gamma  = _delta(gamma);

  let a = _abs(alpha);
  let b = _abs(beta);
  let g = _abs(gamma);

  let a2 = _abs(alpha2);
  let b2 = _abs(beta2);
  let g2 = _abs(gamma2);

  _dprint("#J1_d2xyz (a:", _abs(alpha), "b:", _abs(beta), "g:", _abs(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 0)) { alpha2 = _add(alpha2, d_alpha); a2 = _abs(alpha2); }
  if ((b > 2) && ((b2 % 2) == 1)) { beta2  = _add(beta2, d_beta);   b2 = _abs(beta2); }
  if ((g > 2) && ((g2 % 2) == 1)) { gamma2 = _add(gamma2, d_gamma); g2 = _abs(gamma2); }

  _dprint("#J1.A_d2xyz");

  let nxt_idx = cur_idx + (g2*a2*b2);
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            p,
                            gamma2, alpha2, beta2 );
  }
  cur_idx = nxt_idx;

  _dprint("#J1.B_d2xyz");

  nxt_idx = cur_idx + (b*(g-g2)*a2);
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            _add( p, gamma2 ),
                            beta, _add(gamma, _neg(gamma2)), alpha2 );
  }
  cur_idx = nxt_idx;

  _dprint("#J1.C_d2xyz");

  nxt_idx = cur_idx + (a*(b-b2)*g2);
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            _add( p, _add( _add(gamma2, _neg(d_gamma)), _add(beta, _neg(d_beta)) ) ),
                            alpha, _neg(_add(beta, _neg(beta2))), _neg(gamma2) );
  }
  cur_idx = nxt_idx;

  _dprint("#J1.D_d2xyz");

  nxt_idx = cur_idx + (b*(g-g2)*(a-a2));
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            _add( p , _add( _add(alpha, _neg(d_alpha)), _add( _add(beta, _neg(d_beta)), gamma2 ) ) ),
                            _neg(beta), _add(gamma, _neg(gamma2)), _neg(_add(alpha, _neg(alpha2))) );
  }
  cur_idx = nxt_idx;

  _dprint("#J1.E_d2xyz");

  return Gilbert3D_d2xyz( dst_idx, cur_idx,
                          _add( p, _add( _add(alpha, _neg(d_alpha)), _add(gamma2, _neg(d_gamma)) ) ),
                          _neg(gamma2), _neg(_add(alpha, _neg(alpha2))), beta2 );

}

//--------------------------------------------------
//    ____    __     _____                ___     __
//   |_  /___/ / __ / <  / __ ____ _____ |_  |___/ /
//  _/_ </ _  / / // // /  \ \ / // /_ // __// _  / 
// /____/\_,_/  \___//_/  /_\_\\_, //__/____/\_,_/  
//                            /___/                 
//--------------------------------------------------

function Gilbert3DJ1_xyz2d(cur_idx, q, p, alpha, beta, gamma) {

  let alpha2  = _div2(alpha);
  let beta2   = _div2(beta);
  let gamma2  = _div2(gamma);

  let d_alpha  = _delta(alpha);
  let d_beta   = _delta(beta);
  let d_gamma  = _delta(gamma);

  let a = _abs(alpha);
  let b = _abs(beta);
  let g = _abs(gamma);

  let a2 = _abs(alpha2);
  let b2 = _abs(beta2);
  let g2 = _abs(gamma2);

  _dprint("#J1_xyz2d (a:", _abs(alpha), "b:", _abs(beta), "g:", _abs(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 0)) { alpha2 = _add(alpha2, d_alpha); a2 = _abs(alpha2); }
  if ((b > 2) && ((b2 % 2) == 1)) { beta2  = _add(beta2, d_beta);   b2 = _abs(beta2); }
  if ((g > 2) && ((g2 % 2) == 1)) { gamma2 = _add(gamma2, d_gamma); g2 = _abs(gamma2); }

  _dprint("#J1.A_xyz2d");

  let u = _clone(p);
  if (_inBounds(q, u, gamma2, alpha2, beta2)) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            p,
                            gamma2, alpha2, beta2 );
  }
  cur_idx += (g2*a2*b2);

  _dprint("#J1.B_xyz2d");

  u = _add(p, gamma2);
  if (_inBounds(q, u, beta, _add(gamma, _neg(gamma2)), alpha2)) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            beta, _add(gamma, _neg(gamma2)), alpha2 );
  }
  cur_idx += b*(g-g2)*a2;

  _dprint("#J1.C_xyz2d");

  u = _add( p, _add( _add(gamma2, _neg(d_gamma)), _add(beta, _neg(d_beta)) ) );
  if (_inBounds(q, u, alpha, _neg(_add(beta, _neg(beta2))), _neg(gamma2) )) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            alpha, _neg(_add(beta, _neg(beta2))), _neg(gamma2) );
  }
  cur_idx += a*(b-b2)*g2;

  _dprint("#J1.D_xyz2d");

  u = _add( p , _add( _add(alpha, _neg(d_alpha)), _add( _add(beta, _neg(d_beta)), gamma2 ) ) );
  if (_inBounds(q, u, _neg(beta), _add(gamma, _neg(gamma2)), _neg(_add(alpha, _neg(alpha2))) )) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            _neg(beta), _add(gamma, _neg(gamma2)), _neg(_add(alpha, _neg(alpha2))) );
  }
  cur_idx += (b*(g-g2)*(a-a2));

  _dprint("#J1.E_xyz2d");

  u = _add( p, _add( _add(alpha, _neg(d_alpha)), _add(gamma2, _neg(d_gamma)) ) );
  return Gilbert3D_xyz2d( cur_idx, q,
                          u,
                          _neg(gamma2), _neg(_add(alpha, _neg(alpha2))), beta2 );

}

//-----------------------------------------------
//    ____    __     _____       _____             
//   |_  /___/ / __ / /_  |  ___/ /_  |_ ____ _____
//  _/_ </ _  / / // / __/  / _  / __/\ \ / // /_ /
// /____/\_,_/  \___/____/  \_,_/____/_\_\\_, //__/
//                                       /___/     
//-----------------------------------------------

function Gilbert3DJ2_d2xyz(dst_idx, cur_idx, p, alpha, beta, gamma) {

  let alpha2  = _div2(alpha);
  let beta2   = _div2(beta);
  let gamma2  = _div2(gamma);

  let d_alpha  = _delta(alpha);
  let d_beta   = _delta(beta);
  let d_gamma  = _delta(gamma);

  let a = _abs(alpha);
  let b = _abs(beta);
  let g = _abs(gamma);

  let a2 = _abs(alpha2);
  let b2 = _abs(beta2);
  let g2 = _abs(gamma2);

  _dprint("#J2_d2xyz (a:", _abs(alpha), "b:", _abs(beta), "g:", _abs(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 0)) { alpha2 = _add(alpha2, d_alpha); a2 = _abs(alpha2); }
  if ((b > 2) && ((b2 % 2) == 1)) { beta2  = _add(beta2, d_beta);   b2 = _abs(beta2); }
  if ((g > 2) && ((g2 % 2) == 1)) { gamma2 = _add(gamma2, d_gamma); g2 = _abs(gamma2); }

  _dprint("#J2.A_d2xyz");

  let nxt_idx = cur_idx + (b2*g*a2);
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            p,
                            beta2, gamma, alpha2 );
  }
  cur_idx = nxt_idx;

  _dprint("#J2.B_d2xyz");

  nxt_idx = cur_idx + (g2*a*(b-b2));
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            _add(p, beta2),
                            gamma2, alpha, _add(beta, _neg(beta2)) );
  }
  cur_idx = nxt_idx;

  _dprint("#J2.C_d2xyz");

  nxt_idx = cur_idx + (a*(b-b2)*(g-g2));
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            _add(p, _add(beta2, gamma2)),
                            alpha, _add(beta, _neg(beta2)), _add(gamma, _neg(gamma2)) );
  }
  cur_idx = nxt_idx;

  _dprint("#J2.D_d2xyz");

  nxt_idx = cur_idx + (b2*(g-g2)*(a-a2));
  if ((cur_idx <= dst_idx) && (dst_idx < nxt_idx)) {
    return Gilbert3D_d2xyz( dst_idx, cur_idx,
                            _add( p, _add( _add( alpha, _neg(d_alpha) ), _add( _add(beta2, _neg(d_beta)), gamma2 ) ) ),
                            _neg(beta2), _add(gamma, _neg(gamma2)), _neg(_add(alpha, _neg(alpha2))) );
  }
  cur_idx = nxt_idx;

  _dprint("#J2.E_d2xyz");

  return Gilbert3D_d2xyz( dst_idx, cur_idx,
                          _add( p, _add( _add(alpha, _neg(d_alpha)), _add( gamma2, _neg(d_gamma) ) ) ),
                          _neg(gamma2), _neg(_add(alpha, _neg(alpha2))), beta2);

}

//----------------------------------------------------
//    ____    __     _____                  ___     __
//   |_  /___/ / __ / /_  |  __ ____ _____ |_  |___/ /
//  _/_ </ _  / / // / __/   \ \ / // /_ // __// _  / 
// /____/\_,_/  \___/____/  /_\_\\_, //__/____/\_,_/  
//                              /___/                 
//----------------------------------------------------


function Gilbert3DJ2_xyz2d(cur_idx, q, p, alpha, beta, gamma) {

  let alpha2  = _div2(alpha);
  let beta2   = _div2(beta);
  let gamma2  = _div2(gamma);

  let d_alpha  = _delta(alpha);
  let d_beta   = _delta(beta);
  let d_gamma  = _delta(gamma);

  let a = _abs(alpha);
  let b = _abs(beta);
  let g = _abs(gamma);

  let a2 = _abs(alpha2);
  let b2 = _abs(beta2);
  let g2 = _abs(gamma2);


  _dprint("#J2_xyz2d (a:", _abs(alpha), "b:", _abs(beta), "g:", _abs(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 0)) { alpha2 = _add(alpha2, d_alpha); a2 = _abs(alpha2); }
  if ((b > 2) && ((b2 % 2) == 1)) { beta2  = _add(beta2, d_beta);   b2 = _abs(beta2); }
  if ((g > 2) && ((g2 % 2) == 1)) { gamma2 = _add(gamma2, d_gamma); g2 = _abs(gamma2); }

  _dprint("#J2.A_xyz2d");

  let u = _clone(p);
  if (_inBounds(q, p, beta2, gamma, alpha2)) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            beta2, gamma, alpha2 );
  }
  cur_idx += (b2*g*a2);

  _dprint("#J2.B_xyz2d");

  u = _add(p, beta2);
  if (_inBounds(q, u, gamma2, alpha, _add(beta, _neg(beta2)))) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            gamma2, alpha, _add(beta, _neg(beta2)) );
  }
  cur_idx += (g2*a*(b-b2));

  _dprint("#J2.C_xyz2d");

  u = _add(p, _add(beta2, gamma2));
  if (_inBounds(q, u, alpha, _add(beta, _neg(beta2)), _add(gamma, _neg(gamma2)))) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            alpha, _add(beta, _neg(beta2)), _add(gamma, _neg(gamma2)) );
  }
  cur_idx += (a*(b-b2)*(g-g2));

  _dprint("#J2.D_xyz2d");

  u = _add( p, _add( _add( alpha, _neg(d_alpha) ), _add( _add(beta2, _neg(d_beta)), gamma2 ) ) );
  if (_inBounds(q, u, _neg(beta2), _add(gamma, _neg(gamma2)), _neg(_add(alpha, _neg(alpha2))))) {
    return Gilbert3D_xyz2d( cur_idx, q,
                            u,
                            _neg(beta2), _add(gamma, _neg(gamma2)), _neg(_add(alpha, _neg(alpha2))) );
  }
  cur_idx += (b2*(g-g2)*(a-a2));

  _dprint("#J2.E_xyz2d");

  u = _add( p, _add( _add(alpha, _neg(d_alpha)), _add( gamma2, _neg(d_gamma) ) ) );
  return Gilbert3D_xyz2d( cur_idx, q,
                          u,
                          _neg(gamma2), _neg(_add(alpha, _neg(alpha2))), beta2);

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
  let a = _abs(alpha);
  let b = _abs(beta);
  let g = _abs(gamma);

  let a0 = (a % 2);
  let b0 = (b % 2);
  let g0 = (g % 2);

  _dprint("#Gilbert3D_d2xyz: dst_idx:", dst_idx, "cur_idx:", cur_idx, "p:", p, "a:", alpha, "b:", beta, "g:", gamma);

  // base cases
  //
  if ((a == 2) &&
      (b == 2) &&
      (g == 2)) {

    _dprint("#H2x2x2_d2xyz:");

    return Hilbert2x2x2_d2xyz(dst_idx, cur_idx, p, alpha, beta, gamma);
  }

  if (a == 1) { return Gilbert2D_d2xyz(dst_idx, cur_idx, p, beta, gamma); }
  if (b == 1) { return Gilbert2D_d2xyz(dst_idx, cur_idx, p, alpha, gamma); }
  if (g == 1) { return Gilbert2D_d2xyz(dst_idx, cur_idx, p, alpha, beta); }

  // eccentric cases
  //
  if (((3*a) > (5*b)) &&
      ((3*a) > (5*g))) {

    _dprint("#S0_d2xyz:");

    return Gilbert3DS0_d2xyz(dst_idx, cur_idx, p, alpha, beta, gamma);
  }

  if (((2*b) > (3*g)) ||
      ((2*b) > (3*a))) {

    _dprint("#S2_d2xyz:");

    return Gilbert3DS2_d2xyz(dst_idx, cur_idx, p, alpha, beta, gamma);
  }

  if ((2*g) > (3*b)) {

    _dprint("#S1_d2xyz:");

    return Gilbert3DS1_d2xyz(dst_idx, cur_idx, p, alpha, beta, gamma);
  }

  // bulk recursion
  //
  if (g0 == 0) {

    _dprint("#J0_d2xyz:");

    return Gilbert3DJ0_d2xyz(dst_idx, cur_idx, p, alpha, beta, gamma);
  }

  if ((a0 == 0) || (b0 == 0)) {

    _dprint("#J1_d2xyz:");

    return Gilbert3DJ1_d2xyz(dst_idx, cur_idx, p, alpha, beta, gamma);
  }

  _dprint("#J2_d2xyz:");

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
  let a = _abs(alpha);
  let b = _abs(beta);
  let g = _abs(gamma);

  let a0 = (a % 2);
  let b0 = (b % 2);
  let g0 = (g % 2);

  _dprint("#Gilbert3D_xyz2d: cur_idx:", cur_idx, "p:", p, "a:", alpha, "b:", beta, "g:", gamma);

  // base cases
  //
  if ((a == 2) &&
      (b == 2) &&
      (g == 2)) {

    _dprint("#H2x2x2_xyz2d:");

    return Hilbert2x2x2_xyz2d(cur_idx, q, p, alpha, beta, gamma);
  }

  if (a == 1) { return Gilbert2D_xyz2d(cur_idx, q, p, beta, gamma); }
  if (b == 1) { return Gilbert2D_xyz2d(cur_idx, q, p, alpha, gamma); }
  if (g == 1) { return Gilbert2D_xyz2d(cur_idx, q, p, alpha, beta); }

  // eccentric cases
  //
  if (((3*a) > (5*b)) &&
      ((3*a) > (5*g))) {

    _dprint("#S0_xyz2d:");

    return Gilbert3DS0_xyz2d(cur_idx, q, p, alpha, beta, gamma);
  }

  if (((2*b) > (3*g)) ||
      ((2*b) > (3*a))) {

    _dprint("#S2_xyz2d:");

    return Gilbert3DS2_xyz2d(cur_idx, q, p, alpha, beta, gamma);
  }

  if ((2*g) > (3*b)) {

    _dprint("#S1_xyz2d:");

    return Gilbert3DS1_xyz2d(cur_idx, q, p, alpha, beta, gamma);
  }

  // bulk recursion
  //
  if (g0 == 0) {

    _dprint("#J0_xyz2d:");

    return Gilbert3DJ0_xyz2d(cur_idx, q, p, alpha, beta, gamma);
  }

  if ((a0 == 0) || (b0 == 0)) {

    _dprint("#J1_xyz2d:");

    return Gilbert3DJ1_xyz2d(cur_idx, q, p, alpha, beta, gamma);
  }

  _dprint("#J2_xyz2d:");

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
  let xyz = _clone(p);

  let d_alpha = _delta(alpha);
  let d_beta  = _delta(beta);
  let d_gamma = _delta(gamma);

  yield [ xyz[0], xyz[1], xyz[2] ];

  xyz = _add(xyz, d_beta);
  yield [ xyz[0], xyz[1], xyz[2] ];

  xyz = _add(xyz, d_gamma);
  yield [ xyz[0], xyz[1], xyz[2] ];

  xyz = _add(xyz, _neg(d_beta));
  yield [ xyz[0], xyz[1], xyz[2] ];

  xyz = _add(xyz, d_alpha);
  yield [ xyz[0], xyz[1], xyz[2] ];

  xyz = _add(xyz, d_beta);
  yield [ xyz[0], xyz[1], xyz[2] ];

  xyz = _add(xyz, _neg(d_gamma));
  yield [ xyz[0], xyz[1], xyz[2] ];

  xyz = _add(xyz, _neg(d_beta));
  yield [ xyz[0], xyz[1], xyz[2] ];
}

function *Gilbert3DS0Async(p, alpha, beta, gamma) {

  let alpha2  = _div2(alpha);
  let d_alpha = _delta(alpha);

  let a   = _abs(alpha);
  let a2  = _abs(alpha2);

  _dprint("#S0 (a:", _abs(alpha), "b:", _abs(beta), "g:", _abs(gamma), ")");

  if ((a > 2) && ((a2 % 2)==1)) {
    alpha2 = _add(alpha2, d_alpha);
  }

  _dprint("#S0.A");

  yield *Gilbert3DAsync( p,
                         alpha2, beta, gamma );

  _dprint("#S0.B");

  yield *Gilbert3DAsync( _add(p, alpha2),
                         _add(alpha, _neg(alpha2)), beta, gamma );
}

function *Gilbert3DS1Async(p, alpha, beta, gamma) {
  let alpha2 = _div2(alpha);
  let gamma3 = _divq(gamma, 3);

  let d_alpha = _delta(alpha);
  let d_gamma = _delta(gamma);

  let a = _abs(alpha);
  let g = _abs(gamma);

  let a2 = _abs(alpha2);
  let g3 = _abs(gamma3);

  _dprint("#S1 (a:", _abs(alpha), "b:", _abs(beta), "g:", _abs(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 1)) {
    alpha2 = _add(alpha2, d_alpha);
  }

  if ((g > 2) && ((g3 % 2) == 1)) {
    gamma3 = _add(gamma3, d_gamma);
  }

  _dprint("#S1.A");

  yield *Gilbert3DAsync( p,
                         gamma3, alpha2, beta );

  _dprint("#S1.B");

  yield *Gilbert3DAsync( _add(p, gamma3),
                         alpha, beta, _add(gamma, _neg(gamma3)) );

  _dprint("#S1.C");

  yield *Gilbert3DAsync( _add(p, _add( _add(alpha, _neg(d_alpha)), _add(gamma3, _neg(d_gamma)) ) ),
                         _neg(gamma3), _neg(_add(alpha, _neg(alpha2))), beta );
}

function *Gilbert3DS2Async(p, alpha, beta, gamma) {
  let alpha2 = _div2(alpha);
  let beta3 = _divq(beta, 3);

  let d_alpha = _delta(alpha);
  let d_beta = _delta(beta);

  let a = _abs(alpha);
  let b = _abs(beta);

  let a2 = _abs(alpha2);
  let b3 = _abs(beta3);

  _dprint("#S2 (a:", _abs(alpha), "b:", _abs(beta), "g:", _abs(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 1)) {
    alpha2 = _add(alpha2, d_alpha);
  }

  if ((b > 2) && ((b3 % 2) == 1)) {
    beta3 = _add(beta3, d_beta);
  }

  _dprint("#S2.A");

  yield *Gilbert3DAsync( p,
                         beta3, gamma, alpha2 );

  _dprint("#S2.B");

  yield *Gilbert3DAsync( _add(p, beta3),
                         alpha, _add(beta, _neg(beta3)), gamma );

  _dprint("#S2.C");

  yield *Gilbert3DAsync( _add( p, _add( _add(alpha, _neg(d_alpha)), _add(beta3, _neg(d_beta)) ) ),
                         _neg(beta3), gamma, _neg(_add(alpha, _neg(alpha2))) );

}

function *Gilbert3DJ0Async(p, alpha, beta, gamma) {
  let alpha2  = _div2(alpha);
  let beta2   = _div2(beta);
  let gamma2  = _div2(gamma);

  let d_alpha  = _delta(alpha);
  let d_beta   = _delta(beta);
  let d_gamma  = _delta(gamma);

  let a = _abs(alpha);
  let b = _abs(beta);
  let g = _abs(gamma);

  let a2 = _abs(alpha2);
  let b2 = _abs(beta2);
  let g2 = _abs(gamma2);

  _dprint("#J0 (a:", _abs(alpha), "b:", _abs(beta), "g:", _abs(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 1)) { alpha2 = _add(alpha2, d_alpha); }
  if ((b > 2) && ((b2 % 2) == 1)) { beta2  = _add(beta2, d_beta); }
  if ((g > 2) && ((g2 % 2) == 1)) { gamma2 = _add(gamma2, d_gamma); }

  _dprint("#J0.A");

  yield *Gilbert3DAsync( p,
                         beta2, gamma2, alpha2 );

  _dprint("#J0.B");

  yield *Gilbert3DAsync( _add(p, beta2),
                         gamma, alpha2, _add(beta, _neg(beta2)) );

  _dprint("#J0.C");

  yield *Gilbert3DAsync( _add( p, _add( _add(beta2, _neg(d_beta)), _add(gamma, _neg(d_gamma)) ) ),
                         alpha, _neg(beta2), _neg( _add(gamma, _neg(gamma2)) ) );

  _dprint("#J0.D");

  yield *Gilbert3DAsync( _add( p, _add( _add(alpha, _neg(d_alpha)), _add(beta2, _add(gamma, _neg(d_gamma))) ) ),
                         _neg(gamma), _neg( _add(alpha, _neg(alpha2)) ), _add(beta, _neg(beta2)) );

  _dprint("#J0.E");

  yield *Gilbert3DAsync( _add( p, _add( _add(alpha, _neg(d_alpha)), _add(beta2, _neg(d_beta)) ) ),
                         _neg(beta2), gamma2, _neg( _add(alpha, _neg(alpha2)) ) );
}

function *Gilbert3DJ1Async(p, alpha, beta, gamma) {

  let alpha2  = _div2(alpha);
  let beta2   = _div2(beta);
  let gamma2  = _div2(gamma);

  let d_alpha  = _delta(alpha);
  let d_beta   = _delta(beta);
  let d_gamma  = _delta(gamma);

  let a = _abs(alpha);
  let b = _abs(beta);
  let g = _abs(gamma);

  let a2 = _abs(alpha2);
  let b2 = _abs(beta2);
  let g2 = _abs(gamma2);

  _dprint("#J1 (a:", _abs(alpha), "b:", _abs(beta), "g:", _abs(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 0)) { alpha2 = _add(alpha2, d_alpha); }
  if ((b > 2) && ((b2 % 2) == 1)) { beta2  = _add(beta2, d_beta); }
  if ((g > 2) && ((g2 % 2) == 1)) { gamma2 = _add(gamma2, d_gamma); }

  _dprint("#J1.A");

  yield *Gilbert3DAsync(p,
                        gamma2, alpha2, beta2 );


  _dprint("#J1.B");

  yield *Gilbert3DAsync(_add( p, gamma2 ),
                        beta, _add(gamma, _neg(gamma2)), alpha2 );

  _dprint("#J1.C");

  yield *Gilbert3DAsync(_add( p, _add( _add(gamma2, _neg(d_gamma)), _add(beta, _neg(d_beta)) ) ),
                        alpha, _neg(_add(beta, _neg(beta2))), _neg(gamma2) );

  _dprint("#J1.D");

  yield *Gilbert3DAsync(_add( p , _add( _add(alpha, _neg(d_alpha)), _add( _add(beta, _neg(d_beta)), gamma2 ) ) ),
                        _neg(beta), _add(gamma, _neg(gamma2)), _neg(_add(alpha, _neg(alpha2))) );

  _dprint("#J1.E");

  yield *Gilbert3DAsync(_add( p, _add( _add(alpha, _neg(d_alpha)), _add(gamma2, _neg(d_gamma)) ) ),
                        _neg(gamma2), _neg(_add(alpha, _neg(alpha2))), beta2 );

}

function *Gilbert3DJ2Async(p, alpha, beta, gamma) {

  let alpha2  = _div2(alpha);
  let beta2   = _div2(beta);
  let gamma2  = _div2(gamma);

  let d_alpha  = _delta(alpha);
  let d_beta   = _delta(beta);
  let d_gamma  = _delta(gamma);

  let a = _abs(alpha);
  let b = _abs(beta);
  let g = _abs(gamma);

  let a2 = _abs(alpha2);
  let b2 = _abs(beta2);
  let g2 = _abs(gamma2);

  _dprint("#J2 (a:", _abs(alpha), "b:", _abs(beta), "g:", _abs(gamma), ")");

  if ((a > 2) && ((a2 % 2) == 0)) { alpha2 = _add(alpha2, d_alpha); }
  if ((b > 2) && ((b2 % 2) == 1)) { beta2  = _add(beta2, d_beta); }
  if ((g > 2) && ((g2 % 2) == 1)) { gamma2 = _add(gamma2, d_gamma); }

  _dprint("#J2.A");

  yield *Gilbert3DAsync( p,
                         beta2, gamma, alpha2 );

  _dprint("#J2.B");

  yield *Gilbert3DAsync( _add(p, beta2),
                         gamma2, alpha, _add(beta, _neg(beta2)) );

  _dprint("#J2.C");

  yield *Gilbert3DAsync( _add(p, _add(beta2, gamma2)),
                         alpha, _add(beta, _neg(beta2)), _add(gamma, _neg(gamma2)) );

  _dprint("#J2.D");

  yield *Gilbert3DAsync( _add( p, _add( _add( alpha, _neg(d_alpha) ), _add( _add(beta2, _neg(d_beta)), gamma2 ) ) ),
                         _neg(beta2), _add(gamma, _neg(gamma2)), _neg(_add(alpha, _neg(alpha2))) );

  _dprint("#J2.E");

  yield *Gilbert3DAsync( _add( p, _add( _add(alpha, _neg(d_alpha)), _add( gamma2, _neg(d_gamma) ) ) ),
                         _neg(gamma2), _neg(_add(alpha, _neg(alpha2))), beta2);

}

// Gilbert3dAsync
//
function *Gilbert3DAsync(p, alpha, beta, gamma) {
  let a = _abs(alpha);
  let b = _abs(beta);
  let g = _abs(gamma);

  let a0 = (a % 2);
  let b0 = (b % 2);
  let g0 = (g % 2);

  _dprint("#Gilbert3DAsync: p:", p, "a:", alpha, "b:", beta, "g:", gamma);

  // base cases
  //
  if ((a == 2) &&
      (b == 2) &&
      (g == 2)) {

    _dprint("#H2x2x2:");

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

    _dprint("#S0:");

    yield *Gilbert3DS0Async(p, alpha, beta, gamma);
    return;
  }

  if (((2*b) > (3*g)) ||
      ((2*b) > (3*a))) {

    _dprint("#S2:");

    yield *Gilbert3DS2Async(p, alpha, beta, gamma);
    return;
  }

  if ((2*g) > (3*b)) {

    _dprint("#S1:");

    yield *Gilbert3DS1Async(p, alpha, beta, gamma);
    return;
  }

  // bulk recursion
  //
  if (g0 == 0) {

    _dprint("#J0:");

    yield *Gilbert3DJ0Async(p, alpha, beta, gamma);
    return;
  }

  if ((a0 == 0) || (b0 == 0)) {

    _dprint("#J1:");

    yield *Gilbert3DJ1Async(p, alpha, beta, gamma);
    return;
  }

  _dprint("#J2:");

  // a0 == b0 == g0 == 1
  //
  yield *Gilbert3DJ2Async(p, alpha, beta, gamma);
}


//--------------------------------------------

function __g3d_p(p, alpha, beta, gamma) {

  console.log("##>>", p, alpha, beta, gamma);

  let alpha2  = _div2(alpha);
  let beta2   = _div2(beta);
  let gamma2  = _div2(gamma);

  // forced even axis
  //
  let alpha_2e = [ d2e(alpha[0]), d2e(alpha[1]), d2e(alpha[2]) ];
  let beta_2e  = [ d2e( beta[0]), d2e( beta[1]), d2e( beta[2]) ];
  let gamma_2e = [ d2e(gamma[0]), d2e(gamma[1]), d2e(gamma[2]) ];

  // remainder of even axis
  //
  let alpha_2s = [ alpha[0] - alpha_2e[0], alpha[1] - alpha_2e[1], alpha[2] - alpha_2e[2] ];
  let beta_2s  = [  beta[0] -  beta_2e[0],  beta[1] -  beta_2e[1],  beta[2] -  beta_2e[2]  ];
  let gamma_2s = [ gamma[0] - gamma_2e[0], gamma[1] - gamma_2e[1], gamma[2] - gamma_2e[2] ];

  // forced odd axis
  //
  let alpha_2u = [ d2u(alpha[0]), d2u(alpha[1]), d2u(alpha[2]) ];
  let beta_2u  = [ d2u( beta[0]), d2u( beta[1]), d2u( beta[2]) ];
  let gamma_2u = [ d2u(gamma[0]), d2u(gamma[1]), d2u(gamma[2]) ];

  // remainder of forced odd axis
  //
  let alpha_2up = [ alpha[0] - alpha_2u[0], alpha[1] - alpha_2u[1], alpha[2] - alpha_2u[2] ];
  let beta_2up  = [  beta[0] -  beta_2u[0],  beta[1] -  beta_2u[1],  beta[2] -  beta_2u[2] ];
  let gamma_2up = [ gamma[0] - gamma_2u[0], gamma[1] - gamma_2u[1], gamma[2] - gamma_2u[2] ];

  console.log("#a2/b2/g2:", alpha2, beta2, gamma2);
  console.log("#a2e/b2e/g2e:", alpha_2e, beta_2e, gamma_2e);
  console.log("#a2s/b2s/g2s:", alpha_2s, beta_2s, gamma_2s);
  console.log("#a2u/b2u/g2u:", alpha_2u, beta_2u, gamma_2u);
  console.log("#a2up/b2up/g2up:", alpha_2up, beta_2up, gamma_2up);

  // length of each axis
  //
  let a = _abs(alpha);
  let b = _abs(beta);
  let g = _abs(gamma);

  if ((a==0) ||
      (b==0) ||
      (g==0)) {
    console.log("###!!!Z", a, b, g);
    return;
  }

  if ((a==2) && (b==2) && (g==2)) { g2x2x2p(p, alpha, beta, gamma); return; }

  // (unit) direction of each axis
  //
  let d_alpha = _delta(alpha);
  let d_beta  = _delta(beta);
  let d_gamma = _delta(gamma);

  let xyz = [ p[0], p[1], p[2] ];

  // Two dimensions are 1, linear in the other,
  // so enumerate.
  //
  if ((a==1) && (b==1)) {

    console.log("#L_ab");

    for (let i=0; i<g; i++) {
      console.log(xyz[0], xyz[1], xyz[2]);
      xyz = _add( xyz, d_gamma );
    }
    return;
  }

  else if ((a==1) && (g==1)) {

    console.log("#L_ag");

    for (let i=0; i<b; i++) {
      console.log(xyz[0], xyz[1], xyz[2]);
      xyz = _add( xyz, d_beta );
    }
    return;
  }

  else if ((b==1) && (g==1)) {

    console.log("#L_bg");

    for (let i=0; i<a; i++) {
      console.log(xyz[0], xyz[1], xyz[2]);
      xyz = _add( xyz, d_alpha );
    }
    return;
  }

  // This is a pathological case.
  // If we have |alpha| = 1, it means
  // the start and end are the same point
  // but the region is non-trivial.
  //
  else if (a==1) {

    console.log("#A_1", p, beta, gamma);

    g2d_p( p, beta, gamma );
    return;
  }

  // Otherwse, we have a plane sheet,
  // so reduce to the 2d Gilbert case.
  //
  else if (b==1) {

    console.log("#B_1", p, alpha, gamma);

    g2d_p( p , alpha, gamma );
    return;
  }

  else if (g==1) {

    console.log("#G_1", p, alpha, beta);

    g2d_p( p, alpha, beta );
    return;
  }

  // NOTE: order is important:
  // - first test for w greater than both d,h (S_0, 1 case)
  // - test for h bigger then either w,d (S_2, 3 cases)
  // - test for d bigger than h (S_1, 2 cases)
  //

  // S_0
  //
  // width (\alpha) is larger than height/depth (\beta/\gamma)
  // (long skinny horizontal column)
  //
  // Split \alpha at halfway point.
  //
  if ( ((2*a) > (3*b)) &&
       ((2*a) > (3*g)) ) {

    console.log("#S_0.A");

    g3d_p( p, alpha_2e, beta, gamma );

    console.log("#S_0.B");

    g3d_p( _add(p, alpha_2e), alpha_2s, beta, gamma );
    return;
  }


  // S_2
  //
  // height (\beta) is too long
  // (long skinny height column or height/width sheet)
  //
  // Split by \rho = 2/3 in \beta axis
  //   and by 1/2 in \alpha axis
  //
  //
  else if ( ((2*b) > (3*g)) ||
            ((2*b) > (3*a)) ) {

    let _alpha2 = alpha2;
    let _alpha2p = _add( alpha, _neg(alpha2) );

    let beta_13e  = [ dqe(beta[0],3), dqe(beta[1],3), dqe(beta[2],3) ];
    let beta_23s  = [ beta[0] - beta_13e[0], beta[1] - beta_13e[1], beta[2] - beta_13e[2] ];

    console.log("##b13e/b23s:", beta_13e, beta_23s);

    console.log("#S_2.A");

    g3d_p( p, beta_13e, gamma, _alpha2 );

    console.log("#S_2.B");

    g3d_p( _add(p, beta_13e),
          alpha,
          beta_23s,
          gamma);

    console.log("#S_2.C");

    g3d_p(_add(p, _add( _add(alpha, _neg(d_alpha)), _add(beta_13e, _neg(d_beta)) )),
          _neg(beta_13e),
          gamma,
          _neg(_alpha2p));

    return;
  }

  // S_1
  //
  // depth (\gamma) too long
  //
  // Split by \rho = 2/3 in \gamma dimension
  // and then again by 1/2 in \alpha dimension
  //
  else if ( (2*g) > (3*b) ) {

    let _alpha2 = alpha2;
    let _alpha2p = _add( alpha, _neg(alpha2) );

    let gamma_13e  = [ dqe(gamma[0],3), dqe(gamma[1],3), dqe(gamma[2],3) ];
    let gamma_23s  = [ gamma[0] - gamma_13e[0], gamma[1] - gamma_13e[1], gamma[2] - gamma_13e[2] ];

    console.log("#S_1.A");

    g3d_p(p,
          gamma_13e,
          _alpha2,
          beta);

    console.log("#S_1.B");

    g3d_p(_add(p, gamma_13e),
          alpha,
          beta,
          gamma_23s);

    console.log("#S_1.C");

    g3d_p(_add(p, _add( _add(alpha, _neg(d_alpha)), _add(gamma_13e, _neg(d_gamma)) )),
          _neg(gamma_13e),
          _neg(_alpha2p),
          beta);

    return;

  }



  // bulk recursion
  //
  // J_0
  //
  if ((g%2) == 0) {


    let _gamma2  = gamma_2e,
        _gamma2p = gamma_2s;

    _gamma2 = gamma2;
    _gamma2p = _add( gamma, _neg(gamma2) );

    let _alpha2 = alpha_2e,
        _alpha2p = alpha_2s;

    _alpha2 = alpha2;
    _alpha2p = _add( alpha, _neg(alpha2) );

    console.log("#J_0.A");

    xyz = [ p[0], p[1], p[2] ];
    g3d_p( xyz, beta_2e, _gamma2, _alpha2 );

    console.log("#J_0.B");

    xyz = _add(p, beta_2e);
    g3d_p( xyz, gamma, _alpha2, beta_2s );

    console.log("#J_0.C");

    xyz = _add( _add( p, _add(beta_2e, _neg(d_beta)) ), _add(gamma, _neg(d_gamma)) );
    g3d_p( xyz, alpha, _neg(beta_2e), _neg(_gamma2p) );

    console.log("#J_0.D");

    xyz = _add( _add( _add(p, beta_2e), _add(alpha, _neg(d_alpha)) ), _add(gamma, _neg(d_gamma)) );
    g3d_p( xyz, _neg(gamma), _neg(_alpha2p), beta_2s );

    console.log("#J_0.E");

    xyz = _add( _add(p, _add(beta_2e, _neg(d_beta)) ), _add(alpha, _neg(d_alpha)) );
    g3d_p( xyz, _neg(beta_2e), _gamma2, _neg(_alpha2p) );

    return;
  }

  // g%2 == 1
  //
  // J_1
  //
  else if ((b%2) == 0) {


    let _alpha2 = alpha2;
    let _alpha2p = _add( alpha, _neg(alpha2) );

    let _beta2 = beta2;
    let _beta2p = _add( beta, _neg(beta2) );

    console.log("#J_1.A");

    // A
    xyz = [ p[0], p[1], p[2] ];
    g3d_p( xyz, gamma_2e, _alpha2, _beta2);

    console.log("#J_1.B");

    // B
    xyz = _add( p, gamma_2e );
    g3d_p( xyz, beta, gamma_2s, _alpha2);

    console.log("#J_1.C");

    // C
    xyz = _add( _add( p, _add(gamma_2e, _neg(d_gamma)) ), _add(beta, _neg(d_beta)) );
    g3d_p( xyz, alpha, _neg(_beta2p), _neg(gamma_2e) );

    console.log("#J_1.D");

    // D
    xyz = _add( _add( _add( p, gamma_2e ), _add(beta, _neg(d_beta)) ), _add(alpha, _neg(d_alpha)) );
    g3d_p( xyz, _neg(beta), gamma_2s, _neg(_alpha2p) );

    console.log("#J_1.E");

    // E
    xyz = _add( _add( p, _add(alpha, _neg(d_alpha)) ), _add(gamma_2e, _neg(d_gamma)) );
    g3d_p( xyz, _neg(gamma_2e), _neg(_alpha2p), _beta2);

    return;
  }

  // J_1q (a==0, b==1, g==1)
  //
  // we do need an opinion about alpha2 and gamma2
  // as they both need to be odd to get
  // the B and D block to have all odd sides.
  //
  // We don't need an opinion on beta2
  //
  // KEEPING BETA AS IS FOR NOW TO DEBUG
  // TODO: put agnostic beta2 back in
  //
  else if ((a%2) == 0) {

    let _beta2 = beta2;
    let _beta2p = _add( beta, _neg(beta2) );

    xyz = [ p[0], p[1], p[2] ];
    g3d_p( xyz, gamma_2e, alpha_2u, _beta2 );

    xyz = _add(p, gamma_2e);
    g3d_p( xyz, beta, gamma_2u, alpha_2u );

    xyz = _add( _add( p, _add(gamma_2e, _neg(d_gamma)) ), _add(beta, _neg(d_beta)) );
    g3d_p( xyz, alpha, _neg(_beta2p), _neg(gamma_2e) );

    xyz = _add( _add( _add( p, gamma_2e ), _add(beta, _neg(d_beta)) ), _add(alpha, _neg(d_alpha)) );
    g3d_p( xyz, _neg(beta), gamma_2u, _neg(alpha_2up) );

    xyz = _add( _add( p, _add(alpha, _neg(d_alpha)) ), _add(gamma_2e, _neg(d_gamma)) );
    g3d_p( xyz, _neg(gamma_2e), _neg(alpha_2up), _beta2 );

    return;
  }

  // J_2 (a==1, b==1, g==1)
  //

  let _alpha2 = alpha2;
  let _alpha2p = _add(alpha, _neg(alpha2));

  xyz = [ p[0], p[1], p[2] ];
  g3d_p( xyz, beta_2e, gamma, _alpha2 );

  xyz = _add( p, beta_2e );
  g3d_p( xyz, gamma_2e, alpha, beta_2u );

  xyz = _add( _add( p, beta_2e ), gamma_2e );
  g3d_p( xyz, alpha, beta_2u, gamma_2u );

  xyz = _add( _add( _add( p, _add(beta_2e, _neg(d_beta)) ), gamma_2e ), _add(alpha, _neg(d_alpha)) );
  g3d_p( xyz, _neg(beta_2e), gamma_2u, _neg(_alpha2p) );

  xyz = _add( _add( p, _add(alpha, _neg(d_alpha)) ), _add(gamma_2e, _neg(d_gamma)) );
  g3d_p( xyz, _neg(gamma_2e), _neg(_alpha2p), beta_2e );

}

function gilbert3d_plus(w,h,d) {

  g3d_p( [0,0,0], [w,0,0], [0,h,0], [0,0,d] );

}

//---
//---
//---

function test_2d() {
  let z = [0,0,0];
  let w = 8,
      h = 8,
      d = 8;
  let a = [w, 0, 0],
      b = [0, h, 0],
      g = [0, 0, d];

  console.log("##");
  g2d_p(z, a, b);
  console.log("");

  console.log("##");
  g2d_p(z, a, g);
  console.log("");

  console.log("##");
  g2d_p(z, b, g);
  console.log("");

}

function test_suite(s,_w,_h,_d) {

  let test_str = "yx";
  let w = 8,
      h = 8,
      d = 8;

  if (typeof s !== "undefined") { test_str = s; }
  if (typeof _w !== "undefined") { w = parseInt(_w); }
  if (typeof _h !== "undefined") { h = parseInt(_h); }
  if (typeof _d !== "undefined") { d = parseInt(_d); }


  if (test_str == "xy") {
    let g2xy = g2d_r_a([0,0,0], [w,0,0], [0,h,0]);
    for (let hv = g2xy.next(); !hv.done; hv = g2xy.next()) {
      let _val = hv.value;
      console.log(_val[0], _val[1], _val[2], "#", hv);
    }
  }

  else if (test_str == "yx") {

    let g2yx = g2d_r_a([0,0,0], [0,h,0], [w,0,0]);
    for (let hv = g2yx.next(); !hv.done; hv = g2yx.next()) {
      let _val = hv.value;
      console.log(_val[0], _val[1], _val[2], "#", hv);
    }

  }

  else if (test_str == "xz") {

    let g2xz = g2d_r_a([0,0,0], [w,0,0], [0,0,h]);
    for (let hv = g2xz.next(); !hv.done; hv = g2xz.next()) {
      let _val = hv.value;
      console.log(_val[0], _val[1], _val[2], "#", hv);
    }

  }

  else if (test_str == "zx") {

    let g2zx = g2d_r_a([0,0,0], [0,0,h], [w,0,0]);
    for (let hv = g2zx.next(); !hv.done; hv = g2zx.next()) {
      let _val = hv.value;
      console.log(_val[0], _val[1], _val[2], "#", hv);
    }

  }

  else if (test_str == "yz") {

    let g2yz = g2d_r_a([0,0,0], [0,w,0], [0,0,h]);
    for (let hv = g2yz.next(); !hv.done; hv = g2yz.next()) {
      let _val = hv.value;
      console.log(_val[0], _val[1], _val[2], "#", hv);
    }

  }

  else if (test_str == "zy") {

    let g2zy = g2d_r_a([0,0,0], [0,0,h], [0,w,0]);
    for (let hv = g2zy.next(); !hv.done; hv = g2zy.next()) {
      let _val = hv.value;
      console.log(_val[0], _val[1], _val[2], "#", hv);
    }

  }

  else if (test_str == "xyz") {
    g3d_p([0,0,0], [w,0,0], [0,h,0], [0,0,d]);
  }


}

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

  let g3xyz = Gilbert3DAsync(p, alpha, beta, gamma);
  for (let hv = g3xyz.next() ; !hv.done ; hv = g3xyz.next()) {
    let v = hv.value;
    console.log(v[0], v[1], v[2]);
  }
}

function Gilbert2D(w,h) {
  let p = [0,0,0],
      alpha = [w,0,0],
      beta = [0,h,0];

  let g2xy = Gilbert2DAsync(p, alpha, beta);
  for (let hv = g2xy.next() ; !hv.done ; hv = g2xy.next()) {
    let v = hv.value;
    console.log(v[0], v[1]);
  }
}

var OP_LIST = [
  "xy", "xyz", "xyzp",
  "xy2d", "d2xy",
  "xyz2d", "d2xyz",

  "xyz2da", "d2xyza",
  "xy2da", "d2xya"
];


function _show_help(msg) {
  msg = ((typeof msg !== "undefined") ? msg : "");
  if (msg.length > 0) { console.log(msg, "\n"); }

  let op_list = OP_LIST;

  console.log("usage:");
  console.log("");
  console.log("  node ./gilbert3dpp.js [OP] [W] [H] [D]");
  console.log("");
  console.log("  OP   one of '" + op_list.join("', '") + "'");
  console.log("  W    width");
  console.log("  H    height");
  console.log("  D    depth");
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
      Gilbert2D(w,h);
      return;
      let g2xy = Gilbert2DAsync( [0,0, 0], [w,0, 0], [0,h, 0] );
      for (let hv = g2xy.next(); !hv.done; hv = g2xy.next()) {
        let _val = hv.value;
        console.log(_val[0], _val[1]);
      }
    }
    else if (op == "xyz") {
      Gilbert3D(w,h,d);
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
        let xyz = Gilbert3DAdapt_d2xyz(idx, w,h,d);
        console.log(xyz[0], xyz[1], xyz[2]);
      }

    }

    else if (op == "xyz2da") {

      for (let z=0; z<d; z++) {
        for (let y=0; y<h; y++) {
          for (let x=0; x<w; x++) {
            let idx = Gilbert3DAdapt_xyz2d([x,y,z], w,h,d);
            console.log(idx, x,y,z);
          }
        }
      }

    }

    else if (op == "d2xya") {

      for (let idx=0; idx<(w*h*d); idx++) {
        let xyz = Gilbert2DAdapt_d2xy(idx, w,h);
        console.log(xyz[0], xyz[1]);
      }

    }

    else if (op == "xy2da") {

      for (let y=0; y<h; y++) {
        for (let x=0; x<w; x++) {
          let idx = Gilbert2DAdapt_xy2d([x,y], w,h);
          console.log(idx, x,y);
        }
      }

    }

    // legacy function
    //
    else if (op == "xyzp") {
      g3d_p([0,0,0], [w,0,0], [0,h,0], [0,0,d]);
    }
  }
}

if (typeof module !== "undefined") {
  _main(process.argv.slice(1));
}


