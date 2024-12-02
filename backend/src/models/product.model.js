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

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 1
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    size: {
        type: String,
        enum: ['S', 'M', 'L', 'XL', 'XXL'],
        required: true
    },
    image: {
        type: String,
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

productSchema.pre('save', function(next) {
    // Kiểm tra nếu `name` thay đổi, tạo slug mới
    if (this.isModified('name')) {
        const nameWithoutTones = removeVietnameseTones(this.name);
        this.slug = slugify(nameWithoutTones, { lower: true, strict: true });
    }

    this.updatedAt = Date.now();
    next();
});

productSchema.methods.softDelete = function() {
    this.isDeleted = true;
    this.isActive = false;
    this.deletedAt = Date.now();
    return this.save();
};

productSchema.methods.restore = function() {
    this.isDeleted = false;
    this.isActive = true;
    this.deletedAt = null;
    return this.save();
};

export default mongoose.model("Product", productSchema);