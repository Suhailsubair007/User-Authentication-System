const bcrypt = require("bcrypt");

// create hashed password
const createHashedPassword = async (user) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  return hashedPassword;
};
// compare passwords
const compareHashedPassword = async (password, user) => {
  return bcrypt.compare(password, user.password);
};

module.exports = { createHashedPassword, compareHashedPassword };
