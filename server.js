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
  res.sendFile(__dirname + '/views/index.html');
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/timestamp/:a", function (req, res) {
  var teststr = req.params.a;
  var ret = {"unix": null, "real": null};
  var testint = parseInt(teststr);
  
  if(testint != NaN) teststr = testint;
  var testd = new Date(teststr);
  if(testd.getTime() > 0) {
    ret.unix = testd.getTime();
    ret.real = testd.toDateString();
  }
  
  res.end(JSON.stringify(ret));
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
