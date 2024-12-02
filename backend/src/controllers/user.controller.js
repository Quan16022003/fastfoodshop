import UserService from "../services/user.service.js";

export async function getUserInfo(req, res) {
  try {
    const userId = req.userId;
    const user = await UserService.getUserById(userId);
    res.status(200).send(user);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
}

export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    await UserService.changePassword(req.userId, currentPassword, newPassword);
    res.status(200).json({
      success: true,
      message: "Đổi mật khẩu thành công"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

export function allAccess(req, res) {
  res.status(200).send("Public Content.");
}

export function userBoard(req, res) {
  res.status(200).send("User Content.");
}

export function adminBoard(req, res) {
  res.status(200).send("Admin Content.");
}

export function moderatorBoard(req, res) {
  res.status(200).send("Moderator Content.");
}

export async function updateUserInfo(req, res) {
  try {
    const { fullname, phone, address } = req.body;
    const updatedUser = await UserService.updateUser(req.userId, {
      fullname,
      phone,
      address
    });
    
    res.status(200).json({
      success: true,
      message: "Cập nhật thông tin thành công",
      data: updatedUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}
