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


Overview
===

Each HTML page has a corresponding Javascript in the `js/` directory.

Mathjax is used to render some LaTeX equations.
I've had big problems getting `two.js` and Mathjax to play well together.
The solution I came up with was to pre-render the LaTeX elements I wanted as
SVG elements in the HTML and, after they've been loaded and rendered,
use them in `two.js`.

This has problems and some subscripts don't render right (at least on Firefox
that I'm using), so I've had to hack together some post processing
that traverses the SVG and does some selective rescaling.

There's a `js/FileSaverjs` script that should allow for SVG export.
I'm not sure what the status is on the export
(as of this writing, the figures are still
a work in progress) but there should be a `_dl` function that saves
the appropriate SVG elements into a blob and then allows for an SVG file download.


