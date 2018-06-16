var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('jsonwebtoken');

// Database Connection Using Monk Library
/*var mongo = require('mongodb');
  var monk = require('monk');
  var db = monk('localhost:27017/nodetest1');
*/

/* Database Connection Using Mongoose */
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/nodetest1');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');

var app = express();

process.env.SECRET_KEY="yogita";
process.env.SENDGRID_API_KEY="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";

function middleware(req,res,next){
  //var token = req.headers['token'];
  //var token = req.params.token;

  var token = req.body.token || req.query.token /*|| req.headers['token']*/;

  if(!token){ 
    return res.status(401).send({
      auth: false,
      message: 'No token provided'
    });
  }else{
    jwt.verify(token, process.env.SECRET_KEY, function(err,decoded){
      if(err){
        return res.status(500).send({
          auth: false,
          message: 'Failed to authenticate'
        });
      }
    })
  }
  return next();
}



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Make our db accessible to our router
app.use(function(req,res,next){
  //req.db = db;
  next();
});

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/users', middleware, usersRouter);
//app.use('/helloworld', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(function(req,res,next){
  //res.header("Access-Control-Allow-Origin", "*");
  //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header('Access-Control-Allow-Origin: *');
  res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
  
  next();
});

module.exports = app;
