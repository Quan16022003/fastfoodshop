import db from "../models/index.js";
import Result from '../utils/result.js';

const { order: Order, product: Product } = db;

class OrderService {
  // Tạo đơn hàng mới
  async createOrder(userId, orderData) {
    try {
      // Tính tổng tiền và validate số lượng sản phẩm
      let totalAmount = 0;
      const orderItems = [];

      for (const item of orderData.items) {
        const product = await Product.findById(item.product);
        if (!product) {
          return Result.Fail(`Sản phẩm không tồn tại: ${item.product}`);
        }

        orderItems.push({
          product: item.product,
          quantity: item.quantity,
          price: product.price,
          note: item.note || ''
        });

        totalAmount += product.price * item.quantity;
      }

      const order = new Order({
        user: userId,
        tableNumber: orderData.tableNumber,
        items: orderItems,
        totalAmount,
        note: orderData.note || ''
      });

      await order.save();
      return Result.Success(order);
    } catch (error) {
      return Result.Fail(error.message);
    }
  }

  // Lấy danh sách đơn hàng đang hoạt động (chưa completed/cancelled)
  async getActiveOrders() {
    try {
      const orders = await Order.find({
        status: { $in: ['pending', 'preparing', 'ready'] }
      })
        .populate('items.product', 'name price image')
        .populate('user', 'email')
        .sort({ createdAt: -1 });

      return Result.Success(orders);
    } catch (error) {
      return Result.Fail(error.message);
    }
  }

  // Cập nhật trạng thái đơn hàng
  async updateOrderStatus(orderId, status) {
    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      ).populate('items.product', 'name price image');

      if (!order) {
        return Result.Fail("Không tìm thấy đơn hàng");
      }

      return Result.Success(order);
    } catch (error) {
      return Result.Fail(error.message);
    }
  }

  // Cập nhật trạng thái thanh toán
  async updatePaymentStatus(orderId) {
    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { 
          paymentStatus: 'paid',
          status: 'completed'
        },
        { new: true }
      );

      if (!order) {
        return Result.Fail("Không tìm thấy đơn hàng");
      }

      return Result.Success(order);
    } catch (error) {
      return Result.Fail(error.message);
    }
  }

  // Hủy đơn hàng
  async cancelOrder(orderId) {
    try {
      const order = await Order.findById(orderId);
      
      if (!order) {
        return Result.Fail("Không tìm thấy đơn hàng");
      }

      if (!['pending', 'preparing'].includes(order.status)) {
        return Result.Fail("Không thể hủy đơn hàng ở trạng thái này");
      }

      order.status = 'cancelled';
      await order.save();

      return Result.Success(order);
    } catch (error) {
      return Result.Fail(error.message);
    }
  }
}

export default new OrderService(); 