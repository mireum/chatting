// 서로 독립적인 공간이므로 io는 실행되지 않는다.
// const socket = io.of('/');
// const room = io.of("/room");

// socket.on("connection", (socket) => {
//   console.log("socketio 접속: ", socket.id);
//   socket.on('register', ({userId}) => {
//     userData[userId].socketId = socket.id;
//     // console.log(userData); 
//   })
// })

const rooms = {};

// 방을 생성하는 함수
const createRoom = (roomId) => {
  if (!rooms[roomId]) {
    rooms[roomId] = {
      roomMessages: [],  // 메시지 배열 (id: msg 형태로 저장)
      roomStack: 0       // 방의 스택 (메시지 갯수 등으로 사용할 수 있음)
    };
  }
};

// 메시지를 추가하는 함수
const addMessageToRoom = (roomId, messageId, message) => {
  if (rooms[roomId]) {
    rooms[roomId].roomMessages.push({ [messageId]: message });
    rooms[roomId].roomStack += 1;
  } else {
    console.log(`Room ${roomId} does not exist!`);
  }
};

// 방 생성 예시
createRoom('room1');
createRoom('room2');

// 메시지 추가 예시
addMessageToRoom('room1', 'user1', 'Hello, this is the first message');
addMessageToRoom('room1', 'user2', 'Hello, this is the second message');
addMessageToRoom('room2', 'user3', 'Welcome to room2!');

// 결과 출력
console.log(rooms);


//   socket.on('joinRoom', ({ roomId, userId, userCardId }) => {
//     console.log(roomId, userId, userCardId);
     
//     socket.join(roomId);
//     // if (!roomMessages[roomName]) {
//     //   roomMessages[roomName] = [];
//     // }
//     // if (!roomStacks[roomName]) {
//     //   roomStacks[roomName] = 0;
//     // }
//     // console.log(`Client joined room: ${roomName}, id: ${socket.id}`);
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