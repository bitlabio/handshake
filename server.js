// handshake.ws server

var express   = require('express');
var app       = express();
var fs        = require('fs');
var path      = require("path");

var http = require('http').Server(app);
var io = require('socket.io')(http);

var mongojs     = require('mongojs')
var db          = mongojs('handshake',["users"])

var cookieParser = require('cookie-parser')
var session = require('cookie-session')


//bitlab custom
var toolbox = require('./toolbox');

//app.use(bodyParser.json());

app.use(session({
  name: 'session',
  secret: "handshakew_asdjiosadjo",
  secureProxy: false,
  maxAge: 1000*60*60*24*365*100, //100years
}))

//io.sockets.emit("arduino", data)


///////////////////////////////////////////
// SOCKETS

io.on('connection', function (socket) {
  console.log("socket connected!")

  socket.on('handshake', function(msg){
    console.log('message: ' + msg);
  });

});




///////////////////////////////////////////
// WEBSERVER 

app.use(express.static('static'));

var users = function (req, res, next) {
	//user.check(db.users, req.session, req.user, next)
	if (req.session.hash == undefined) {
		req.session.hash = toolbox.randomHex(64);
		next()
	} else {
		console.log(req.session.hash)
		next()
	}
}

app.use(users);
app.use(toolbox.logger);

var apphandler = function (req, res) {
  res.sendFile(path.join(__dirname+'/static/handshake.html'));  
}

app.get('/', apphandler);
app.get('/profile', apphandler);
app.get('/profile/email', apphandler);
app.get('/profile/skills', apphandler);


http.listen(80, function () {
  console.log('Handshake App running!');
});