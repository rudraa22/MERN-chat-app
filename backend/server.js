const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const {Server} = require('socket.io')
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const authRoutes = require('../backend/routes/authRoutes');
app.use('/api/auth' , authRoutes);
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chats', chatRoutes);
const messageRoutes = require('./routes/messageRoutes');
app.use('/api/messages', messageRoutes);
const { searchUsers } = require('./controllers/authController');
const { protect } = require('./middleware/authMiddleware');
app.get('/api/users', protect, searchUsers);

app.get('/' , (req,res) => {
    res.send('Chat app is running...');
});

const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin: '*',
    },
});

io.on('connection' , (socket) => {
    console.log('New client connected' , socket.id);

    socket.on('setup' , (userId) => {
        socket.join(userId);
        socket.emit('connected');
        });

    socket.on(('join chat' , (chatId) => {
        socket.join(chatId);
        console.log('User joined chat' , chatId);
    }));
    
    socket.on('typing' , (chatId) => {
        socket.in(chatId).emit('typing');
    });

    socket.on('sstop typing' , (chatId) => {
        socket.in(chatId).emit('stop typing');
    });

    socket.on('new message' , (newMessageReceived) => {
        const chat = newMessageReceived.chat;

        if(!chat.users)
        {
            console.log('chat.users not defined');
            return;
        }

        chat.users.forEach((user) => {
            if(user._id === newMessageReceived.sender._id)
                return;
            socket.in(user._id).emit('message recieved' , newMessageReceived);
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected' , socket.id);
    });
});

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connect'))
.catch((err) => console.log('MongoDB connection error' , err));

const PORT = process.env.port || 5000;

server.listen(PORT , () => { 
    console.log(`Server running on port ${PORT}`);
});
