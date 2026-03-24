const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const PDFDocument = require('pdfkit');

exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) query.orderStatus = status;

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total,
        limit: Number(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments({ user: req.user.id });

    res.json({
      orders,
      pagination: {
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total,
        limit: Number(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, notes } = req.body;

    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${item.product.name}` 
        });
      }
    }

    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.price,
      image: item.product.images[0]
    }));

    const totalAmount = cart.totalAmount;
    const shippingCost = totalAmount >= 100 ? 0 : 50;
    const finalAmount = totalAmount + shippingCost;

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      notes,
      totalAmount,
      shippingCost,
      finalAmount
    });

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [] }
    );

    res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Order status updated',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.orderStatus !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel this order' });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.generateInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="invoice-${order.orderNumber}.pdf"`);
      res.send(pdfData);
    });

    // Header
    doc.fontSize(20).font('Helvetica-Bold').text('INVOICE', { align: 'center' });
    doc.moveDown();

    // Order Info
    doc.fontSize(12).font('Helvetica');
    doc.text(`Order Number: ${order.orderNumber}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.text(`Payment Method: ${order.paymentMethod.toUpperCase()}`);
    doc.text(`Payment Status: ${order.paymentStatus.toUpperCase()}`);
    doc.moveDown();

    // Customer Info
    doc.fontSize(14).font('Helvetica-Bold').text('Bill To:');
    doc.fontSize(12).font('Helvetica');
    doc.text(order.user.name);
    doc.text(order.shippingAddress.street);
    doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`);
    doc.text(order.shippingAddress.country);
    doc.text(`Phone: ${order.shippingAddress.phone}`);
    doc.moveDown();

    // Items Table Header
    doc.fontSize(14).font('Helvetica-Bold').text('Order Items:');
    doc.moveDown(0.5);

    const startY = doc.y;
    doc.fontSize(11).font('Helvetica-Bold');
    doc.text('Item', 50, startY, { width: 200 });
    doc.text('Qty', 280, startY, { width: 50, align: 'center' });
    doc.text('Price', 340, startY, { width: 80, align: 'right' });
    doc.text('Total', 440, startY, { width: 80, align: 'right' });

    doc.moveDown();
    doc.fontSize(11).font('Helvetica');

    let currentY = doc.y;

    // Items
    order.items.forEach(item => {
      doc.text(item.name, 50, currentY, { width: 220 });
      doc.text(item.quantity.toString(), 280, currentY, { width: 50, align: 'center' });
      doc.text(`Rs. ${item.price}`, 340, currentY, { width: 80, align: 'right' });
      doc.text(`Rs. ${item.price * item.quantity}`, 440, currentY, { width: 80, align: 'right' });
      currentY += 20;
    });

    doc.moveDown();
    doc.fontSize(12).font('Helvetica-Bold');

    // Totals
    doc.text(`Subtotal: Rs. ${order.totalAmount}`, { align: 'right' });
    doc.text(`Shipping: Rs. ${order.shippingCost}`, { align: 'right' });
    if (order.discount > 0) {
      doc.text(`Discount: -Rs. ${order.discount}`, { align: 'right' });
    }
    doc.fontSize(14).text(`Total: Rs. ${order.finalAmount}`, { align: 'right' });

    doc.moveDown(2);
    doc.fontSize(10).font('Helvetica').text('Thank you for your purchase!', { align: 'center' });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
