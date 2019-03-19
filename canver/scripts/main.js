var __bind = function (fn, me) { return function () { return fn.apply(me, arguments); }; };
var table = [];
var team;
/*if (!("ontouchend" in document || location.search === '?debug=1')) {
  window.location = 'unsupported.html';
}*/
window.onload = function () {
  var bgSetup, canvas, menu, start;
  canvas = document.getElementById('canvas');
  bgSetup = document.getElementById('backgroundSetup');
  start = document.getElementById('start');
  menu = document.getElementById('menu');
  Util.noScrollingOn(bgSetup);
  Util.noScrollingOn(start);
  Util.noScrollingOn(menu);
  bgSetup.style.display = 'none';
  this.canver = new Canver(canvas, '#FFFFFF', window.devicePixelRatio);
  return this.menu = new Menu(start, menu, this.canver);
  if (!window.navigator.standalone) {
    true;
  }


};

function eraser() {
  var color = '#FFFFFF';
  var size = '1000';
  var tool = 'pencil';
  this.canver.setColor(color);
  this.canver.setTool(tool);
  this.canver.setSize(size);


}
function screenshot() {

  var img = document.getElementById('canvas').toDataURL('image/jpeg', 0.05);
  socket.emit('screensubmit', { image: img, name: team });

}

function resetcanvas() {
  var context = document.getElementById('canvas').getContext('2d');
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
}
function select() {
  var select = document.getElementById("teamselection");
  var name = select.options[select.selectedIndex].text;
  team = name;
  document.getElementById("teamselectionmenu").style.visibility = "hidden";
  document.getElementById("name").innerHTML = team;


}

function setdropdown() {
  var select = document.getElementById("teamselection");
  var i;
  for (i = 0; i < table.length; i++) {
    var opt = table[i].abbr;
    var el = document.createElement("option");
    el.text = opt;
    el.value = opt;
    select.appendChild(el);

  }
}

function x2() {
  socket.emit('');
}

function x3() {

}