var table = [];
var questions= [];
var edited = true;
var timer = false;
var question = {};
var judge;
var currentround;
var button = false;
function addimage(data)
{   var index = table.findindexbyabbr(data.name);
   
    var nameimg = "team"+(index+1)+"img";
    document.getElementById(nameimg).src = data.image;
    document.getElementById("team"+(index+1)+"panel").getElementsByClassName('btn-container')[0].style.visibility = "visible";
}


    function init()
{   
     setdropdown();
     setqeustionlist();   
}

function setpanel()
{
    for(var i = 0;i<table.length;i++)
    {
       document.getElementById("team"+(i+1)+"label").innerHTML = table[i].abbr;

    }
}

function roundsetup(round)
{
     currentround = round;
  

}

function manualsetscore(team,score)
{
    socket.emit('manual-setscore',{name:team,score:score});
}

function setscore(team,score)
{
    socket.emit('setscore',{name:team,score:score});
}

function submitscore(score,type)
{   if(type == "reduce")
    {
        score = 0-score;
    }
   var select = document.getElementById("teamselection");
   var value = select.options[select.selectedIndex].value;
   var team = select.options[select.selectedIndex].text;
   socket.emit('manual-setscore',{name:team,score:score});
    
}

function addscore()
{   var score = parseInt(document.getElementById("scoresubmit").value);
    submitscore(score,"add");
}

function reducescore()
{
     var score = parseInt(document.getElementById("scoresubmit").value);
    submitscore(score,"reduce");
}


function resetcanvas()
{
    socket.emit('resetcanvas',true);
}
function fullscreen(img)
{
    document.getElementById("selected").src = img;
    document.getElementById("fullscreen").style.visibility ="visible";
}

function cancel()
{
    document.getElementById("fullscreen").style.visibility ="hidden";
    document.getElementById("ans").style.visibility ="hidden";
}

function selectquestion()
{
    var select = document.getElementById("questionselection");
    var section = select.options[select.selectedIndex].text;
    var index = questions.findindexbysection(section);
    var time = questions[index].time;
   // document.getElementById("questiontext").innerHTML = questions[index].question;
    document.getElementById("questionscore").innerHTML = "Score: "+questions[index].score;
    document.getElementById("questiontime").innerHTML = "Time: "+Math.floor(time / 60) + "." + (time % 60).pad(2)+" min";
    question = questions[index];
}
function openquestion()
{
    socket.emit('openquestion',true);
}
function openanswer()
{
    socket.emit('openanswer',true);
}
function selectround()
{
    var select = document.getElementById("roundselection");
    var round = select.options[select.selectedIndex].text;
    socket.emit('roundstart',round);
}

function submitquestion()
{
    socket.emit('questionshow',question);
}

function timerOn()
{
   
    if(timer == false)
        {
            timer= true;
            document.getElementById('toggletimer').className ="btn btn-danger";
             document.getElementById('toggletimer').innerHTML = "stop timer";
        }
    else
        {
             timer = false;
            document.getElementById('toggletimer').className ="btn btn-success";
             document.getElementById('toggletimer').innerHTML = "start timer";
        }
    socket.emit('timerOn',timer);
}



function setdropdown()
{
    var select = document.getElementById("teamselection");
    select.innerHTML = "";
    var i;
    for(i = 0; i < table.length; i++) {
    var opt = table[i].abbr;
    var el = document.createElement("option");
    el.text = opt;
    el.value = opt;
    select.appendChild(el);
      
  }
}

function setqeustionlist()
{
    var select = document.getElementById("questionselection");
    select.innerHTML = "";
    var i;
    for(i = 0; i < questions.length; i++) {
    var opt = questions[i].section;
    var el = document.createElement("option");
    el.text = opt;
    el.value = opt;
    select.appendChild(el);
    selectquestion();
        
      
  }
}


function edit()
{  if(edited == true)
    {
           document.getElementById('pageturner').style.visibility ="hidden";
          edited = false;
    }
   else
       if(edited==false)
       {
           document.getElementById('pageturner').style.visibility ="visible";
           edited = true;
       }
}

function correct(teamnumber)
{    
      document.getElementById("team"+teamnumber+"panel").style.backgroundColor ="green";
     // document.getElementById("status"+teamnumber).style.backgroundColor ="green";
      var name = document.getElementById("team"+teamnumber+"label").innerHTML;
      if(currentround != "sudden death")
      {
        var score = parseInt(question.score);
        setscore(name,score);
      }
      else
      {
          setscore(name, 0);
      }
      socket.emit('correct',name);
      socket.emit('LEDOn',[table[table.findindexbyabbr(name)].buttonnumber,"green"]);
}

function wrong(teamnumber)
{
    document.getElementById("team"+teamnumber+"panel").style.backgroundColor ="red";
    var name = document.getElementById("team"+teamnumber+"label").innerHTML;
    if(currentround != "sudden death")
    {
        var score = -parseInt(question.score);
        setscore(name,score);
    }
    else
      {
          setscore(name, -1);
      }
    socket.emit('wrong',name);
    socket.emit('LEDOn',[table[table.findindexbyabbr(name)].buttonnumber,"red"]);
}

function judgeSubmit()
{
    socket.emit('judgeSubmit',true);
}

function screenshot()
{
    socket.emit('screenshot',true);
}
function resetpanel()
{   var i;
    var teampanel = document.getElementsByClassName("teampanel");
    var teamimg = document.getElementsByClassName("teamimg");
    for(i=0;i<teampanel.length;i++)
    {   if(teampanel[i].style.backgroundColor != "black")
    {
        teampanel[i].style.backgroundColor = "cornflowerblue";
        teampanel[i].getElementsByClassName('btn-container')[0].style.visibility = "hidden";
        teamimg[i].src = "";

    }
    }
}


function enablebutton()
    {
        var ebutton = document.getElementById("enableButton");
    
        if(button)
            {   
                socket.emit('buttonOff',true);
                ebutton.innerHTML = "Button disabled";
                ebutton.className = "btn btn-secondary";
                button = false;
            }
        else
            {
                 socket.emit('buttonOn',true);
                 ebutton.innerHTML = "Button enabled";
               ebutton.className = "btn btn-info";
                button =true;
            }
         
    
    }

function blackout(name)
{   var teampanel = document.getElementsByClassName("teampanel");
    var teamlabel = document.getElementsByClassName("teamlabel");
    var teamimg = document.getElementsByClassName("teamimg");
    for(let i=0;i<teampanel.length;i++)
    {   if(  teamlabel[i].innerHTML == name )
        {
               teampanel[i].style.backgroundColor = "black";
               teamimg[i].src = "/asset/balckout.jpg";
        }
      
    }
}

Array.prototype.findindexbysection = function(name)
{
  var i;
  for (i = 0; i < this.length; i++) {
    if(this[i].section == name)
        {return i;}
  }

};
Array.prototype.findindexbyabbr = function(name)
{
  var i;
  for (i = 0; i < this.length; i++) {
    if(this[i].abbr == name)
        {return i;}
  }

};
Array.prototype.findbtnbyabbr = function (number) {
    var i;
    for (i = 0; i < this.length; i++) {
      //   console.log(this[i].abbr);
      if (this[i].buttonnumber == number) { return i; }
    }
  };
NodeList.prototype.map = Array.prototype.map;
Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) { s = "0" + s; }
    return s;
  };