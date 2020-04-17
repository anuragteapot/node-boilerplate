const mongoose = require('mongoose');
const { Schema } = mongoose;
const Guid = require('guid');
// const types = require('./../helpers/types');

const ApproverSchema = new Schema({
  _id: {
    type: String,
    default: () => Guid.raw(),
  },
  userId: {
    type: String,
    required: true,
  },
  passId: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
    default: 0,
  },
  updated_at: {
    type: Date,
    default: new Date().getTime(),
  },
  created_at: {
    type: Date,
    default: new Date().getTime(),
  },
});

ApproverSchema.pre('update', function (next) {
  this.updated_at = new Date().getTime();
  next();
});

mongoose.model('Approver', ApproverSchema);
