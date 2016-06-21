console.log('loading toolbox.js');

var mongojs     = require('mongojs')
var db          = mongojs('handshake',["geoblocks","geolocation"]);

var toolbox = {}

toolbox.cleanIp = function(ip) {
  var a = ip
  a = a.split(":")
  var b = a[a.length-1]
  return b;
}

toolbox.lookupIp = function(ip, cb) {
  // https://github.com/bitlabio/locationjs
  var ip_prep = ip;
    ip_prep = ip_prep.split('.');            
    var integer_ip = (16777216*ip_prep[0])+(65536*ip_prep[1])+(256*ip_prep[2])+(ip_prep[3]*1);
    console.log(integer_ip)

    db.geoblocks.findOne({startIpNum:{$lte: integer_ip}, endIpNum:{$gte: integer_ip}}, function (err, res) {

      console.log("res:")
      console.log(res)
      if (res != null) {
        db.geolocation.findOne({locId:res.locId}, function (err, loc) { 
          //console.log(loc)
          cb(loc);
        })
      } else {
          return;
      } 
      
    })

}


toolbox.randomHex = function(length) {
	/* generates hexadecimal random string of a certain length */
  var randomhex = ""
  while (randomhex.length < length) {
    var randomnum    = Math.round(Math.random()*9999999999999) 
    var randomnumhex = randomnum.toString(16)
    var a = Math.floor(Math.random()*randomnumhex.length)
    var b = Math.floor((randomnumhex.length - a)*Math.random())
    randomhex += randomnumhex.slice(a,b)
  }
  var finaltrim = randomhex.slice(0,length);
  return finaltrim
}

toolbox.logger = function (req, res, next) {
  console.log("req:"+req.url)
  next();
}

module.exports = toolbox;