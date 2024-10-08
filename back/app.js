const express = require('express');
// const morgan = require('morgan');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2')

const app = express();
const http = require('http').createServer(app);
// http server를 socket.id server로 업그레이드
const io = require('socket.io')(http, {cors: {
  origin: "*"
  }
});
// 네임스페이스 이벤트. room, chat이라는 io 객체를 만든다.
// 서로 독립적인 공간이므로 io는 실행되지 않는다.
const room = io.of("/room");

// 클라이언트와 연결되면 실행되는 이벤트
io.on('connection', (socket) => {
  console.log('A client has connected. id: ', socket.id);
  
  // 클라이언트가 message라는 이벤트를 발생시키면 해당 메시지를 수신한다.
  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
    socket.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('A client has disconnected');
  });
});

// room io객체가 연결되었을때, room에 대한 이벤트만 실행된다.
room.on("connection", (socket) => {
  console.log("room 네임스페이스에 접속");
  socket.on("disconnect", () => {
    console.log("room 네임스페이스 접속 해제");
  });
});

// chat io객체가 연결되었을 때, chat에 대한 이벤트만 실행된다.
// chat.on("connection", (socket) => {
//   console.log("chat 네임스페이스에 접속");
//   // "방번호"는 예시를 위한 임의의 값
//   socket.join(방번호);
//   socket.to(방번호).emit("join", {
//     user: "system",
//     chat: `${아이디}님이 입장하셨습니다.`,
//   });

//   socket.on("disconnect", () => {
//     console.log("chat 네임스페이스 접속 해제");
//     // 방에서 나가는 메서드
//     socket.leave(roomId);
//   });
// });
// io.on('connection', function(socket) {
//     // 접속한 클라이언트의 정보가 수신되면
//     socket.on('login', function(data) {
//       console.log('Client logged-in:\n name:' + data.name + '\n userid: ' + data.userid);
  
//       // socket에 클라이언트 정보를 저장한다
//       socket.name = data.name;
//       socket.userid = data.userid;
  
//       // 접속된 모든 클라이언트에게 메시지를 전송한다
//       io.emit('login', data.name );
//     });
  
//     // 클라이언트로부터의 메시지가 수신되면
//     socket.on('chat', function(data) {
//       console.log('Message from %s: %s', socket.name, data.msg);
  
//       var msg = {
//         from: {
//           name: socket.name,
//           userid: socket.userid
//         },
//         msg: data.msg
//       };
  
//       // 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지를 전송한다
//       socket.broadcast.emit('chat', msg);
  
//       // 메시지를 전송한 클라이언트에게만 메시지를 전송한다
//       // socket.emit('s2c chat', msg);
  
//       // 접속된 모든 클라이언트에게 메시지를 전송한다
//       // io.emit('s2c chat', msg);
  
//       // 특정 클라이언트에게만 메시지를 전송한다
//       // io.to(id).emit('s2c chat', data);
//     });

//     // force client disconnect from server
//     socket.on('forceDisconnect', function() {
//       socket.disconnect();
//     })
  
//     socket.on('disconnect', function() {
//       console.log('user disconnected: ' + socket.name);
//     });
// });


dotenv.config();

// mysql 연결
var conn = mysql.createConnection({ 
  host : 'localhost',  
  user : 'root',
  password : process.env.MYSQLPASS,
  database : 'online_db'
});

conn.connect();
module.exports = conn;

// 라우터 가져오기
const mainRouter = require('./routes/index');

app.set('port', process.env.PORT || 8088);

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));
// app.use(morgan('dev'));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: false,
    secure: false,
  },
  name: 'session-cookie'
}));

// req.user 사용
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// 라우터를 미들웨어로 등록
app.use('/', mainRouter);


app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  console.error(err)
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

http.listen(app.get('port'), () => {
  console.log(app.get('port') + '번에서 서버 실행 중입니다.');
});