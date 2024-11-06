const CategoryService = require('../services/category.service');

// Tạo danh mục mới
exports.createCategory = async (req, res) => {
    try {
        const category = await CategoryService.createCategory(req.body);
        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Lấy danh sách danh mục có phân trang
exports.getAllCategories = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await CategoryService.getAllCategories(parseInt(page), parseInt(limit));
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Lấy chi tiết danh mục theo ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await CategoryService.getCategoryById(req.params.id);
        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// Cập nhật danh mục
exports.updateCategory = async (req, res) => {
    try {
        const category = await CategoryService.updateCategory(req.params.id, req.body);
        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Xóa mềm danh mục
exports.softDeleteCategory = async (req, res) => {
    try {
        await CategoryService.softDeleteCategory(req.params.id);
        res.status(200).json({
            success: true,
            message: "Danh mục đã được xóa thành công"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Khôi phục danh mục đã xóa
exports.restoreCategory = async (req, res) => {
    try {
        await CategoryService.restoreCategory(req.params.id);
        res.status(200).json({
            success: true,
            message: "Danh mục đã được khôi phục thành công"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Tìm kiếm danh mục
exports.searchCategories = async (req, res) => {
    try {
        const { keyword = "", page = 1, limit = 10 } = req.query;
        const result = await CategoryService.searchCategories(
            keyword,
            parseInt(page),
            parseInt(limit)
        );
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Lấy danh mục theo slug
exports.getCategoryBySlug = async (req, res) => {
    try {
        const category = await CategoryService.getCategoryBySlug(req.params.slug);
        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};
