var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var redis = require('redis');
var socketio = require('socket.io');
var server = null;
var io = null;
var users = [];
var subscriber = redis.createClient();
var publisher = redis.createClient();

var routes = require('./routes/index');


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

server = http.createServer(app);
io = socketio.listen(server);

io.sockets.on('connection', function (socket) {
  // 사용자가 채팅창에 최초 접속시 발생하는 소켓 이벤트
  socket.on('chat_user', function (raw_msg) {
       // MongoDB에 있는 접속로그를 불러온다.
  });
  // 사용자가 접속했을 때 발생하는 소켓 이벤트
  socket.on('chat_conn', function (raw_msg) {
       // 사용자접속 처리. 아이디 중복체크, 접속로그 등록(MongoDB)
       // 현재접속자에 대한 새로고침
  });
  // 사용자가 메시지를 보냈을 때 발생하는 소켓 이벤트
  socket.on('message', function (raw_msg) {
       // 발행자로부터 구독자에 메시지 전달 (redis)
  });
  // 사용자가 채팅방에서 나갔을 때 발생하는 소켓 이벤트
  socket.on('leave', function (raw_msg) {
       // 나가기, 새로고침에 대한 처리 / 접속로그 등록(MongoDB)
       // 현재접속자에 대한 새로고침
  });
  // 구독자 객체가 메시지를 받으면 소켓을 통해 메시지를 전달하는 함수
  subscriber.on('message', function (channel, message) {
       // 사용자에게 메시지 전달. 클라이언트에게 보낸다.
  });
  // 구독자 객체는 'chat' 채널에 대한 구독을 시작
  subscriber.subscribe('chat');
}); 


// socket.io가 끊어졌을 시
io.sockets.on('close', function (socket) {
     subscriber.unsubscribe();
     publisher.close();
     subscriber.close();
});
// HTTP 서버 시작
server.listen(app.get('port'), function(){
    console.log('채팅방 서버를 기동 합니다. 포트 : ' + app.get('port'));
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
