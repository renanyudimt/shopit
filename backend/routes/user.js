const express = require("express");
const router = express.Router();

const { 
  registerUser, 
  login, 
  logout, 
  forgotPassword,
  resetPassword,
  getUser,
  updatePassword,
  updateUser,
  getAllUsers,
  getTargetUser,
  updateTargetUser,
  deleteTargetUser,
} = require("../controllers/userController")

const { isAuthenticatedUser, authorizedRoles } = require("./../middlewares/auth")

router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/password/forgot").post(forgotPassword)

router.route("/password/reset/:token").put(resetPassword)
router.route("/password/update").put(isAuthenticatedUser, updatePassword)
router.route("/user/update").put(isAuthenticatedUser, updateUser)

router.route("/logout").get(logout);
router.route("/user").get(isAuthenticatedUser, getUser)

//Admin routes
router.route("/admin/users/").get(isAuthenticatedUser, authorizedRoles("admin"), getAllUsers)
router.route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getTargetUser)
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateTargetUser)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteTargetUser)

module.exports = router;