// LICENSE: CC0
//

var CANVAS_ID = 'gilbert2d_example_mainsubdiv';
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

function mkgcurve(xy, wh, s, opt) {
  s = ((typeof s === "undefined") ? 1 : s);
  opt = ((typeof opt === "undefined") ? {"y":false, "x": false} : opt);

  let two = g_fig_ctx.two;

  let W = wh[0];
  let H = wh[1];

  let pal = [
    'rgb(215,25,28)',
    //'rgb(255,255,159)',

    '#aa9803',
    'rgb(43,131,186)'
  ];

  let idx0 = 0,
      idx1 = 0;

  if ("idx_pal" in opt) {
    if (opt.idx_pal.length > 0) { idx0 = opt.idx_pal[0]; }
    if (opt.idx_pal.length > 1) { idx1 = opt.idx_pal[1]; }
  }

  let opacity = 0.3;

  let n = wh[0]*wh[1];
  for (let idx=1; idx<n; idx++) {
    let p = gilbert.d2xy(idx-1, wh[0], wh[1]);
    let q = gilbert.d2xy(  idx, wh[0], wh[1]);

    if (opt.y) {
      p.y = H - p.y;
      q.y = H - q.y;
    }

    if (opt.x) {
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

    if      (idx < idx0) { clr = pal[0]; }
    else if (idx < idx1) { clr = pal[1]; }
    else { clr = pal[2]; }

    let line = two.makeLine(p.x, p.y, q.x, q.y);
    line.noFill();
    line.stroke = clr;
    line.linewidth = 2;
    line.cap = "round";

    if (idx==1) {
      let _c = two.makeCircle(p.x, p.y, 8);
      _c.fill = "rgb(0,0,0)";
      _c.noStroke();
      _c.opacity = opacity;
    }

    if (idx==(n-1)) {
      let _c = two.makeCircle(q.x, q.y, 8);
      _c.fill = "rgb(0,0,0)";
      _c.noStroke();
      _c.opacity = opacity;
    }

    if (( (idx-1) < idx0 ) &&
        ( idx >= idx0 )) {
      let _c = two.makeCircle((p.x + q.x)/2, (p.y + q.y)/2, 8);
      _c.fill = "rgb(0,0,0)";
      _c.noStroke();
      _c.opacity = opacity;
    }

  }
}

function mk_shadow_text(txt, x,y, fs) {
  let two = g_fig_ctx.two;
  let sfs = Math.floor(fs.size*1.65);

  let s0 = new Two.Stop(0, "#fff", 1);
  let s1 = new Two.Stop(0.5, "#fff", 0);

  s0.opacity = 1;
  s1.opacity = 0;

  let rg = two.makeRadialGradient( 0,0, sfs, s0, s1);
  rg.units = "userSpaceOnUse";

  let _r = two.makeRectangle( x,y, sfs, sfs );
  _r.noStroke();
  _r.fill = rg;

  let clr = "#222";
  let txt_fg = two.makeText(txt, x,y, fs);
  txt_fg.stroke = clr;
  txt_fg.fill = clr;
}

function gilbert2d_example_eccentric() {
  let two = new Two({"fitted":true});
  g_fig_ctx["two"] = two;

  let ele = document.getElementById(CANVAS_ID);
  two.appendTo(ele);

  //WIP

  let fs = 28;
  fs = 20;
  let font_style = {
    "size": fs,
    "family": "Libertine, Linux Libertine 0"
  };

  //two.makeText("i)", lx, 50, font_style);
  //mkgcurve([lx+35,35], [18, 18], 10, {"y":true, "x":false});

  let sx = 15,
      sy = 5;

  let ax = 80+sx,
      ay = 195 + sy,
      bx = 173-5+sx,
      by = 65 + sy,
      cx = 255 + sx,
      cy = 195 + sy;

  //mkgcurve([sx,sy], [34, 26], 10, {"y":true, "x":false});

  ax = sx + 65;
  ay = sy + 135;

  cx = sx + 190;
  cy = sy + 135;

  bx = sx + 126;
  by = sy + 50;

  let idx0 = 

  mkgcurve([sx,sy], [28, 18], 10, {"y":true, "x":false, "idx_pal": [252]});

  /*
  //let txt_A = two.makeText("A", 85, 190, font_style);
  mk_shadow_text("A", ax, ay, font_style);
  mk_shadow_text("B", bx, by, font_style);
  mk_shadow_text("C", cx, cy, font_style);
  */

  let use_frame = false;
  if (use_frame) {
    let frame = two.makeRectangle( two.width/2, two.height/2, two.width, two.height );
    frame.noFill();
    frame.stroke = "#000";
    frame.linewidth = 5;
  }

  two.update();
  return two;
}

