const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minLength: 1,
    trim: true,
    unique: true,
    validate: {
      // validator: (value) => {
      //   return validator.isEmail(value);
      // },
      //can be cleaned to:
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

// creating instance methods
// using es5 function syntax because we want to use 'this'

//this is overriding the toJSON function which is called automatiacally?
UserSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};


UserSchema.methods.generateAuthToken = function () {
  let user = this;
  let access = 'auth';
  // let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
  let token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  user.tokens.push({access, token});
  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function (token) {
  let user = this;
  return user.update({
    $pull: {
      tokens: {
        token: token
      }
    }
  });
};

// .statics is for model methods where as .methods is for intstance methods
UserSchema.statics.findByToken = function (token) {
  let User = this;
  let decoded;

  try {
    // decoded = jwt.verify(token, 'abc123');
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch(e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    // simpler way of dong the above:
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  let User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (error, result) => {
        if (result) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

//.pre is for methods that are suppose to run before you, in this case save, your instance to DB
UserSchema.pre('save', function (next) {
  user = this;

  if (user.isModified('password')) {
    // only encrypt password if its modified meaning if it was changed by user upon initial sign up or updating password
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(user.password, salt, (error, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

let User = mongoose.model('User', UserSchema);


module.exports = {
  User
};
