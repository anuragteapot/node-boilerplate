const mongoose = require('mongoose');
const { Schema } = mongoose;
const shortid = require('shortid');
const types = require('./../helpers/types');

const PassDataSchema = new Schema({
  _id: {
    type: String,
    default: () => shortid.generate(),
  },
  userId: {
    type: String,
    required: true,
  },
  approverEmail: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  trolley_no: {
    type: String,
    required: true,
  },
  room: {
    type: Number,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  data: {
    type: Array,
    required: true,
    default: [],
  },
  state: {
    type: String,
    required: true,
    default: types.RAISED,
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

// PassDataSchema.createIndex( { data: "text" } );

PassDataSchema.pre('update', function (next) {
  this.updated_at = new Date().getTime();
  next();
});

mongoose.model('PassData', PassDataSchema);
