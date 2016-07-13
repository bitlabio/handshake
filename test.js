const hostname = 'handshake.ws';
const port = 443;

var https = require('https');
var fs = require('fs');

var options = {
	ca : fs.readFileSync('sslcert/server.ca'),
	key: fs.readFileSync('sslcert/server.key'),
	cert: fs.readFileSync('sslcert/server.crt')
};

var server = https.createServer(options, function (req,res) {
	console.log("!!")
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
})

server.listen(443);