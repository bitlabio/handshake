console.log('loading toolbox.js');

var toolbox = {}

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