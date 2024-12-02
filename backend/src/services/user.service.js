import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

class UserService {
  // Tạo người dùng mới
  async createUser(userData) {
    try {
      // Kiểm tra email tồn tại
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error("Email đã được sử dụng");
      }

      // Hash mật khẩu
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);

      // Tạo tokens
      const accessToken = jwt.sign(
        { id: userData._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      const refreshToken = jwt.sign(
        { id: userData._id },
        process.env.JWT_REFRESH_SECRET_KEY
      );

      userData.accessToken = accessToken;
      userData.refreshToken = refreshToken;

      const newUser = await User.create(userData);
      return newUser;
    } catch (error) {
      throw new Error(error.message || "Không thể tạo người dùng mới");
    }
  }

  // Lấy thông tin người dùng theo ID
  async getUserById(userId) {
    try {
      const user = await User.findById(userId).select("-password");
      if (!user) {
        throw new Error("Không tìm thấy người dùng");
      }
      return user;
    } catch (error) {
      throw new Error(error.message || "Lỗi khi lấy thông tin người dùng");
    }
  }

  // Cập nhật thông tin người dùng
  async updateUser(userId, updateData) {
    try {
      // Kiểm tra số điện thoại hợp lệ
      if (updateData.phone && !/^\d{10}$/.test(updateData.phone)) {
        throw new Error("Số điện thoại không hợp lệ");
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select("-password");

      if (!user) {
        throw new Error("Không tìm thấy người dùng");
      }

      return user;
    } catch (error) {
      throw new Error(error.message || "Lỗi khi cập nhật thông tin người dùng");
    }
  }

  // Xóa người dùng
  async deleteUser(userId) {
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        throw new Error("Không tìm thấy người dùng");
      }
      return { message: "Xóa người dùng thành công" };
    } catch (error) {
      throw new Error(error.message || "Lỗi khi xóa người dùng");
    }
  }

  // Lấy danh sách người dùng có phân trang
  async getAllUsers(page = 1, limit = 10, search = "") {
    try {
      const query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ];
      }

      const skip = (page - 1) * limit;
      
      const [users, total] = await Promise.all([
        User.find(query)
          .select("-password")
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        User.countDocuments(query)
      ]);

      return {
        users,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(error.message || "Lỗi khi lấy danh sách người dùng");
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId).select('+password');
      if (!user) {
        throw new Error("Không tìm thấy người dùng");
      }

      // Kiểm tra mật khẩu hiện tại
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        throw new Error("Mật khẩu hiện tại không chính xác");
      }

      // Hash mật khẩu mới
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      return true;
    } catch (error) {
      throw new Error(error.message || "Lỗi khi đổi mật khẩu");
    }
  }
}

export default new UserService();
