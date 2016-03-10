var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var routes = require('./routes/index');
var users = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


var httpServer =http.createServer(app).listen(3030, function(req,res){
  console.log('Socket IO server has been started');
});
// upgrade http server to socket.io server
var io = require('socket.io').listen(httpServer);

var usernames = {}; 
io.sockets.on('connection',function(socket){
    socket.emit('toclient',{msg:'Welcome to My Server !'});
    
    socket.on('sendchat', function(data){
      io.sockets.emit('updatechat', socket.username, data);
    });

    socket.on('adduser', function(username){
      socket.username = username;
      usernames[username] = username;
      socket.emit('updatechat', 'SERVER', 'You have connected');
      socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
      io.sockets.emit('updateusers', usernames )
    });

    socket.on('disconnect', function(){
      delete usernames[socket.username];
      io.sockets.emit('updateusers', usernames);
      socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
    });

});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
