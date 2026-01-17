// LICENSE: CC0
//

var CANVAS_ID = 'gilbert2d_examples';
var g_fig_ctx = {};

var RECT_COLOR = "rgb(100,100,100)";
var LINE_COLOR = "rgb(81,166,10)";

var BEG_COLOR = "rgb(80,80,140)";
var END_COLOR = "rgb(120,180,180)";

function _dl() {
  var ele = document.getElementById(CANVAS_ID);
  var b = new Blob([ ele.innerHTML ]);
  saveAs(b, "fig.svg");
}

function makeTwoAnchor(_pnt) {
  let pnt = [];
  for (let ii=0; ii<_pnt.length; ii++) {
    pnt.push( new Two.Anchor(_pnt[ii][0], _pnt[ii][1]) );
  }
  return pnt;
}

// so very hacky
// somehow we managed to shoehorn
// mathjax notation into svg so that it
// can be used by two.js.
// We need to contort ourselves to get the mask
// right so that it gets all the element
//
function mathjax2twojs(_id,x,y,s,s_sub) {
  s = ((typeof s === "undefined") ? 0.02 : s);
  s_sub = ((typeof s_sub === "undefined") ? 0.7 : s_sub);

  let two = g_fig_ctx.two;

  let ele = document.querySelector("#" + _id + " svg");
  let ser = new XMLSerializer();
  let str = ser.serializeToString(ele);

  let parser = new DOMParser();
  let sge = parser.parseFromString(str, "image/svg+xml").documentElement;

  let sgr = two.interpret(sge);

  sgr.position.x = x;
  sgr.position.y = y;
  sgr.scale.x =  s;
  sgr.scale.y = -s;

  // rescale subscript HACK
  //
  if (_id.slice(0,2) == "m_") {

    if (true) {

    if (sgr.children.length > 0) {
    if (sgr.children[0].children.length > 0) {
    if (sgr.children[0].children[0].children.length > 1) {
    if (sgr.children[0].children[0].children[1].children.length > 1) {
        sgr.children[0].children[0].children[1].children[1].scale.x = s_sub;
        sgr.children[0].children[0].children[1].children[1].scale.y = s_sub;
    }
    }
    }
    }

    }
  }
  else {

    if (sgr.children.length > 0) {
    if (sgr.children[0].children.length > 0) {
    if (sgr.children[0].children[0].children.length > 0) {
    if (sgr.children[0].children[0].children[0].children.length > 1) {
        sgr.children[0].children[0].children[0].children[1].scale.x = s_sub;
        sgr.children[0].children[0].children[0].children[1].scale.y = s_sub;
    }
    }
    }
    }

  }

  //yep, needed, so we can then get the make element
  //
  two.update();

  let mask = document.getElementById(sgr.mask.id);
  mask.firstChild.setAttribute("d", "M -4000 -4000 L 8000 -4000 L 4000 4000 L -4000 4000 Z");

  two.update();
}

function mkgcurve(xy, wh, s, flipxy) {
  s = ((typeof s === "undefined") ? 1 : s);
  flipxy = ((typeof flipxy === "undefined") ? {"y":false, "x": false} : flipxy);

  let two = g_fig_ctx.two;

  let W = wh[0];
  let H = wh[1];

  let n = wh[0]*wh[1];
  for (let idx=1; idx<n; idx++) {
    let p = gilbert.d2xy(idx-1, wh[0], wh[1]);
    let q = gilbert.d2xy(  idx, wh[0], wh[1]);

    if (flipxy.y) {
      p.y = H - p.y;
      q.y = H - q.y;
    }

    if (flipxy.x) {
      p.x = W - p.x;
      q.x = W - q.x;
    }

    q.x *= s; q.x += xy[0];
    q.y *= s; q.y += xy[1];

    p.x *= s; p.x += xy[0];
    p.y *= s; p.y += xy[1];

    let hue = Math.floor(360*idx / (W*H)).toString();
    let sat = "95%";
    let lit = '45%';
    let clr = "hsl(" + [ hue,sat,lit ].join(",") + ")";

    let line = two.makeLine(p.x, p.y, q.x, q.y);
    line.noFill();
    line.stroke = clr;
    line.linewidth = 2;
    line.cap = "round";

  }
}


function gilbert2d_examples() {
  let two = new Two({"fitted":true});
  g_fig_ctx["two"] = two;

  let ele = document.getElementById(CANVAS_ID);
  two.appendTo(ele);

  //WIP

  let fs = 18;
  let font_style = {
    "size": fs,
    "family": "Libertine, Linux Libertine 0"
  };

  let lx = 40;

  two.makeText("i)", lx, 50, font_style);
  mkgcurve([lx+35,35], [8, 8], 10, {"y":true, "x":false});

  two.makeText("ii)", lx + 140, 50, font_style);
  mkgcurve([lx+160,35], [18, 6], 10, {"y":true, "x":false});

  two.makeText("iii)", lx, 150, font_style);
  mkgcurve([lx+10,160], [13, 8], 10, {"y":true, "x":false});

  two.makeText("iv)", lx + 140, 150, font_style);
  mkgcurve([lx+170,130], [14, 14], 10, {"y":true, "x":false});

  two.update();

  return two;
}

