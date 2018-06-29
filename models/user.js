/* *********
  Import Node Modules
***********/   

const mongoose = require('mongoose'); //Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose
const bcrypt = require('bcrypt-nodejs'); // A native JS bcrypt library for NodeJS

// Validate Function to check e-mail length
let emailLengthChecker = (email) => {
  // Check if email exists
  if (!email) {
    return false; // return error
  } else {
    // Check the Length of email string
    if (email.length < 5 || email.length > 30) {
      return false; // Return error if it's not proper length
    } else {
      return true; // REturn as valid email
    }
  }
};

// specifying all characters required for the email
let validEmailChecker = (email) => {
  // Check if email exists
  if (!email) {
    return false; // Run error
  } else {
    // Regular Expression to test for valid email
    const regExp = new
    RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regExp.test(email); // Return regular Expression results - true/false
  }
};

// Array of Email Validators
const emailValidators = [
  // First Email Validator
  {
    validator: emailLengthChecker,
    message: 'E-mail must be at least 5 characters but no more than 30'
  },
  // Second Email Validator
  {
    validator: validEmailChecker,
    message: 'Must be a valid e-mail'
  }
];

// validator for username length
let usernameLengthChecker = (username) => {
  // Check if username exists
  if (!username) {
    return false; // Return error
  } else {
    // Check length of username string
    if (username.length < 3 || username.length > 15) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid username
    }
  }
};

// Validate Function to check if username format is valid
let validUsername = (username) => {
  // Check if username exists
  if (!username) {
    return false; // Return error
  } else {
    // Regular expression to test if username format is valid
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    return regExp.test(username); // return regEx results - true/false
  }
};
// Array of Username validators
const usernameValidators = [
  // First Username validator
  {
    validator: usernameLengthChecker,
    message: 'Username must be at least 3 characters but no more than 16'
  }, 
  // Second username Validator
  {
    validator: validUsername,
    message: 'username must not have any special characters'
  }
 ];

// Validate Function to check password length
let passwordLengthChecker = (password) => {
  // Check if password exists
  if (!password) {
    return false; // Return error
  } else {
    // Check password length
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