const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require("./../middlewares/auth")
const { 
  createOrder, 
  getOrder, 
  getOrders, 
  getAllOrders, 
  getTargetOrder, 
  updateTagetOrder, 
  deleteOrder 
} = require("./../controllers/orderController");

router.route("/order/new").post(isAuthenticatedUser, createOrder)

router.route("/order/:id").get(isAuthenticatedUser, getOrder)
router.route("/orders").get(isAuthenticatedUser, getOrders)

router.route("/admin/orders").get(isAuthenticatedUser, authorizedRoles("admin"), getAllOrders);
router.route("/admin/order/:id")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getTargetOrder)
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateTagetOrder)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteOrder)

module.exports = router;