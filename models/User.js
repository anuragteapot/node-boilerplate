const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const Guid = require('guid');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'devmode';
const { Schema } = mongoose;

// filter returned values on requests
const returnFilter = (obj) => {
  let tmp = { ...obj };
  // tmp._id = undefined;
  tmp.password = undefined;
  tmp.__v = undefined;
  tmp.updated_at = undefined;
  tmp.created_at = undefined;
  tmp.emailVerified = undefined;
  return tmp;
};

const UserSchema = new Schema({
  _id: {
    type: String,
    default: () => Guid.raw(),
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
    trim: true,
    minlength: 5,
    validate: {
      validator: (value) =>
        process.env.NODE_ENV === 'production'
          ? validator.isEmail(value) && value.split('@')[1] === 'iitp.ac.in'
          : validator.isEmail(value),
      message: '{VALUE} is not a valid email',
    },
  },
  emailVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  designation: {
    type: String,
    required: true,
  },
  telephone: {
    type: String,
    required: true,
  },
  empId: {
    type: String,
    required: true,
  },
  acl: {
    type: Array,
    required: true,
    default: ['$user'],
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

UserSchema.plugin(uniqueValidator);

UserSchema.pre('save', function (next) {
  const user = this;
  user.updated_at = new Date().getTime();

  if (user.isModified('password')) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;
    next();
  } else {
    next();
  }
});

UserSchema.pre('update', function (next) {
  const user = this;
  this.updated_at = new Date().getTime();
  next();
});

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  return returnFilter(userObject);
};

UserSchema.statics.returnFilter = returnFilter;

UserSchema.statics.findByCredentials = async function (email, password) {
  const user = this;
  return new Promise(async (resolve, reject) => {
    try {
      user.findOne({ email }, (err, doc) => {
        if (err || !doc) {
          return reject({ status: 404, message: 'Invalid credentials' });
        }
        bcrypt.compare(password, doc.password, (err, didMatch) => {
          if (err) return reject(err);
          if (didMatch) {
            resolve(doc);
          } else {
            reject({ message: 'Not authorized' });
          }
        });
      });
    } catch (e) {
      reject(e);
    }
  });
};

UserSchema.statics.findByToken = function (token) {
  return new Promise((resolve, reject) => {
    const User = this;
    let decodedIdAndToken = jwt.verify(token, secret);
    User.findById(decodedIdAndToken._id, (err, user) => {
      if (err) {
        return reject(err);
      }
      return resolve(user);
    });
  });
};

mongoose.model('User', UserSchema);
