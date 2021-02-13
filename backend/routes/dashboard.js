const express = require("express")
const router = express.Router()
const { isAuthenticatedUser, authorizedRoles } = require("./../middlewares/auth")
const { getDashboardData } = require("./../controllers/adminController")

router.route("/admin/dashboard").get(isAuthenticatedUser, authorizedRoles("admin"), getDashboardData)

module.exports = router