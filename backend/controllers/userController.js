const User = require("./../models/user");
const ErrorHandler = require("./../utils/errorHandler");
const catchAsyncErrors = require("./../middlewares/getAsyncErrors")
const sendToken = require("./../utils/jwtToken");
const sendEmail = require("./../utils/sendEmail");
const crypto = require('crypto');
const cloudinary = require("cloudinary");

//Register user => /api/v1/register
exports.registerUser = catchAsyncErrors(async(req, res, next) => { 
  const { avatar } = req.body;
  if (!avatar) {
    return next(new ErrorHandler("Please, choose your profile image", 400));
  }

  const result = await cloudinary.v2.uploader.upload(avatar, {
    folder: 'avatars',
    width: 150,
    crop: "scale",

  })

  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id : result.public_id,
      url : result.secure_url
    }
  })

  sendToken(user, 200, res); 
})

//Login User => /api/v1/login
exports.login = catchAsyncErrors(async(req, res, next) => {
  const { email, password } = req.body;

  //checks if email and password is entered by user
  if (!email || !password) {
    return next(new ErrorHandler("Please, enter email and password", 400))
  }

  //find user on database
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  //check if password is correct 
  const isPasswordMatch = await user.comparePassword(password)

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res); 
})

//Logout user => /api/v1/logout
exports.logout = catchAsyncErrors(async(req, res, next) => {
  res.cookie('shopit_token', null, {
    expires: new Date(Date.now()),
    httpOnly: true
  })

  res.status(200).json({
    success: true,
    message: "Logged out"
  })
})

//Forgot Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async(req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404))
  }

  // get reset token
  const resetToken = user.generateResetPasswordToken();

  await user.save({ validateBeforeSave: false })

  //Create reset password url 
  const url = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`
  const message = `Your password reset token is as follow: \n\n${url}\n\nIf you have not requested this email, then ignore it.`

  try {
    await sendEmail({
      email: user.email,
      subject: "ShopIT password recovery",
      message
    })

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`
    })

  } catch(error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false })

    return next(new ErrorHandler(error.message, 500))
  }

})

// Reset password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async(req, res, next) => {
  
  /**
   * esse role é interessante, vamos la, quando eu chamo a funçao de perdi password e me mandar o link pra resetar por email,
   * eu crio (no model) uma string de 20 caracteres, essa string é encryptada e salva no banco no registro do usuario, junto com uma data de expiraçao de 30 min
   * no email, tem uma url, essa url, tem o token de 20 caracteres, que ao receber e enviar como params da funçao de reset password, eu encrypto ela de novo
   * (a string encryptada no model é a mesma dentro dessa funçao) e procuro no banco o usuario que tiver o token exato e a data de expiration <= a data atual.
  */

  //Hash URL token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  })

  if (!user) {
    return next(new ErrorHandler("Password reset token is invalid or expired.", 400))
  }

  if (req.body.password != req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  // setup new password 
  user.password = req.body.password
  user.resetPasswordToken = "";
  user.resetPasswordExpire = "";

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password successfully reseted, login now with your new password."
  })
})

//Get currently logged in user details => /api/v1/user
exports.getUser = catchAsyncErrors(async (req, res, next) => {
  
  const user = await User.findById(req.user.id)

  res.status(200).json({
    success: true,
    user
  })
})

//Update or Change password (not forgeted) => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  //vou pedir pra ele digitar o antigo password e o novo password, por isso preciso do password atual
  const user = await User.findById(req.user.id).select("+password") 
  const isMatched = await user.comparePassword(req.body.oldPassword)

  if (!isMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400))
  }

  user.password = req.body.newPassword
  await user.save();

  sendToken(user, 200, res)
})

//Update user profile => /api/v1/user/update
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  }

  //Update avatar
  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id)
    const image_id = user.avatar.public_id

    await cloudinary.v2.uploader.destroy(image_id)

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: 'avatars',
      width: 150,
      crop: "scale",
    })


    newUserData.avatar = {
      public_id: result.public_id,
      url: result.secure_url
    }
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, { 
    new: true,
    runValidators: true,
    useFindAndModify: false
  })

  res.status(200).json({
    success: true,
    user
  })
})

//ADMIN ROUTES

//Get All Users => /api/v1/admin/users 
exports.getAllUsers = catchAsyncErrors(async(req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users
  })
})

//GET user details => /api/v1/admin/user/:id
exports.getTargetUser = catchAsyncErrors(async(req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(new ErrorHandler(`User does not found with id ${req.params.id}`))
  }

  res.status(200).json({
    success: true,
    user
  })
})

//Update user profile => /api/v1/admin/user/:id
exports.updateTargetUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  }

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, { 
    new: true,
    runValidators: true,
    useFindAndModify: false
  })

  res.status(200).json({
    success: true,
    user
  })
})

//Delete user profile => /api/v1/admin/user/:id
exports.deleteTargetUser = catchAsyncErrors(async(req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(new ErrorHandler(`User ${req.params.id} not found`, 404))
  }

  //REmove avatar from cloudnary = @TODO

  user.remove();
  res.status(200).json({
    success: true,
    message: `User ${req.params.id} deleted`
  })
})