var table = [];
var team;
var currentround;
Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

function roundstart(round)
{   currentround = round;
    document.getElementById("round-info").firstElementChild.innerHTML = round;
    document.getElementById("round-info").style.visibility = "visible";
}

function openquestion()
{
  document.getElementById("question-info").style.visibility = "hidden";
  document.getElementById("clock").innerHTML = tomin(question.time);
}
function openanswer()
{
      document.getElementById("head").innerHTML = currentround + " " +question.section+" answer";
      document.getElementById("text").innerHTML = question.answer;
      document.getElementById("body").style.backgroundColor = "white";
}
function select(socket)
{
        var select = document.getElementById("teamselection");
        var name = select.options[select.selectedIndex].text;
         team = name;
       document.getElementById("teamselectionmenu").style.visibility = "hidden";
       document.getElementById("teamname").innerHTML = team;
       document.getElementById("score").innerHTML = "Score: "+table[table.findindexbyabbr(name)].score;

       introduce(socket, "stage-" + name);
}

function setdropdown()
{
    var select = document.getElementById("teamselection");
    var i;
    for(i = 0; i < table.length; i++) {
    var opt = table[i].abbr;
    var el = document.createElement("option");
    el.text = opt;
    el.value = opt;
    select.appendChild(el);
      
  }
}

function blackout()
{
  document.getElementById("blackout").style.visibility = "visible";
}
Array.prototype.findindexbyabbr = function(name)
{
  var i;
  for (i = 0; i < this.length; i++) {
   //   console.log(this[i].abbr);
    if(this[i].abbr == name)
        {return i;}
  }

};

function tomin(time)
{
  return Math.floor(time / 60) + "." + (time % 60).pad(2);
}