var table = [];
var questions = [];
var question = {};




function init() {
    var i;
    cleartable();
    for (i = 0; i < table.length; i++) {
        addrow(i + 1, table[i].abbr, table[i].score);
    }


}
function addrow(rank, name, score) {
    var tablepanel = document.getElementById("tablepanel");
    var newrow = document.createElement("tr");
    newrow.classList.add("scoreitem");
    newrow.innerHTML = ' <th scope="row" class="teamrank"></th> <td class="teamname"><img class="logoimg"> <h1 class="teamnametext"></h1><img class="flagimg"></td><td class="teamscore"></td>';
    tablepanel.appendChild(newrow);

    for (var i = 0; i < newrow.childNodes.length; i++) {
        if (newrow.childNodes[i].className == "teamrank") {
            newrow.childNodes[i].innerHTML = rank;

        }
        else
            if (newrow.childNodes[i].className == "teamname") {
                newrow.childNodes[i].childNodes.map(function (element) {
                    if (element.className == "logoimg") {
                        element.src = "/logo/" + table[table.findindexbyabbr(name)].name + ".png";
                    }
                    if (element.className == "flagimg") {
                        element.src = "/flag/" + table[table.findindexbyabbr(name)].country + ".png";
                    }
                    if (element.className == "teamnametext") {
                        element.innerHTML = name;
                    }

                });

            }

            else
                if (newrow.childNodes[i].className == "teamscore") {
                    newrow.childNodes[i].innerHTML = score;

                }




    }
    flip(newrow);

}
function deleterow(data) {

    var item = document.getElementsByClassName("scoreitem");
    item[data.dataindex].parentNode.removeChild(item[data.dataindex]);
    table = data.datatable;
    rerank();

}

function rerank() {
    for (var i = 0; i < table.length; i++) {
        var rank = document.getElementsByClassName("teamrank");
        rank[i].innerHTML = i + 1;
    }
}
function flip(row) {
    row.classList.add("flip-in-hor-bottom");
    setTimeout(function () { row.classList.remove("flip-in-hor-bottom"); }, 1000);

}

function swing(row) {
    row.classList.add("swing-in-top-fwd");
    setTimeout(function () { row.classList.remove("swing-in-top-fwd"); }, 1000);

}
function colorflash(row) {
    row.map((node) => {
        node.classList.add("color-change-2x");
        setTimeout(function () { node.classList.remove("color-change-2x"); }, 1000);
    }
    );
}
function x2(row) {
    row.childNodes[1].classList.add("x2");
    row.childNodes[3].classList.add("x2");
    row.childNodes[4].classList.add("x2");

}
function x3(row) {
    row.childNodes[1].classList.add("x3");
    row.childNodes[3].classList.add("x3");
    row.childNodes[4].classList.add("x3");

}

function leader(row) {
    row.childNodes[1].classList.add("leader");
    row.childNodes[3].classList.add("leader");
    row.childNodes[4].classList.add("leader");

}
function addteam() {
    var inputname = document.getElementById('addname').value;
    var inputscore = document.getElementById('initialscore').value;
    socket.emit('addteam', { name: inputname, score: inputscore });


}

function deleteteam() {
    var inputname = document.getElementById('addname').value;
    socket.emit('deleteteam', { name: inputname });

}

function change(from, to) {
    var nodes = document.getElementsByClassName("scoreitem");
    if (to > from) {
        for (var i = from; i < to + 1; i++) {
            flip(document.getElementsByClassName("scoreitem")[i]);

        }
        nodes[from].parentNode.insertBefore(nodes[from], nodes[to + 1]);

    }

    else {
        for (var i = to; i < from; i++) {
            flip(document.getElementsByClassName("scoreitem")[i]);

        }

        nodes[from].parentNode.insertBefore(nodes[from], nodes[to]);
    }


    swing(nodes[to]);
    colorflash(nodes[to]);


    rerank();
}

function setscore(name, score) {
    var index = table.findindexbyabbr(name);
    var teamscore = document.getElementsByClassName("teamscore");
    teamscore[index].innerHTML = score;
}

function submitscore(score, type) {
    if (type == "reduce") {
        score = 0 - score;
    }
    var select = document.getElementById("teamselection");
    var value = select.options[select.selectedIndex].value;
    var team = select.options[select.selectedIndex].text;
    socket.emit('setscore', { name: team, score: score });

}

function factoreffect(data) {
    var row = document.getElementsByClassName("scoreitem")[table.findindexbyabbr(data.name)];
    if (data.type == "x2") {
        x2(row);
    }
    else if(data.type == "x3"){
        x3(row);
    }
    else if(data.type == "Leader")
    {
        leader(row);
    }
    
    row.getElementsByClassName("teamname")[0].getElementsByClassName('teamnametext')[0].innerHTML += "  "+data.type;
    

}




Array.prototype.findindexbysection = function (name) {
    var i;
    for (i = 0; i < this.length; i++) {
        console.log(this[i].abbr);
        if (this[i].section == name) { return i; }
    }

};
Array.prototype.findindexbyabbr = function (name) {
    var i;
    for (i = 0; i < this.length; i++) {
        console.log(this[i].abbr);
        if (this[i].abbr == name) { return i; }
    }

};

NodeList.prototype.map = Array.prototype.map;


function reset() {
    socket.emit('reset', true);

}

function reload() {
    socket.emit('reload', true);
}


function cleartable() {
    var table = document.getElementById("tablepanel");
    table.innerHTML = '';
}


