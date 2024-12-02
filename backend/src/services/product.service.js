import db from "../models/index.js";
const { product: Product } = db;
import Result from '../utils/result.js';

class ProductService {
  // Helper method để xử lý phân trang và sắp xếp
  _getPaginationAndSort(page = 1, limit = 10, sort = 'createdAt', order = 'desc') {
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;
    const skip = (page - 1) * limit;
    return { sortOptions, skip, limit };
  }

  // Helper method để xử lý kết quả phân trang
  _getPaginatedResponse(products, total, page, limit) {
    return Result.Success({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  }

  // Tạo sản phẩm mới
  async createProduct(productData) {
    try {
      const product = new Product(productData);
      await product.save();
      return Result.Success(product);
    } catch (error) {
      return Result.Fail(error.message || "Lỗi khi tạo sản phẩm");
    }
  }

  // Lấy tất cả sản phẩm (có phân trang)
  async getAllProducts(page = 1, limit = 10, sort = 'createdAt', order = 'desc') {
    try {
      const { sortOptions, skip, limit: limitValue } = this._getPaginationAndSort(page, limit, sort, order);
      
      const [products, total] = await Promise.all([
        Product.find()
          .populate('category', 'name')
          .skip(skip)
          .limit(limitValue)
          .sort(sortOptions)
          .lean(),
        Product.countDocuments()
      ]);

      return this._getPaginatedResponse(products, total, page, limitValue);
    } catch (error) {
      return Result.Fail(error.message || "Lỗi khi lấy danh sách sản phẩm");
    }
  }

  // Lấy chi tiết sản phẩm theo ID
  async getProductById(id) {
    try {
      const product = await Product.findById(id).populate('category', 'name');
      if (!product) {
        return Result.Fail("Không tìm thấy sản phẩm");
      }
      return Result.Success(product);
    } catch (error) {
      return Result.Fail(error.message || "Lỗi khi lấy thông tin sản phẩm");
    }
  }

  // Cập nhật sản phẩm
  async updateProduct(id, updateData) {
    try {
      const product = await Product.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).populate('category', 'name');

      if (!product) {
        return Result.Fail("Không tìm thấy sản phẩm");
      }

      return Result.Success(product);
    } catch (error) {
      return Result.Fail(error.message || "Lỗi khi cập nhật sản phẩm");
    }
  }

  // Xóa mềm sản phẩm
  async softDeleteProduct(id) {
    try {
      const product = await Product.findById(id);
      if (!product) {
        return Result.Fail("Không tìm thấy sản phẩm");
      }

      await product.softDelete();
      return true;
    } catch (error) {
      return Result.Fail(error.message || "Lỗi khi xóa sản phẩm");
    }
  }

  // Khôi phục sản phẩm đã xóa mềm
  async restoreProduct(id) {
    try {
      const product = await Product.findById(id);
      if (!product) {
        return Result.Fail("Không tìm thấy sản phẩm");
      }

      await product.restore();
      return Result.Success(true);
    } catch (error) {
      return Result.Fail(error.message || "Lỗi khi khôi phục sản phẩm");
    }
  }

  // Tìm kiếm sản phẩm
  async searchProducts(keyword, page = 1, limit = 10, sort = 'createdAt', order = 'desc') {
    try {
      const { sortOptions, skip, limit: limitValue } = this._getPaginationAndSort(page, limit, sort, order);
      
      const query = {
        isDeleted: false,
        $or: [
          { name: { $regex: keyword?.trim(), $options: 'i' } },
          { description: { $regex: keyword?.trim(), $options: 'i' } }
        ]
      };

      const [products, total] = await Promise.all([
        Product.find(query)
          .populate('category', 'name')
          .skip(skip)
          .limit(limitValue)
          .sort(sortOptions)
          .lean(),
        Product.countDocuments(query)
      ]);

      return this._getPaginatedResponse(products, total, page, limitValue);
    } catch (error) {
      return Result.Fail(error.message || "Lỗi khi tìm kiếm sản phẩm");
    }
  }

  // Lấy sản phẩm theo slug
  async getProductBySlug(slug) {
    try {
      const product = await Product.findOne({ slug }).populate('category', 'name');
      if (!product) {
        return Result.Fail("Không tìm thấy sản phẩm");
      }
      return Result.Success(product);
    } catch (error) {
      return Result.Fail(error.message || "Lỗi khi tìm kiếm sản phẩm theo slug");
    }
  }

  // Lấy sản phẩm theo danh mục
  async getProductsByCategory(categoryId, page = 1, limit = 10, sort = 'createdAt', order = 'desc') {
    try {
      const sortOptions = {};
      sortOptions[sort] = order === 'desc' ? -1 : 1;

      const products = await Product.find({ category: categoryId })
        .populate('category', 'name')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sortOptions);

      const total = await Product.countDocuments({ category: categoryId });

      return {
        products,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      };
    } catch (error) {
      return Result.Fail(error.message || "Lỗi khi lấy sản phẩm theo danh mục");
    }
  }
}

export default new ProductService();
