Notes
===

A document for general free form notes

---

### A space filling curve is compact, connected and locally connected

* [compact](https://en.wikipedia.org/wiki/Compact_space) - a space is compact if it includes all of its limiting values
  - A closed interval on `[0,1]` (inclusive) is compact
  - An open interval on `(0,1)` (excluding 0,1) is not compact
* [connected](https://en.wikipedia.org/wiki/Connected_space) - a space is connected if it can't be divided into two disjoint non-empty open sets
  - a "blob" is connected
  - two disjoint "blobs" are not connected
* [locally connected](https://en.wikipedia.org/wiki/Locally_connected_space) - a space is locally connected if every point has an open connected neighborhood around it
  - a "blob" is locally connected
  - $sin(\frac{1}{x})$ is not locally connected, even though it is connected near $0$, as the neighborhood (to the right, say) of a point shoots up rather than having a path to it ([so](https://math.stackexchange.com/questions/2589358/any-example-of-a-connected-space-that-is-not-locally-connected))

This is the Hahn-Mazurkiewicz theorem (pg. 106, Thm. 6.8 of Sagan).

I think the point, here, is that the space filling curves hit all points (compact), include
points near it (connected) and can reach nearby points from any starting point (locally connected).

The locally connected property precludes things like "scan line" curves as being space filling.


---

$$
| h(t _ 0) - h( t _ 1) | _ 2 \le C | t _ 0 - t _ 1 |^{\frac{1}{d}}
$$

* $t _ 0$, $t _ 1$ positions along the curve
* $h(\cdot)$ the image
* $C \in \mathbb{R}$, "measure of compactness"
* $d$ the dimension


---

From the Gotsman and Lindenbaum paper, we can define a maximum and minimum distance metric:

$$
\begin{array}{l}
L _ 1 (C) = \text{max}  _ {i,j \in [N^D], i < j } \frac{ d(C(i), C(j)) ^ D }{ | i - j | } \\
L _ 2 (C) = \text{min}  _ {i,j \in [N^D], i < j } \frac{ d(C(i), C(j)) ^ D }{ | i - j | } \\
\end{array}
$$

For $N$ side length,
$D$ the dimension,
$N^D$ the number of cells total in the $D$ dimensional cube,
$C$ the curve and $d(\cdot, \cdot)$ the distance function.

From the Gotsman paper (in general):

$$
\begin{array}{l}
L _ 1 (C) > (2 ^ D - 1)(1 - \frac{1}{N})^ D \\
L _ 2 (C) = O(N ^ {1 - D}) \\
\end{array}
$$

For the Hilbert curve in particular:

$$
\begin{array}{l}
L _ 1 ( H _ k ^ {D} ) \le (D + 3) ^ {\frac{D}{2}} 2^D \\
6 ( 1 - O(2^{-k})) \le L _ 1 (H _ k ^ 2) \le 6 \frac{2}{3} \\
L _ 1 ( H _ k ^ 3) \le 23 \\
\end{array}
$$

---

Voorhies cohesion:

* $D _ C$ : object circle diameter
* $D _ H$ : Hysteresis diameter

Define $\text{Coherence}$ as the number of paths which go through the inner object circle and
exit the hysteresis boundary.

In some sense, this is like measure the 'flux' through a volume boundary.


References
---

* "Space-Filling Curves" by Hans Sagan
* ["Space-Filling Curves" Encyclopedia of Parallel Computing ](https://link.springer.com/referenceworkentry/10.1007/978-0-387-09766-4_145)
* [The Perfomance of Space-Filling Curves for Dimension Reduction](https://people.csail.mit.edu/jaffer/CNS/PSFCDR)
* [Voxel Compression - Space-Filling Curves](https://eisenwave.github.io/voxel-compression-docs/rle/space_filling_curves.html)
* ["On the metric properties of discrete space-filling curves" by C. Gotsman  and M. Lindenbaum](https://www.researchgate.net/publication/5567343_On_the_metric_properties_of_discrete_space-filling_curves)
* "Space-filling Curves and a Measure of Coherence" by D. Voorhies
