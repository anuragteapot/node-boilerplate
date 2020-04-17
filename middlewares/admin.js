const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
const AccessTokenModel = mongoose.model('AccessToken');
const httpStatus = require('../helpers/httpStatus');
const accessTokenTypes = require('../helpers/accessTokenTypes');
const logs = require('../helpers/logs');

const auth = async (req, res, next) => {
  if (!req.headers.authorization || req.user.acl.indexOf('$admin') == -1) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      status: httpStatus.UNAUTHORIZED,
      message: 'UNAUTHORIZED',
    });
  } else {
    next();
  }
};

module.exports = auth;
