const router = require("express").Router();
const { body } = require("express-validator");
const auth = require("../controllers/auth.controller");

router.post("/register", auth.register);
router.post("/login", auth.login);
router.get("/verify/:token", auth.verifyEmail);
router.post("/resend-verification", auth.resendVerification);
router.post("/forgot-password", auth.forgotPassword);
router.post("/reset-password/:token", auth.resetPassword);
router.get("/me", auth.me);

module.exports = router;