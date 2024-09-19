const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  return token;
};

const isTokenValid = (token) => {
  const isMatch = jwt.verify(token, process.env.JWT_SECRET);
  return isMatch;
};

const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });

  res.cookie("token", token, {
    httpOnly: true,
    expiresIn: new Date(Date.now() + 1000 * 60 * 60 * 24), //one Day
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

const verifyUser = ({ res, verificationStatus }) => {
  const token = createJWT({ payload: verificationStatus });
  // console.log(isTokenValid(token));

  res.cookie("verificationToken", token, {
    httpOnly: true,
    expiresIn: new Date(Date.now() + 1000 * 60 * 60 * 24), //one Day
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  verifyUser,
};
