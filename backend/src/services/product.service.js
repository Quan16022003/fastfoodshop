const db = require("../models");
const Product = db.product;

class ProductService {
  // Tạo sản phẩm mới
  async createProduct(productData) {
    try {
      const product = new Product(productData);
      await product.save();
      return product;
    } catch (error) {
      throw new Error(error.message || "Lỗi khi tạo sản phẩm");
    }
  }

  // Lấy tất cả sản phẩm (có phân trang)
  async getAllProducts(page = 1, limit = 10) {
    try {
      const products = await Product.find()
        .populate('category', 'name')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });
      
      const total = await Product.countDocuments();

      return {
        products,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      };
    } catch (error) {
      throw new Error(error.message || "Lỗi khi lấy danh sách sản phẩm");
    }
  }

  // Lấy chi tiết sản phẩm theo ID
  async getProductById(id) {
    try {
      const product = await Product.findById(id).populate('category', 'name');
      if (!product) {
        throw new Error("Không tìm thấy sản phẩm");
      }
      return product;
    } catch (error) {
      throw new Error(error.message || "Lỗi khi lấy thông tin sản phẩm");
    }
  }

  // Cập nhật sản phẩm
  async updateProduct(id, updateData) {
    try {
      const product = await Product.findById(id);
      if (!product) {
        throw new Error("Không tìm thấy sản phẩm");
      }

      Object.assign(product, updateData);
      await product.save();
      return product;
    } catch (error) {
      throw new Error(error.message || "Lỗi khi cập nhật sản phẩm");
    }
  }

  // Xóa mềm sản phẩm
  async softDeleteProduct(id) {
    try {
      const product = await Product.findById(id);
      if (!product) {
        throw new Error("Không tìm thấy sản phẩm");
      }

      await product.softDelete();
      return true;
    } catch (error) {
      throw new Error(error.message || "Lỗi khi xóa sản phẩm");
    }
  }

  // Khôi phục sản phẩm đã xóa mềm
  async restoreProduct(id) {
    try {
      const product = await Product.findById(id);
      if (!product) {
        throw new Error("Không tìm thấy sản phẩm");
      }

      await product.restore();
      return true;
    } catch (error) {
      throw new Error(error.message || "Lỗi khi khôi phục sản phẩm");
    }
  }

  // Tìm kiếm sản phẩm
  async searchProducts(keyword, page = 1, limit = 10) {
    try {
      const query = {
        isDeleted: false,
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } }
        ]
      };
      console.log(keyword);
      const products = await Product.find(query)
        .populate('category', 'name')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Product.countDocuments(query);

      return {
        products,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      };
    } catch (error) {
      throw new Error(error.message || "Lỗi khi tìm kiếm sản phẩm");
    }
  }

  // Lấy sản phẩm theo slug
  async getProductBySlug(slug) {
    try {
      const product = await Product.findOne({ slug }).populate('category', 'name');
      if (!product) {
        throw new Error("Không tìm thấy sản phẩm");
      }
      return product;
    } catch (error) {
      throw new Error(error.message || "Lỗi khi tìm kiếm sản phẩm theo slug");
    }
  }

  // Lấy sản phẩm theo danh mục
  async getProductsByCategory(categoryId, page = 1, limit = 10) {
    try {
      const products = await Product.find({ category: categoryId })
        .populate('category', 'name')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Product.countDocuments({ category: categoryId });

      return {
        products,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      };
    } catch (error) {
      throw new Error(error.message || "Lỗi khi lấy sản phẩm theo danh mục");
    }
  }
}

module.exports = new ProductService();
