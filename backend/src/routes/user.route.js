const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
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
router.get("/all", controller.allAccess);

// Route yêu cầu xác thực
router.get("/user", [authJwt.verifyToken], controller.userBoard);

// Route cho moderator
router.get(
  "/mod",
  [authJwt.verifyToken, authJwt.isModerator],
  controller.moderatorBoard
);

// Route cho admin
router.get(
  "/admin",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.adminBoard
);

router.get("/info", [authJwt.verifyToken], controller.getUserInfo);

module.exports = router;