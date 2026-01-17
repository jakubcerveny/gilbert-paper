// LICENSE: CC0
//

var njs = numeric;

var CANVAS_ID = 'gilbert2d_mainsubdiv';
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

function rbracket(mxy, w, h, theta) {
  theta = ((typeof theta === "undefined") ? 0 : theta);

  let two = g_fig_ctx.two;

  let lw = 1.35;

  let ct = Math.cos(theta);
  let st = Math.sin(theta);

  let M = [
    [  ct, st ],
    [ -st, ct ]
  ];

  let cp_u0 = njs.dot( M, [-w/2, 0] );
  let cp_u1 = njs.dot( M, [ w/2, 0] );
  let ep_u = njs.dot( M, [ -w/2, -h/2 ] );

  let cp_d0 = njs.dot( M, [-w/2, 0] );
  let cp_d1 = njs.dot( M, [ w/2, 0] );
  let ep_d = njs.dot( M, [ -w/2,  h/2 ] );

  let p_u = new Two.Path([
    new Two.Anchor( mxy[0],         mxy[1],           0,0,                cp_u0[0], cp_u0[1],   Two.Commands.curve),
    new Two.Anchor( mxy[0]+ep_u[0], mxy[1]+ep_u[1],   cp_u1[0],cp_u1[1],  0,0,                  Two.Commands.curve),
  ], false, false, true);

  p_u.linewidth = lw;
  p_u.stroke = "rgb(0,0,0)";
  p_u.noFill();

  let p_d = new Two.Path([
    new Two.Anchor( mxy[0],         mxy[1],           0,0,                cp_d0[0], cp_d0[1],   Two.Commands.curve),
    new Two.Anchor( mxy[0]+ep_d[0], mxy[1]+ep_d[1],   cp_d1[0],cp_d1[1],  0,0,                  Two.Commands.curve),
  ], false, false, true);

  p_d.linewidth = lw;
  p_d.stroke = "rgb(0,0,0)";
  p_d.noFill();

  two.add(p_u);
  two.add(p_d);

  two.update();

}


// so very hacky
// somehow we managed to shoehorn
// mathjax notation into svg so that it
// can be used by two.js.
// We need to contort ourselves to get the mask
// right so that it gets all the element
//
function mathjax2twojs(_id,x,y,s,s_sub, ignore) {
  s = ((typeof s === "undefined") ? 0.02 : s);
  s_sub = ((typeof s_sub === "undefined") ? 0.7 : s_sub);
  ignore = ((typeof ignore === "undefined") ? false : ignore );

  console.log(s, s_sub, ignore);

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

  if (!ignore) {

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

  }

  //yep, needed, so we can then get the make element
  //
  two.update();

  let mask = document.getElementById(sgr.mask.id);
  //mask.firstChild.setAttribute("d", "M -4000 -4000 L 8000 -4000 L 4000 4000 L -4000 4000 Z");
  mask.firstChild.setAttribute("d", "M -4000 -4000 L 9000 -4000 L 4000 4000 L -4000 4000 Z");

  two.update();
}



function mkarrow(px, py, dx, dy, w, h) {
  let two = g_fig_ctx.two;

  //path_color = "rgba(80,80,140,1)";
  let path_color = "rgb(80,80,140)";
  let path_color_p = "rgb(120,180,180)";


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

function gilbert2d_eccentric_simple() {
  let two = new Two({"fitted":true});
  g_fig_ctx["two"] = two;

  let ele = document.getElementById(CANVAS_ID);
  two.appendTo(ele);

  let rect_lw = 2;

  let s0_x = 50,
      s0_y = 300,
      e0_x = 300,
      e0_y = 300;

  let s = 0.025;

  s = (300/250)*0.025;

  let s1_x = 400,
      s1_y = 300,
      e1_x = 300,
      e1_y = 300;

  s1_x = 370;

  let cxy = [ two.width/2 + 20,two.height/2 - 20];
  cxy = [ two.width/2 + 30,two.height/2 - 20];



  //DEBUG
  //DEBUG
  //DEBUG
  //two.makeRectangle( two.width/2, two.height/2, two.width, two.height );
  //DEBUG
  //DEBUG
  //DEBUG

  let _h = 200;
  let _w = 340;


  /*
  let rect  = two.makeRectangle( cxy[0], cxy[1], _w, _h);
  rect.noFill();
  rect.linewidth = rect_lw;
  rect.stroke = RECT_COLOR;
  rect.opacity = 1;
  rect.join = "round";
  */

  let rect_l  = two.makeRectangle( cxy[0] - _w/4, cxy[1], _w/2, _h);
  //rect_l.noFill();
  rect_l.fill = "rgba(215,25,28)";
  rect_l.fill = "hsl(359,79.2%,47.1%)";
  rect_l.fill = "hsl(359,70.2%,65.1%)";
  rect_l.linewidth = rect_lw;
  rect_l.stroke = RECT_COLOR;
  rect_l.opacity = 1;
  rect_l.join = "round";

  let rect_r = two.makeRectangle( cxy[0] + _w/4, cxy[1], _w/2, _h);
  //rect_r.noFill();
  rect_r.fill = "rgba(43,131,186)";
  rect_r.fill = "hsl(203,63.9%,44.5%)";
  rect_r.fill = "hsl(203,53.9%,54.5%)";
  rect_r.linewidth = rect_lw;
  rect_r.stroke = RECT_COLOR;
  rect_r.opacity = 1;
  rect_r.join = "round";

  let _line = two.makeLine( cxy[0], cxy[1] - _h/2, cxy[0], cxy[1] + _h/2 );

  //rbracket( [cxy[0], cxy[1] + _h/2 + 30], 30, _w*0.95, -Math.PI/2 );
  mathjax2twojs("sigma_abs_beta", cxy[0] - 88, cxy[1] + _h/2 + 60, s, 1, true);
  rbracket( [cxy[0], cxy[1] + _h/2 + 30], 30, _w*0.95, -Math.PI/2 );

  mathjax2twojs("abs_beta", cxy[0] - _w/2-65, cxy[1] + 6, s, 1, true);
  rbracket( [cxy[0] - _w/2 - 30, cxy[1] ], 30, _h*0.95, Math.PI );

  mathjax2twojs("abs_alpha_d_2", cxy[0] - _w/4 - 25, cxy[1] + _h/2 - 45, s, 1, true);
  rbracket( [cxy[0] - _w/4 , cxy[1] + _h/2 - 30 ], 30, (_w/2)*0.9, Math.PI/2 );

  mathjax2twojs("abs_alpha_d_2", cxy[0] + (_w/4) - 25, cxy[1] + _h/2 - 45, s, 1, true);
  rbracket( [cxy[0] + (_w/4) , cxy[1] + _h/2 - 30 ], 30, (_w/2)*0.9, Math.PI/2 );


  //rbracket( 50, 50, 10, 10 );

  two.update();
  g_two = two;
  return two;
}

