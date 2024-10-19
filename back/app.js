const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2')

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {cors: { origin: "*" }});

let userData = {};
let rooms = {};

const room = io.of("/room");

let roomMessages = {}; // 방별 메시지 목록 관리
let messageStacks = {}; // 방별 메시지 스택 관리

// room 네임스페이스
room.on('connection', (socket) => {
  socket.on('joinRoom', ( roomId ) => {   
    socket.join(roomId);
    // 입장한 방에 스택이 없으면 초기화
    if (!messageStacks[room]) {
      messageStacks[room] = 0;
    }
    // 사용자가 속한 방 확인 { '아이디', '방' }
    console.log(socket.rooms);
  });

  // socket.on('invite', ({ roomId, userCardId }) => {
  //   console.log(roomId, userCardId);
  //   const userCardSocketId = userData[userCardId].socketId;
  //   io.to(userCardSocketId).emit('joinRoom', roomId);

  //   io.to(roomId).emit('message', {text: 'room1입니다.'});
  // });

  socket.on('message', ({ message, room, stack }) => {
    console.log(message, room, stack);
    stack++;

    socket.to(room).emit('receive', {message, room, stack});
    console.log(`Message sent to room ${room}, message: ${message}, stack: ${stack}`);

  })
});

dotenv.config();

// mysql 연결
const conn = mysql.createConnection({ 
  host : 'localhost',  
  user : 'root',
  password : process.env.MYSQLPASS,
  database : 'online_db'
});

conn.connect();
// module.exports = conn;
module.exports = { userData, conn };

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