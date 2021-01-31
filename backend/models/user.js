const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please, enter your name"],
    maxlength: [30, 'Your name cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, "Please, enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please, enter valid e-mail address"]
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Your password must be longer than 6 characters"],
    select: false
  },
  avatar: {
    public_id: {
      type: String,
      required: [true, "Please, select your profile image"]
    },
    url: {
      type: String,
      required: [true, "Please, select your profile image"]
    },
  },
  role: {
    type: String,
    default: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: {
    type: String,
    select: false
  },
  resetPasswordExpire:  {
    type: Date,
    select: false
  }
})

//Encrypting password before saving user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10)
})

//Return JWT token
userSchema.methods.generateJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  })
}

userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

//Generate password reset token
userSchema.methods.generateResetPasswordToken = function() {
  //Generate Token
  const resetToken = crypto.randomBytes(20).toString('hex')

  // Hash and set to resetPasswordToken
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

  //Set token expire time => 30 min
  this.resetPasswordExpire = Date.now() +  30 * 30 * 1000;

  return resetToken;  
} 

module.exports = mongoose.model('User', userSchema);