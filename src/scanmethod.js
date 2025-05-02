// To the extent possible under law, the person who associated CC0 with
// this project has waived all copyright and related or neighboring rights
// to this project.
// 
// You should have received a copy of the CC0 legalcode along with this
// work. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
//


// statistical test outlined in "A Pseudo-Hilbert Scan for Arbitrarily-Sized Arrays"
// by Jian ZHANG, Sei-ichiro KAMATA, and Yoshifumi UESHIGE
//
// 1. init N, L vectors to 0
// 2. take two points a(X_1,Y_1), b(X_2,Y_2) randomly in a rectangle region
//    R(L_x,L_y), where 1<=X_1,x_2<=L_x and 1<=Y_1,Y_2<=L_y
// 3. Calculate square Euclidean distance d (d \in [0,(L_x-1)^2 + (L_y-1)^2])
//    and scalling lenght l (l \in [0,L_x \cdot L_y]) between two points
//
//    d = (X_2 - X_1)^2 + (Y_2 - Y_1)^2
//    N(d) = N(d) + 1
//    L(d) = L(d) + l
//
// $\widetilde {\textbf{L}} = \frac{L(d)}{N(d)}$
//
// Plots are then done in ( L', d )
//
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

let wh = [64,64];
wh = [128,128];
let p = g3dpp.Gilbert2D(wh[0],wh[1]);

let N = [];
let L = [];

for (let i=0; i<((wh[0]*wh[0]) + (wh[1]*wh[1])); i++) {
  N.push(0);
  L.push(0);
}

let n_it = 1000000;
for (let it=0; it<n_it; it++) {
  let x0 = _irnd(0,wh[0]);
  let x1 = _irnd(0,wh[0]);

  let y0 = _irnd(0,wh[1]);
  let y1 = _irnd(0,wh[1]);

  let d = (x1-x0)*(x1-x0) + (y1-y0)*(y1-y0);

  let l0 = g3dpp.Gilbert2D_xyz2d(0, [x0,y0,0], [0,0,0], [wh[0], 0,0], [0,wh[1],0], [0,0,1]);
  let l1 = g3dpp.Gilbert2D_xyz2d(0, [x1,y1,0], [0,0,0], [wh[0], 0,0], [0,wh[1],0], [0,0,1]);

  N[d] += 1;
  L[d] += Math.abs(l1-l0);;

  //console.log(d, N[d], L[d], "(l:", l1, "-", l0, ")");

}

for (let d=0; d<N.length; d++) {
  if (N[d] == 0) { continue; }

  console.log(L[d]/N[d], d);
}
