const express = require('express');
const { userData } = require('../app');
// const app = express();
const router = express.Router();
// const http = require('http').createServer(app);
// const io = require('socket.io')(http, {cors: {
//   origin: "*"
//   }
// });

// let userData = {};
// // 네임스페이스 이벤트. room, chat이라는 io 객체를 만든다.
// // 서로 독립적인 공간이므로 io는 실행되지 않는다.
// const room = io.of("/room");

// let roomMessages = {}; // 방별 메시지 목록 관리
// let roomStacks = {}; // 방별 메시지 스택 관리

// // room io객체가 연결되었을때, room에 대한 이벤트만 실행된다.
// room.on("connection", (socket) => {
//   console.log("room 네임스페이스에 접속");
  
//   socket.on('joinRoom', ({ roomId, userId, userCardId }) => {
//     console.log(roomId, userId, userCardId);
    
//     socket.join(roomId);
//     if (!roomMessages[roomName]) {
//       roomMessages[roomName] = [];
//     }
//     if (!roomStacks[roomName]) {
//       roomStacks[roomName] = 0;
//     }
//     console.log(`Client joined room: ${roomName}, id: ${socket.id}`);
//   });

//   // 원래 joinRoom
//   // socket.on('joinRoom', (roomName) => {
//   //   socket.join(roomName);
//   //   if (!roomMessages[roomName]) {
//   //     roomMessages[roomName] = [];
//   //   }
//   //   if (!roomStacks[roomName]) {
//   //     roomStacks[roomName] = 0;
//   //   }
//   //   console.log(`Client joined room: ${roomName}, id: ${socket.id}`);
//   // });

//   // message 이벤트
//   socket.on('message', (data) => {
//     const { room, message, stack } = data;
//     console.log(`Received message for room ${room}: ${message}, Stack: ${stack}`);

//     if (!roomMessages[room]) {
//       roomMessages[room] = [];
//     }

//     const currentStack = roomMessages[room].length;

//     if (stack !== currentStack) {
//       console.log('Stack mismatch. Sending update to client.');
//       // 클라이언트의 스택이 다르면 업데이트 요청
//       const difference = currentStack - stack;
//       const newMessages = roomMessages[room].slice(stack);
//       socket.emit('updateMessages', { room: room, newMessages: newMessages });
//     } else {
//       // 메시지를 저장하고 해당 방의 모든 클라이언트에게 브로드캐스트
//       roomMessages[room].push(message);
//       socket.to(room).emit('message', { message, room, stack: roomMessages[room].length });
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("room 네임스페이스 접속 해제");
//   });
// });

router.get('/', (req, res) => {
  res.json({
    flag: true,
  }); 
});

router.post('/userInfo', (req, res) => {
  const { id, name, profile_image } = req.body;

  userData[id] = { id, name, profile_image, socketId:null };
  // console.log('userData', userData);
  res.json({
    flag: true,
    message: 'userData saved!'
  });
});

router.get('/userList', (req, res) => {
  res.json({
    userList: userData,
  })
});

module.exports = router;