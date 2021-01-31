const express = require("express");
const router = express.Router();

const { 
  getProducts, 
  getProduct, 
  newProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
  getCartProducts
} = require("../controllers/productController");

const { isAuthenticatedUser, authorizedRoles } = require("./../middlewares/auth")

router.route('/products').get(getProducts)
router.route('/product/:id').get(getProduct)

router.route('/admin/product/new').post(isAuthenticatedUser, authorizedRoles('admin'), newProduct)

router.route('/admin/product/:id')
  .put(isAuthenticatedUser, authorizedRoles('admin'), updateProduct)
  .delete(isAuthenticatedUser, authorizedRoles('admin'), deleteProduct)

router.route("/cart").post(getCartProducts)

router.route("/review")
  .put(isAuthenticatedUser,createProductReview)
  .delete(isAuthenticatedUser, deleteReview)
router.route("/reviews/").get(isAuthenticatedUser, getProductReviews)


module.exports = router; 