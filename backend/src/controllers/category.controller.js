import CategoryService from '../services/category.service.js';

// Tạo danh mục mới
export async function createCategory(req, res) {
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
}

// Lấy danh sách danh mục có phân trang
export async function getAllCategories(req, res) {
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
}

// Lấy chi tiết danh mục theo ID
export async function getCategoryById(req, res) {
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
}

// Cập nhật danh mục
export async function updateCategory(req, res) {
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
}

// Xóa mềm danh mục
export async function softDeleteCategory(req, res) {
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
}

// Khôi phục danh mục đã xóa
export async function restoreCategory(req, res) {
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
}

// Tìm kiếm danh mục
export async function searchCategories(req, res) {
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
}

// Lấy danh mục theo slug
export async function getCategoryBySlug(req, res) {
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
}
