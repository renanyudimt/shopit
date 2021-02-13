const Product = require("./../models/product");
const Order = require("./../models/order");
const User = require("./../models/user");
const ErrorHandler = require("./../utils/errorHandler");
const catchAsyncErrors = require("./../middlewares/getAsyncErrors")

exports.getDashboardData = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find()
  const orders = await Order.find()
  const users = await User.find() 
  const qtdProducts = products.length
  let qtdOutOfStock = 0
  products.map((item) => {
    if (item.stock === 0) {
      qtdOutOfStock++;
    }
  })
  const qtdOrders = orders.length
  const qtdUsers = users.length
  const amount = orders.length > 0 && (
    orders.reduce((acc, item) => item.totalPrice + acc, 0)
  )
  
  res.status(200).json({
    success: true,
    users: qtdUsers,
    orders: qtdOrders,
    outOfStock: qtdOutOfStock,
    products: qtdProducts,
    amount
  })

})
