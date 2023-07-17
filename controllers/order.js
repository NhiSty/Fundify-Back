const Order = require('../db/models/Order');

exports.createOrder = async (req, res) => {
  const {
    customerName,
    customerEmail,
    billingAddress,
    billingCity,
    billingZip,
    deliveryAddress,
    deliveryCity,
    deliveryZip,
    cart,
    totalAmount,
  } = req.body;

  try {
    const newOrder = await Order.create({
      customerName,
      customerEmail,
      billingAddress,
      billingCity,
      billingZip,
      deliveryAddress,
      deliveryCity,
      deliveryZip,
      cart,
      totalAmount,
    });

    const paymentUrl = `http://localhost:3000/payment/${newOrder.id}`;

    res.json({ newOrder, paymentUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }
};

exports.getOneOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByPk(id);

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const {
    customerName,
    customerEmail,
    billingAddress,
    billingCity,
    billingZip,
    deliveryAddress,
    deliveryCity,
    deliveryZip,
    cart,
    totalAmount,
  } = req.body;

  try {
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await order.update({
      customerName,
      customerEmail,
      billingAddress,
      billingCity,
      billingZip,
      deliveryAddress,
      deliveryCity,
      deliveryZip,
      cart,
      totalAmount,
    });

    return res.json({ message: 'Order updated' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err });
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await order.destroy();

    return res.json({ message: 'Order deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err });
  }
};
