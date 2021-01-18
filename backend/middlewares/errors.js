const ErrorHandler = require("./../utils/errorHandler");

module.exports = (err, req, res, next) => {
  //isso aqui é uma tricky, o statusCode é ele mesmo, se e somente se, existir, caso nao exista atribui o statusCode para 500, que é internal server error
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV == "development") {
    //CastError é quando houve erro no ID, um id objectId valido.
    if (err.name == "CastError") {
      const message = `Resource not found. Invalid ${err.path}`
      error = new ErrorHandler(message, 404)
    }
    
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errorMessage: err.message,
      stack: err.stack
    })
  }

  if (process.env.NODE_ENV == "production") {
    let error = {...err};
    error.message = err.message;

    //Wron mongoose object ID
    //CastError é quando houve erro no ID, um id objectId valido.
    if (err.name == "CastError") {
      const message = `Resource not found. Invalid ${err.path}`
      error = new ErrorHandler(message, 400)
    }

    //Handling Mongoose validation error
    //Nota: o que tiver default value, nao vai acusar error.
    if (err.name == "ValidationError") {
      const message = Object.values(err.errors).map(value => value.message);
      error = new ErrorHandler(message, 400)
    }

    //Handling Mongoose duplicated key error
    if (err.code == 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`
      error = new ErrorHandler(message, 400 )
    }

    //Handling wrong jwt error
    if (err.name == "JsonWebTokenError") {
      const message = "Token is invalid, try again."
      error = new ErrorHandler(message, 400)
    }

    //Handling expired jwt error
    if (err.name == "TokenExpiredError") {
      const message = "Token expired, log in again."
      error = new ErrorHandler(message, 400)
    }

    res.status(error.statusCode).json({
      success: false,
      msg: error.message || "Internal Server Error"
    })
  }
}