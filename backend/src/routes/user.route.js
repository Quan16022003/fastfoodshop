import express from "express";
import { authJwt } from "../middlewares/index.js";
import { allAccess, userBoard, moderatorBoard, adminBoard, getUserInfo, changePassword, updateUserInfo } 
        from "../controllers/user.controller.js";

const router = express.Router();

// Middleware CORS cho tất cả các route
router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept, X-Requested-With, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Route công khai
router.get("/all", allAccess);

// Route yêu cầu xác thực
router.get("/user", [authJwt.verifyToken], userBoard);

// Route cho moderator
router.get(
  "/mod",
  [authJwt.verifyToken, authJwt.isModerator],
  moderatorBoard
);

// Route cho admin
router.get(
  "/admin",
  [authJwt.verifyToken, authJwt.isAdmin],
  adminBoard
);

router.get("/info", 
  [authJwt.verifyToken], 
  getUserInfo
);
router.put(
  '/change-password',
  [authJwt.verifyToken],
  changePassword
);
router.put(
  '/update',
  [authJwt.verifyToken],
  updateUserInfo
);

export default router;