// To the extent possible under law, the person who associated CC0 with
// this project has waived all copyright and related or neighboring rights
// to this project.
// 
// You should have received a copy of the CC0 legalcode along with this
// work. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
//


var grid = [];

let n = 200;
let N = n*n;
let n_step = Math.floor((n-1)/2);

let s0 = Math.floor(n/2);
for (let i=0; i<N; i++) {
  grid.push(0);
}
grid[ (s0*n) + s0 ] = 1;


function to_idx(x, y, nx, ny) {
  return x*nx + y;
}

function to_xy(idx, nx, ny) {
  let x = Math.floor(idx/nx);
  let y = idx - (x*nx);
  return [x,y];
}

function print_grid(g, nx, ny) {
  for (let y=0; y<ny; y++) {
    let line = [];
    for (let x=0; x<nx; x++) {
      let idx = (x*nx) + y;

      line.push( g[idx].toString() );
    }
    console.log( line.join(" ") );
  }
  console.log("---\n");
}

function renorm_grid(g) {
  let N = g.length;
  let S = 0;
  for (let i=0; i<N; i++) { S += g[i]; }
  for (let i=0; i<N; i++) { g[i] /= S; }
}

function update_grid(g, nx, ny) {
  let G = [];
  let N = nx*ny;
  for (let i=0; i<N; i++) { G.push(0); }

  let nei_idx =  -1;
  for (let i=0; i<N; i++) {

    let x = Math.floor(i/nx);
    let y = i - (x*nx);

    G[i] += g[i];

    nei_idx = (x*nx) + (y-1);
    if ((nei_idx >= 0) && (nei_idx < N)) {
      G[i] += g[nei_idx];
    }

    nei_idx = (x*nx) + (y+1);
    if ((nei_idx >= 0) && (nei_idx < N)) {
      G[i] += g[nei_idx];
    }

    nei_idx = ((x-1)*nx) + (y);
    if ((nei_idx >= 0) && (nei_idx < N)) {
      G[i] += g[nei_idx];
    }

    nei_idx = ((x+1)*nx) + (y);
    if ((nei_idx >= 0) && (nei_idx < N)) {
      G[i] += g[nei_idx];
    }

  }

  return G;
}

function walk_count(g, nx, ny) {
  let N = nx*ny;
  let p0 = [ Math.floor(nx/2), Math.floor(ny/2) ];

  let S = 0;
  for (let i=0; i<N; i++) {

    let xy = to_xy(i, nx, ny);

    let dx = xy[0] - p0[0];
    let dy = xy[1] - p0[1];

    S += g[i]*Math.sqrt( dx*dx + dy*dy );
  }

  return S;
}

let F = [0];

for (let step=0; step<n_step; step++) {
  grid = update_grid(grid, n, n);
  renorm_grid(grid, n, n);
  F.push( walk_count(grid, n, n) );
}

let count = 0;
for (let i=0; i<F.length; i++) { count += F[i]; }
for (let i=0; i<F.length; i++) { F[i] /= count; }


let plot_type = "holder";

if (plot_type == "simple") {
  for (let i=0; i<F.length; i++) {
    console.log(i / F.length, F[i]);
  }

}

else {

  let D = 2;

  for (let i=0; i<F.length; i++) {
    if (i == 0) { continue; }
    let t = i / F.length;
    console.log( i / F.length, F[i] / Math.pow( i, 1/D ) );
  }
}
