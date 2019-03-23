var table = [];
var questions= [];
var edited = true;
var timer = false;
var question = {};
var judge;
var currentround;
function addimage(data)
{   var index = table.findindexbyabbr(data.name);
    if(currentround != "final:the fast")
    {
        var nameimg = "team"+(index+1)+"img";
        document.getElementById(nameimg).src = data.image;
    }
    document.getElementById("team"+(index+1)+"panel").getElementsByClassName('btn-container')[0].style.visibility = "visible";
}


    function init()
{   
     setdropdown();
     setqeustionlist();


    
     for(var i = 0;i<table.length;i++)
     {
        document.getElementById("team"+(i+1)+"label").innerHTML = table[i].abbr;

     }
     for(var i = 0;i<5;i++)
     {
        document.getElementById("team"+(i+1)+"label2").innerHTML = table[i].abbr;
     }
    

     
}

function roundsetup(round)
{
     currentround = round;
     if(currentround == "final:the fast")
     {
         document.getElementById("thefast").style.visibility = "visible";
     }
     else
     {
        document.getElementById("thefast").style.visibility = "hidden";
     }
     

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
   socket.emit('setscore',{name:team,score:score});
    
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
      document.getElementById("status"+teamnumber).style.backgroundColor ="green";
      var name = document.getElementById("team"+teamnumber+"label").innerHTML;
      var score = parseInt(question.score);
      setscore(name,score);
      socket.emit('correct',name);
      judge--;
      iscomplete();
}

function wrong(teamnumber)
{
    document.getElementById("team"+teamnumber+"panel").style.backgroundColor ="red";
    document.getElementById("status"+teamnumber).style.backgroundColor ="red";
    var name = document.getElementById("team"+teamnumber+"label").innerHTML;
    var score = 0-parseInt(question.score);
    setscore(name,score);
    socket.emit('wrong',name);
    judge--;
    iscomplete();
}

function iscomplete()
{
    if(judge == 0)
    {
        socket.emit('judgecomplete',true);

    }
}
function screenshot()
{
    socket.emit('screenshot',true);
}
function resetpanel()
{   var i;
    var teampanel = document.getElementsByClassName("teampanel");
    for(i=0;i<teampanel.length;i++)
    {
        teampanel[i].style.backgroundColor = "cornflowerblue";
    }
    var status= document.getElementsByClassName("status");
    for(i=0;i<status.length;i++)
    {
        status[i].style.backgroundColor = "white";
    }
    //socket.emit('screenshot',true);
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
NodeList.prototype.map = Array.prototype.map;
Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) { s = "0" + s; }
    return s;
  };