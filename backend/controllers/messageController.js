const Message = require('../models/Message');
const Chat = require('../models/Chat');
const User = require('../models/User');

const sendMessage = async (req , res) => {
    try
    {
        const {chatId ,content} = req.body;

        if (!chatId || !content)
        {
            return res.status(500).json({messsage : 'chatID and content are required'});
        }

        let newMessage = await Message.create({
            sender: req.user._id,
            content: content,
            chat: chatId
        });

        newMessage = await newMessage.populate('sender' , 'name profilePic');
        newMessage = await newMessage.populate('chat');

        newMessage = await User.populate(newMessage, {
            path: 'chat.users',
            select: 'name email profilePic',    
        });

        await Chat.findByIdAndUpdate(chatId,  {latestMessage: newMessage});
        res.status(201).json(newMessage);
    }

    catch(error)
    {
        console.log('Send message error' , error);
        res.status(500).json({message: 'Server error sending message'});
    }
};

const getMessage = async (req, res) => {
    try {
        const { chatId } = req.params;

        const messages = await Message.find({ chat: chatId })
            .populate('sender', 'name email profilePic')
            .populate('chat')
            .sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.log('Get message error', error);
        res.status(500).json({ message: 'Server error fetching message' });
    }
};

module.exports = {sendMessage , getMessage};