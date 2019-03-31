var table = [];
var team;
var currentround;
var roundname;
Number.prototype.pad = function (size) {
  var s = String(this);
  while (s.length < (size || 2)) { s = "0" + s; }
  return s;
}

function roundstart(round) {
  currentround = round;
  switch (currentround) {
    case "final:the fast": roundname = "finalthefast";
      break;
    case "final:the leader": roundname = "finaltheleader";
      break;
    case "final:the error detector": roundname = "finaltheerrordectector";
      break;
    default: roundname = currentround;
  }


  document.getElementById("round-info").firstElementChild.innerHTML = round.toUpperCase();
  document.getElementById("round-info").style.visibility = "visible";
}

function openquestion() {
  document.getElementById("question-info").style.visibility = "hidden";
  document.getElementById("clock").innerHTML = tomin(question.time);
}
function openanswer() {
  //document.getElementById("head").innerHTML = (currentround + " " + question.section + " answer").toUpperCase();
  //document.getElementById("text").innerHTML = question.answer;
  document.getElementById("body").style.backgroundColor = "white";
  let image = "url('/question/" + roundname+ question.section + "ans.jpg')";
  $("#body").css("background-image", image);
}
function select(socket) {
  var select = document.getElementById("teamselection");
  var name = select.options[select.selectedIndex].text;
  team = name;
  document.getElementById("teamselectionmenu").style.visibility = "hidden";
  document.getElementById("teamname").innerHTML = team;
  document.getElementById("score").innerHTML = "SCORE: " + table[table.findindexbyabbr(name)].score;
  $(".teambar").css("visibility", "visible");
  introduce(socket, "stage-" + name);

}
function fullscreen() {
  document.getElementById("selected").src = "/question/" + currentround + question.section + "img.jpg";
  document.getElementById("fullscreen").style.visibility = "visible";
}
function cancel() {
  document.getElementById("fullscreen").style.visibility = "hidden";
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
function factoreffect(data) {
  if (team == data.name) {
    $(".factor").text(data.type);
    $(".factor").css("visibility", "visible");
    var color;
    switch (data.type) {
      case "x2": color = "lightpink";
        break;
      case "x3": color = "greenyellow";
        break;
      case "Leader": color = "cornlowerblue";
        break;
    }
    $(".factor").css("background-color", color);
  }
}
function resetfactor() {
  $(".factor").css("visibility", "hidden");
}
function blackout() {
  document.getElementById("blackout").style.visibility = "visible";
}
Array.prototype.findindexbyabbr = function (name) {
  var i;
  for (i = 0; i < this.length; i++) {
    //   console.log(this[i].abbr);
    if (this[i].abbr == name) { return i; }
  }

};

function tomin(time) {
  return Math.floor(time / 60) + "." + (time % 60).pad(2);
}