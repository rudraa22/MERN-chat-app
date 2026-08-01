const mongoose = require('moongoose');
const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            red: 'User',
            required: true
        },
        content: {
            type: String,
            trim: true
        },
        chat: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat',
            required: true
        },

        fileUrl:
        {
            type: String,
            default: null
        },

        readyBy: [
            {
                type: mongoose.Schema.Type.ObjectId,
                ref: 'User'
            },
        ],
    },
        {
            timestamps:true,
        }
);

const Mongoose = mongoose.model('Message' , messageSchema);
module.exports = Message;