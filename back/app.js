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

// room io객체가 연결되었을때, room에 대한 이벤트만 실행된다.
room.on("connection", (socket) => {
  console.log("room 네임스페이스에 접속");

  // message 이벤트
  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
    // socket은 그 사람에게만 간다.
    // socket.emit('message', message);
    room.emit('message', message);
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