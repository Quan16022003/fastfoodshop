import { secret } from "../configs/auth.config.js";
import db from "../models/index.js";
import jsonwebtoken from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { createTransport } from "nodemailer";

const { sign } = jsonwebtoken;
const { hashSync, compareSync, compare, genSalt, hash } = bcryptjs;

const { user: User, role: Role } = db;
class AuthService {
  async signup(userData) {
    const user = new User({
      fullname: userData.fullname,
      email: userData.email,
      password: hashSync(userData.password, 8),
    });

    await user.save();
    
    // Gán role mặc định là "user"
    const role = await Role.findOne({ name: "user" });
    user.roles = [role._id];

    await user.save();
    return user;
  }

  async signin(email, password) {
    const user = await User.findOne({ email }).populate("roles", "-__v");
    
    if (!user) {
      throw new Error("User not found");
    }

    const passwordIsValid = compareSync(password, user.password);
    if (!passwordIsValid) {
      throw new Error("Invalid password");
    }

    const token = sign(
      { id: user.id },
      secret,
      {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400,
      }
    );

    const authorities = user.roles.map(role => `ROLE_${role.name.toUpperCase()}`);

    return {
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        roles: authorities,
      }
    };
  }
  // Đổi mật khẩu
  async changePassword(userId, oldPassword, newPassword) {
    try {
      const user = await User.findById(userId).select("+password");
      if (!user) {
        throw new Error("Không tìm thấy người dùng");
      }

      const isValidPassword = await compare(oldPassword, user.password);
      if (!isValidPassword) {
        throw new Error("Mật khẩu cũ không chính xác");
      }

      const salt = await genSalt(10);
      user.password = await hash(newPassword, salt);
      await user.save();

      return true;
    } catch (error) {
      throw new Error(error.message || "Lỗi khi đổi mật khẩu");
    }
  }

  // Gửi OTP qua email
  async forgotPassword(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Email không tồn tại trong hệ thống");
      }

      // Tạo OTP ngẫu nhiên 6 số
      const otp = Math.floor(100000 + Math.random() * 900000);
      
      // Lưu OTP và thời gian hết hạn (15 phút)
      user.resetPasswordOtp = otp;
      user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
      await user.save();
      console.log(otp);
      // Cấu hình nodemailer
      const transporter = createTransport({
        service: process.env.SMTP_SERVICE,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      // Gửi email
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Mã OTP đặt lại mật khẩu',
        text: `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn sau 15 phút.`
      });

      return true;
    } catch (error) {
      throw new Error(error.message || "Lỗi khi gửi OTP");
    }
  }

  // Kiểm tra OTP
  async verifyOTP(email, otp) {
    try {
      const user = await User.findOne({
        email,
        resetPasswordOtp: otp,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        throw new Error("OTP không hợp lệ hoặc đã hết hạn");
      }

      return true;
    } catch (error) {
      throw new Error(error.message || "Lỗi khi xác thực OTP");
    }
  }

  // Xác thực OTP và đặt lại mật khẩu
  async resetPassword(email, newPassword) {
    try {
      const user = await User.findOne({ email });
      
      if (!user) {
        throw new Error("Không tìm thấy người dùng");
      }

      // Cập nhật mật khẩu mới
      const salt = await genSalt(10);
      user.password = await hash(newPassword, salt);
      
      // Xóa OTP và thời gian hết hạn
      user.resetPasswordOtp = undefined;
      user.resetPasswordExpires = undefined;
      
      await user.save();
      return true;
    } catch (error) {
      throw new Error(error.message || "Lỗi khi đặt lại mật khẩu");
    }
  }
}

export default new AuthService();