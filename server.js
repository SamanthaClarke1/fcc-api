// server.js, home of all things good!

// init project
var express = require('express');
var app = express();

//lets require/import the mongodb native drivers.
var mongodb = require('mongodb').MongoClient;
var url = 'mongodb://guest:'+process.env.SECRET+'@ds056979.mlab.com:56979/king-fcc';  // Connection URL.


function makeSlug(min, max) {
  var t = "";
  for(var i = 0; i < min + Math.floor(Math.random() * (max - min)); i++) {
    var base = 65 + (Math.random() * 25);
    if(Math.random() < 0.4) {
      base += 32;
    } else if (Math.random() < 0.3) {
      base = 48 + Math.random() * 9;
    } t += String.fromCharCode(base);
  } 
  return t;
}


// Use connect method to connect to the Server
mongodb.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url.replace(process.env.SECRET, "SECRETPASSWORD"));
    var shrturls = db.collection('shrturls');
    
    app.get("/shrturl", function(req, res) {
      var longurl = req.query.shrtn;
      var urlobj = {"longurl": longurl, "shrturl": ""};

      if(longurl && /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(longurl)) {
        var shrturl = makeSlug(4, 8);
        urlobj["shrturl"] = shrturl;
        
        // validate long urls (TODO)
        
        shrturls.insert(urlobj, function(err, data) {
          if (err) throw err;
        });
        res.end(JSON.stringify(urlobj));
      }  else if (!longurl) {
        res.sendFile(__dirname + '/views/tstamp/index.html');
      } else {
        res.end('{"err":"Invalid URL!"}');
      }
        // search for their url and redirect them (TODO)
    });
    app.get("/shrturl/:shrturl", function(req, res) {
      shrturls.find({
        shrturl: req.params.shrturl
      }).toArray(function(err, longurls) {
        if(err) throw err;
        res.redirect(longurls[0].longurl);
        res.end(longurls[0].longurl);
      });
    });
  }
});

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
