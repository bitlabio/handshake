var mongojs     = require('mongojs')
var db          = mongojs('handshake',["geoblocks","geolocation"]);

var toolbox = {}

toolbox.cleanIp = function(ip) {
  var a = ip
  a = a.split(":")
  var b = a[a.length-1]
  return b;
}

toolbox.distance = function(x1, y1, x2, y2) {
  var dx = x1-x2
  var dy = y1-y2
  return Math.sqrt(dx*dx + dy*dy)
}

toolbox.lookupIp = function(ip, cb) {
  // https://github.com/bitlabio/locationjs
  var ip_prep = ip;
    ip_prep = ip_prep.split('.');            
    var integer_ip = (16777216*ip_prep[0])+(65536*ip_prep[1])+(256*ip_prep[2])+(ip_prep[3]*1);

    db.geoblocks.findOne({startIpNum:{$lte: integer_ip}, endIpNum:{$gte: integer_ip}}, function (err, res) {
      if (res != null) {
        db.geolocation.findOne({locId:res.locId}, function (err, loc) { 
          
          cb(loc);
        })
      } else {
          return;
      } 
      
    })

}


toolbox.lookupGps = function(lat, lon, cb) {

  var found = 0;

  db.geolocation.find({latitude: {$lte:lat+1, $gte:lat-1}, longitude: {$lte:lon+1, $gte:lon-1}}, function (err, dbres) {
    //console.log(dbres);
    var closest = 99
    var closestp = {}
    for (var p in dbres) {
      var dist = toolbox.distance(lat, lon, dbres[p].latitude, dbres[p].longitude)  
      if (dist < closest) { closestp = dbres[p]}
    }
    
    cb(closestp)
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