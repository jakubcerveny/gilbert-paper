TODO
===


###### 2025-04-18

* Introduction/Definitions:
  - Define locality/local connectivity
  - Define space filling
  - Define admissible/feasible for Hamiltonian path?
  - Define "eccentric" (oblong?)
  - Cleanup/reword/lookover/improve "mathy" section of
    rectangular cuboid region definitions, Hamiltonian path
    definitions, etc.
  - not sure if its worth mentioning
* Related Work
  - Needs whole section written
  - Tautenhahn is effectively the originator of this idea? But mention not 3d. Should reach
    out to get more information about algorithm and motivation for constants chosen
  - Hamilton&Chaplin "Space-filling curves for domains with unequal side lengths" assume side lengths still powers of 2,
    so not arbitrary lengths
  - zhang,kamata,ueshige do arbitrary rectangular regions but don't generalize to 3d well (?) and 2d has (at least to my
    eye) less quality (fig 7c and 7d has man long stretches, so don't 'wiggle' as much as the Gilbert curve). Also, it
    looks like the curve doesn't end on (w-1,0) ? might be worth implementing for comparison. Try to quantify the wiggliness
    for comparison. They have a comparison to Hilbert curve so maybe we can use that to compare to Hilbert and theirs.
    Looks like there is a FOSS implementation on [gh](https://github.com/yvt/zhang_hilbert)
  - [rectfillcurve](https://hg.sr.ht/~dalke/rectfillcurve) talks about speed optimizations
* Algorithm
  - Overview (3.1)
    + edit/improvements
  - Pairty (3.2)
    + try to do actual proofs instead of just "stating without proof"?
  - Gilbert2d (3.3)
    + improve algorithm description
    + provide example 2d realizations (4x4, 10x4, 7x4) (chosen to highlight:
      feature parity with Hilbert (4x4), extension (10x4) and limitation/notch (7x4))
    + make sure to note the `//` as being integer divide and round towards 0 (as in, *not* the floor function)
  - Gilbert3d (3.4)
    + **confirm 3d algorithm actually works**
    + algorithm description needs to be written. My suggestion is to focus on the intuitive case first
      when all sides are even, in that case, the recursion is simple. Then move on to the other
      $J_1$ and $J_2$ splits, then go into the $S$-splits along with motivations behind them
    + talk about base case, S-splits and J-splits
    + talk about motivation for eccentric threshold values (point reader to appendix A)
    + show some pictures of the 3d Gilbert curve
  - Extensions
    + simple extension to choose the appropriate direction to always have a notch-free Gilbert realization
      (if user doesn't care about endpoint, can choose it to make sure Gilbert curve is notch-free)
      - show generalized Moore curve realization
    + generalized Moore
* Experiments/Results
  - whole section needs to be written
  - do some locality experiments some variety of sizes and random points within
  - figure out what additional metrics can be used (Gotsman/Lindenbaum, Voorhies, Mokbel, etc.)
* Conclusion
  - whole section needs to be written
  - "There is the possibility that the shape template subdivision scheme could be extended to higher dimensions but this idea is not pursued in this paper"
  - "The recursive implementation provides a proof-of-concept for the method. Attempts at memory reductions and run-time optimizations to reduce execution
    speed constants are not pursued in this paper"
  - mention FOSS and repo location
 
