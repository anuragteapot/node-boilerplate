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
const path = require('path');
const fs = require('fs');
const admin = require('../config/env')[process.env.NODE_ENV].admin;
const secret = process.env.JWT_SECRET || 'devmode';

class User {
  getByToken(req, res) {
    const user = { ...req.user };
    user._id = undefined;
    res.json(user);
  }

  async getAllAdmin(req, res) {
    const { limit, filter } = { ...req.query };
    const l = parseInt(limit) || 50;
    const reg = new RegExp(filter, 'i');

    const data = await UserModel.find(
      {
        emailVerified: true,
        email: reg,
        acl: { $in: ['$admin'] },
      },
      { email: true, name: true }
    ).limit(l);
    return res.json(data);
  }

  async acl(req, res) {
    const user = { ...req.user };
    const body = { ...req.body };
    const { action, limit, filter } = { ...req.query };

    const l = parseInt(limit) || 10;
    const reg = new RegExp(filter, 'i');

    try {
      if (action == 'getAllAdmin') {
        const data = await UserModel.find({
          emailVerified: true,
          email: reg,
          acl: { $in: ['$admin'] },
        }).limit(l);
        return res.json(data);
      } else if (action == 'getAllSecurity') {
        const data = await UserModel.find({
          emailVerified: true,
          email: reg,
          acl: { $in: ['$security'] },
        }).limit(l);
        return res.json(data);
      } else if (action == 'getAllGateIncharge') {
        const data = await UserModel.find({
          emailVerified: true,
          email: reg,
          acl: { $in: ['$gate'] },
        }).limit(l);
        return res.json(data);
      } else if (action == 'getAllUser') {
        const data = await UserModel.find({
          emailVerified: true,
          email: reg,
          acl: { $in: ['$user'] },
        }).limit(l);
        return res.json(data);
      }

      const aclUser = await UserModel.findById(body.userId);

      if (
        aclUser &&
        aclUser.email !== user.email &&
        admin.indexOf(aclUser.email) == -1 &&
        action
      ) {
        const updateObj = {};
        updateObj.updated_at = new Date().getTime();

        if (action == 'makeAdmin') {
          if (aclUser.acl.indexOf('$admin') == -1) {
            aclUser.acl.push('$admin');
            aclUser.save();
          }
          return res.json({ SUCCESS: 'DONE' });
        } else if (action == 'removeAdmin') {
          aclUser.acl = aclUser.acl.filter((v) => v != '$admin');
          aclUser.save();
          return res.json({ SUCCESS: 'DONE' });
        } else if (action == 'makeSecurity') {
          if (aclUser.acl.indexOf('$security') == -1) {
            aclUser.acl.push('$security');
            aclUser.save();
          }
          return res.json({ SUCCESS: 'DONE' });
        } else if (action == 'removeSecurity') {
          aclUser.acl = aclUser.acl.filter((v) => v != '$security');
          aclUser.save();
          return res.json({ SUCCESS: 'DONE' });
        } else if (action == 'makeGateIncharge') {
          if (aclUser.acl.indexOf('$gate') == -1) {
            aclUser.acl.push('$gate');
            aclUser.save();
          }
          return res.json({ SUCCESS: 'DONE' });
        } else if (action == 'removeGateIncharge') {
          aclUser.acl = aclUser.acl.filter((v) => v != '$gate');
          aclUser.save();
          return res.json({ SUCCESS: 'DONE' });
        } else {
          return res.status(httpStatus.UNAUTHORIZED).send();
        }
      } else {
        return res.status(httpStatus.UNAUTHORIZED).send();
      }
    } catch (e) {
      logs(
        `Error on update user acl [${user.email}]. Error: ..:: ${
          e.message || e
        } ::..`,
        'error'
      );
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        error: 'INTERNAL_SERVER_ERROR',
        message: e.message || e,
      });
    }
  }

  async create(req, res) {
    if (!req.body) {
      return res.status(httpStatus.NO_CONTENT).send();
    }
    const user = { ...req.body };

    try {
      if (admin.indexOf(user.email) != -1) {
        user.acl = ['$user', '$admin'];
      } else {
        user.acl = undefined;
      }

      const created = await UserModel.create(user);

      let token = jwt.sign(
        {
          _id: created._id,
          expires: moment().add(1, 'days').valueOf(),
        },
        secret
      );

      await AccessTokenModel.create({
        userId: created._id,
        token: token,
        type: accessTokenTypes.VERIFY_EMAIL,
        location: 'Update this',
        ip: req.connection.remoteAddress || req.headers['x-forwarded-for'],
      });

      const template = await fs.readFileSync(
        path.resolve(__dirname, '../mail/templates/verifyEmail.html'),
        'utf8'
      );

      const url = `${process.env.SITE_BASE_URL}/verify-email?token=${token}`;

      await sendEmail({
        to: user.email,
        subject: 'Please Verify Email',
        template: template.replace('$link', url),
      });

      return res.status(httpStatus.CREATED).json({
        status: httpStatus.CREATED,
        message:
          'Your account has been successfully created. Please verify your email.',
      });
    } catch (e) {
      logs(
        `Error on create user [${user.email}]. Error: ..:: ${
          e.message || e
        } ::..`,
        'error'
      );
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        error: 'INTERNAL_SERVER_ERROR',
        message: e.message || e,
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
        designation: newData.designation || userData.designation,
        telephone: newData.telephone || userData.telephone,
      };

      if (newData.password) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newData.password, salt);
        updateObj.password = hash;
      }

      updateObj.updated_at = new Date().getTime();

      const updated = await UserModel.findByIdAndUpdate(
        userData._id,
        updateObj
      );

      if (accessTokenData.type === accessTokenTypes.RESET) {
        await AccessTokenModel.updateOne(
          {
            userId: updated._id,
            token: accessTokenData.token,
            status: true,
            type: accessTokenTypes.RESET,
          },
          {
            status: false,
            token: 'null',
          }
        );
      }

      const user = await UserModel.findById(updated._id);
      user._id = undefined;
      return res.json(user);
    } catch (e) {
      logs(
        `Error on update user [${userData.email}]. Error: ..:: ${
          e.message || e
        } ::..`,
        'error'
      );
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        error: 'INTERNAL_SERVER_ERROR',
        message: e.message || e,
      });
    }
  }
}

module.exports = new User();
