import ProductService from '../services/product.service.js';

// Tạo sản phẩm mới
export async function createProduct(req, res) {
    const result = await ProductService.createProduct(req.body);
    if (result.success) {
        res.status(201).json({
            success: true,
            data: result.data
        });
    } else {
        res.status(400).json({
            success: false,
            message: result.error
        });
    }
};

// Lấy danh sách sản phẩm có phân trang
export async function getAllProducts(req, res) {
    const { page = 1, limit = 8, sort = "createdAt", order = "desc" } = req.query;
    const result = await ProductService.getAllProducts(
        parseInt(page), parseInt(limit), sort, order
    );
    
    if (result.success) {
        res.status(200).json({
            success: true,
            data: result.data
        });
    } else {
        res.status(500).json({
            success: false,
            message: result.error
        });
    }
};

// Lấy chi tiết sản phẩm theo ID
export async function getProductById(req, res) {
    const result = await ProductService.getProductById(req.params.id);
    
    if (result.success) {
        res.status(200).json({
            success: true,
            data: result.data
        });
    } else {
        res.status(404).json({
            success: false,
            message: result.error
        });
    }
};

// Cập nhật sản phẩm
export async function updateProduct(req, res) {
    const result = await ProductService.updateProduct(req.params.id, req.body);
    
    if (result.success) {
        res.status(200).json({
            success: true,
            data: result.data
        });
    } else {
        res.status(400).json({
            success: false,
            message: result.error
        });
    }
};

// Xóa mềm sản phẩm
export async function softDeleteProduct(req, res) {
    const result = await ProductService.softDeleteProduct(req.params.id);
    
    if (result === true || result.success) {
        res.status(200).json({
            success: true,
            message: "Sản phẩm đã được xóa thành công"
        });
    } else {
        res.status(400).json({
            success: false,
            message: result.error
        });
    }
};

// Khôi phục sản phẩm đã xóa
export async function restoreProduct(req, res) {
    const result = await ProductService.restoreProduct(req.params.id);
    
    if (result.success) {
        res.status(200).json({
            success: true,
            message: "Sản phẩm đã được khôi phục thành công"
        });
    } else {
        res.status(400).json({
            success: false,
            message: result.error
        });
    }
};

// Tìm kiếm sản phẩm
export async function searchProducts(req, res) {
    const { keyword = "", page = 1, limit = 10 } = req.query;
    const result = await ProductService.searchProducts(
        keyword,
        parseInt(page),
        parseInt(limit)
    );
    
    if (result.success) {
        res.status(200).json({
            success: true,
            data: result.data
        });
    } else {
        res.status(500).json({
            success: false,
            message: result.error
        });
    }
};

// Lấy sản phẩm theo slug
export async function getProductBySlug(req, res) {
    const result = await ProductService.getProductBySlug(req.params.slug);
    
    if (result.success) {
        res.status(200).json({
            success: true,
            data: result.data
        });
    } else {
        res.status(404).json({
            success: false,
            message: result.error
        });
    }
};

// Lấy sản phẩm theo danh mục
export async function getProductsByCategory(req, res) {
    const { page = 1, limit = 10 } = req.query;
    const result = await ProductService.getProductsByCategory(
        req.params.categoryId,
        parseInt(page),
        parseInt(limit)
    );
    
    if (result.success) {
        res.status(200).json({
            success: true,
            data: result.data
        });
    } else {
        res.status(500).json({
            success: false,
            message: result.error
        });
    }
};
