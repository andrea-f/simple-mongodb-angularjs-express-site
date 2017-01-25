
express = require('express');
var app = express();
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var path = require('path');

/*
 * Set up DB connection to Mongo
 */
require("./js/data/database.js");
var mongoose = require('mongoose');
ObjectID = require('mongodb').ObjectID;
Bike = mongoose.model('bike');
mongoose.connect('mongodb://localhost:27017/bikes');

/*
var MongoStore = require('connect-mongo')(session);
User = mongoose.model('user');
//mongoose.connect(configDB.url); // connect to our database
app.use(session({
    secret: 'myawesomepassportlocalauth', // session secret
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ 
      mongooseConnection: mongoose.connection, 
      ttl: 14 * 24 * 60 * 60  
    }), 
    cookie: { secure: false, httpOnly: false },
    name: "bikes"
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
require('./js/data/passport')(passport);

var session = require('express-session');
var passport = require('passport');
var flash    = require('connect-flash');
*/



//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS");
  next();
});

var r = require('./js/routes/api');
app.use('/api', r);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err.message });
});


module.exports = app;
