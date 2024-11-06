const { authJwt } = require("../middlewares");
const controller = require("../controllers/category.controller");
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

// Route công khai
router.get("/", controller.getAllCategories);
router.get("/search", controller.searchCategories);
router.get("/:id", controller.getCategoryById);
router.get("/slug/:slug", controller.getCategoryBySlug);

// Route yêu cầu xác thực Admin
router.post(
  "/",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.createCategory
);

router.put(
  "/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.updateCategory
);

router.delete(
  "/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.softDeleteCategory
);

router.put(
  "/restore/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.restoreCategory
);

module.exports = router;
