var __bind = function (fn, me) { return function () { return fn.apply(me, arguments); }; };
var table = [];
var team;
var score;
var question;
var leader = [];
var currentround;
var challenge = false;
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

function init(data)
{
    table = data.table;
    question = data.question;
    currentround = data.currentround;
   
}
function roundsetup(round) {
  currentround = round;
  if (round == "semifinal") {
    document.getElementById("helper").style.visibility = "visible";
  }
  else {
    document.getElementById("helper").style.visibility = "hidden";
  }

  if (round == "final:the leader") {
    document.getElementById('leader-selector').style.visibility = "visible";
    document.getElementsByClassName('flex-head')[0].innerHTML = "Topic 1 : Subgroup 1<br>Select question for your leader!";

  }
  else {
    document.getElementById('leader-selector').style.visibility = "hidden";
    leader = [];
  }


}



function eraser() {
  var color = '#FFFFFF';
  var size = '1000';
  var tool = 'pencil';
  this.canver.setColor(color);
  this.canver.setTool(tool);
  this.canver.setSize(size);


}


function showquestion() {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext("2d");
  ctx.font = "30px Impact";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText(question.question, canvas.width / 2, canvas.height / 2);
}
function screenshot() {

  var img = document.getElementById('canvas').toDataURL('image/jpeg', 0.05);
  socket.emit('screensubmit', { image: img, name: team });
  if (question.section == "1-" + leader[0] || question.section == "2-" + leader[1]) {
    socket.emit('setscorefactor', { type: "Leader", name: team, positive: 2, negative: 2 });
  }
}

function resetcanvas() {
  var context = document.getElementById('canvas').getContext('2d');
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);

}

//select team
function select() {
  var select = document.getElementById("teamselection");
  var name = select.options[select.selectedIndex].text;
  team = name;
  document.getElementById("teamselectionmenu").style.visibility = "hidden";
  document.getElementById("name").innerHTML = team;
  score = table[table.findindexbyabbr(team)].score;
  introduce(socket, "canver-" + name);
}

function selectleader(level) {
  if (currentround == "final:the leader" && leader.length < 2) {
    leader.push(level.innerHTML);
    level.style.backgroundImage = "url('/asset/leadership.png')";
  }
  if (leader.length == 1) {
    setTimeout(() => {
      document.getElementsByClassName('flex-head')[0].innerHTML = "Topic 2 : Subgroup 2<br>Select question for your leader!";
      document.getElementById("easy").style.backgroundImage = "none";
      document.getElementById("hard").style.backgroundImage = "none";
    }, 500);
  }
  else {

    setTimeout(() => {
      document.getElementById('leader-selector').style.visibility = "hidden";
    }, 500);
  }
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
  socket.emit('setscorefactor', { type: "x2", name: team, positive: 2, negative: 0.5 });
  document.getElementById("x2").style.visibility = "hidden";
}

function x3() {
  socket.emit('setscorefactor', { type: "x3", name: team, positive: 3, negative: 1 });
  document.getElementById("x3").style.visibility = "hidden";
}

function blackout() {
  document.getElementById("blackout").style.visibility = "visible";
}

function setscore(data) {
  if (team == data ) {
    var scoreselection = document.getElementById("score-selection");
    scoreselection.innerHTML = "";
    scoreselection.style.visibility = "visible";
    choices = Math.floor(score / 10);
    hue = 140;
    for (let i = 1; i <= choices; i++) {
      let item = document.createElement("div");
      item.className = "score-item";
      scoreselection.appendChild(item);
      item.innerHTML = i * 10;
      item.score = i*10;
      item.addEventListener("click",()=>{selectscore(this,i*10)},false);
      item.style.backgroundColor = 'hsl(' + hue + ',70%,50%)';
      hue-= 150/choices;
    }

  }
}

function selectscore(item,score) {
  var scoreselection = document.getElementById("score-selection");
  socket.emit('setquestionscore', score);
  alert("this question's score was set to "+score);
  scoreselection.style.visibility = "hidden";
}
Array.prototype.findindexbyabbr = function (name) {
  var i;
  for (i = 0; i < this.length; i++) {
    //   console.log(this[i].abbr);
    if (this[i].abbr == name) { return i; }
  }
};