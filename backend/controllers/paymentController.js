const catchAsyncErrors = require("./../middlewares/getAsyncErrors")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Product = require("./../models/product")
const ErrorHandler = require("./../utils/errorHandler")

//Check products stock BEFORE COMPLETE THE ORDER
const checkProductsStock = async (items, next) => {
  let pass = true;

  //tem outra forma de fazer isso, checar updateStock() em orderController()

  return new Promise(async (res) => {
    items.map(async (item) => {
      await Product.find({
        '_id' : item.product,
        'stock': {
          $gte: item.quantity 
        }
      }).then(result => {
        console.log("pass", pass)
        if (pass) {
          res(pass = result.length > 0 ? true : false)
        }
      }).catch( () => next())
    })
  })
}

//Process stripe payments => /api/v1/payment/process
exports.processPayment = catchAsyncErrors( async(req, res, next) => {
  //Into this page, i'll check again if all products and product quantity is available, if it is, process the payment, if dont, return error
  const productsAvailable = await checkProductsStock(req.body.cartItems, next)

  console.log("final", productsAvailable);

  if (!productsAvailable) {
    return next(new ErrorHandler("Ooops! Looks like there's no stock for one or more product", 400));
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "usd",
    description: "ShopIT",
    metadata: {
      integration_check: "accept_a_payment"
    }
  });

  res.status(200).json({
    success: true,
    client_secret: paymentIntent.client_secret
  })
})

//send API key => /api/v1/stripeapi
exports.sendStripeApi = catchAsyncErrors( async (req, res, next) => {
  res.status(200).json({
    stripeApiKey: process.env.STRIPE_API_KEY
  })
})