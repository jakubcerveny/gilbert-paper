Gilbert Paper Figures
===

I use [two.js](https://two.js.org/) to create many of the graphical figures.

There's a few reasons I like this method:

* More programatic control over figure creation, rather than relying on
  GUI tools
* Control through HTML, JS, CSS and SVG to create graphics
* Output to SVG

The SVG output in particular is important as figures included in the paper
won't suffer from image compression artificats.

One unfortunate side effect of this method is that many figures are "write-only".

Quickstart
===

```
python3 -m http.server
```

This will run a local web server and listen on port 8000 by default.

To view the various figures, point your web page to one of the following pages:

* [2D Gilbert Production Rules](http://localhost:8000/config_production.html)
* [2D Simple Hamiltonian Path](http://localhost:8000/simple_hampath.html)
* [3D J-Split Exploded View](http://localhost:8000/gilbert3d_explode.html)
* [3D Bulk Recursion Atlas](http://localhost:8000/gilbert3d_case.html)
* [3D Eccentric Recursion Figure](http://localhost:8000/gilbert3d_eccentric.html)


