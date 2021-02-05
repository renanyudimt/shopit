const Order = require("./../models/order")
const Product = require("./../models/product")
const ErrorHandler = require("./../utils/errorHandler")
const catchAsyncErrors = require("./../middlewares/getAsyncErrors")

//crate new order => /api/v1/order/new
exports.createOrder = catchAsyncErrors(async(req, res, next) => {
  const { 
    orderItems, 
    shippingInfo,
    ItemsPrice,
    taxPrice, 
    shippingPrice,
    totalPrice,
    orderStatus,
    paymentInfo

  } = req.body

  orderItems.forEach(async item => {
    await updateStock(item.product, item.quantity, next)
  })

  
  const order = await Order.create({
    orderItems, 
    shippingInfo,
    ItemsPrice,
    taxPrice, 
    shippingPrice,
    totalPrice,
    paymentInfo,
    orderStatus,
    paidAt: Date.now(),
    user: req.user._id
  })

  res.status(200).json({
    success: true,
    order
  })

})

//get logged in single order => /api/v1/order/:id
exports.getOrder = catchAsyncErrors(async(req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', "name email")
    .populate('orderItems.product', "name description ")

  if (!order) {
    return next(new ErrorHandler("No order found with this id", 400))
  }

  res.status(200).json({
    success: true,
    order
  })
})

//get logged in all orders => /api/v1/orders
exports.getOrders = catchAsyncErrors(async(req, res, next) => {
  const orders = await Order.find({ user: req.user.id })
    .populate('user', "name email")
    .populate('orderItems.product', "name description price seller category")

  if (!orders) {
    return next(new ErrorHandler("No orders found for this user", 400))
  }

  res.status(200).json({
    success: true,
    orders
  })
})

//get all products all orders from all users => /api/v1/admin/orders
exports.getAllOrders = catchAsyncErrors(async(req, res, next) => {
  const orders = await Order.find()
    .populate('user', "name email")
    .populate('orderItems.product', "name description price seller category")
  
  if (!orders) {
    return next(new ErrorHandler("We don't have orders yet", 404))
  }

  let totalAmount = 0;

  orders.forEach(element => {
    totalAmount += element.totalPrice
  });

  res.status(200).json({
    success: true,
    orders,
    totalAmount
  })
})

//GET single order - ADMIN => /api/v1/admin/order/:id
exports.getTargetOrder = catchAsyncErrors(async(req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', "name email")
    .populate('orderItems.product', "name description price seller category")
    
  if (!order) {
    next(new ErrorHandler(`No order found with id ${req.params.id}`))
  }

  res.status(200).json({
    success: true,
    order,
  })
})


//UPDATE single order / process order  - ADMIN => /api/v1/admin/order/:id
exports.updateTagetOrder = catchAsyncErrors(async(req, res, next) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    return next(new ErrorHandler(`No order found with id ${req.params.id}`))
  }

  if (order.orderStatus == "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400))
  }

  order.orderItems.forEach(async item => {
    await updateStock(item.product, item.quantity, next)
  })

  order.orderStatus = req.body.status;

  if (order.orderStatus == "Delivered") {
    order.deliveredAt = Date.now();
  }

  order.updatedAt = Date.now();

  await order.save() 

  res.status(200).json({
    success: true,
    order
  })
})

async function updateStock(id, quantity, next) {
  try {
    const product = await Product.findById(id)
    product.stock = product.stock - quantity;
    await product.save({ validateBeforeSave: true })
  } catch(error) {
    next();
  }
}

//DELETE order - ADMIN => /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors(async(req, res, next) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    return next(new ErrorHandler(`No order found with id ${req.params.id}`))
  }

  await order.remove();

  res.status(200).json({
    success: true
  })
})