const mongoose = require('mongoose');
const Guid = require('guid');
const accessTokenTypes = require('../helpers/accessTokenTypes');
const { Schema } = mongoose;

const AccessTokenSchema = new Schema({
  _id: {
    type: String,
    default: () => Guid.raw()
  },
  userId: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    required: true,
    default: true
  },
  type: {
    type: String,
    required: true,
    default: accessTokenTypes.AUTH
  },
  location: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true
  }
});

const returnFilter = obj => {
  let tmp = { ...obj };
  return tmp;
};

AccessTokenSchema.methods.toJSON = function() {
  const accessToken = this;
  const accessTokenObject = accessToken.toObject();
  return returnFilter(accessTokenObject);
};

mongoose.model('AccessToken', AccessTokenSchema);
