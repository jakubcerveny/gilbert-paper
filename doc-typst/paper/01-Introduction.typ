= Introduction

== Overview

We present the _Gilbert curve_, a generalized Hilbert curve for 2D and 3D, that works on arbitrary rectangular regions.

An overview of the benefits of the Gilbert curve are that it is:

- Valid on arbitrary rectangular regions
- Equivalent to the Hilbert curve when dimensions are exact powers of 2
- Efficient at random access lookups ($cal(O)(log N)$)
- A conceptually straightforward algorithm
- Able to realize curves without notches unnecessarily and limits the resulting curve to a single notch when forced
- Similar in measures of locality to the Hilbert curve

Further, we show:

- Measures of locality are preserved (Section X)
- Trivial extensions to create generalized Moore curves (Section X)
- Comparison metrics to other space filling curves (Section X)

Some drawbacks are that:

- Our implementation is recursive, which may be undesirable for some applications requiring better than $cal(O)(log N)$ memory usage or better constant bounds for runtime performance
- Might not adequately capture some features of a Hilbert curve

Generalizations of the Hilbert curve to non power of two rectangular cuboid regions have been explored before but are overly complicated algorithmically, create unbalanced curves and often don't generalize well to 3D. Our realization focuses on a conceptually simple algorithm which creates pleasing resulting curves and works in both 2D and 3D.

Space filling curves are a specialization of a more general Hamiltonian path, but have a more stringent requirement of local connectivity. The local connectivity, or locality, preserves a measure of nearness, where points from the source unit line remain close in the embedded space.

The local connectivity requirements preclude things like _zig-zag_ Hamiltonian paths, as nearby points in the embedded dimension can be far from the origin line.

// FIGURE DESCRIBING LOCALITY, LOCAL CONNECTIVITY

The Gilbert curve algorithm works by choosing sub rectangular cuboid regions, or blocks, to recursively find a connecting path. If one extent of the cuboid becomes too large or small relative to the other lengths, a special subdivision is performed to try and make further subdivisions more cube-like. Subdivisions are performed until a base case is reached and the lowest unit of the curve can be realized.

A Hamiltonian path is not always realizable for certain side lengths and endpoint constraints. In such a case, the Gilbert curve will introduce a single diagonal path move, called a _notch_.

== Definitions

We concern ourselves with a space filling curve, $ω = (ω_0, ω_1, dots.h, ω_{N-1})$, through a rectangular region $(N_x, N_y, N_z)$, $N = (N_x dot.c N_y dot.c N_z)$.

$ k in \{0 dots.h (N-1)\} $

$ x_k, y_k, z_k in NN $

$ ω_k = (x_k, y_k, z_k) $

$ ω = (ω_0, ω_1, dots.h, ω_{N-1}) $

$ k > 1 => |ω_{k-1} - ω_k| = 1 $

$ forall i, j in \{0 dots.h (N-1)\}, i eq.not j => ω_i eq.not ω_j $

For convenience, we use curves in 3D with the understanding that the 2D case is a specialization when $N_z = 1$ and drop the third dimension when convenient and context is clear.

A _Hamiltonian path_ is a path through a graph such that every vertex is visited exactly once. In the context of this paper, we concern ourselves with Hamiltonian paths through the implied graph from integral points in 3D restricted to a cuboid region $(N_x, N_y, N_z)$. Each point in the cuboid represents a vertex in the implied graph, with vertices joined in the graph if points are (Euclidean) distance one away from a neighboring point restricted to the cuboid.

We also concern ourselves with Hamiltonian paths that specify a _start_ and _end_ point within a cuboid region.

*TODO*

- Define locality/local connectivity
- Define space filling
- Define admissible/feasible for Hamiltonian path?
- Define "eccentric" (oblong?)
