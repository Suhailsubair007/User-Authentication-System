const jwt = require("jsonwebtoken");

function  generateJWT(res, user) {
  const token = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, 
  });
}



module.exports = generateJWT;
