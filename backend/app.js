const express = require("express");
const app = express();
const errorMiddleware = require("./middlewares/errors") 
const cookieParse = require("cookie-parser");
const cors = require("cors");
var corsOptions = {
  origin: '*',
}

app.use(cors(corsOptions))
app.use(express.json()); 
//ao fazer login eu tenho sendCookie() que ira enviar um cookie e salvar ele no http request (nunca vi isso antes)
//aî, vou tentar acessar ele, se tiver la o cookie, vou tentar acessar ele e ver se o usuario ta logado, se nao tiver um cookie,
//singifica que o usuario ta deslogado e nao pode acessar a api

//Entao SIM ! parece que to usand o back pra fazer login e logout, doido...
app.use(cookieParse())

//Import all routes
const products = require('./routes/product');
const user = require('./routes/user');
const orders = require('./routes/order');

app.use('/api/v1', products);
app.use('/api/v1', user);
app.use('/api/v1', orders);


//Middleware to handle errors
app.use(errorMiddleware)

module.exports = app;