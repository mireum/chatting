const express = require('express');
const { userData, getRooms } = require('../app');
const router = express.Router();

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

router.post('/unreadMessage', (req, res) => {
  const rooms = getRooms();
  const { stack, roomName } = req.body;

  if (rooms[roomName]) {
    const unreadStack = rooms[roomName].roomStack - stack;
    res.json({
      unreadStack
    })
  }
  else {
    res.json({
      unreadStack: 0
    })
  }
});

module.exports = router;