// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use("/", express.static('public'));

app.get("/", function(req, res) {
  res.sendFile(__dirname + '/views/home.html');
});

app.get("/timestamp/", function(req, res) {
  res.sendFile(__dirname + '/views/tstamp/index.html');
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/timestamp/:a", function (req, res) {
  var teststr = req.params.a;
  var ret = {"unix": null, "real": null};
  var testint = parseInt(teststr);
  
  if(!isNaN(testint)) teststr = testint;
  var testd = new Date(teststr);
  if(testd.getTime() > 0) {
    ret.unix = testd.getTime();
    ret.real = testd.toDateString();
  }
  
  res.end(JSON.stringify(ret));
});

app.get("/hparser/", function(req, res) {
  var ret = {"system": "", "browser": ""};
  var tarr = req.headers["user-agent"].split(/[\(\)]/);
  
  ret["browser"] = tarr[4].split('').splice(1, tarr[4].length).join('').split(' ').join('; ');
  ret["system"] = tarr[1];
  ret["user-agent"] = req.headers["user-agent"];
  ret["language"] = req.headers["accept-language"].split(";")[0];
  ret["ip"] = req.headers["x-forwarded-for"].split(",")[0];
  ret["protocol"] = req.headers["x-forwarded-proto"].split(",")[0];
  
  res.end(JSON.stringify(ret, null, 2));
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
