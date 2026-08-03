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
