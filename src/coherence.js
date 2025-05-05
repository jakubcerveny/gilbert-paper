// To the extent possible under law, the person who associated CC0 with
// this project has waived all copyright and related or neighboring rights
// to this project.
// 
// You should have received a copy of the CC0 legalcode along with this
// work. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
//

var g3dpp = require("./gilbert3dpp/gilbert3dpp.js");

function _rnd(a,b) {
  if (typeof a === "undefined") { return Math.random(); }
  if (typeof b === "undefined") { return a*Math.random(); }

  return ((b-a)*Math.random()) + a;
}

function _irnd(a,b) {
  return Math.floor(((b-a)*Math.random()) + a);
}

function mk_hitobj(center, diam) {

  let hit_obj = {
    "c": [0,0,0],
    "d": diam,
    "n": 0,
    "p" : []
  };

  let _r = hit_obj.d/2;
  hit_obj.c = [center[0], center[1], center[2]];
  for (let y=0; y<hit_obj.d; y++) {
    hit_obj.p.push([]);
    for (let x=0; x<hit_obj.d; x++) {
      hit_obj.p[y].push(-1);
      let ds = Math.sqrt( (x-_r)*(x-_r) + (y-_r)*(y-_r) );
      if (ds < _r) { hit_obj.p[y][x] = 0; }
    }
  }

  return hit_obj;
}

function print_hitobj(hit_obj) {
  for (let y=0; y<hit_obj.d; y++) {
    let s = [];
    for (let x=0; x<hit_obj.d; x++) {
      let v = hit_obj.p[y][x].toString();
      if (v.length == 1) { v = " " + v; }
      s.push( v );
    }
    console.log( s.join(" ") );
  }
}

function _get_hitobj_xy(hit_obj) {
  for (let y=0; y<hit_obj.p.length; y++) {
    for (let x=0; x<hit_obj.p[y].length; x++) {
      if (hit_obj.p[y][x] == 0) { return [x,y, 0]; }
    }
  }
  return [-1,-1, -1];
}

function trace_hitobj(hit_obj, whd) {

  let xyz = _get_hitobj_xy(hit_obj);
  let c = hit_obj.c;

  let N = whd[0]*whd[1]*whd[2];
  let R = hit_obj.d/2;

  let dxyz = [ Math.floor(R), Math.floor(R), 0 ];

  let count=1;
  while ((xyz[0] != -1) && (xyz[1] != -1) && (xyz[2] != -1)) {

    let wxyz = [ xyz[0] + c[0] - dxyz[0], xyz[1] + c[1] - dxyz[1], xyz[2] + c[2] - dxyz[2] ];
    let idx = g3dpp.Gilbert2D_xyz2d(0, wxyz, [0,0,0], [whd[0],0,0], [0,whd[1],0], [0,0,whd[2]]);

    //console.log(xyz, "+", c, "-", dxyz, "-->", wxyz, idx);

    let first = true;
    first = false;

    for (let dd=1; dd>-2; dd-=2) {
      for (let didx=1; didx<N; didx+=dd) {
        if ((idx+didx) >= N) { break; }
        let txyz = g3dpp.Gilbert2D_d2xyz(idx+didx, 0, [0,0,0], [whd[0],0,0], [0,whd[1],0]);
        let _dist = Math.sqrt( (txyz[0]-c[0])*(txyz[0]-c[0]) + (txyz[1]-c[1])*(txyz[1]-c[1]) + (txyz[2]-c[2])*(txyz[2]-c[2]) );
        if (_dist > (2*R)) { break; }

        let _x = txyz[0] - c[0] + dxyz[0];
        let _y = txyz[1] - c[1] + dxyz[1];
        let _z = txyz[2] - c[2] + dxyz[2];


        if ((_x>=0) && (_x < hit_obj.d) &&
            (_y>=0) && (_y < hit_obj.d) &&
            (_z>=0) && (_z < hit_obj.d)) {
          hit_obj.p[_y][_x] = count;

          if (first) { hit_obj.p[_y][_x] = 99; first = false; }
        }


        //console.log(txyz, "+", c, "-", dxyz, "-->>>", _x, _y, _z, "(", count, ", dist:", _dist, ", R:", R, ")");
        //print_hitobj(hit_obj);

      }

      //hit_obj.p[xyz[1]][xyz[0]] = count;
    }

    count++;

    //console.log("\n>>>>", count);
    //print_hitobj(hit_obj);

    xyz = _get_hitobj_xy(hit_obj);
  }

  return count;
}

let whd = [1024,1024,1];

let n_it = 10;
let D = 30;

for (let D = 3; D<200; D++) {

  let scount = 0;

  for (let it=0; it<n_it; it++) {
    let qxy = [500, 500, 0];

    qxy[0] += Math.floor(((Math.random()-0.5)*2)*300);
    qxy[1] += Math.floor(((Math.random()-0.5)*2)*300);

    //console.log("#", qxy);

    //let idx = g3dpp.Gilbert2D_xyz2d(0, qxy, [0,0,0], [whd[0],0,0], [0,whd[1],0], [0,0,whd[2]]);

    let hit_obj = mk_hitobj(qxy, D);
    //print_hitobj(hit_obj);

    scount += trace_hitobj(hit_obj, whd);

    //console.log(D, count);
  }

  console.log(D, D / (scount / n_it) );

}

