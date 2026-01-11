TODO
===

###### 2026-01-10

in-progress

* eccentric subdivision (next to gilbert3d algorithm):
  - ~provide colored subdivision alpha for 2d and 3d (to be put side-by-side)
    with constants put in~
  - ~provide colored subdivision for in-plane 3d (to be put side-by-side)
    with constants put in~
  - add final main subdivision
  - add beta, gamma and main example color coded
* references
* additional pretty graphics

done-ish:

* ~subdivision strategies, provide gilbert curve with 3 colors showing main
  subdivision scheme (fills out whitespace from main 2d subdivision)~
* ~don't do elementray math in main subdivision, just provide result and
  let reader do tedious calculation~
* ~clean up algorithm (2) for 3d~
  - (in progress) this overflows and is way to long compared with the gilbert2d algorithm.
    I think the solution here is to put it at the end and have some graphics,
    maybe with eccentric subdivisions, on the right of it


Consider providing harmonious comparison with in-harmonious splits

There are 2-3 graphics that can be added:

* 3d bulk recursion with each troche split out (first graphic of `gilbert3d_case.html`)
  - this seems a bit redundant... fig 5 has a decent graphic on how the 3d case is split
* comparison of subdivision without harmonious split
