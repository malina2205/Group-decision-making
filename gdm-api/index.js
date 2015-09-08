var express = require('express'),
users = require('./routes/users');
var User = require('./models/User');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());



//heroku 
app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send('Hello World!');
});
//end heroku



app.all('/*', function(req, res, next)  {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type, Accept, Authorization');
  next();
});

//TOKEN
app.all('/api/*', [require('./middleware/validateRequest')]);


app.use('/', require('./routes'));

var url  = require('url')
// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {

  var err = new Error(req.url + ' - Route Not Found');
  err.status = 404;
  next(err);
});


var MongoDBuri = 'mongodb://malina2205:dbpass@ds061721.mongolab.com:61721/gdm';
//mongo database connection
mongoose.connect(MongoDBuri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("connected to database");
});

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});
 




app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
