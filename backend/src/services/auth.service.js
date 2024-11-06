const config = require("../configs/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodeMailer = require("nodemailer");

class AuthService {
  async signup(userData) {
    const user = new User({
      username: userData.username,
      email: userData.email,
      password: bcrypt.hashSync(userData.password, 8),
    });

    await user.save();
    
    if (userData.roles) {
      const roles = await Role.find({ name: { $in: userData.roles } });
      user.roles = roles.map(role => role._id);
    } else {
      const role = await Role.findOne({ name: "user" });
      user.roles = [role._id];
    }

    await user.save();
    return user;
  }

  async signin(email, password) {
    const user = await User.findOne({ email }).populate("roles", "-__v");
    
    if (!user) {
      throw new Error("User not found");
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      { id: user.id },
      config.secret,
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
        username: user.username,
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

      const isValidPassword = await bcrypt.compare(oldPassword, user.password);
      if (!isValidPassword) {
        throw new Error("Mật khẩu cũ không chính xác");
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
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
      const transporter = nodeMailer.createTransport({
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
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      
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

module.exports = new AuthService();