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

---

Mokbel et all use the following metrics:


| Function | Description |
|---|---|
| $Jump(k, N, d)$ | Counts the number of non orthogonal "jumps" in an axis aligned direction. $| d( h(t _ i), h(t _ {i+1}) ) _ k | > 1$ in axis dimension $k$, image dimension $d$, with side length $N$ |
| $Contiguity(k, N, d)$ | Counts the number of orthogonal moves in an axis aligned direction. $| d( h(t _ i), h(t _ {i+1}) ) _ k | = 1$ in axis dimension $k$, image dimension $d$, with side length $N$ |
| $Reverse(k, N, d)$ | Counts the number of decreasing moves in an axis aligned direction. $d( h(t _ i), h(t _ {i+1}) ) _ k < 0$ in axis dimension $k$, image dimension $d$ and side length $N$ |
| $Forward(k, N, d)$ | Counts the number of increasing moves in an axis aligned direction. $d( h(t _ i), h(t _ {i+1}) ) _ k > 0$ in axis dimension $k$, image dimension $d$ and side length $N$ |
| $Still(k, N, d)$ | Counts the number of unchanging moves in an axis aligned direction. $d( h(t _ i), h(t _ {i+1}) ) _ k = 0$ in axis dimension $k$, image dimension $d$ and side length $N$ |
| $J _ T(N,d)$  | Total jumps in all directions |
| $C _ T(N,d)$  | Total contiguity in all directions |
| $R _ T(N,d)$  | Total reverse in all directions |
| $F _ T(N,d)$  | Total forward in all directions |
| $S _ T(N,d)$  | Total still in all directions |
| $V _ T$  |  The vector $V _ T = ( J _ T, C _ T, R _ T, F _ T, S _ T)$ |

There's a lot of redundant information stored between them.

$$
\begin{array}{c}
Jump(k,N,d) + Contiguity(k,N,d) + Still(k,N,d) = N^d -1 \\
Reverse(k,N,d) + Forward(k,N,d) + Still(k,N,d) = N^d - 1 \\
J _t + C _ T + S _ T = D \cdot (N^D-1) \\
R _t + F _ T + S _ T = D \cdot (N^D-1) \\
\end{array}
$$

It looks like they focus on SFCs when as $D$ is large.


---

Haverkort defines GP-order (Giuseppe Peano order) to define the Peano curve that we commonly refer to as "the" Peano curve.
Probably good to adopt this terminology to avoid confusion in the future as other authors have different ideas of what the definition of
a Peano curve is.
Further, the "meander" curve they define as "R-order".

Define $C(a)$ ($0 \le a \le 1$) to be the position along the curve. I'm being sloppy, see the paper for a more precise defintion.

$$
\sum _ {i = 0} ^ {n-1} |C(i)| = |C| = 1
$$

Define $C(a,b)$ to be the area/volume traced out by the curve. For our purposes, $C(a,b)$ will always be discrete so we can
do box counting but from the paper:

$$
|C(p,q)| := \lim _ {k \to \infty} \min _ {a,b \in n, s.t. p \in C(a), q \in C(b) } |C(a,b)|
$$

Worst case locality (WL):

$$
\text{WL} _ r := \lim _ {k \to \infty} \sup _ {a, b \in n} \frac{ d _ r( C(a), C(b) )^2 }{ |C(a,b)| }
$$

I assume the $2$ in the exponent is becuase the paper only considers the 2D case?

The above implies $\text{WL} _ 1 \ge \text{WL} _ 2 \ge \text{WL} _ {\infty}$.

Worst case bounding box area ratio (WBA):

$$
\text{WBA} := \lim _ {k \to \infty} \sum{ a,b \in n} \frac{ |\text{bbox}(C(a,b))| }{ |C(a,b)| }
$$

With $\text{peri}$ being the perimeter, the worst case bounding box square perimeter ratio (WBP):

$$
\text{WBP} := \frac{1}{16} \lim _ {k \to \infty} \sup _ {a,b \in n} \frac{ \peri(\bbox(C(a,b)))^2 }{ |C(a,b)| }
$$

Total bounding box area (TBA):

$$
\text{TBA} := \lim _ { k \to \infty } \sup _ { a_1 \prec a_2 \prec \cdots \prec a _ {m-1} \in n} \left( \sum _ {i=1}^{m} |\text{bbox}(C(a _ {i-1}, a_i) )|  \right)
$$

$a _ 0 = 0$, $a _ {m} = \emptyset$ (??)

Average total bounding box area (ABA):

$$
\text{ABA} := \lim _ { k \to \infty } \text{avg} _ { a_1 \prec a_2 \prec \cdots \prec a _ {m-1} \in n} \left( \sum _ {i=1}^{m} |\text{bbox}(C(a _ {i-1}, a_i) )|  \right)
$$

Square average relative total bounding box perimeter (ABP):

$$
\text{ABP} := \lim _ { k \to \infty } \left( \text{avg} _ { a_1 \prec a_2 \prec \cdots \prec a _ {m-1} \in n} \frac{1}{4 \sqrt{m}} \left( \sum _ {i=1}^{m} |\text{peri}(\text{bbox}(C(a _ {i-1}, a_i) ))| \right)  \right)^2
$$

Square average relative total curve section diameter ($\text{AD} _ {\infty}$):

$$
\text{AD} _ {\infty} := \lim _ { k \to \infty } \left( \text{avg} _ { a_1 \prec a_2 \prec \cdots \prec a _ {m-1} \in n} \frac{1}{4 \sqrt{m}} \left( \sum _ {i=1}^{m} |\text{diam} _ {\infty} (C(a _ {i-1}, a_i) )| \right)  \right)^2
$$

Where $\text{diam} _ {\infty} (S)$ is the diameter of $S$ in the $L _ {\infty}$ metric.




References
---

* "Space-Filling Curves" by Hans Sagan
* ["Space-Filling Curves" Encyclopedia of Parallel Computing ](https://link.springer.com/referenceworkentry/10.1007/978-0-387-09766-4_145)
* [The Perfomance of Space-Filling Curves for Dimension Reduction](https://people.csail.mit.edu/jaffer/CNS/PSFCDR)
* [Voxel Compression - Space-Filling Curves](https://eisenwave.github.io/voxel-compression-docs/rle/space_filling_curves.html)
* ["On the metric properties of discrete space-filling curves" by C. Gotsman  and M. Lindenbaum](https://www.researchgate.net/publication/5567343_On_the_metric_properties_of_discrete_space-filling_curves)
* "Space-filling Curves and a Measure of Coherence" by D. Voorhies
* "Locality and bounding-box quality of two-dimensional space-ﬁlling curves" by H. Haverkort and F. Walderveen
