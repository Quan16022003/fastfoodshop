import express from "express";
import { verifySignUp, authJwt, verifyOTPStatus } from "../middlewares/index.js";
import { signup, signin, signout, changePassword, forgotPassword, resetPassword, googleLogin } from "../controllers/auth.controller.js";

const router = express.Router();

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
  signup
);

// Route đăng nhập
router.post("/signin", signin);

// Route đăng xuất
router.post("/signout", signout);

router.put("/change-password", 
  [
    authJwt.verifyToken, 
    verifySignUp.checkPassword
  ], 
  changePassword
);

// Thêm route quên mật khẩu
router.post("/forgot-password", forgotPassword);

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
  resetPassword
);

router.post("/google", googleLogin);

export default router;