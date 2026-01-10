Gilbert Paper, Additional Work
===

This sub-directory holds an earlier version of the paper with extra algorithms, ideas, etc.
that we ultimately decided not to include in the first iteration of the paper.

We still might use some of these ideas, so this we'll keep this work around, maybe for a future
paper, but the current paper effort is in the [`bridges-2026`](../bridges-2026) sub-directory.

This paper represents a description of the algorithms and motivation for *Gilbert++* the extensions
located in [github.com/jakubcerveny/gilbert/extensions](https://github.com/jakubcerveny/gilbert/tree/master/extensions).

The current state of the paper is that, after some investigation, it was discovered that coming
up with a curve that met the criteria of what was wanted was non-trivial.
Instead of delaying the paper further, we decided to focus on the core Gilbert algorithm, as originally
presented in the [github.com/jakubcerveny/gilbert](https://github.com/jakubcerveny/gilbert) repo,
and leave extensions for future research.

The four criteria are:

* *Hilbert-esque* : The curve is identical to the Hilbert curve for equal side lengths that are exact powers of two
* *Stable* : As side lengths increase but remain relatively equal proportionally, points converge in the embedded space
* *Harmony* : Defect reduction techniques are used when side lengths become too eccentric
* *Notch-limited* : When a diagonal move is forced, the number of diagonal moves are limited to one

For the sake of verbosity, the line of thinking was as follows:

* An alternate decomposition was created that kept harmony, kept Hilbert-esque and made it notch-limited
* After the alternate decomposition was made it was realized that it wasn't stable (the alternative
  subdivision schemes were depending on side parity, making points 'jump around' depending on low
  order bits of side lengths)
* The four criteria were then formulated (Hilbert-esque, stable, harmonious, notch-limited)
* It was then realized that creating a 3d curve with all four properties was non-trivial

The *Gilbert++* extensions provided are stable, harmonious and notch-limited but **not** Hilbert-esque.
Some previous solutions were Hilbert-esque, harmonious and notch-limited but not stable, as the point
location would be dependent on the parity of side lengths.

For 2d, this is pretty much solved, so the focus is on 3d.

I (Zzyv) believe that providing a generalized Hilbert curve in 3d is possible with all of those
four qualities, but it requires some machinery to get working.
Namely, providing alternative endpoints when connecting the cuboid subdivisions.

The idea is to keep the normal subdivision (what's labeled as a $J _ 0$ split in the *Gilbert++* scheme)
but move the endpoints by one position when connecting the cuboid subdivisions.
The move by one will keep color compatibility and not introduce new notches (diagonal moves).
Moving endpoints in this way only occurs when side lengths are odd, so even side lengths, notably
powers of two side lengths, functionality is identical to the classic Gilbert curve.

When side lengths are odd, then we move the endpoints to maintain as much as possible color compatibility.
Any notch that is forced can then be moved to whichever region is desired.

Again, I (Zzyv) believe this is within reach but considering how many times the algorithm has been
redone, the "just one more thing" is probably best left to a later paper rather than trying to shove
it into this one.

