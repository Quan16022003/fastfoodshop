const AuthService = require("../services/auth.service");

const signup = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    await AuthService.signup(req.body);
    res.send({ message: "User was registered successfully!" });
  } catch (err) {
    console.log('Signup error:', err);
    res.status(500).send({ message: err.message });
  }
};

const signin = async (req, res) => {
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

const signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    await AuthService.changePassword(req.userId, req.body.oldPassword, req.body.password);
    res.status(200).send({ message: "Password changed successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    await AuthService.forgotPassword(req.body.email);
    res.status(200).send({ 
      message: "OTP đã được gửi đến email của bạn!" 
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const resetPassword = async (req, res) => {
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

const verifyOTP = async (req, res) => {
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

module.exports = {
  signup,
  signin,
  signout,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyOTP
};
