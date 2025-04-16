



var CANVAS_ID = 'gilbert2d_mainsubdiv';
var g_fig_ctx = {};

var RECT_COLOR = "rgb(100,100,100)";
var LINE_COLOR = "rgb(81,166,10)";

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

  /*
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
  */

  //yep, needed, so we can then get the make element
  //
  two.update();

  let mask = document.getElementById(sgr.mask.id);
  mask.firstChild.setAttribute("d", "M -4000 -4000 L 8000 -4000 L 4000 4000 L -4000 4000 Z");

  two.update();
}



function mkarrow(px, py, dx, dy, w, h) {
  let two = g_fig_ctx.two;

	//path_color = "rgba(80,80,140,1)";
  let path_color = "rgb(80,80,140)";
  let path_color_p = "rgb(120,180,180)";

  /*
  let path_color_m = "rgb(138,189,95)";
  path_color_m = "rgb(62,114,19)";
  path_color_m = "rgb(185,227,151)";
  path_color_m = "rgb(156,234,91)";
  path_color_m = "rgb(155,218,103)";
  path_color_m = "rgb(185,244,136)";
  path_color_m = "rgb(127,202,64)";
  path_color_m = "rgb(81,166,10)";
  */


  let theta = Math.atan2(-dy,dx);
  theta += Math.PI/2;

  let ct = Math.cos(theta);
  let st = Math.sin(theta);

  let w2 = w/2;

  let q0 = [  ct*w2 - st*h, -st*w2 - ct*h ];
  let q1 = [ -ct*w2 - st*h,  st*w2 - ct*h ];

  let hh = h*0.95;

  let qm = [  ct*0  - st*hh, -st*0  - ct*hh ];

  q0[0] += px;
  q0[1] += py;

  q1[0] += px;
  q1[1] += py;

  qm[0] += px;
  qm[1] += py;


  let anch = makeTwoAnchor( [ [px,py], q0, qm, q1 ] );
  
  let _p = two.makePath( anch );

  _p.linewidth = 3;
  _p.stroke = LINE_COLOR;
  _p.fill = LINE_COLOR;
  _p.join = "round";
  _p.opacity = 1;

  return _p;
}

function gilbert2d_mainsubdiv() {
  let two = new Two({"fitted":true});
  g_fig_ctx["two"] = two;

  let ele = document.getElementById(CANVAS_ID);
  two.appendTo(ele);

  let rect_lw = 2;

  let s0_x = 50,
      s0_y = 300,
      e0_x = 300,
      e0_y = 300;

  let s1_x = 400,
      s1_y = 300,
      e1_x = 300,
      e1_y = 300;

  let _h = 230;
  let _w = e0_x - s0_x;

  let cp_f = _h*(e0_x - s0_x)/10000;

  cp_f_x = 60;
  cp_f_y = 45;

  //---------------
  // level (n) Rect
  //---------------


  let cp_f_s = 30;
  let baseLine = new Two.Path([
    new Two.Anchor(s0_x,s0_y,       0,       0,  cp_f_x, -cp_f_y,   Two.Commands.curve),
    new Two.Anchor(e0_x,e0_y, -cp_f_x, -cp_f_y,       0,       0,   Two.Commands.curve)
  ], false, false, true);
  baseLine.cap = "round"
  baseLine.linewidth = 3;
  //baseLine.stroke = "rgb(0,0,0)";
  baseLine.stroke = LINE_COLOR;
  baseLine.noFill();
  baseLine.opacity = 1;

  two.add(baseLine);

  let _arrow0 = mkarrow(e0_x, e0_y, cp_f_x, cp_f_y, 12, 18);


  let _fudge = 10;

  let rect_n = two.makeRectangle(s0_x+_w/2,s0_y-_h/2,_w+_fudge,_h+_fudge);
  rect_n.noFill();
  rect_n.linewidth = rect_lw;
  rect_n.stroke = RECT_COLOR;
  rect_n.opacity = 1;
  rect_n.join = "round";

  //-----------------
  // level (n+1) Rect
  //-----------------

  let rect_npp = two.makeRectangle(s1_x+_w/2,s1_y-_h/2,_w+_fudge,_h+_fudge);
  rect_npp.noFill();
  rect_npp.linewidth = rect_lw;
  rect_npp.stroke = RECT_COLOR;
  rect_npp.opacity = 1;
  rect_npp.join = "round";

  let _shift = [10,25];

  // horizontal mid
  //
  let hm0 = [ s1_x - _fudge/2, s1_y-_h/2 - _shift[1]];
  let hm1 = [ s1_x+_w + _fudge/2, s1_y-_h/2 - _shift[1]];

  // vertical mid
  //
  let vm0 = [ s1_x+_w/2 + _shift[0], s1_y-_h/2 - _shift[1] ];
  let vm1 = [ s1_x+_w/2 + _shift[0], s1_y + _fudge/2 ];

  let hl1 = two.makeLine(hm0[0], hm0[1], hm1[0], hm1[1]);
  hl1.linewidth = rect_lw;
  hl1.noFill();
  hl1.cap = "round";
  hl1.stroke = RECT_COLOR;

  let vl1 = two.makeLine(vm0[0], vm0[1], vm1[0], vm1[1]);
  vl1.linewidth = rect_lw;
  vl1.noFill();
  vl1.cap = "round";
  vl1.stroke = RECT_COLOR;

  let A_endpoint = [
    [s1_x, s1_y],
    [s1_x, vm0[1]]
  ];

  let B_endpoint = [
    [s1_x, vm0[1] ],
    [hm1[0], vm0[1] ]
  ];

  let C_endpoint = [
    [ hm1[0], vm0[1] ],
    [ hm1[0], s1_y ]
  ];


  let A_circle_s = two.makeCircle(A_endpoint[0][0], A_endpoint[0][1], 5);
  let A_circle_e = two.makeCircle(A_endpoint[1][0], A_endpoint[1][1], 5);

  A_circle_s.noStroke();
  //A_circle_s.fill = 

  let B_circle_s = two.makeCircle(B_endpoint[0][0], B_endpoint[0][1], 5);
  let B_circle_e = two.makeCircle(B_endpoint[1][0], B_endpoint[1][1], 5);

  let C_circle_s = two.makeCircle(C_endpoint[0][0], C_endpoint[0][1], 5);
  let C_circle_e = two.makeCircle(C_endpoint[1][0], C_endpoint[1][1], 5);

  let cp1a_f_x = 10, cp1a_f_y = 10,
      cp1b_f_x = 10, cp1b_f_y = 10,
      cp1c_f_x = 10, cp1c_f_y = 10;

  let _arrow1a = mkarrow(A_endpoint[1][0], A_endpoint[1][1], cp1a_f_x, cp1a_f_y, 12, 18);
  let _arrow1b = mkarrow(B_endpoint[1][0], B_endpoint[1][1], cp1b_f_x, cp1b_f_y, 12, 18);
  let _arrow1c = mkarrow(C_endpoint[1][0], C_endpoint[1][1], cp1c_f_x, cp1c_f_y, 12, 18);


  //------------
  // annotations
  //------------

  let fs = 18;
  let font_style = {
    "size": fs,
    "family": "Libertine, Linux Libertine 0"
  };

  let s = 0.025;

  mathjax2twojs("mj_leveln", s0_x+_w/2-30, s0_y-_h-15, s, 1);
  mathjax2twojs("mj_b", s0_x-25, s0_y-_h/2, s, 1);
  mathjax2twojs("mj_a", s0_x+_w/2, s0_y+30,s, 1);

  mathjax2twojs("mj_levelnpp", s1_x+_w/2-50, s1_y-_h-15, s, 1);
  mathjax2twojs("mj_b2", s1_x-45, s1_y-_h/2+50, s, 1);
  mathjax2twojs("mj_a2", s1_x+_w/4-20, s1_y+30,s, 1);

  //----
  // fin
  //----

  two.update();
  g_two = two;
  return two;
}

