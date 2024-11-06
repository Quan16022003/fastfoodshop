const { verifySignUp, authJwt } = require("../middlewares");
const { verifyOTPStatus } = require("../middlewares/verifyOTP");
const controller = require("../controllers/auth.controller");
const router = require('express').Router();

// Middleware CORS cho tất cả các route
router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept, X-Requested-With, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// Route đăng ký tài khoản mới
router.post(
  "/signup",
  [
    verifySignUp.checkDuplicateEmail,
    verifySignUp.checkPassword,
    verifySignUp.checkRolesExisted
  ],
  controller.signup
);

// Route đăng nhập
router.post("/signin", controller.signin);

// Route đăng xuất
router.post("/signout", controller.signout);

router.put("/change-password", 
  [
    authJwt.verifyToken, 
    verifySignUp.checkPassword
  ], 
  controller.changePassword
);

// Thêm route quên mật khẩu
router.post("/forgot-password", controller.forgotPassword);

router.get("/verify-otp", verifyOTPStatus, async (req, res)=> {
  res.status(200).send({
    message: "OTP is valid"
  });
});

// Thêm route đặt lại mật khẩu với OTP
router.put(
  "/reset-password",
  [
    verifyOTPStatus,  // Kiểm tra trạng thái xác thực OTP
    verifySignUp.checkPassword
  ],
  controller.resetPassword
);

module.exports = router;