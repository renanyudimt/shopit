const Product = require("./../models/product");
const ErrorHandler = require("./../utils/errorHandler");
const catchAsyncErrors = require("./../middlewares/getAsyncErrors")
const APIFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

//Creating new product => /api/v1/admin/product/new
exports.newProduct = catchAsyncErrors(async(req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  let imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
})

//Get all Products => api/v1/produtcs
exports.getProducts = catchAsyncErrors(async(req, res, next) => {  
  const resPerPage = 4;
  const productsCount = await Product.countDocuments();

  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
  
  let products = await apiFeatures.query;
  let filteredProductsCount = products.length;

  apiFeatures.pagination(resPerPage)
  products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    count: products.length,
    productsCount,
    products,
    resPerPage,
    filteredProductsCount
  })
})

//Get specific product => api/vi/product:id
exports.getProduct = catchAsyncErrors(async(req, res, next) => {
  const product = await Product.findById(req.params.id) 
  .populate({
    path: 'reviews.user',
    select:["_id", 'name'],
  })
  
  if (!product) {
    return next(new ErrorHandler("Product not found", 404))
  }  
  
  res.status(200).json({
    success: true,
    product
  })
})

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting images associated with the product
    for (let i = 0; i < product.images.length; i++) {
      const result = await cloudinary.v2.uploader.destroy(
        product.images[i].public_id
      );
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

exports.deleteProduct = catchAsyncErrors(async(req, res, next) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    return next(new ErrorHandler("Product not found", 404))
  }  

  await product.remove();

  res.status(200).json({
    success: true,
    msg: "Product was deleted"
  })
})

//Creating review => /api/v1/review
exports.createProductReview = catchAsyncErrors(async(req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment: comment
  }

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    review => review.user.toString() == req.user._id.toString()
  )


  if (isReviewed) {
    //atualiza o ja existente
    product.reviews.forEach(review => {
      if (review.user.toString() == req.user._id.toString()) {
        review.comment = comment
        review.rating = rating 
      }
    });
  } else {
    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length
  }

  //uma media de ratings ja que um review a mais entrou no negocio. Esse reduce é um acumulador basicamente, esse 0 significa que vai se iniciar em 0,
  //somar tudo e depois dividir, easy.
  product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true
  })
})

//Get All reviews of a product => /api/v1/reviews
exports.getProductReviews = catchAsyncErrors(async(req, res, next) => {
  const product = await Product.findById(req.query.id)
    .populate({
      path: 'reviews.user',
      model: 'User',
      select:['name'],
    })

  res.status(200).json({
    success: true,
    reviews: product.reviews
  })
})

//Delete review of a product => /api/v1/reviews
exports.deleteReview = catchAsyncErrors(async(req, res, next) => {
  const product = await Product.find({
    "id" : req.query.id, 
    "reviews.user": req.user.id
  })

  if (product.length == 0) {
    return next(new ErrorHandler("You can't delete a reviews that doesn't belongs to you", 400))
  }
  
  const reviews = product[0].reviews.filter(review => review._id.toString() != req.query.reviewId.toString())
  //ao inves de remover a que eu quero, vou separa uma array com todas as reviews que nao tem o id igual ao da query, ou seja trazer todas menos ela e salvar

  const numberOfReviews = reviews.length

  const ratings = product[0].reviews.reduce((acc, item) => item.rating + acc, 0)/reviews.length;


  await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    ratings,
    numberOfReviews
  }, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })
  
  res.status(200).json({
    success: true,
    reviews
  })
})

//get user cart => /api/v1/cart
exports.getCartProducts = catchAsyncErrors(async(req, res, next) => {
  const arr_items = req.body.cartItems.map(item => (item.product))
  const products = await Product.find({
    '_id' : {
      $in: arr_items
    }
  })

  res.status(200).json({
    success: true,
    products
  })
})


//get all products info to Admin => api/v1/admin/products
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find()
  res.status(200).json({
    success: true,
    products
  })
})

//get all products info to Admin => api/v1/admin/products
exports.getAdminProductsOutOfStock = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find({
    "stock": {
      $lte: 0
    }
  })
  res.status(200).json({
    success: true,
    products
  })
})