//Create and send token and save in the cookie
const sendToken = (user, statusCode, res) => {
  //Create jwt token and 
  const token = user.generateJwtToken();

  //options for cookie
  const options = {
    expires: new Date( Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000), //use to set expiration date for persistent cookies.
    httpOnly: false, //Ensures the cookie is sent only over HTTP(S), not client JavaScript, helping to protect against cross-site scripting attacks.
  }

  res.status(statusCode).cookie("shopit_token", token, options).json({
    success: true,
    token,
    user
  })
}

module.exports = sendToken