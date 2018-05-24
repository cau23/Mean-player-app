const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

let emailLengthChecker = (email) => {
  if (!email) {
    return false;
  } else {
    if (email.length < 5 || email.length > 30) {
      return false;
    } else {
      return true;
    }
  }
};
// specifying all characters required for the email
let validEmailChecker = (email) => {
  if (!email) {
    return false;
  } else {
    const regExp = new
    RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regExp.test(email);
  }
};


const emailValidators = [{
  validator: emailLengthChecker,
  message: 'E-mail must be at least 5 characters but no more than 30'
},
{
  validator: validEmailChecker,
  message: 'Must be a valid e-mail'
}
];
// validator for username
let usernameLengthChecker = (username) => {
  if (!username) {
    return false;
  } else {
    if (username.length < 3 || username.length > 15) {
      return false;
    } else {
      return true;
    }
  }
};

let validUsername = (username) => {
  if (!username) {
    return false;
  } else {
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    return regExp.test(username);
  }
};

const usernameValidators = [
  {
    validator: usernameLengthChecker,
    message: 'Username must be at least 3 characters but no more than 16'
  }, {
    validator: validUsername,
    message: 'username must not have any special characters'
  }
 ];

let passwordLengthChecker = (password) => {
  if (!password) {
    return false;
  } else {
    if (password.length < 8 || password.length > 35) {
      return false;
    } else {
      return true;
    }
  }
};

let validPassword = (password) => {
  if (!password) {
    return false;
  } else {
    const regExp = new
    RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    return regExp.test(password); // Return regular express test result (true or false)
  }
};

const passwordValidators = [{
  validator: passwordLengthChecker,
  message: 'Password must be at least 8 characters but no more than 35'
}, {
  validator: validPassword,
  message: 'Must be at least one uppercase, lowercase, special character, and number'
}];

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
    username: { type: String, required: true, unique: true, lowercase: true, validate: usernameValidators },
    password: { type: String, required: true, validate: passwordValidators }
  });

// Schema middleware to Encrypt Password
userSchema.pre('save', function(next) {
  // Ensure password is new or motified before applying encryption
  if (!this.isModified('password'))
    return next ();

  bcrypt.hash(this.password, null, null, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  })
});

// Methods to compare password to encrypted password upon login
userSchema.methods.comparePassword = (password) => {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);