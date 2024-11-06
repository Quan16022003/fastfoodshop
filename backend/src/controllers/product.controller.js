const ProductService = require('../services/product.service');

// Tạo sản phẩm mới
exports.createProduct = async (req, res) => {
    try {
        const product = await ProductService.createProduct(req.body);
        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Lấy danh sách sản phẩm có phân trang
exports.getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await ProductService.getAllProducts(parseInt(page), parseInt(limit));
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

// Lấy chi tiết sản phẩm theo ID
exports.getProductById = async (req, res) => {
    try {
        const product = await ProductService.getProductById(req.params.id);
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
    try {
        const product = await ProductService.updateProduct(req.params.id, req.body);
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Xóa mềm sản phẩm
exports.softDeleteProduct = async (req, res) => {
    try {
        await ProductService.softDeleteProduct(req.params.id);
        res.status(200).json({
            success: true,
            message: "Sản phẩm đã được xóa thành công"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Khôi phục sản phẩm đã xóa
exports.restoreProduct = async (req, res) => {
    try {
        await ProductService.restoreProduct(req.params.id);
        res.status(200).json({
            success: true,
            message: "Sản phẩm đã được khôi phục thành công"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Tìm kiếm sản phẩm
exports.searchProducts = async (req, res) => {
    try {
        const { keyword = "", page = 1, limit = 10 } = req.query;
        const result = await ProductService.searchProducts(
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

// Lấy sản phẩm theo slug
exports.getProductBySlug = async (req, res) => {
    try {
        const product = await ProductService.getProductBySlug(req.params.slug);
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// Lấy sản phẩm theo danh mục
exports.getProductsByCategory = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await ProductService.getProductsByCategory(
            req.params.categoryId,
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
