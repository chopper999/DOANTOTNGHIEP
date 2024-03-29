import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { detailsOrder, payOrder, deliverOrder } from '../actions/orderAction';
import { useState } from 'react';
import Axios from 'axios';
import {PayPalButton} from 'react-paypal-button-v2';
import { ORDER_PAY_RESET } from '../constants/orderConstants';
import { ORDER_DELIVER_RESET } from './../constants/orderConstants';
import { Button } from 'semantic-ui-react';

export default function OrderScreen(props) {
  const orderId = props.match.params.id; //lay id tu url
  const [sdkReady, setSdkReady] = useState(false);
  const orderDetails = useSelector((state) => state.orderDetails);
  const {order, loading, error} = orderDetails;

  //lay userInfo de xac nhan thanh toan
  const userSignin = useSelector((state)=> state.userSignin);
  const {userInfo} = userSignin;

  const orderPay = useSelector((state) => state.orderPay);
  const {loading:loadingPay, error: errorPay, success: successPay} = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const {loading:loadingDeliver, error: errorDeliver, success: successDeliver} = orderDeliver;

  const dispatch = useDispatch();


  useEffect(() => {

    const addPayPalScript = async ()=> {
      const {data} = await Axios.get('/api/config/paypal'); //data chua client id
      const script = document.createElement('script');
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };
    if (!order || successPay || successDeliver || (order && order._id !== orderId)){
      dispatch({type: ORDER_PAY_RESET});
      dispatch({type: ORDER_DELIVER_RESET});
      dispatch(detailsOrder(orderId));
    } else{
      if (!order.isPaid) {
        if (!window.paypal) { //neu chua load paypal len 
          addPayPalScript(); 
        }
        else{
          setSdkReady(true);
        }
      }
    }
    
  }, [dispatch,order, orderId, sdkReady, successPay, successDeliver]); //khi cac tham so trong mang thay doi, ham useEffect run
  

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(order, paymentResult));
  };

  const deliverHandler = ()=>{
    dispatch(deliverOrder(order._id));
  };


  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <h1 className="nameOrder">Đơn hàng {order._id}</h1>
      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className="card-placeorder card-body-placeorder">
                <h2>Shipping</h2>
                <p>
                  <strong>Tên:</strong> {order.shippingAddress.fullName} <br />
                  <strong>Địa chỉ: </strong> {order.shippingAddress.address},
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode},
                  {order.shippingAddress.country}
                </p>
                {order.isDelivered ? (
                  <MessageBox variant="success">
                    Chuyển phát vào ngày {order.deliveredAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Chưa chuyển phát</MessageBox>
                )}
              </div>
            </li>
            <li>
              <div className="card-placeorder card-body-placeorder">
                <h2>Thanh toán</h2>
                <p>
                  <strong>Phương thức:</strong> {order.paymentMethod}
                </p>
                {order.isPaid ? (
                  <MessageBox variant="success">
                    Thanh toán vào ngày {order.paidAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Chưa thanh toán</MessageBox>
                )}
              </div>
            </li>
            <li>
              <div className="card-placeorder card-body-placeorder">
                <h2>Sản phẩm</h2>
                <ul>
                  {order.orderItems.map(item => (
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
                          {item.qty} x {item.price} VNĐ = {item.qty * item.price} VNĐ
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
                <h2 className="textLb">Chi phí đơn hàng</h2>
              </li>
              <li>
                <div className="row">
                  <div>Tiền sản phẩm</div>
                  <div>{order.itemsPrice.toFixed(0)} VNĐ</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Tiền Ship</div>
                  <div>{order.shippingPrice.toFixed(0)} VNĐ</div>
                </div>
              </li>
              {/* <li>
                <div className="row">
                  <div>Tax</div>
                  <div>${order.taxPrice.toFixed(2)}</div>
                </div>
              </li> */}
              <li>
                <div className="row">
                  <div>
                    <strong> Tổng thanh toán</strong>
                  </div>
                  <div>
                    <strong>{order.totalPrice.toFixed(0)} VNĐ</strong>
                  </div>
                </div>
              </li>
              {!order.isPaid && (
                <li>
                  {!sdkReady ? (
                    <LoadingBox></LoadingBox>
                  ) : (
                    <>
                      {errorPay && (
                        <MessageBox variant="danger">{errorPay}</MessageBox>
                      )}
                      {loadingPay && <LoadingBox></LoadingBox>}
                      <PayPalButton
                        amount={order.totalPrice}
                        onSuccess={successPaymentHandler}
                      ></PayPalButton>
                      </>
                  )}
                </li>
              )}
              {userInfo.isAdmin && order.isPaid && !order.isDelivered &&( //neu da thanh toan va chua xac nhan giao hang thi hien thi nut deliver
                <li>
                  {loadingDeliver && <LoadingBox></LoadingBox>}
                  {errorDeliver && <MessageBox variant="danger">{errorDeliver}</MessageBox>}
                  <Button
                  color="red"
                  type="button"
                  onClick={deliverHandler}
                  className="block"
                >
                  Deliver Order
                </Button>
                </li>
              )}           

            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}