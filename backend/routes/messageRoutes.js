const express = require('express');
const {sendMessage , getMessage} = require('../controllers/messageController');
const {protect} = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/' , protect , sendMessage);
router.get('/:chatId' , protect, getMessage );

module.exports = router;    
