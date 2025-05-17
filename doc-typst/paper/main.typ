#import "@preview/charged-ieee:0.1.3": ieee

#show: ieee.with(
  title: [A Generalized 2D and 3D Hilbert Curve],
  abstract: [
    The two and three dimensional Hilbert curves are fractal space filling curves that
    map the unit interval to the unit square or unit cube.
    Hilbert curves preserve locality, keeping distance from the unit interval
    to their respective higher dimensional embeddings.
    Finite approximations of the Hilbert curve can be constructed in stages
    by stopping the recursive construction at a specified depth, providing locality
    from a discrete array of points to points in the embedded dimension.
    The locality property of the Hilbert curve can help with caching optimizations based on order
    and finds uses as a companion method in applications ranging from job scheduling
    to scene rendering.
    One limitation of the Hilbert curve approximation construction is that the regions need
    to be exact powers of two, making it difficult to work with in many real world
    scenarios.
    In this paper, we present the Gilbert curve,
    a conceptually straight forward generalization of the Hilbert curve,
    that works on arbitrary rectangular regions.
    The construction provides reasonable worst case run-time guarantees for random
    access lookups for both two and three dimensions.
    We also provide comparisons to other Hilbert curve generalization methods
    and investigate overall quality metrics of the Gilbert curve construction.
  ],
  authors: (
    (
      name: "Jakub Cerveny",
      url: "https://github.com/jakubcerveny"
    ),
    (
      name: "Zzyv Zzyzek",
      url: "https://orcid.org/0009-0005-2175-1166"
    ),
  ),
  index-terms: ("Space filling curve", "hilbert curve", "Generalized Hilbert Curve"),
  bibliography: bibliography("./06-References.bib", full: true),
)

#include "./01-Introduction.typ"
#include "./02-Related-Work.typ"
#include "./03-Algorithm.typ"
#include "./04-Results.typ"
#include "./05-Conclusion.typ"
