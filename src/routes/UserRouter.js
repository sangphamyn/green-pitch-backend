const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const {
  authMiddleWare,
  authUserMiddleWare,
} = require("../middleware/authMiddleware");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get(
  "/get-details/:id",
  authUserMiddleWare,
  UserController.getDetailsUser
);
router.post("/logout", UserController.logoutUser);
router.post("/refresh-token", UserController.refreshToken);
module.exports = router;
