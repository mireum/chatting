const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2')

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {cors: {
  origin: "*"
  }
});
// 네임스페이스 이벤트. room, chat이라는 io 객체를 만든다.
// 서로 독립적인 공간이므로 io는 실행되지 않는다.
const room = io.of("/room");

let roomMessages = {}; // 방별 메시지 목록 관리
let roomStacks = {}; // 방별 메시지 스택 관리

// room io객체가 연결되었을때, room에 대한 이벤트만 실행된다.
room.on("connection", (socket) => {
  console.log("room 네임스페이스에 접속");
  
  socket.on('joinRoom', ({ roomId, userId, userCardId }) => {
    console.log(roomId, userId, userCardId);
    
    socket.join(roomId);
    // if (!roomMessages[roomName]) {
    //   roomMessages[roomName] = [];
    // }
    // if (!roomStacks[roomName]) {
    //   roomStacks[roomName] = 0;
    // }
    // console.log(`Client joined room: ${roomName}, id: ${socket.id}`);
  });

  // 원래 joinRoom
  // socket.on('joinRoom', (roomName) => {
  //   socket.join(roomName);
  //   if (!roomMessages[roomName]) {
  //     roomMessages[roomName] = [];
  //   }
  //   if (!roomStacks[roomName]) {
  //     roomStacks[roomName] = 0;
  //   }
  //   console.log(`Client joined room: ${roomName}, id: ${socket.id}`);
  // });

  // message 이벤트
  socket.on('message', (data) => {
    const { room, message, stack } = data;
    console.log(`Received message for room ${room}: ${message}, Stack: ${stack}`);

    if (!roomMessages[room]) {
      roomMessages[room] = [];
    }

    const currentStack = roomMessages[room].length;

    if (stack !== currentStack) {
      console.log('Stack mismatch. Sending update to client.');
      // 클라이언트의 스택이 다르면 업데이트 요청
      const difference = currentStack - stack;
      const newMessages = roomMessages[room].slice(stack);
      socket.emit('updateMessages', { room: room, newMessages: newMessages });
    } else {
      // 메시지를 저장하고 해당 방의 모든 클라이언트에게 브로드캐스트
      roomMessages[room].push(message);
      socket.to(room).emit('message', { message, room, stack: roomMessages[room].length });
    }
  });

  socket.on("disconnect", () => {
    console.log("room 네임스페이스 접속 해제");
  });
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