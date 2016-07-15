// handshake.ws server
var config = {}
config.db = "handshake"
//config.env = "production";
config.env = 'development';

//var env = process.env.NODE_ENV || 'development';
//var env = 'production';


var express   = require('express');
var app       = express();
var fs        = require('fs');
var path      = require("path");

var compression = require('compression')

var http = require('http')
var https = require('https')

var credentials = {
  ca : fs.readFileSync('sslcert/server.ca'),
  key: fs.readFileSync('sslcert/server.key'),
  cert: fs.readFileSync('sslcert/server.crt')
};


var mongojs     = require('mongojs')
var db          = mongojs('handshake',["users"])

var cookieParser = require('cookie-parser')
var session = require('cookie-session')



var bodyParser  = require('body-parser');



//bitlab custom
var toolbox = require('./toolbox');

app.use(compression())

app.use(session({
  name: 'session',
  secret: "handshakew_asdjiosadjo",
  secureProxy: false,
  maxAge: 1000*60*60*24*365*100, //100years
}))

//io.sockets.emit("arduino", data)







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
		//console.log(req.session.hash)
		next()
	}
}

app.use(users);
app.use(toolbox.logger);

var apphandler = function (req, res) {
  //console.log(req.headers)
  
  /*if (req.headers['x-forwarded-proto'] !== 'https') {
    res.redirect(['https://', req.get('Host'), req.url].join(''));
  } else {
    
  }*/

  res.sendFile(path.join(__dirname+'/static/handshake.html'));    
}

app.get('/', apphandler);
app.get('/postjob', apphandler);
app.get('/profile', apphandler);
app.get('/profile/email', apphandler);
app.get('/profile/location', apphandler);
app.get('/profile/skills', apphandler);
app.get('/profile/*', apphandler);

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

app.post('/api/gpslookup', function(req,res) {
  // sends you the location data for a gps location
  //console.log(req.body)
  toolbox.lookupGps(req.body.geolocation.lat, req.body.geolocation.lon, function (dblookup) {
    //console.log(dblookup);
    res.json(dblookup);
  });

})

app.post('/api/signup', function (req, res) {
  //console.log(req.body)
  var newuser = req.body
  newuser.created = Date.now()
  newuser.sessionhash = req.session.hash
  db.users.save(newuser, function (err, dbres) { res.end("saved"); });
})


app.post('/api/skills', function (req, res) {
  db.users.findOne({sessionhash:req.session.hash}, function (err, user) {
    user.skills = req.body
    //console.log(user)
    db.users.update({sessionhash:req.session.hash}, user, function (err, upd) {
      console.log(upd)
      res.end("saved");
    })
    
  })
  /*
  console.log(req.body)
  var newuser = req.body
  newuser.created = Date.now()
  newuser.sessionhash = req.session.hash
  db.users.save(newuser, function (err, dbres) { res.end("saved"); });*/
})


app.post('/api/search', function (req, res) {
  db.users.find({}, function (err, dbres) {
    console.log("SEARCHED")
    res.end(JSON.stringify(dbres)) //CAREFUL!
  })
})

/// ON LOAD CHECK SESSION/COOKIE
app.get('/api/session', function (req, res) {
  var session = {}
  session.ip = toolbox.cleanIp(req.connection.remoteAddress)

  db.users.findOne({sessionhash:req.session.hash}, function (err, dbres){
    //console.log(dbres);
    session.db = dbres
    res.end(JSON.stringify(session));
  })

})

app.get('/api/location', function (req, res) {
  var ip = toolbox.cleanIp(req.connection.remoteAddress)
  toolbox.lookupIp(ip, function (loc) { res.json(loc);  })
})





var httpServer;
var httpsServer;
var io;

//PRODUCTION
if (config.env == "production") {

  httpServer = http.createServer(function (req,res) {
    res.writeHead(302, {'Location': 'https://www.handshake.ws' + req.url});
    res.end();
  })

  httpsServer = https.createServer(credentials, app);
  io = require('socket.io')(httpsServer);

  httpServer.listen(80);
  httpsServer.listen(443);
}

//DEVELOPMENT
if (config.env == "development") {
  httpServer = http.createServer(app);
  io = require('socket.io')(httpServer);
  httpServer.listen(80);
}

///////////////////////////////////////////
// SOCKETS

io.on('connection', function (socket) {
  console.log("socket connected!")

  socket.on('handshake', function(msg){
    console.log('message: ' + msg);
  });
});


