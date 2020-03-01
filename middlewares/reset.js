const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
const AccessTokenModel = mongoose.model('AccessToken');
const httpStatus = require('../helpers/httpStatus');
const accessTokenTypes = require('../helpers/accessTokenTypes');
const logs = require('../helpers/logs');

const auth = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      status: httpStatus.UNAUTHORIZED,
      message: 'UNAUTHORIZED'
    });
  }

  let token = req.headers.authorization;

  try {
    let user = await UserModel.findByToken(token);

    if (user) {
      const AccessTokenUser = await AccessTokenModel.findOne({
        userId: user._id,
        token: token,
        $or: [
          { type: accessTokenTypes.RESET },
          { type: accessTokenTypes.AUTH }
        ],
        status: true
      });

      if (AccessTokenUser) {
        req.user = user.toJSON();
        req.accessToken = AccessTokenUser.toJSON();
        next();
      } else {
        return res.status(httpStatus.UNAUTHORIZED).json({
          status: httpStatus.UNAUTHORIZED,
          message: 'UNAUTHORIZED'
        });
      }
    } else {
      return res.status(httpStatus.UNAUTHORIZED).json({
        status: httpStatus.UNAUTHORIZED,
        message: 'UNAUTHORIZED'
      });
    }
  } catch (e) {
    logs(`Error [${e}]`);
    return res.status(httpStatus.UNAUTHORIZED).json({
      status: httpStatus.UNAUTHORIZED,
      message: 'UNAUTHORIZED'
    });
  }
};

module.exports = auth;
