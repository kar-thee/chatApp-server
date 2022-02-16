const bcrypt = require("bcrypt");

const encryptPwd = async (originalPwd) => {
  const hashedPwd = await bcrypt.hash(originalPwd, 12);
  return hashedPwd;
};
const decryptPwd = async (userTypedPwd, hashedPwdFromDb) => {
  const isPwdSame = await bcrypt.compare(userTypedPwd, hashedPwdFromDb);
  return isPwdSame ? true : false;
};

module.exports = { encryptPwd, decryptPwd };
