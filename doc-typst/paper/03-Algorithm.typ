#import "@preview/algorithmic:0.1.0"
#import algorithmic: algorithm

= Algorithm

== Overview

We discuss one possible generalization of the Hilbert curve, which we call the Gilbert curve,
to arbitrary axis-aligned cuboid regions.

The design of the Gilbert curve is done to provide a:

- Conceptually simple algorithm
- Harmonious realization
- Resulting curve with good locality conditions

The discretized Hilbert curve recursively traces out a Hamiltonian path through a square
region whose sides are powers of two.
The Gilbert curve extends this idea to trace out Hamiltonian paths through arbitrary axis-aligned
cuboid regions.

The Gilbert curve recursively subdivides a larger cuboid region into smaller cuboid
regions of different sizes and orientations.
The subdivision scheme uses a shape template that will be explained in more detail in subsequent sections.
The orientations of the subdivided cuboid regions are chosen so that the recursive path
will start and end at pre-specified endpoints, connecting neighboring cuboid regions
after a path is realized.

If a cuboid becomes too oblong, or _eccentric_, a subdivision shape template scheme is chosen
in an attempt to create subdivisions that are closer to being cube like.

The subdivided cuboid region is processed by the Gilbert curve algorithm,
with virtual origin point $p in ZZ^3$ and local coordinate system $[alpha, beta, gamma]$,
with $alpha, beta, gamma in ZZ^3$.
Each of $alpha$, $beta$, and $gamma$ are axis-aligned and orthogonal.

In a cuboid region, the Hamiltonian path starts at $p$ and ends at $p + alpha$.
For this reason, we call $alpha$ the "width-like" dimension, with $beta$ and $gamma$
called the "height-like" and "depth-like" dimensions, respectively.

When processing the subdivided cuboid regions, the coordinate system is updated
with new integral lengths and rotated.
Since rotations are only in units of $pi / 2$ radians and $alpha$, $beta$, $gamma$ start
off as axis-aligned and orthogonal, they remain so throughout.

When applying the shape template to choose the subdivided cuboid regions during the course of the
algorithm, side lengths are chosen so as to preserve the possibility of a Hamiltonian path.
Should the lengths of the cuboid being subdivided preclude a Hamiltonian path, the lengths
of the subdivided cuboids are chosen so that all but one will preserve that possibility.
In this case, only a single cuboid absorbs the impossibility, leading to a single jump, or _notch_,
in the resulting curve globally.

The next sub-section discusses parity arguments for when a valid curve can be
traced out in a sub-region.
We then discuss the 2D Gilbert curve algorithm in detail, and end with the 3D Gilbert curve.

When talking about the 2D Gilbert curves, we assume vectors are in $ZZ^3$
so they can be used unaltered for 3D algorithms.

== Valid Paths from Grid Parity

#figure(
  image("./resources/img/simple_hampath.svg"),
  caption: [
    Illustrative examples of Hamiltonian paths for height/width combinations that are even/even, even/odd, and odd/odd,
    starting from the lower-left corner.
  ],
)

The feasibility of a Hamiltonian path in a cuboid grid region can be determined through parity arguments.
Label grid cell points in a volume alternately as 0 or 1 with each axis-aligned step.
Any Hamiltonian path that ends at a corner must have the same parity as the starting point if the
volume is odd, or different if the volume is even.

#figure(
  [
    #table(
      align: center + horizon,
      columns: 4,
      stroke: none,
      table.header(
        table.cell(colspan: 2, rowspan: 2)[Path possible],
        table.vline(),
        table.cell(colspan: 2)[Volume],
        [#emph[even]],
        [#emph[odd]],
      ),
      table.hline(),
      table.cell(rowspan: 2)[|α|], emph[even], "Yes", "Yes",
      emph[odd], [*No*], "Yes",
      table.hline(),
    )
  ],
  caption: [
    Table showing when a Hamiltonian path is possible.
    Here, $|alpha|$ is the absolute difference in start and end positions along one axis.
    A Hamiltonian path is possible only when $|alpha|$ is even or both $|alpha|$ and the volume are odd.
  ],
)

Let a path start at $p_s = (0,0,0)$ and end at $p_e = (w-1, 0, 0)$ with
$alpha = (w,0,0), beta = (0,h,0), gamma = (0,0,d)$.
Then a Hamiltonian path is always possible when $|alpha|$ is even or when $|alpha|$, $|beta|$, and $|gamma|$
are all odd.

== 2D Generalized Hilbert Function (Gilbert2D)

#figure(
  image("./resources/img/gilbert2d_mainsubdiv.svg"),
  caption: [
    For the 2D Gilbert curve, the main rectangle is subdivided into three subregions,
    making sure their paths connect and preferring even side lengths. This is called a $U$-split.
  ],
) <fig-main2dsubdiv>

#figure(
  image("./resources/img/config_production.svg"),
  caption: [
    Enumeration of the subdivision template depending on different parities of $alpha$ and $beta$.
  ],
)

The 2D Gilbert curve uses a $U$-split template (Figure @fig-main2dsubdiv), breaking the region into three blocks:
$A$, $B$, and $C$.
Each block has its own coordinate system, recursively updated.

Even dimensions are preferred for sub-blocks $A$ and $C$.
If the width-like length ($|alpha|$) is even, $C$ will allow a Hamiltonian path.
Otherwise, a notch is introduced.

#figure(
  [
    #set align(left)
    #algorithm({
      import algorithmic: *
      Cmt[p, α, β ∈ ℤ³]
      Function(
        "Gilbert2D",
        args: ("p", "α", "β"),
        {
          Cmt[Initialize the search range]
          Assign[$α₂$][$"div"(α, 2)$]
          Assign[$β₂$][$"div"(β, 2)$]
          If(
            cond: $|β| equiv 1$,
            {
              State[*yield* $p + i · δ(α)$ *forall* $i in |α|$]
            },
          )
        },
      )
    })],
  caption: [
    2D Generalized Hilbert Function (Gilbert2D)
  ],
)

#figure(
  image("./resources/img/gilbert2d_examples.svg"),
  caption: [
    Example outputs of the 2D Gilbert algorithm for several width × height combinations.
    The $(13 times 8)$ case inserts a notch due to the impossibility of a Hamiltonian path.
  ],
)

== 3D Generalized Hilbert Function (Gilbert3D)

#figure(
  image("./resources/img/gilbert3d_explode.svg"),
  caption: [
    The $J_0$-split subdivision, used in the main recursion of the 3D Gilbert curve.
  ],
)

// TODO: Add algorithm here

#figure(
  image("./resources/img/gilbert3d_case.svg"),
  caption: [
    Bulk recursion $J$-split atlas for 3D Gilbert algorithm.
    Local axes, endpoints, and invalid paths are visualized.
  ],
)

#figure(
  image("./resources/img/gilbert3d_eccentric.svg"),
  caption: [
    Eccentric cases for recursion.
    $S$-splits reshape the cuboids to become more cube-like.
  ],
)

== Defect Analysis

Let
$$$
  "defect"(|alpha|, |beta|, |gamma|) eq.def (|alpha| · |beta| · |gamma|) / min(|alpha|, |beta|, |gamma|)
$$$


The average defect is the weighted sum of each sub-cuboid's defect by volume proportion.
The constants used for the $S$-split thresholds are chosen to reduce this average defect.
