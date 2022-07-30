const express = require('express');
const router = express.Router();
const { signup, signin, logout, currentUser, forgotPassword, resetPassword} = require('../controllers/auth');
const { requireSignin } = require("../middlewares");

// validators
const { runValidation } = require('../validators');
const { userSignupValidator, userSigninValidator, forgotPasswordValidator, resetPasswordValidator } = require('../validators/auth');

router.post('/signup', signup, userSignupValidator, runValidation);
router.post('/signin', userSigninValidator, runValidation, signin);
router.get("/logout", logout);
router.get("/current-user", requireSignin, currentUser);
router.post("/forgot-password", forgotPassword, forgotPasswordValidator);
router.post("/reset-password", resetPassword, resetPasswordValidator);

module.exports = router;

