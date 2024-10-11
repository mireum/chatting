const express = require('express');

const router = express.Router();

let userData = {};

router.get('/', (req, res) => {
  res.json({
    flag: true,
  }); 
});

router.post('/userInfo', (req, res) => {
  const { id, name, profile_image } = req.body;

  userData[id] = { name, profile_image };
  console.log('userData', userData);
  res.json({
    flag: true,
    message: 'userData saved!'
  });
  
});

module.exports = router;