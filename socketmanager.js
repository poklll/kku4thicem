var io = require('socket.io')(http);
var time = 800;
var timeron = true;
var count = function () {
    time--;
    io.sockets.emit('tick', Math.floor(time / 60) + "." + (time % 60).pad(2));
}

setInterval(count, 1000);
io.on('connection', function (socket) {

    console.log("client is connected");
    //init
    socket.emit('init', { table: table, questions: questions });
    socket.emit('setteamlist', table.name);


    //reset
    socket.on('reset', function (data) {
        console.log("cleared");
        table = { name: [], score: [] };
        socket.broadcast.emit('reset', true);
        socket.emit('reset', true);
    }

    );
    socket.on('resetcanvas', function () { io.sockets.emit('clearcanvas', true); });

    //team
    socket.on('deleteteam', function (data) {
        var index = table.name.indexOf(data.name);
        console.log(table.name);
        console.log(index);
        table.name.splice(index, 1);
        table.score.splice(index, 1);
        console.log(table.name);
        socket.broadcast.emit('delete', { dataindex: index, datatable: table });
        socket.emit('delete', { dataindex: index, datatable: table });
    });
    socket.on('addteam', function (data) {
        table.name.push(data.name);
        table.score.push(data.score);
        console.log(table.name[table.name.length - 1] + table.score[table.score.length - 1]);
        socket.broadcast.emit('addrow', { rank: table.name.length, name: data.name, score: data.score, });
        socket.emit('addrow', { rank: table.name.length, name: data.name, score: data.score });
    });
    socket.on('screensubmit', function (data) {
        socket.broadcast.emit('addimage', data);
        socket.emit('addimage', data);
    });

    //score
    socket.on('setscore', function (data) {
        var index = table.name.indexOf(data.name);
        var sum = table.score[index] + data.score;
        var i;
        var previousposition;
        console.log(table.name + " , " + table.score);
        if (sum > table.score[index]) {
            i = sortascending(sum, index);
            previousposition = index + 1;
        }
        else {
            i = sortdescending(sum, index);
            previousposition = index;
        }
        table.score.splice(i, 0, sum);
        table.score.splice(previousposition, 1);
        table.name.splice(i, 0, data.name);
        table.name.splice(previousposition, 1);
        console.log(table.name + " , " + table.score);
        console.log("score was added : " + data.name + " " + table.score[index] + " " + index);
        console.log("positionchage from: " + index + " to " + i);
        socket.emit('scorechange', { datatable: table, name: data.name, score: sum });
        socket.broadcast.emit('scorechange', { datatable: table, name: data.name, score: sum });
        socket.emit('positionchange', { from: index, to: i, datatable: table });
        socket.broadcast.emit('positionchange', { from: index, to: i, datatable: table });

    });



    //stage

    socket.on('buttonHit', function (data) { console.log(data); })
    socket.on('success', function (data) { console.log(data) });
    socket.on('sirenOn', function (data) { socket.broadcast.emit('turnOnSiren', data) });
    socket.on('sirenOff', function (data) { socket.broadcast.emit('turnOffSiren', data) });
    socket.on('buttonOn', function (data) { socket.broadcast.emit('enableButton', data) });
    socket.on('buttonOff', function (data) { socket.broadcast.emit('disableButton', data) });


    //question
    socket.on('questionshow', function (data) { });
});
Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) { s = "0" + s; }
    return s;
}



function sortascending(sum, index) {
    table.score[index] = sum;
    var i = index - 1;
    while (table.score[index] > table.score[i]) {
        i--;
    }
    return i + 1;
}
function sortdescending(sum, index) {
    table.score[index] = sum;
    var i = index + 1;
    while (table.score[index] < table.score[i]) {
        i++;
    }
    return i;
}