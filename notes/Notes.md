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
|| h(t _ 0) - h( t _ 1)|| _ 2 \le C | t _ 0 - t _ 1 |^{\frac{1}{d}}
$$

* $t _ 0$, $t _ 1$ positions along the curve
* $h(\cdot)$ the image
* $C \in \mathbb{R}$, "measure of compactness"
* $d$ the dimension



References
---

* "Space-Filling Curves" by Hans Sagan
* ["Space-Filling Curves" Encyclopedia of Parallel Computing ](https://link.springer.com/referenceworkentry/10.1007/978-0-387-09766-4_145)
* [The Perfomance of Space-Filling Curves for Dimension Reduction](https://people.csail.mit.edu/jaffer/CNS/PSFCDR)
* [Voxel Compression - Space-Filling Curves](https://eisenwave.github.io/voxel-compression-docs/rle/space_filling_curves.html)
