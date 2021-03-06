const app = require("./app");
const connect = require("./config/database");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary");

//setting up the config file
dotenv.config({ path: 'backend/config/config.env'})

//Handle Uncaught exceptions (variaveis nao declaradas, entre outros)
process.on('uncaughtException', err => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Uncaught Exception")
  process.exit(1)
})

//setting up cloudinary settings
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET
})

//conenting to database
connect();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})

//Handle Unhandled promise rejection (por algum motivo, a connection string esta errada e vai dar erro)
process.on('unhandledRejection', err => {
  console.log(`Error: ${err.stack}`);
  console.log("Shutting down the server due to Unhandled promise rejection")
  server.close(() => {
    process.exit(1)
  });
})