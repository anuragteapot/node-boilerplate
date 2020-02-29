const mongoose = require('mongoose');
const moment = require('moment');
const UserModel = mongoose.model('User');
const AccessTokenModel = mongoose.model('AccessToken');
const logs = require('../helpers/logs');
const sendEmail = require('../mail/sendEmail');
const httpStatus = require('../helpers/httpStatus');
const accessTokenTypes = require('../helpers/accessTokenTypes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'devmode';

class User {
  getByToken(req, res) {
    const user = { ...req.user };
    res.json(user);
  }

  async create(req, res) {
    if (!req.body) {
      return res.status(httpStatus.NO_CONTENT).send();
    }
    const user = { ...req.body };

    try {
      const created = await UserModel.create(user);

      logs(`Created user [${created._id}]`);

      let token = jwt.sign(
        {
          _id: created._id,
          expires: moment()
            .add(1, 'days')
            .valueOf()
        },
        secret
      );

      await AccessTokenModel.create({
        userId: created._id,
        token: token,
        type: accessTokenTypes.VERIFY_EMAIL,
        location: 'Update this',
        ip: req.connection.remoteAddress || req.headers['x-forwarded-for']
      });

      try {
        await sendEmail({
          to: user.email,
          subject: 'Please Verify Email',
          template: `<h1>${token}</h1>`
        });

        res.status(httpStatus.CREATED).json({
          status: httpStatus.CREATED,
          message:
            'Your account has been successfully created. Please verify your email.'
        });
      } catch (err) {
        logs(
          `Error on create user [${user.email}]. Error: ..:: ${err} ::..`,
          'error'
        );
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          status: httpStatus.INTERNAL_SERVER_ERROR,
          error: 'Please try again.'
        });
      }
    } catch (e) {
      logs(
        `Error on create user [${user.email}]. Error: ..:: ${e.message} ::..`,
        'error'
      );
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        error: e.message
      });
    }
  }

  async update(req, res) {
    const userData = { ...req.user };
    const newData = { ...req.body };
    const accessTokenData = { ...req.accessToken };

    try {
      const updateObj = {
        name: newData.name || userData.name,
        age: newData.age || userData.age
      };
      
      if (newData.password) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newData.password, salt);
        updateObj.password = hash;
      }

      updateObj.updated_at = new Date().getTime();
      UserModel.findByIdAndUpdate(userData._id, updateObj, async function(
        err,
        updated
      ) {
        if (err) {
          logs(
            `Error on findAndupdate user [${userData.email}]. Error: ..:: ${err} ::..`,
            'error'
          );
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            error: err
          });
        }

        if (accessTokenData.type === accessTokenTypes.RESET) {
          await AccessTokenModel.updateOne(
            {
              userId: updated._id,
              token: accessTokenData.token,
              status: true,
              type: accessTokenTypes.RESET
            },
            {
              status: false,
              token: 'null'
            }
          );
        }

        UserModel.findById(updated._id, (err, user) => {
          return res.json(user);
        });
      });
    } catch (e) {
      logs(
        `Error on update user [${userData.email}]. Error: ..:: ${e.message} ::..`,
        'error'
      );
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        error: e.message
      });
    }
  }
}

module.exports = new User();
