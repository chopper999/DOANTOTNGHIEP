import jwt from "jsonwebtoken";
import mg from "mailgun-js";
const generateToken = user => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET, //jwt_secret nhu la key de encrypt data va de tao token, nen duoc bao mat
    {
      expiresIn: "30d"
    }
  );
};


//add middleware to authorization 
const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization) {
      const token = authorization.slice(7, authorization.length); //Bo 'Bearer '
      jwt.verify(
        token,
        process.env.JWT_SECRET || 'somethingsecret',
        (err, decode) => {
          if (err) {
            res.status(401).send({ message: 'Invalid Token' });
          } else {
            req.user = decode;
            next();
          }
        }
      );
    } else {
      res.status(401).send({ message: 'No Token' });
    }
  };

  // middle ware isAdmin
const isAdmin = (req, res, next) => {     
  if (req.user && req.user.isAdmin) {
    next();
  }
  else {
    res.status(401).send({ message: "Admin Token is not valid" });
  }
  
};
const mailGun = () => mg({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});

const payOrderEmailTemplate = (order) => {
  return `<h1>Cảm ơn bạn đã mua hàng</h1>
  <p>
  Chào ${order.user.name},</p>
  <p>Chúng tôi đã xử lý xong đơn hàng của bạn</p>
  <h2>[Đơn hàng ${order._id}] (${order.createdAt.toString().substring(0, 10)})</h2>
  <table>
  <thead>
  <tr>
  <td><strong>Sản phẩm</strong></td>
  <td><strong>Số lượng</strong></td>
  <td><strong align="right">Giá</strong></td>
  </thead>
  <tbody>
  ${order.orderItems
    .map(
      (item) => `
    <tr>
    <td>${item.name}</td>
    <td align="center">${item.qty}</td>
    <td align="right"> ${item.price.toFixed(2)}$</td>
    </tr>
  `
    )
    .join('\n')}
  </tbody>
  <tfoot>
  <tr>
  <td colspan="2">Giá:</td>
  <td align="right"> $${order.itemsPrice.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2"></td>
  <td align="right"></td>
  </tr>
  <tr>
  <td colspan="2">Giá vận chuyển:</td>
  <td align="right"> ${order.shippingPrice.toFixed(2)}$</td>
  </tr>
  <tr>
  <td colspan="2"><strong>Tổng số tiền:</strong></td>
  <td align="right"><strong> ${order.totalPrice.toFixed(2)}$</strong></td>
  </tr>
  <tr>
  <td colspan="2">Phương thức thanh toán:</td>
  <td align="right">${order.paymentMethod}</td>
  </tr>
  </table>
  <h2>Địa chỉ nhận hàng</h2>
  <p>
  ${order.shippingAddress.fullName},<br/>
  ${order.shippingAddress.address},<br/>
  ${order.shippingAddress.city},<br/>
  ${order.shippingAddress.country},<br/>
  ${order.shippingAddress.postalCode}<br/>
  </p>
  <hr/>
  <p>
  Cảm ơn quý khách
  </p>
  `;
};
export { isAuth, isAdmin, generateToken, mailGun, payOrderEmailTemplate };

