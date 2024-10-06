const express = require('express');
// const morgan = require('morgan');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);

dotenv.config();

// 라우터 가져오기
const mainRouter = require('./routes/index');

app.set('port', process.env.PORT || 8088);

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

app.use(cors({
  origin: 'http://localhost:3000',
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