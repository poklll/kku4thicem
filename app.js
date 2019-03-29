const express = require("express");
const path = require("path");
const omit = require('object.omit');
const app = express();
const router = express.Router();
var http = require('http').Server(app);
app.use('/asset', express.static(path.join(__dirname, 'public/asset')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/canver', express.static(path.join(__dirname, 'canver')));
app.use('/logo', express.static(path.join(__dirname, 'public/asset/Logo')));
app.use('/flag', express.static(path.join(__dirname, 'public/asset/Flag')));

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});
router.get('/tester', function (req, res) {
  res.sendFile(path.join(__dirname + '/tester.html'));
});
router.get('/user', function (req, res) {
  res.sendFile(path.join(__dirname + '/scoreuser.html'));
});
router.get('/admin', function (req, res) {
  res.sendFile(path.join(__dirname + '/scoreadmin.html'));
});
router.get('/contestant', function (req, res) {
  res.sendFile(path.join(__dirname + '/canver/canver.html'));
});
router.get('/committee', function (req, res) {
  res.sendFile(path.join(__dirname + '/answerview.html'));
});
router.get('/stage', function (req, res) {
  res.sendFile(path.join(__dirname + '/stage.html'));
});
router.get('/projector', function (req, res) {
  res.sendFile(path.join(__dirname + '/projector.html'));
});
router.get('/projector-left', function (req, res) {
  res.sendFile(path.join(__dirname + '/projector-left.html'));
});
router.get('/projector-middle', function (req, res) {
  res.sendFile(path.join(__dirname + '/projector-middle.html'));
});
router.get('/projector-right', function (req, res) {
  res.sendFile(path.join(__dirname + '/projector-right.html'));
});
app.use('/', router);

//if (process.env.NODE_ENV === 'production') {
// app.use(express.static('client/build'));
//}
//app.get('*', (request, response) => {
// response.sendFile(path.join(__dirname, 'client/build', 'index.html'));
//});

var io = require('socket.io')(http);
var table = []; //abbr,name,country,score
var questions = []; //section,question,score,time
var semifinalquestion = [];
var resuscitationquestion = [];
var suddendeathquestion = [];
var finalfastquestion = [];
var finalleaderquestion = [];
var finalerrorquestion = [];
var question = {};
var defaultpositivefactor = 1;
var defaultnegativefactor = 1;
var Round = []; //name,rule
var currentround;
var Currentteam;
var socketID = [];

//Init data
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), readsheet);
});


function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}


function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}


function readsheet(auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  //set up table
  sheets.spreadsheets.values.get({
    spreadsheetId: '15QDjlyUu5dF5xIJLU7-9Dz5PL4cD1HKNsOEQYijNbnI',
    range: 'TeamList!A2:E',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      //console.log('Question : Section,Question,Score,Time:');
      rows.map((row) => {
        table.push({ abbr: row[0], name: row[1], country: row[2], score: row[3], buttonnumber: row[4], positivefactor: 1, negativefactor: 1 });
        // console.log(`${row[0]} , ${row[1]} , ${row[2]} , ${row[3]}`);

      });
      // console.log(table);
      //console.log(table.findindexbyabbr('KKU1'));
    } else {
      console.log('No data found.');
    }
  });

  //set up questions
  sheets.spreadsheets.values.get({
    spreadsheetId: '15QDjlyUu5dF5xIJLU7-9Dz5PL4cD1HKNsOEQYijNbnI',
    range: 'Semifinal!A2:G',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      rows.map((row) => {
        semifinalquestion.push({ section: row[0], question: row[1], answer: row[2], score: row[3], time: row[4], img: row[5], level: row[6] });
      });

    } else {
      console.log('No data found.');
    }
  });
  sheets.spreadsheets.values.get({
    spreadsheetId: '15QDjlyUu5dF5xIJLU7-9Dz5PL4cD1HKNsOEQYijNbnI',
    range: 'Resusitation!A2:F',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      rows.map((row) => {
        resuscitationquestion.push({ section: row[0], question: row[1], answer: row[2], time: row[3], img: row[4], level: row[5] });
      });

    } else {
      console.log('No data found.');
    }
  });
  sheets.spreadsheets.values.get({
    spreadsheetId: '15QDjlyUu5dF5xIJLU7-9Dz5PL4cD1HKNsOEQYijNbnI',
    range: 'Sudden Death!A2:D',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      rows.map((row) => {
        suddendeathquestion.push({ section: row[0], question: row[1], answer: row[2], time: row[3] });
      });

    } else {
      console.log('No data found.');
    }
  });
  sheets.spreadsheets.values.get({
    spreadsheetId: '15QDjlyUu5dF5xIJLU7-9Dz5PL4cD1HKNsOEQYijNbnI',
    range: 'Final:the fast!A2:F',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      rows.map((row) => {
        finalfastquestion.push({ section: row[0], question: row[1], answer: row[2], score: row[3], time: row[4], img: row[5] });
      });

    } else {
      console.log('No data found.');
    }
  });
  sheets.spreadsheets.values.get({
    spreadsheetId: '15QDjlyUu5dF5xIJLU7-9Dz5PL4cD1HKNsOEQYijNbnI',
    range: 'Final:the leader!A2:G',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      rows.map((row) => {
        finalleaderquestion.push({ section: row[0], question: row[1], answer: row[2], score: row[3], time: row[4], img: row[5], level: row[6] });
      });

    } else {
      console.log('No data found.');
    }
  });
  sheets.spreadsheets.values.get({
    spreadsheetId: '15QDjlyUu5dF5xIJLU7-9Dz5PL4cD1HKNsOEQYijNbnI',
    range: 'Final:the error detector!A2:G',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      rows.map((row) => {
        finalerrorquestion.push({ section: row[0], question: row[1], answer: row[2], score: row[3], time: row[4], img: row[5], level: row[6] });
      });

    } else {
      console.log('No data found.');
    }
  });

  //set up round infomation
  sheets.spreadsheets.values.get({
    spreadsheetId: '15QDjlyUu5dF5xIJLU7-9Dz5PL4cD1HKNsOEQYijNbnI',
    range: 'Rule!A2:B',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      rows.map((row) => {
        Round.push({ name: row[0], rule: row[1] });
      });
    } else {
      console.log('No data found.');
    }
  });

}





//Timer
var time = 0;
var timerOn = false;
var tickFeedbackImmediateCount = 0;
var tickFeedbackDelayCount = 0;
var tickMissing = 0;
var firstTick = true;
var teamCount = 9;
var count = function () {
  if (timerOn) {
    if (time > 0) {
      time--;
      if (!firstTick) tickMissing += teamCount - tickFeedbackImmediateCount - tickFeedbackDelayCount;
      console.log("Tick! [" + time + "] (on-time: " + tickFeedbackImmediateCount + ", delay: " + tickFeedbackDelayCount + ", missing: " + tickMissing + ")");
      tickFeedbackImmediateCount = 0;
      tickFeedbackDelayCount = 0;
      io.sockets.emit('tick', time);
      firstTick = false;
    }
    else {
      timerOn = false;
      io.sockets.emit('screenshot', true);
      io.sockets.emit('clearcanvas', true);
      io.sockets.emit('timeup', true);
      tickFeedbackImmediateCount = 0;
      tickFeedbackDelayCount = 0;
      tickMissing = 0;
      firstTick = true;
    }
  }
}


setInterval(count, 1000);

questions = semifinalquestion;


//Socket
var clientEntries = [];
var nextSocketId = 0;
var AsyncLock = new require('async-lock');
var lock = new AsyncLock();

// Override console.log
var originConsoleLog = console.log;
console.log = function (data) {
  lock.acquire("socketIntroduction", () => {
    var d = new Date();
    var ds = "[" + d.getHours().toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0') + ":" + d.getSeconds().toString().padStart(2, '0') + "] ";
    clientEntries.forEach(x => {
      if (x.introduction == "admin" || x.introduction == "committee") {
        x.socket.emit("addConsoleText", ds + data);
      }
    });
    originConsoleLog(ds + data);
  });
};

io.on('connection', function (socket) {


  socket.on("introduce", function (intro) {
    lock.acquire("socketIntroduction", () => {
      var index = clientEntries.findIndex(x => x.socket == socket);
      if (index != -1) return;
      index = clientEntries.findIndex(x =>
        x.ip == socket.handshake.address && x.introduction == intro && x.disconnected);
      var entry = null;
      if (index != -1) {
        console.log("client '" + intro + "' reconnected");
        entry = clientEntries[index];
        clientEntries.splice(index, 1);
        entry.socket = socket;
        entry.disconnected = false;
      }
      else {
        console.log("client '" + intro + "' connected");
        entry = {
          socket: socket,
          id: nextSocketId++,
          introduction: intro,
          ip: socket.handshake.address,
          pingTime: null,
          disconnected: false,
          warning: false,
        };
      }
      clientEntries.forEach(x => {
        if (x.introduction == "admin") {
          x.socket.emit("showNewClient", omit(entry, 'socket'));
        }
      });
      clientEntries.push(entry);

      if (intro == "admin") {
        clientEntries.forEach(x => {
          socket.emit("showNewClient", omit(x, 'socket'));
          if (x.disconnected) socket.emit("grayoutClient", x.id);
          else if (x.warning) socket.emit("warningClient", x.id, true);
        });
      }

      entry.pingTime = Date.now();
      socket.emit('manual-ping');
      var intervalId = setInterval(() => {
        if (entry.disconnected) {
          clearInterval(intervalId);
        }
        else if (entry.pingTime != -1 && Date.now() - entry.pingTime > 1000 && !entry.warning) {
          console.log("client '" + entry.introduction + "' not responding");
          entry.warning = true;
          clientEntries.forEach(x => {
            if (x.introduction == "admin") {
              x.socket.emit("warningClient", entry.id, true);
            }
          });
        }
      }, 1000);
    });
  });

  socket.on('disconnect', () => {
    lock.acquire("socketIntroduction", () => {
      var index = clientEntries.findIndex(x => x.socket == socket);
      if (index == -1) return;
      console.log("client '" + clientEntries[index].introduction + "' disconnected");
      clientEntries[index].disconnected = true;
      clientEntries.forEach(x => {
        if (x.introduction == "admin") {
          x.socket.emit("grayoutClient", clientEntries[index].id);
        }
      });
      setTimeout(() => {
        lock.acquire("socketIntroduction", () => {
          var index = clientEntries.findIndex(x => x.socket == socket);
          if (index == -1 || !clientEntries[index].disconnected) return;
          clientEntries.forEach(x => {
            if (x.introduction == "admin") {
              x.socket.emit("removeClient", clientEntries[index].id);
            }
          });
          clientEntries.splice(index, 1);
        });
      }, 60000);
    });
  });

  socket.on('manual-pong', () => {
    lock.acquire("socketIntroduction", () => {
      var index = clientEntries.findIndex(x => x.socket == socket);
      if (index == -1 || clientEntries[index].disconnected || clientEntries[index].pingTime == -1) return;
      var latency = Date.now() - clientEntries[index].pingTime;
      if (clientEntries[index].warning) {
        console.log("client '" + clientEntries[index].introduction + "' resume responding");
        clientEntries[index].warning = false;
        clientEntries.forEach(x => {
          if (x.introduction == "admin") {
            x.socket.emit("warningClient", clientEntries[index].id, false);
          }
        });
      }
      clientEntries[index].pingTime = -1;
      setTimeout(() => {
        lock.acquire("socketIntroduction", () => {
          var index = clientEntries.findIndex(x => x.socket == socket);
          if (index == -1 || clientEntries[index].disconnected) return;
          clientEntries[index].pingTime = Date.now();
          socket.emit('manual-ping');
        });
      }, 2000);
      clientEntries.forEach(x => {
        if (x.introduction == "admin") {
          x.socket.emit("updateClientLatency", clientEntries[index].id, latency);
        }
      });
    });
  });

  socket.on("feedback", (data) => {
    if (data.error == null) {
      if (data.event == "tick") {
        if (data.tick == time) {
          tickFeedbackImmediateCount++;
        }
        else {
          tickFeedbackDelayCount++;
        }
        console.log(data.client + ": " + data.event + " success [" + data.tick + "]");
      }
      else {
        console.log(data.client + ": " + data.event + " success");
      }
    }
    else {
      console.log(data.client + ": " + data.event + " error: " + data.error);
    }
  });

  //init
  socket.emit('init', { table: table, questions: questions, currentroun: currentround, question: question });
  socket.emit('setteamlist', table);
  socket.emit('tester',table);
  //io.sockets.emit('setquestion', question);
  io.sockets.emit('setround', Round);


  //reset

  socket.on('reload', function () {
    reload();
    io.sockets.emit('init', { table: table, questions: questions });
    io.sockets.emit('setteamlist', table);
  });
  socket.on('reset', function () {
    console.log("cleared");
    table = [];
    socket.broadcast.emit('reset', true);
    socket.emit('reset', true);
  }
  );
  socket.on('resetcanvas', function () { io.sockets.emit('clearcanvas', true); });



  //timer
  socket.on('settimer', function (data) { time = data; });
  socket.on('timerOn', function (data) { timerOn = data; });


  //round

  socket.on('roundstart', function (data) {
    currentround = data;
    console.log("round was set to " + currentround);
    roundsetup(currentround);
    io.sockets.emit('round', data);
    io.sockets.emit('setquestionlist', questions);
    //show helper
    if (data == "semifinal") {
      io.sockets.emit('showhelper', true);
    }
    else {
      io.sockets.emit('showhelper', false);
    }
    //show leader selection
    if (data == "final:the leader") {
      io.sockets.emit('showleader', true);
    }
    else {
      io.sockets.emit('showleader', false);
    }
    //
  });
  socket.on('openquestion', function (data) {
    io.sockets.emit('openquestion', data);
    time = (question.time);
  });
  socket.on('openanswer', function () {
    io.sockets.emit('openanswer', true);
  });
  socket.on('judgecomplete', function () {
    console.log("judge was completed");
    if (currentround == "semifinal" && (question.section == 4 || question.section == 8)) {
      if (table[table.length - 1].score == table[table.length - 2].score) {
        table.splice(table.length - 1, 1);
        io.sockets.emit('blackout', table[table.length - 1].name);
        socket.emit('init', { table: table, questions: questions });
      }
    }
  }
  )

  //question

  socket.on('questionshow', function (data) {
    if(currentround != "final:the leader")
    {
      resetfactor();
    }
    timerOn = false;
    question = data;
    io.sockets.emit('setquestion', data);
    if(currentround == "semifinal")
    {
         time = 10;
    }
    
  });
  socket.on('setquestionscore', function (data) {
    question.score = data;
    io.sockets.emit('setquestion', question);
    console.log(currentround +" "+question.section + " score was set to " + data);
  });

  //team

  socket.on('deleteteam', function (data) {
    table.splice(table.findindexbyabbr(data), 1);
    io.sockets.emit('blackout', data);
    socket.emit('init', { table: table, questions: questions });

  });

  socket.on('screensubmit', function (data) {
    socket.broadcast.emit('addimage', data);
    socket.emit('addimage', data);
  });
  socket.on('screenshot', function () { io.sockets.emit('screenshot', true); });
  socket.on('correct', function (data) { io.sockets.emit('correct', data) });
  socket.on('wrong', function (data) { io.sockets.emit('wrong', data) });
  socket.on('setscorefactor', function (data) {
    table[table.findindexbyabbr(data.name)].positivefactor = data.positive;
    table[table.findindexbyabbr(data.name)].negativefactor = data.negative;
    console.log(data);
    console.log(table[table.findindexbyabbr(data.name)]);
    io.sockets.emit('setscorefactor', data);
  });


  //score

  socket.on('setscore', function (data) {
    var index = table.findindexbyabbr(data.name);
    var sum;
    if (data.score > 0) {
      console.log("positivefactor: " + table[index].positivefactor);
      sum = parseInt(table[index].score) + (parseInt(data.score) * parseInt(table[index].positivefactor));
      console.log(data.score);
      console.log(sum);
    }
    else {
      sum = parseFloat(table[index].score) + (parseInt(data.score) * parseFloat(table[index].negativefactor));
    }
    //resuscitation
    if (currentround == "resuscitation" && sum <= 0) {
      io.sockets.emit('blackout', data.name);
      table.splice(table.findindexbyabbr(data.name), 1);
      io.sockets.emit('init', { table: table, questions: questions, currentround:currentround ,question: question});
    }
    else {
      var previousposition = index;
      //console.log(table);
      table[index].score = sum;
      table.sort(function (a, b) {
        return b.score - a.score;
      });
      //console.log(" ");
      //console.log(table);
      var newposition = table.findindexbyabbr(data.name);
      console.log(data.score + " score was added to " + data.name);
      console.log(data.name+" score: "+sum);
      console.log("Scoreboard: position change from: " + previousposition + " to " + newposition);
      io.sockets.emit('scorechange', { datatable: table, name: data.name, score: sum });
      io.sockets.emit('positionchange', { from: previousposition, to: newposition, datatable: table });
    }
  });

  socket.on('manual-setscore', function (data) {
    var index = table.findindexbyabbr(data.name);
    var sum;
    if (data.score > 0) {
      sum = parseInt(table[index].score) + parseInt(data.score) ;
    }
    else {
      sum = parseFloat(table[index].score) + parseInt(data.score);
    }
    //resuscitation
    if (currentround == "resuscitation" && sum <= 0) {
      io.sockets.emit('blackout', data.name);
      table.splice(table.findindexbyabbr(data.name), 1);
      io.sockets.emit('init', { table: table, questions: questions, currentround:currentround ,question: question});
    }
    else {
      var previousposition = index;
      //console.log(table);
      table[index].score = sum;
      table.sort(function (a, b) {
        return b.score - a.score;
      });
      //console.log(" ");
      //console.log(table);
      var newposition = table.findindexbyabbr(data.name);
      console.log(data.score + " score was added to " + data.name);
      console.log(data.name+" score: "+sum);
      console.log("Scoreboard: position change from: " + previousposition + " to " + newposition);
      io.sockets.emit('scorechange', { datatable: table, name: data.name, score: sum });
      io.sockets.emit('positionchange', { from: previousposition, to: newposition, datatable: table });
    }
  });
  socket.on('kill',function(data){
    io.sockets.emit('blackout', data.name);
    table.splice(table.findindexbyabbr(data.name), 1);
    io.sockets.emit('init', { table: table, questions: questions, currentround:currentround ,question: question});
    console.log(data.name+" is eliminated");
  });

  //stage

  socket.on('buttonHit', function (data) {
    console.log("button " + data + " was hit!");
    if (currentround == "resuscitation") {
      var name = table.findabbrbybtn(data);
      io.sockets.emit('hitsetscore', name);

    }
    if(currentround == "final:the fast")
    {
        time = 20;
        timerOn = true;
    }
  })
  socket.on('success', function (data) { console.log(data) });
  socket.on('sirenOn', function (data) { socket.broadcast.emit('turnOnSiren', data) });
  socket.on('sirenOff', function (data) { socket.broadcast.emit('turnOffSiren', data) });
  socket.on('buttonOn', function (data) { socket.broadcast.emit('enableButton', data) });
  socket.on('buttonOff', function (data) { socket.broadcast.emit('disableButton', data) });
  socket.on('LEDOn', function (data) { socket.broadcast.emit('turnOnLedStrip', (data[0] + "," + data[1])); });
  socket.on('LEDOff', function (data) { socket.broadcast.emit('turnOffLedStrip', parseInt(data)); });
  socket.on('ForceLEDOff', function (data) { socket.broadcast.emit('forceTurnOffLedStrip', data); });


});

function reload() {
  table = [];
  questions = [];
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), readsheet);
  });

}

function roundsetup(round) {
  switch (round) {
    case "semifinal":
      questions = semifinalquestion;
      resetscore(0);
      break;
    case "resuscitation":
      questions = resuscitationquestion;
      resetscore(50);
      break;
    case "sudden death":
      questions = suddendeathquestion;
      resetscore(0);
      break;
    case "final:the fast":
      questions = finalfastquestion;
      resetscore(0);
      break;
    case "final:the leader":
      questions = finalleaderquestion;
      resetscore(0);
      break;
    case "final:the error detector":
      questions = finalerrorquestion;
      resetscore(0);
      defaultnegativefactor = 0;
      break;

  }
  // console.log(questions);
  currentquestionnumber = 0;
}

function resetscore(score) {
  table.map((team) => {
    team.score = score;
  });
  io.sockets.emit('init', { table: table, questions: questions });
}

function resetfactor() {
  table.map((team) => {
    team.positivefactor = defaultpositivefactor;
    team.negativefactor = defaultnegativefactor;
  });
  io.sockets.emit('init', { table: table, questions: questions });
}

function blackout()
{

}
Number.prototype.pad = function (size) {
  var s = String(this);
  while (s.length < (size || 2)) { s = "0" + s; }
  return s;
};



Array.prototype.findindexbyabbr = function (name) {
  var i;
  for (i = 0; i < this.length; i++) {
    if (this[i].abbr == name) { return i; }
  }
};

Array.prototype.findabbrbybtn = function (number) {
  var i;
  for (i = 0; i < this.length; i++) {
    if (this[i].buttonnumber == number) { return this[i].abbr; }
  }
};

Array.prototype.findsocketbyID = function (id) {
  var i;
  for (i = 0; i < this.length; i++) {
    if (this[i].id == id) { return this[i].name; }
  }
};
Array.prototype.findbtnbyabbr = function (number) {
  var i;
  for (i = 0; i < this.length; i++) {
    //   console.log(this[i].abbr);
    if (this[i].buttonnumber == number) { return i; }
  }
};
Array.prototype.sortBy = function (p) {
  return this.slice(0).sort(function (a, b) {
    return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
  });
}


var server = http.listen((process.env.PORT || 5000), () => {
  console.log('server is running on port', server.address().port);
});

process.on('uncaughtException', (e) => { console.log(e); });