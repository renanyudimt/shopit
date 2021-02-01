const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: 'backend/config/config.env'})

const errorMiddleware = require("./middlewares/errors") 
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const fileUpload = require("express-fileupload")

const cors = require("cors");
var corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

//ao fazer login eu tenho sendCookie() que ira enviar um cookie e salvar ele no http request (nunca vi isso antes)
//aî, vou tentar acessar ele, se tiver la o cookie, vou tentar acessar ele e ver se o usuario ta logado, se nao tiver um cookie,
//singifica que o usuario ta deslogado e nao pode acessar a api

//Entao SIM ! parece que to usand o back pra fazer login e logout, doido...
app.use(cookieParser());
app.use(fileUpload());

//Import all routes
const products = require('./routes/product');
const user = require('./routes/user');
const orders = require('./routes/order');
const payment = require('./routes/payment')

app.use('/api/v1', products);
app.use('/api/v1', user);
app.use('/api/v1', orders);
app.use('/api/v1', payment)

//Middleware to handle errors
app.use(errorMiddleware)

module.exports = app;