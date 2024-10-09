# rps_game

## socket 공부

socket.join(["room 237", "room 238"]); // 동시에 여러방에 참가

<!-- // others 라는방에 이벤트를 보낼 수 있다. -->
  socket.to("others").emit("an event", { some: "data" });

  // to multiple rooms
  socket.to("room1").to("room2").emit("hello");

  // or with an array
  socket.to(["room1", "room2"]).emit("hello");

  <!-- // 다른 socket의 ID를 안다면 프라이빗 메세지를 보낼 수 있다! -->
  socket.to(/* another socket id */).emit("hey");

user의 id는 user가 있는 방의 id와 같다.

<!-- 방에 참가 -->
io.on('connection', (socket) => {
  socket.onAny((e) => {
    console.log(`소켓이벤트: ${e}`);
  });
  socket.on('enter_room', (roomName, done) => {
    socket.join(roomName);
    done();
  });
});

<!-- 방에 누가 참가했는지 알려주기 -->
// server.js
io.on('connection', (socket) => {
  socket.onAny((e) => {
    console.log(`소켓이벤트: ${e}`);
  });
  socket.on('enter_room', (roomName, done) => {
    socket.join(roomName); // 1. 방에 참가하면
    done(); // 2. 함수를 호출하고
    socket.to(roomName).emit('웰컴'); // 4. '웰컴' event를 rommName에 있는 모든 사람들에게 emit 함
  });
});
// 📌 소켓이 다르므로 위 노랑새색 코드는 사파리에서 한번, 크롬에서 한번 더 실행된다. 두번 실행

// add.js
function addMessage(msg) {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = msg;
  ul.appendChild(li);
}

// 3. done()은 프론트엔드에 있는 showRoom()을 실행
function showRoom() {
  console.log('백엔드에서 호출');
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector('h3');
  h3.innerText = `Room ${roomName}`;
}

function handleRoomSubmit(e) {
  e.preventDefault();
  const input = form.querySelector('input');
  socket.emit('enter_room', input.value, showRoom);
  roomName = input.value;
  input.value = '';
}

form.addEventListener('submit', handleRoomSubmit);

socket.on('웰컴', () => {
  addMessage('누군가 들어왔습니다!');
});

 <!-- socket.emit의 세번째 argument -->
첫 번째 argument에는 이벤트 이름
두 번째 argument에는 보내고싶은 payload (무수히 많이 넣을 수 있다.)
마지막 argument에는 서버에서 호출하는 function가 들어감
프론트엔드에 있는 함수는 프론트엔드에서 실행된다. 실행시키는 버튼이 백엔드에 있다고 생각.
끝날 때 실행되는 function을 보내고 싶으면 마지막인자에 넣으면 된다 !

<!-- 다른 클라이언트에게도 메시지를 보내려면 socket.broadcast.emit 또는 room.emit을 사용해야 합니다. -->

<!-- chat io객체가 연결되었을 때, chat에 대한 이벤트만 실행된다. -->
chat.on("connection", (socket) => {
  console.log("chat 네임스페이스에 접속");
  // "방번호"는 예시를 위한 임의의 값
  socket.join(방번호);
  socket.to(방번호).emit("join", {
    user: "system",
    chat: `${아이디}님이 입장하셨습니다.`,
  });

  socket.on("disconnect", () => {
    console.log("chat 네임스페이스 접속 해제");
    // 방에서 나가는 메서드
    socket.leave(roomId);
  });
});
io.on('connection', function(socket) {
    // 접속한 클라이언트의 정보가 수신되면
    socket.on('login', function(data) {
      console.log('Client logged-in:\n name:' + data.name + '\n userid: ' + data.userid);
  
      // socket에 클라이언트 정보를 저장한다
      socket.name = data.name;
      socket.userid = data.userid;
  
      // 접속된 모든 클라이언트에게 메시지를 전송한다
      io.emit('login', data.name );
    });
  
    // 클라이언트로부터의 메시지가 수신되면
    socket.on('chat', function(data) {
      console.log('Message from %s: %s', socket.name, data.msg);
  
      var msg = {
        from: {
          name: socket.name,
          userid: socket.userid
        },
        msg: data.msg
      };
  
      // 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지를 전송한다
      socket.broadcast.emit('chat', msg);
  
      // 메시지를 전송한 클라이언트에게만 메시지를 전송한다
      // socket.emit('s2c chat', msg);
  
      // 접속된 모든 클라이언트에게 메시지를 전송한다
      // io.emit('s2c chat', msg);
  
      // 특정 클라이언트에게만 메시지를 전송한다
      // io.to(id).emit('s2c chat', data);
    });

    // force client disconnect from server
    socket.on('forceDisconnect', function() {
      socket.disconnect();
    })
  
    socket.on('disconnect', function() {
      console.log('user disconnected: ' + socket.name);
    });
});