const express = require('express');
const path = require('path');

//Setting port if not set by heroku set default to 3000
const port = process.env.PORT || 3000;


var app = express();
//Set view engine to embedded javascript instead of html
app.set('view engine', 'ejs');

//Set the directory
app.use(express.static(__dirname));

//Access embedded javascript
app.get('/', function(req, res) {
  res.render('../views/index.ejs');
});

var firebase = require('firebase');

//Initializing firebase
firebase.initializeApp({ "apiKey": "AIzaSyCAnkKBia6Jd8REycaDryC2AY5Jj_NQBpQ",
  "authDomain": "formula-1-7a0c8.firebaseapp.com",
  "databaseURL": "https://formula-1-7a0c8.firebaseio.com",
  "projectId": "formula-1-7a0c8",
  "storageBucket": "formula-1-7a0c8.appspot.com",
  "messagingSenderId": "708407712539"
});

//Set up server
server=app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

//Instantiate socket to communicate with index file
const io = require("socket.io")(server);

var database = firebase.database();

//Instantiate downforce_values values
var downforce_values = [];

//Survey downforce child
var leadsRef = database.ref('Downforces');

//Listen on every connection
io.on('connection', (socket) => {
  //io.sockets.emit('new_message_company', {message : 'Hi, we are the Imperial College Israeli Society. How may we help?'});
	console.log('Connection established')
  //Website is started
  socket.on('Window_loaded', (data) => {
      console.log('New message');
      //Send initial downforce_values
			io.sockets.emit('Initialize', downforce_values);
    })
});

//Initializing the downforce values from the database
leadsRef.on('child_added', function(snapshot){
  //Do the following for each value in the database
  var childData = snapshot.val();
  //Push data from database to downforce_values
  downforce_values.push(Number(childData["Downforce"]));
  //Emit message to add downforce value to chart
  io.sockets.emit("add_to_chart",Number(childData["Downforce"]))
  });
