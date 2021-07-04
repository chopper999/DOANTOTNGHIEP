import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';
import { Button } from 'semantic-ui-react';

export default function PaymentMethodScreen(props) {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  if (!shippingAddress.address) {
    props.history.push('/shipping');
  }
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    props.history.push('/placeorder');
  };
  return (
    <div className="containerCart">
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1 className="centerText">Chọn phương thức thanh toán</h1>
        </div>
        <div>
          <div className="centerItem">
            <input
              className="radioBt"
              type="radio"
              id="paypal"
              value="PayPal"
              name="paymentMethod"
              required
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></input>
            <label className="namePayMethod" htmlFor="paypal">PayPal</label>
            <label className="textWhite">--------------------------</label>
            <input
              className="radioBt"
              type="radio"
              id="stripe"
              value="Stripe"
              name="paymentMethod"
              required
              disabled
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></input>
            <label className="namePayMethod" htmlFor="stripe">Stripe</label>
          </div>
        </div>
        <div>
          <label />
          <Button
                  color="red"
                  type="submit"
                  className="block"
                >
                  Tiếp tục
                </Button>
        </div>
      </form>
    </div>
  );
}