import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from './../models/orderModel.js';
import { isAuth, isAdmin, payOrderEmailTemplate, mailGun } from '../util.js';

const orderRouter = express.Router();

orderRouter.get('/mine', isAuth, expressAsyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;
  const count = await Order.countDocuments({user: req.user._id});
  const orders  = await Order.find({user: req.user._id}).sort({_id: -1}).skip(pageSize*(page-1)).limit(pageSize);
  res.send({orders, page, pages: Math.ceil(count / pageSize) });
}));

//create order
orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (req.body.orderItems.length === 0) {
      res.status(404).send({ message: "Cart is empty" });
      
    }
    else{
        
        const order = new Order({
            orderItems: req.body.orderItems,
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            itemsPrice: req.body.itemsPrice,
            shippingPrice: req.body.shippingPrice,
            taxPrice: req.body.taxPrice, 
            totalPrice: req.body.totalPrice,
            user: req.user._id,

        });
        const createdOrder = await order.save();
        res.status(201).send({message: 'New Order Created', order: createdOrder});
    }
  })
);

orderRouter.get('/:id', isAuth, expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    res.send(order);
  } else {
    res.status(404).send({message: 'Order not found'});
  }
}));

orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'email name'
    );
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const updatedOrder = await order.save();
      mailGun()
      .messages()
      .send(
        {
          from: 'Chopper Shop <Chopper@mg.yourdomain.com>',
          to: `${order.user.name} <${order.user.email}>`,
          subject: `New order ${order._id}`,
          html: payOrderEmailTemplate(order),
        },
        (error, body) => {
          if (error) {
            console.log(error);
          } else {
            console.log(body);
          }
        }
      );
      res.send({message: 'Order Paid' , order: updatedOrder});
    } else{
      res.status(404).send({message: 'Order not found'});
    }

  })
);

//API get orderlist
orderRouter.get('/', isAuth, isAdmin, expressAsyncHandler (async(req, res) => {
  const orders = await Order.find({}).populate('user', 'name');
  res.send({orders});
})    
);

//API  delete orderlist
orderRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      const deleteOder = await order.remove();
      res.send({ message: "Order Deleted", order: deleteOder });
    } else {
      res.status(404).send({ message: "Order not found" });
    }
  })
);

//API for deliver 
orderRouter.put(
  '/:id/deliver',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updatedOrder = await order.save();
      res.send({message: 'Order Delivered' , order: updatedOrder});
    } else{
      res.status(404).send({message: 'Order not found'});
    }

  })
);

export default orderRouter; 