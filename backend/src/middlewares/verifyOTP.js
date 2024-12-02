import db from '../models/index.js';

const { user: User } = db;

export const verifyOTPStatus = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Tìm người dùng dựa trên email và kiểm tra mã OTP và thời gian hết hạn
    const user = await User.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordExpires: { $gt: Date.now() } // Kiểm tra thời gian OTP còn hiệu lực
    });

    if (!user) {
      return res.status(400).send({
        message: "OTP không hợp lệ hoặc đã hết hạn"
      });
    }

    // Nếu OTP hợp lệ, tiếp tục với request
    next();
  } catch (error) {
    res.status(500).send({
      message: "Lỗi xác thực OTP",
      error: error.message
    });
  }
};
