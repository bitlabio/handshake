// handshake.ws server
var config = {}
config.db = "handshake"

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



var bodyParser  = require('body-parser');



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

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

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

app.get('/admin/userslist', function (req, res) {
  db.users.find({}, function (err, dbres) {
    var output = ""

    output += "Number of users registered: #"+dbres.length + "<br><br>"


    for (var u in dbres) {
      output += JSON.stringify(dbres[u]) + "<br><br>"
    }
    res.writeHeader(200, {"Content-Type": "text/html"}); 
    res.write(output)
    res.end();
  })
})

app.post('/api/signup', function (req, res) {
  console.log(req.body)
  var newuser = req.body
  newuser.created = Date.now()
  db.users.save(newuser, function (err, dbres) {
    res.end("saved")
  })
})

app.get('/api/ip', function (req, res) {
  var ip = toolbox.cleanIp(req.connection.remoteAddress)
  res.end(ip)
})

app.get('/api/location', function (req, res) {
  var ip = toolbox.cleanIp(req.connection.remoteAddress)
  toolbox.lookupIp(ip, function (loc) { res.json(loc);  })
})

http.listen(80, function () {
  console.log('Handshake App running!');
});