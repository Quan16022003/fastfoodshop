const { authJwt } = require("../middlewares");
const controller = require("../controllers/product.controller");
const router = require('express').Router();

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
router.get("/", controller.getAllProducts);
router.get("/search", controller.searchProducts);
router.get("/category/:categoryId", controller.getProductsByCategory);
router.get("/slug/:slug", controller.getProductBySlug);
router.get("/:id", controller.getProductById);

// Route yêu cầu xác thực Admin
router.post(
  "/",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.createProduct
);

router.put(
  "/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.updateProduct
);

router.delete(
  "/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.softDeleteProduct
);

router.put(
  "/restore/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.restoreProduct
);

module.exports = router;
