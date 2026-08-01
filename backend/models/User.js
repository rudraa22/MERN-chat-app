const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            requires: true,
        },
        email: {
            type:String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        profilePic: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User' , userSchema);
module.exports = User;