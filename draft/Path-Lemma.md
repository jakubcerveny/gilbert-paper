Call the point set $S = \{ (x,y,z) | 0 \le x < W, 0 \le y < H, 0 \le z < L, x,y,z \in \mathbb{N} \}$ of
lattice points within the rectangular cuboid defined by $(W,H,L)$.

Consider a path in 3D space $ s = \{s _ 0, s _ 1 , s _ 2, \dots, s _ {n-1}\}$
that fills a rectangular cuboid defined by $W, H, L \in \mathbb{N}$ ($n = W \cdot H \cdot L = |S|$)
such that
only axis aligned single unit steps are allowed ($|s _ i - s _ j| _ 1 = 1, i \ne j$).

*Claim*:

> No path, $s$, is possible that visits every point in
> $S$, and no other points outside of $S$, that starts at $s _ 0 = (0,0,0)$ and ends
> at $s _ {n-1} = (W-1, 0, 0)$ when $W$ is odd and $(W \cdot H \cdot L)$ is even.


That is, a rectangular cuboid filling path is precluded when the width is odd and the number of points within
the rectangular cuboid is even.

*Proof*:

The proof follows from a straight forward proof by contradiction parity argument.

Consider a two coloring of the lattice points within $S$, alternating between the two colors of red, $r$, and blue, $b$ in
each cardinal direction.

Without loss of generality, we can assume the starting color at $s _ 0$ is blue.
The path must now alternate in colors and, since the path length, $N = W \cdot H \cdot L$ is even,
must end on a red colored lattice point, $\textit{color}(s) = (b,r,b,r, \dots, b,r)$.

Starting from the blue $(0,0,0)$ lattice point and alternating in colors
to the lattice point $(W-1,0,0)$, $(W-1,0,0)$ must be blue since $W$ is odd.

$(W,0,0)$ must be blue but $s _ {n-1} = (W-1,0,0)$ must
be red, making such a configuration impossible.

---

The above shows the impossibility of a path when $W$ is odd and $H \cdot L$ is even but does not
show a path is possible when $W$ is even or when $W$ is odd and $H \cdot L$ is odd.

We will show the possibility of a path in these conditions constructively, but first we
will prove some auxiliary results.

*Claim*:

> For any $W,H,L \in \mathbb{N}$, with $W$ even, there is a $S$ restricted Hamiltonian path, $s$,
> that starts at $(0,0,0)$ and ends at $(W-1,0,0)$.

*Proof*:

**WIP**

A scanline approach...maybe proof by induction?


---

*Claim*:

> For any $W, H, L \in \mathbb{N}$, where $(W \cdot H \cdot L)$ odd, there is an $S$ restricted
> Hamiltonian Path, $s$ that starts at $(0,0,0)$ and ends at $(W-1,0,0)$.

*Proof*:

**WIP**

Shave off a plane and create a sub problem with the start point in a line from the end point, then
use the the previous lemma above.


