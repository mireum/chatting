const express = require('express');
const { userData } = require('../app');
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

module.exports = router;