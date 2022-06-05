const CustomError = require('../errors');
const Token = require('../models/Token');
const { isTokenValid, attachCookiesToResponse } = require('../utils');

// now if there is access token we identificate and next. if there is not but there is refresh token, then 
// then we look for if there is a token with the refresh token data (user, refresh) if it is, identificate,
// reatach cookies and next()
const authenticateUser = async (req, res, next) => {
  const {refreshToken,accessToken} = req.signedCookies

  if (!accessToken && !refreshToken) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }
  try {
    if(accessToken){
      const payload = isTokenValid(accessToken)
      req.user = payload.user
      next()
      return
    }
    const payload = isTokenValid(refreshToken)
    const existingToken = await Token.findOne({user:payload.user.userId, refreshToken:payload.refreshToken})
    if(!existingToken || !existingToken?.isValid){
      throw new CustomError.UnauthenticatedError('Authentication Invalid')
    }
    req.user = payload.user
    attachCookiesToResponse({res, user:payload.user, refreshToken:payload.refreshToken})
    next()
    return
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        'Unauthorized to access this route'
      );
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};
