import AuthService from "../services/auth.service.js";
import { OAuth2Client } from 'google-auth-library';
import db from "../models/index.js";
import { sign } from "jsonwebtoken";

const { user: User, role: Role } = db;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function signup(req, res) {
  try {
    console.log('Request body:', req.body);
    await AuthService.signup(req.body);
    res.send({ message: "User was registered successfully!" });
  } catch (err) {
    console.log('Signup error:', err);
    res.status(500).send({ message: err.message });
  }
};

export async function signin(req, res) {
  try {
    const result = await AuthService.signin(req.body.email, req.body.password);
    req.session.token = result.token;
    res.status(200).send(result.user);
  } catch (err) {
    if (err.message === "User not found") {
      return res.status(404).send({ message: "User Not found." });
    }
    if (err.message === "Invalid password") {
      return res.status(401).send({ message: "Invalid Password!" });
    }
    res.status(500).send({ message: err.message });
  }
};

export async function signout(req, res) {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export async function changePassword(req, res) {
  try {
    await AuthService.changePassword(req.userId, req.body.oldPassword, req.body.password);
    res.status(200).send({ message: "Password changed successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export async function forgotPassword(req, res) {
  try {
    await AuthService.forgotPassword(req.body.email);
    res.status(200).send({ 
      message: "OTP đã được gửi đến email của bạn!" 
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export async function resetPassword(req, res) {
  try {
    const { email, password } = req.body;
    await AuthService.resetPassword(email, password);
    res.status(200).send({ 
      message: "Mật khẩu đã được đặt lại thành công!" 
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;
    await AuthService.verifyOTP(email, otp);
    res.status(200).send({ 
      message: "OTP hợp lệ!",
      verified: true 
    });
  } catch (err) {
    res.status(400).send({ 
      message: err.message,
      verified: false 
    });
  }
};

export async function googleLogin(req, res) {
  try {
    const { credential } = req.body;
    
    // Xác thực token Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    
    // Tìm user theo email từ Google
    let user = await User.findOne({ email: payload.email });
    
    // Nếu user chưa tồn tại, tạo mới
    if (!user) {
      try {
        // Tìm role mặc định (user)
        const role = await Role.findOne({ name: "user" });
        if (!role) {
          throw new Error("Role 'user' không tồn tại trong hệ thống");
        }

        // Tạo user mới
        user = await User.create({
          email: payload.email,
          fullname: payload.name,
          password: Math.random().toString(36).slice(-8), // Tạo mật khẩu ngẫu nhiên
          roles: [role._id],
          googleId: payload.sub,
          active: true
        });

        console.log('Đã tạo user mới từ Google:', user.email);
      } catch (createError) {
        console.error('Lỗi khi tạo user mới:', createError);
        return res.status(500).json({ 
          message: "Không thể tạo tài khoản mới",
          error: createError.message 
        });
      }
    }

    // Kiểm tra trạng thái active của user
    if (!user.active) {
      return res.status(403).json({ 
        message: "Tài khoản đã bị khóa. Vui lòng liên hệ admin." 
      });
    }

    // Tạo JWT token
    const token = sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: 86400 } // 24 giờ
    );

    // Lưu token vào cookie
    res.cookie('fastfood-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 giờ
    });

    // Trả về thông tin user
    res.status(200).json({
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      roles: user.roles.map(role => `ROLE_${role.name.toUpperCase()}`),
      message: user.googleId ? "Đăng nhập thành công" : "Tài khoản mới đã được tạo"
    });

  } catch (error) {
    console.error('Lỗi đăng nhập Google:', error);
    res.status(500).json({ 
      message: "Đăng nhập thất bại",
      error: error.message 
    });
  }
}