import express from "express";
import { authJwt } from "../middlewares/index.js";
import { getAllProducts, searchProducts, getProductsByCategory,
        getProductBySlug, getProductById, createProduct, updateProduct, 
        softDeleteProduct, restoreProduct } 
        from "../controllers/product.controller.js";

const router = express.Router();

// Middleware CORS cho tất cả các route
router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept, X-Requested-With, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// Route công khai - không cần xác thực
router.get("/", getAllProducts);
router.get("/search", searchProducts);
router.get("/category/:categoryId", getProductsByCategory);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);

// Route yêu cầu xác thực Admin
router.post(
  "/",
  [authJwt.verifyToken, authJwt.isAdmin],
  createProduct
);

router.put(
  "/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  updateProduct
);

router.delete(
  "/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  softDeleteProduct
);

router.put(
  "/restore/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  restoreProduct
);

export default router;
