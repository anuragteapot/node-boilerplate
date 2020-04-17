const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
const PassDataModel = mongoose.model('PassData');
const ApproverModel = mongoose.model('Approver');
const logs = require('../helpers/logs');
const sendEmail = require('../mail/sendEmail');
const path = require('path');
const fs = require('fs');
const httpStatus = require('../helpers/httpStatus');
const types = require('../helpers/types');
const security = require('../config/env')[process.env.NODE_ENV].security;

class Service {
  async updateState(req, res) {
    if (!req.body) {
      return res.status(httpStatus.NO_CONTENT).send();
    }

    const { id, action } = { ...req.body };
    const user = { ...req.user };

    try {
      const pass = await PassDataModel.findById(id);

      if (
        action == types.APPROVED &&
        user.acl.indexOf('$admin') != -1 &&
        pass &&
        pass.state == types.RAISED
      ) {
        pass.state = types.APPROVED;
        pass.save();

        await ApproverModel.create({
          userId: user._id,
          passId: pass._id,
          state: types.APPROVED,
        });

        const userData = await UserModel.findById(pass.userId);

        const template = await fs.readFileSync(
          path.resolve(__dirname, '../mail/templates/security.html'),
          'utf8'
        );

        const url = `${process.env.SITE_BASE_URL}/dashboard/view/${pass._id}?action=APPROVED`;

        await sendEmail({
          to: security,
          subject: `${user.name} requested you to approve this gate pass.`,
          template: template
            .replace('$link', url)
            .replace('$approver', user.name)
            .replace('$name', userData.name)
            .replace('$designation', user.designation),
        });

        return res.json({ SUCCESS: true });
      } else if (
        action == types.CHECKED &&
        user.acl.indexOf('$security') != -1 &&
        pass &&
        pass.state == types.APPROVED
      ) {
        pass.state = types.CHECKED;
        pass.save();

        await ApproverModel.create({
          userId: user._id,
          passId: pass._id,
          state: types.CHECKED,
        });

        return res.json({ SUCCESS: true });
      } else if (
        action == types.GATE_INCHARGE &&
        user.acl.indexOf('$gate') != -1 &&
        pass &&
        pass.state == types.CHECKED
      ) {
        pass.state = types.GATE_INCHARGE;
        pass.save();

        await ApproverModel.create({
          userId: user._id,
          passId: pass._id,
          state: types.GATE_INCHARGE,
        });

        return res.json({ SUCCESS: true });
      } else if (
        action == types.REJECT &&
        pass.state != types.REJECT &&
        (user.acl.indexOf('$admin') != -1 ||
          user.acl.indexOf('$gate') != -1 ||
          user.acl.indexOf('$security') != -1)
      ) {
        pass.state = types.REJECT;
        pass.save();

        await ApproverModel.create({
          userId: user._id,
          passId: pass._id,
          state: types.REJECT,
        });

        return res.json({ SUCCESS: true });
      } else if (
        action == types.CANCEL &&
        pass.userId == user._id &&
        pass.state != types.CANCEL
      ) {
        pass.state = types.CANCEL;
        pass.save();

        await ApproverModel.create({
          userId: user._id,
          passId: pass._id,
          state: types.CANCEL,
        });

        return res.json({ SUCCESS: true });
      } else {
        return res.status(httpStatus.UNAUTHORIZED).json({
          status: httpStatus.UNAUTHORIZED,
          error: 'UNAUTHORIZED',
          message: 'Not authorized',
        });
      }
    } catch (e) {
      logs(
        `Error on updateState [${user.email}]. Error: ..:: ${
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

  async getApprover(req, res) {
    const { id } = { ...req.query };

    try {
      if (id) {
        const data = await ApproverModel.findById(id);

        if (data) {
          const pass = await PassDataModel.findById(data.passId);
          const user = await UserModel.findById(data.userId);
          user._id = undefined;

          const newv = data.count + 1;
          data.count = newv;
          data.save();
          return res.json({ pass, user, count: data.count - 1 });
        } else {
          return res.status(httpStatus.UNAUTHORIZED).send();
        }
      } else {
        return res.status(httpStatus.UNAUTHORIZED).send();
      }
    } catch (e) {
      logs(`Error on getApprover. Error: ..:: ${e.message || e} ::..`, 'error');
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        error: 'INTERNAL_SERVER_ERROR',
        message: e.message || e,
      });
    }
  }

  async createPass(req, res) {
    if (!req.body) {
      return res.status(httpStatus.NO_CONTENT).send();
    }
    let passData = { ...req.body };
    const user = { ...req.user };

    try {
      passData.userId = user._id;
      const data = await PassDataModel.create(passData);

      if (data) {
        await ApproverModel.create({
          userId: user._id,
          passId: data._id,
          state: types.RAISED,
        });

        const template = await fs.readFileSync(
          path.resolve(__dirname, '../mail/templates/approver.html'),
          'utf8'
        );

        const url = `${process.env.SITE_BASE_URL}/dashboard/view/${data._id}?action=RAISED`;

        await sendEmail({
          to: passData.approverEmail,
          subject: `${user.name} requested you to approve this gate pass.`,
          template: template.replace('$link', url).replace('$name', user.name),
        });

        return res.json({ id: data._id });
      } else {
        return res.status(httpStatus.NO_CONTENT).send();
      }
    } catch (e) {
      logs(
        `Error on createPass [${user.email}]. Error: ..:: ${
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

  async getAllPass(req, res) {
    const user = { ...req.user };
    const { limit, state, filter, type } = { ...req.query };

    const l = limit | 10;

    const re = new RegExp(filter, 'i');

    try {
      if (type === 'MY') {
        const pass = await PassDataModel.find({
          userId: user._id,
          title: re,
        })
          .limit(l)
          .sort({ updated_at: -1 });
        return res.json(pass);
      } else if (user.acl.length > 1) {
        const pass = await PassDataModel.find({
          state,
          title: re,
        })
          .limit(l)
          .sort({ updated_at: -1 });
        return res.json(pass);
      } else {
        const pass = await PassDataModel.find({
          userId: user._id,
          title: re,
          state,
        })
          .limit(l)
          .sort({ updated_at: -1 });
        return res.json(pass);
      }
    } catch (e) {
      logs(
        `Error on get all pass [${user.email}]. Error: ..:: ${
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

  async getPass(req, res) {
    if (!req.body) {
      return res.status(httpStatus.NO_CONTENT).send();
    }
    const user = { ...req.user };
    const { id } = { ...req.query };

    try {
      let pass = await PassDataModel.findById(id);
      if (user.acl.length <= 1 && pass.userId != user._id) {
        pass = undefined;
      }
      pass.userId = undefined;

      if (pass) {
        const approver = await ApproverModel.find({ passId: pass._id });

        let userData = {};

        for (let i = 0; i < approver.length; i++) {
          const user = await UserModel.findById(approver[i].userId, {
            _id: false,
            acl: false,
          });
          userData[approver[i].state] = user;
        }

        return res.json({ pass, approver, userData });
      } else {
        return res.status(httpStatus.NO_CONTENT).send();
      }
    } catch (e) {
      logs(
        `Error on getPass [${user.email}]. Error: ..:: ${e.message || e} ::..`,
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

module.exports = new Service();
