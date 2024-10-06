const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    flag: true,
  }); 
});

module.exports = router;