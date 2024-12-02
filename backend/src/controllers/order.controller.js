import OrderService from '../services/order.service.js';

// Tạo đơn hàng mới
export async function createOrder(req, res) {
  const result = await OrderService.createOrder(req.userId, req.body);
  
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
}

// Lấy danh sách đơn hàng đang hoạt động
export async function getActiveOrders(req, res) {
  const result = await OrderService.getActiveOrders();
  
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
}

// Cập nhật trạng thái đơn hàng
export async function updateOrderStatus(req, res) {
  const result = await OrderService.updateOrderStatus(
    req.params.id,
    req.body.status
  );
  
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
}

// Cập nhật trạng thái thanh toán
export async function updatePaymentStatus(req, res) {
  const result = await OrderService.updatePaymentStatus(req.params.id);
  
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
}

// Hủy đơn hàng
export async function cancelOrder(req, res) {
  const result = await OrderService.cancelOrder(req.params.id);
  
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
} 