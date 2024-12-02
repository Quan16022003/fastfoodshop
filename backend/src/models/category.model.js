import mongoose from "mongoose";
import slugify from "slugify";

// Hàm chuyển chuỗi tiếng Việt thành chuỗi không dấu
function removeVietnameseTones(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
        .replace(/đ/g, "d").replace(/Đ/g, "D") // Thay thế ký tự đặc biệt
        .replace(/[^a-zA-Z0-9 ]/g, '') // Xóa ký tự đặc biệt
        .trim();
}

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

categorySchema.pre('save', function(next) {
    // Kiểm tra nếu `name` thay đổi, tạo slug mới
    if (this.isModified('name')) {
        const nameWithoutTones = removeVietnameseTones(this.name);
        this.slug = slugify(nameWithoutTones, { lower: true, strict: true });
    }

    // Cập nhật timestamp
    if (this.isDeleted && !this.deletedAt) {
        this.deletedAt = Date.now();
    }
    this.updatedAt = Date.now();
    next();
});

categorySchema.methods.softDelete = function() {
    this.isDeleted = true;
    this.isActive = false;
    this.deletedAt = Date.now();
    return this.save();
};

categorySchema.methods.restore = function() {
    this.isDeleted = false;
    this.isActive = true;
    this.deletedAt = null;
    return this.save();
};

categorySchema.pre(/^find/, function(next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

export default mongoose.model("Category", categorySchema);