const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

const signup = async (req, res) => {
    try {
        const { name, email, password, pic } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exist with this email' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            profilePic: pic || "",
        });

        const token = generateToken(newUser._id);
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            profilePic: newUser.profilePic,
            token,
        });
    } catch (error) {
        console.error('Signup error', error);
        res.status(500).json({ message: 'Server error during signup' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all the details" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            token,
        });
    } catch (error) {
        console.log('Login error', error);
        res.status(500).json({ message: 'Error during login' });
    }
};

const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

const searchUsers = async (req, res) => {
    try {
        const keyword = req.query.search
            ? {
                  $or: [
                      { name: { $regex: req.query.search, $options: 'i' } },
                      { email: { $regex: req.query.search, $options: 'i' } },
                  ],
              }
            : {};

        const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }).select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error('Search users error', error);
        res.status(500).json({ message: 'Server error searching users' });
    }
};

module.exports = { signup, login, getMe, searchUsers };