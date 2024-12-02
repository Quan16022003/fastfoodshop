import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    fullname: {
      type: String,
      required: [true, "Fullname là bắt buộc"],
    },
    email: {
      type: String,
      required: [true, "Email là bắt buộc"],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email không hợp lệ"]
    },
    password: {
      type: String,
      required: [true, "Password là bắt buộc"],
      minlength: [6, "Password phải có ít nhất 6 ký tự"]
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true
    },
    roles: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }],
    active: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

userSchema.methods.changePassword = async function(oldPassword, newPassword) {
    const isMatch = await bcrypt.compare(oldPassword, this.password);
    if (!isMatch) {
        throw new Error('Mật khẩu cũ không chính xác');
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(newPassword, salt);
    await this.save();
    return true;
};

const User = mongoose.model("User", userSchema);
export default User;