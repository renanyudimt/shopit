const catchAsyncErrors = require("./getAsyncErrors");
const ErrorHandler = require("./../utils/errorHandler");
const User = require("./../models/user");
const jwt = require("jsonwebtoken")

exports.isAuthenticatedUser = catchAsyncErrors(async(req, res, next) => {
  const { shopit_token } = req.cookies

  if (!shopit_token) {
    return next(new ErrorHandler('Login first to access this resource', 401))
  }

  const decode = jwt.verify(shopit_token, process.env.JWT_SECRET)
  const user = await User.findById(decode.id);

  if (!user) {
    return next(new ErrorHandler('This user does not exist.', 401))
  }

  req.user = user;

  next();
})

//Handling user roles
exports.authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(new ErrorHandler(`Role ${req.user.role} is not allowed to access this resource `, 403))
    }
    //lembrando que esse next() serve pra prosseguir, senao vai morrer aqui
    next()
  }
}