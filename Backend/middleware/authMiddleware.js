const jwt = require('jsonwebtoken')
const User = require('../model/User');


const verifyUser = async (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET)
      console.log(decode)
      const userrr= await User.findById(decode.user).select('-password')
      console.log(userrr)
      console.log(userrr.name)
      next()
    } catch (err) {
      console.error(err)
      res.status(401)
      throw new Error('User not authorized , Tocken failed')
    }
  } else {
    res.status(401)
    throw new Error('Not authorizedddddddddd,No Tocken')
  }
}

const isAdminAuth = async (req, res, next) => {
  const token = req.cookies.jwtAdmin;
  console.log(token)

  if (token) {
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode)
      const user = await User.findById(decode.user).select('-password');
      console.log(user)
      
      if (user && user.role === 'Admin') {
        req.user = user;
        next();
      } else {
        res.status(403).json({ success: false, message: 'You are not allowed to access this route' });
      }
    } catch (err) {
      console.error(err);
      res.status(401).json({ success: false, message: 'Token is not valid' });
    }
  } else {
    res.status(401).json({ success: false, message: 'Not authorized, No token' });
  }
};

module.exports = { verifyUser, isAdminAuth }
