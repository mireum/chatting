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
let roomName = '';
let userId = '';

const room = io.of("/room");

// room 네임스페이스
room.on('connection', (socket) => {
  socket.on('joinRoom', ({ roomId, stack }) => {
    const roomIdParts = roomId.split('_');
    roomName = roomIdParts[0] + roomIdParts[1];
    userId = roomIdParts[2];
    socket.join(roomName);

    // 방 이름 없으면 새 방 만들고
    // 있으면 roomMessages, roomStack 주기
    if (!rooms[roomName]) {
      rooms[roomName] = [];
      rooms[roomName] = {
        roomMessages: [],
        roomStack: 0
      }
    }
    else {
      const stackDiff = rooms[roomName].roomStack - stack;
      socket.emit('enterRoom', {
        roomMessages: stackDiff > 0 ? rooms[roomName].roomMessages.slice(-stackDiff) : [],
        roomStack: rooms[roomName].roomStack,
      })
    }
  });

  // 메시지 받았을 때
  socket.on('message', ({ message, user }) => {
    console.log('받은메시지', message);
    
    // 메시지 저장, 스택 +1
    rooms[roomName]['roomMessages'].push({text: message, user});
    rooms[roomName]['roomStack'] += 1;
    console.log('rooms', rooms);
    
    // 다른 사용자에게 메시지 보내기
    socket.to(roomName).emit('receive', {message: {text: message, user}, roomName});
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