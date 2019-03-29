var table = [];
var questions= [];
var question = {};
var edited = true;
var timer = false;

function init()
{   var i;
    cleartable();
    for (i = 0; i < table.length; i++) 
     {
     addrow(i+1,table[i].abbr,table[i].score);
     }
 
     setdropdown();
     setqeustionlist();
}

  function addrow(rank,name,score)
    {     
        var tablepanel = document.getElementById("tablepanel");
        var newrow = document.createElement("tr");
        newrow.classList.add("scoreitem");
        newrow.innerHTML = ' <th scope="row" class="teamrank"></th> <td class="teamname"><img class="logoimg"> <h1 class="teamnametext"></h1><img class="flagimg"></td><td class="teamscore"></td>';
        tablepanel.appendChild(newrow);
       
     for (var i = 0; i < newrow.childNodes.length; i++) 
     {
        if (newrow.childNodes[i].className == "teamrank") 
        {
           newrow.childNodes[i].innerHTML = rank;
         
        }
         else
        if (newrow.childNodes[i].className == "teamname") 
        {
            newrow.childNodes[i].childNodes.map(function(element){
                if(element.className == "logoimg")
                    {
                        element.src = "/logo/"+table[table.findindexbyabbr(name)].name+".png";
                    }
                if(element.className == "flagimg")
                    {
                        element.src = "/flag/"+table[table.findindexbyabbr(name)].country+".png";
                    }
                if(element.className == "teamnametext")
                   {
                       element.innerHTML = name;
                   }
                
            });
           
        }
         
         else
        if (newrow.childNodes[i].className == "teamscore") 
        {
           newrow.childNodes[i].innerHTML = score;
         
        }
        
        
             
         
     }
        flip(newrow);
       
    }
   function deleterow(data) 
{   
    
    var item = document.getElementsByClassName("scoreitem");
    item[data.dataindex].parentNode.removeChild(item[data.dataindex]);
    table = data.datatable;
    rerank();
    
}

function rerank()
{
     for(var i=0;i<table.length;i++)
        {
            var rank = document.getElementsByClassName("teamrank");
            rank[i].innerHTML = i+1;
        }
}
  function flip(row)
{
    row.classList.add("flip-in-hor-bottom");
    setTimeout(function(){  row.classList.remove("flip-in-hor-bottom");}, 1000);
  
}

 function swing(row)
{
    row.classList.add("swing-in-top-fwd");
    setTimeout(function(){  row.classList.remove("swing-in-top-fwd");}, 1000);
  
}
function colorflash(row)
{
     row.childNodes[1].classList.add("color-change-2x");
    setTimeout(function(){  row.childNodes[1].classList.remove("color-change-2x");}, 1000);
    row.childNodes[3].classList.add("color-change-2x");
    setTimeout(function(){  row.childNodes[3].classList.remove("color-change-2x");}, 1000);
    row.childNodes[4].classList.add("color-change-2x");
    setTimeout(function(){  row.childNodes[4].classList.remove("color-change-2x");}, 1000);
}

function addteam()
{   var inputname =document.getElementById('addname').value;
    var inputscore= document.getElementById('initialscore').value;
    socket.emit('addteam',{name:inputname,score:inputscore});
  

}

function deleteteam()
{   var inputname =document.getElementById('addname').value;
    socket.emit('deleteteam',{name: inputname});

}

function change(from,to)
{     var nodes = document.getElementsByClassName("scoreitem");
    if(to>from)
    {
          for(var i = from;i<to+1;i++)
        {
            flip(document.getElementsByClassName("scoreitem")[i]);
            
        }
         nodes[from].parentNode.insertBefore(nodes[from],nodes[to+1]);
    
    }
  
   else
       {
            for(var i = to;i<from;i++)
        {
            flip(document.getElementsByClassName("scoreitem")[i]);
             
        }
          
           nodes[from].parentNode.insertBefore(nodes[from],nodes[to]);
       }


 swing(nodes[to]);   
 colorflash(nodes[to]);  

         
    rerank();
}

function setscore(name,score)
{ var index = table.findindexbyabbr(name);
  var teamscore = document.getElementsByClassName("teamscore");
  teamscore[index].innerHTML = score;
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

function selectquestion()
{
    var select = document.getElementById("questionselection");
    var section = select.options[select.selectedIndex].text;
    var index = questions.findindexbysection(section);
    document.getElementById("questiontext").innerHTML = questions[index].question;
    document.getElementById("questionscore").value = questions[index].score;
    document.getElementById("questiontime").value = questions[index].time;
    question = questions[index];
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


Array.prototype.findindexbysection = function(name)
{
  var i;
  for (i = 0; i < this.length; i++) {
      console.log(this[i].abbr);
    if(this[i].section == name)
        {return i;}
  }

};
Array.prototype.findindexbyabbr = function(name)
{
  var i;
  for (i = 0; i < this.length; i++) {
      console.log(this[i].abbr);
    if(this[i].abbr == name)
        {return i;}
  }

};

NodeList.prototype.map = Array.prototype.map;


function reset()
{
    socket.emit('reset',true);
  
}

function reload()
{
    socket.emit('reload',true);
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

function setqeustionlist()
{
     var select = document.getElementById("questionselection");
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
function cleartable()
{
      var table = document.getElementById("tablepanel");
      table.innerHTML = '';
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


//stage
var button = false;
var siren = false;

function togglesiren()
    {
        var team = parseInt(document.getElementById('teamnumber').value);
         var ebutton = document.getElementById("enableSiren");
        if(siren)
            {
                  socket.emit('sirenOff',team);
                 ebutton.innerHTML = "Turn on Siren";
                ebutton.className ="btn btn-success";
                 siren = false;
                
            }
        else
            {
                  socket.emit('sirenOn',team);
                ebutton.innerHTML = "Turn off Siren";
                ebutton.className ="btn btn-danger";
                siren =true;
            }
        
      
    }
function enablebutton()
    {
       var team = parseInt(document.getElementById('teamnumber').value);
        var ebutton = document.getElementById("enableButton");
    
        if(button)
            {   
                 socket.emit('buttonOff',team);
                ebutton.innerHTML = "Button disabled";
                ebutton.className = "btn btn-secondary";
                button = false;
            }
        else
            {
                 socket.emit('buttonOn',team);
                 ebutton.innerHTML = "Button enabled";
               ebutton.className = "btn btn-info";
                button =true;
            }
         
    
    }
function LEDon()
{   var team = document.getElementById('teamnumber').value;
    var select = document.getElementById("LEDpattern");
    var pattern = select.options[select.selectedIndex].value;
    socket.emit('LEDOn',[team,pattern]);
}

function LEDoff()
{
     var team = document.getElementById('teamnumber').value;
    socket.emit('LEDOff',team);
}

function ForceLEDoff()
{
      var team = document.getElementById('teamnumber').value;
       socket.emit('ForceLEDOff',team);
}