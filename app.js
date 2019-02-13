const express = require('express');
const path = require('path');

const port = process.env.PORT || 3000;
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.render('../views/index.ejs');
});

var firebase = require('firebase');

firebase.initializeApp({ "apiKey": "AIzaSyCAnkKBia6Jd8REycaDryC2AY5Jj_NQBpQ",
  "authDomain": "formula-1-7a0c8.firebaseapp.com",
  "databaseURL": "https://formula-1-7a0c8.firebaseio.com",
  "projectId": "formula-1-7a0c8",
  "storageBucket": "formula-1-7a0c8.appspot.com",
  "messagingSenderId": "708407712539"
});


server=app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

const io = require("socket.io")(server);

function responsex(msg){
	io.sockets.emit('new_message_company', {message : msg});
	console.log('responsex executed');
	console.log(msg);
};
var database = firebase.database();
var downforce_values = [];
var leadsRef = database.ref('Downforces');

/*leadsRef.on('value', function(snapshot){
  snapshot.forEach(function(childSnapshot) {
    var childData = childSnapshot.val();
    downforce_values.push(Number(childData["Downforce"]));
    //update_graph(downforce_values);
    //console.log(childData["Downforce"]);
  });
})*/



//listen on every connection
io.on('connection', (socket) => {
  //io.sockets.emit('new_message_company', {message : 'Hi, we are the Imperial College Israeli Society. How may we help?'});
	console.log('Connection established')
  socket.on('Window_loaded', (data) => {
      ;
      //broadcast the new message
      console.log('New message');
			io.sockets.emit('Initialize', downforce_values);
    })
});

leadsRef.on('child_added', function(snapshot){
  var childData = snapshot.val();
  downforce_values.push(Number(childData["Downforce"]));
  io.sockets.emit("add_to_chart",Number(childData["Downforce"]))
  });

setInterval(emit, 1000);

function emit() {

  io.sockets.emit('Intialize', {message : downforce_values});
  //console.log(typeof downforce_values[0]);
};
