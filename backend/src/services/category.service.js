import db from "../models/index.js";
const Category = db.category;

class CategoryService {
  // Tạo danh mục mới
  async createCategory(categoryData) {
    try {
      const category = new Category({
        name: categoryData.name,
        description: categoryData.description,
      });

      await category.save();
      return category;
    } catch (error) {
      throw new Error(error.message || "Lỗi khi tạo danh mục");
    }
  }

  // Lấy tất cả danh mục (có phân trang)
  async getAllCategories(page = 1, limit = 10) {
    try {
      const categories = await Category.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });
      
      const total = await Category.countDocuments();

      return {
        categories,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      };
    } catch (error) {
      throw new Error(error.message || "Lỗi khi lấy danh sách danh mục");
    }
  }

  // Lấy chi tiết danh mục theo ID
  async getCategoryById(id) {
    try {
      const category = await Category.findById(id);
      if (!category) {
        throw new Error("Không tìm thấy danh mục");
      }
      return category;
    } catch (error) {
      throw new Error(error.message || "Lỗi khi lấy thông tin danh mục");
    }
  }

  // Cập nhật danh mục
  async updateCategory(id, updateData) {
    try {
      const category = await Category.findById(id);
      if (!category) {
        throw new Error("Không tìm thấy danh mục");
      }

      Object.assign(category, updateData);
      await category.save();
      return category;
    } catch (error) {
      throw new Error(error.message || "Lỗi khi cập nhật danh mục");
    }
  }

  // Xóa mềm danh mục
  async softDeleteCategory(id) {
    try {
      const category = await Category.findById(id);
      if (!category) {
        throw new Error("Không tìm thấy danh mục");
      }

      await category.softDelete();
      return true;
    } catch (error) {
      throw new Error(error.message || "Lỗi khi xóa danh mục");
    }
  }

  // Khôi phục danh mục đã xóa mềm
  async restoreCategory(id) {
    try {
      const category = await Category.findById(id);
      if (!category) {
        throw new Error("Không tìm thấy danh mục");
      }

      await category.restore();
      return true;
    } catch (error) {
      throw new Error(error.message || "Lỗi khi khôi phục danh mục");
    }
  }

  // Tìm kiếm danh mục theo tên
  async searchCategories(keyword, page = 1, limit = 10) {
    try {
      const query = {
        name: { $regex: keyword, $options: 'i' }
      };

      const categories = await Category.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Category.countDocuments(query);

      return {
        categories,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      };
    } catch (error) {
      throw new Error(error.message || "Lỗi khi tìm kiếm danh mục");
    }
  }

  // Tìm kiếm danh mục theo slug
  async getCategoryBySlug(slug) {
    try {
      const category = await Category.findOne({ slug });
      if (!category) {
        throw new Error("Không tìm thấy danh mục");
      }
      return category;
    } catch (error) {
      throw new Error(error.message || "Lỗi khi tìm kiếm danh mục theo slug");
    }
  }
}

export default new CategoryService();
