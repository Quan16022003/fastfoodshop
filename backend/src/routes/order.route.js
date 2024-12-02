import express from "express";
import { authJwt } from "../middlewares/index.js";
import { 
  createOrder, 
  getActiveOrders, 
  updateOrderStatus, 
  updatePaymentStatus,
  cancelOrder 
} from "../controllers/order.controller.js";

const router = express.Router();

// Middleware CORS
router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept, X-Requested-With, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// Routes cho nhân viên (yêu cầu xác thực)
router.post("/", [authJwt.verifyToken], createOrder);
router.get("/active", [authJwt.verifyToken], getActiveOrders);
router.put("/:id/status", [authJwt.verifyToken], updateOrderStatus);
router.put("/:id/payment", [authJwt.verifyToken], updatePaymentStatus);
router.put("/:id/cancel", [authJwt.verifyToken], cancelOrder);

export default router; 