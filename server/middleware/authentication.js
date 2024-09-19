const { StatusCodes } = require("http-status-codes");
const { isTokenValid } = require("../utils/jwt");

const authenticateUser = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  } else if (req.signedCookies.token) {
    token = req.signedCookies.token;
  } else {
    token = req.cookies.token;
  }
  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication failed" });
  }
  try {
    const { name, userId, role } = isTokenValid(token);
    req.user = { name, userId, role };
    next();
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json(error);
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Unauthorized to access this route" });
    }
    next();
  };
};

const verifyUser = async (req, res, next) => {
  const token = req.signedCookies.verificationToken;
  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication failed" });
  }
  try {
    const { status } = isTokenValid(token);
    if (!status) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Authentication failed" });
    }
    req.verificationStatus = { status };
    next();
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error });
  }
};

module.exports = { authenticateUser, verifyUser, authorizePermissions };
