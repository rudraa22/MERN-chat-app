const jwt = require('jsonwebtoken');
const User = require('../models/User')

const protect = async (req , res , next) => {
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer'))
        {
            return res.status(401).json({message: 'Not authorized , No token'});
        }

        const token = authHeader.split(' ').filter(Boolean)[1];        
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if(!user)
        {
            return res.status(401).json({message: ' Not authorized , User not found'});
        }

        req.user = user;
        next();
    }

    catch(error)
    {
        console.log('Auth midleware error' , error);
        res.status(401).json({message: ' Not authorized token failed'});
        } 
};

module.exports = {protect};