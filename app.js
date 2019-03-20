const express = require("express");
const path = require("path");
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
app.use('/', router);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}
app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

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
var CurrentRound;





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
    range: 'TeamList!A2:D',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      //console.log('Question : Section,Question,Score,Time:');
      rows.map((row) => {
        table.push({ abbr: row[0], name: row[1], country: row[2], score: row[3], positivefactor: 1, negativefactor: 1 });
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
    range: 'Resusitation!A2:G',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      rows.map((row) => {
        resuscitationquestion.push({ section: row[0], question: row[1], answer: row[2], score: row[3], time: row[4], img: row[5], level: row[6] });
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
var count = function () {
  if (timerOn) {
    if (time > 0) {
      time--;
      io.sockets.emit('tick', Math.floor(time / 60) + "." + (time % 60).pad(2));
    }
    else {
      timerOn = false;
      io.sockets.emit('screenshot', true);
      io.sockets.emit('clearcanvas', true);
    }
  }
}


setInterval(count, 1000);

questions = semifinalquestion;


//Socket

io.on('connection', function (socket) {

  console.log("client is connected");


  //init

  socket.emit('init', { table: table, questions: questions });
  socket.emit('setteamlist', table);
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

  socket.on('settime', function (data) { time = data; });
  socket.on('timerOn', function (data) { timerOn = data; });


  //round

  socket.on('roundstart', function (data) {
    CurrentRound = data;
    console.log("round was set to " + CurrentRound);
    roundsetup(CurrentRound);
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
  });
  socket.on('openanswer', function () {
    io.sockets.emit('openanwer', true);
  });


  //question

  socket.on('questionshow', function (data) {
    resetfactor();
    timerOn = false;
    question = data;
    io.sockets.emit('setquestion', data);
    time = (question.time);
  });


  //team

  socket.on('deleteteam', function (data) {
    table.splice(table.findindexbyabbr(data), 1);
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
      sum = parseInt(table[index].score) + (data.score * parseInt(table[index].positivefactor));
      console.log(data.score);
      console.log(sum);
    }
    else {
      sum = parseFloat(table[index].score) + (data.score * parseFloat(table[index].negativefactor));
    }
    //resuscitation
    if (CurrentRound == "resuscitation" && sum <= 0) {
      table.splice(table.findindexbyabbr(data.name), 1);
      io.sockets.emit('init', { table: table, questions: questions });
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
      console.log(sum + " score was added to " + data.name);
      console.log("positionchage from: " + previousposition + " to " + newposition);
      io.sockets.emit('scorechange', { datatable: table, name: data.name, score: sum });
      io.sockets.emit('positionchange', { from: previousposition, to: newposition, datatable: table });
    }
  });


  //stage

  socket.on('buttonHit', function (data) { console.log(data); })
  socket.on('success', function (data) { console.log(data) });
  socket.on('sirenOn', function (data) { socket.broadcast.emit('turnOnSiren', data) });
  socket.on('sirenOff', function (data) { socket.broadcast.emit('turnOffSiren', data) });
  socket.on('buttonOn', function (data) { socket.broadcast.emit('enableButton', data) });
  socket.on('buttonOff', function (data) { socket.broadcast.emit('disableButton', data) });
  socket.on('LEDOn', function (data) { socket.broadcast.emit('turnOnLedStrip', (data[0] + "," + data[1])); console.log(data); });
  socket.on('LEDOff', function (data) { socket.broadcast.emit('turnOffLedStrip', parseInt(data)); console.log(data); });
  socket.on('ForceLEDOff', function (data) { socket.broadcast.emit('forceTurnOffLedStrip', data); console.log(data); });


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
Number.prototype.pad = function (size) {
  var s = String(this);
  while (s.length < (size || 2)) { s = "0" + s; }
  return s;
};



Array.prototype.findindexbyabbr = function (name) {
  var i;
  for (i = 0; i < this.length; i++) {
    //   console.log(this[i].abbr);
    if (this[i].abbr == name) { return i; }
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