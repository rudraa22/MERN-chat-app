const Chat = require('../models/Chat');

const accessChat = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'UserId is required' });
        }

        let existingChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        })
            .populate('users', '-password')
            .populate('latestMessage');

        if (existingChat.length > 0) {
            return res.status(200).json(existingChat[0]);
        }

        const newChat = await Chat.create({
            chatName: 'sender',
            isGroupChat: false,
            users: [req.user._id, userId],
        });

        const fullChat = await Chat.findOne({ _id: newChat._id }).populate('users', '-password');
        res.status(201).json(fullChat);
    } catch (error) {
        console.log('Access chat error', error);
        res.status(500).json({ message: 'Server error accessing chat' });
    }
};

const getUserChats = async (req, res) => {
    try {
        let chats = await Chat.find({
            users: { $elemMatch: { $eq: req.user._id } },
        })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate('latestMessage')
            .sort({ updatedAt: -1 });

        res.status(200).json(chats);
    } catch (error) {
        console.log('Get chats error', error);
        res.status(500).json({ message: 'Server error fetching data' });
    }
};

const createGroupChat = async (req, res) => {
    try {
        const { users, chatName } = req.body;

        if (!users || !chatName) {
            return res.status(400).json({ message: 'Please provide users and a group name' });
        }

        if (users.length < 2) {
            return res.status(400).json({ message: 'A group needs at least 2 members' });
        }

        users.push(req.user._id);

        const groupChat = await Chat.create({
            chatName,
            isGroupChat: true,
            users,
            groupAdmin: req.user._id,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate('users', '-password')
            .populate('groupAdmin', '-password');

        res.status(201).json(fullGroupChat);
    } catch (error) {
        console.log('Create Group Error', error);
        res.status(500).json({ message: 'Server error creating group' });
    }
};

module.exports = { accessChat, getUserChats, createGroupChat };