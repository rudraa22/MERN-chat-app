const express = require('express');
const { accessChat, getUserChats , createGroupChat} = require ('../controllers/chatController.js');
const {protect} = require('../middleware/authMiddleware.js');
const router = express.Router();


router.post('/' , protect , accessChat);
router.get('/' , protect , getUserChats);
router.post('/group', protect , createGroupChat);

module.exports = router;