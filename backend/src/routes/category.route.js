import express from "express";
import { authJwt } from "../middlewares/index.js";
import { getAllCategories, searchCategories, getCategoryById, getCategoryBySlug, 
        createCategory, updateCategory, softDeleteCategory, restoreCategory } 
      from "../controllers/category.controller.js";

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

// Route công khai
router.get("/", getAllCategories);
router.get("/search", searchCategories);
router.get("/:id", getCategoryById);
router.get("/slug/:slug", getCategoryBySlug);

// Route yêu cầu xác thực Admin
router.post(
  "/",
  [authJwt.verifyToken, authJwt.isAdmin],
  createCategory
);

router.put(
  "/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  updateCategory
);

router.delete(
  "/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  softDeleteCategory
);

router.put(
  "/restore/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  restoreCategory
);

export default router;
