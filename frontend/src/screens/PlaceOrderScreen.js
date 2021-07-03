import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from './../actions/orderAction';
import { useEffect } from 'react';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import LoadingBox from './../components/LoadingBox';
import MessageBox from './../components/MessageBox';
import { Button } from 'semantic-ui-react';
export default function PlaceOrderScreen(props) {
  const cart = useSelector((state) => state.cart);
  if (!cart.paymentMethod) {
    props.history.push('/payment');
  }

  const orderCreate = useSelector(state => state.orderCreate);
  const {loading, success, error, order} = orderCreate;
  const toPrice = (num) => Number(num.toFixed(2)); //lm tron 2 so thap phan
  cart.itemsPrice = toPrice(
    cart.cartItems.reduce((a, c) => a + c.qty * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 500000 ? toPrice(0) : toPrice(30000); //free ship khi tong tien lon hon 100
  cart.taxPrice = toPrice(0 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;
  const dispatch = useDispatch();
  const placeOrderHandler = () => {
    dispatch(createOrder({...cart, orderItems: cart.cartItems}));
  };

  useEffect(() => {
    if (success) {
      //order duoc tao thanh cong
      props.history.push(`/order/${order._id}`); //chuyen den order
      dispatch({ type: ORDER_CREATE_RESET }); // reset order
    }
  }, [dispatch, order, props.history, success]);

  return (
    <div className="containerCart">
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className=" card-placeorder card-body-placeorder">
                <h2>Shipping</h2>
                <p>
                  <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                  <strong>Address: </strong> {cart.shippingAddress.address},
                  {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}
                  ,{cart.shippingAddress.country}
                </p>
              </div>
            </li>
            <li>
              <div className="card-placeorder card-body-placeorder">
                <h2>Payment</h2>
                <p>
                  <strong>Method:</strong> {cart.paymentMethod}
                </p>
              </div>
            </li>
            <li>
              <div className="card-placeorder card-body-placeorder">
                <h2>Order Items</h2>
                <ul>
                  {cart.cartItems.map((item) => (
                    <li key={item.product}>
                      <div className="row">
                        <div>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="small"
                          ></img>
                        </div>
                        <div className="min-30">
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </div>

                        <div>
                          {item.qty} x {item.price} VNĐ= {item.qty * item.price} VNĐ
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-1 ml-30">
          <div className="card card-body">
            <ul>
              <li>
                <h2 className="textLb">Order Summary</h2>
              </li>
              <li>
                <div className="row">
                  <div>Items</div>
                  <div>{cart.itemsPrice.toFixed(0)} VNĐ</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Shipping</div>
                  <div>{cart.shippingPrice.toFixed(0)} VNĐ</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Tax</div>
                  <div>{cart.taxPrice.toFixed(0)} VNĐ</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>
                    <strong> Order Total</strong>
                  </div>
                  <div>
                    <strong>{cart.totalPrice.toFixed(0)} VNĐ</strong>
                  </div>
                </div>
              </li>
              <li>
                <Button
                  color="red"
                  type="button"
                  onClick={placeOrderHandler}
                  className="block"
                  disabled={cart.cartItems.length === 0}
                >
                  Place Order
                </Button>
              </li>
              {
                loading && <LoadingBox></LoadingBox>
              }
              {
                error && <MessageBox variant = "danger">{error}</MessageBox>
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}