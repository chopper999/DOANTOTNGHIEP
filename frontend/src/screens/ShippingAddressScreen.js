import React, {useState} from "react";
import {useSelector, useDispatch} from 'react-redux';
import {saveShippingAddress} from '../actions/cartActions';
import CheckoutSteps from "../components/CheckoutSteps";
import { Button} from 'semantic-ui-react'

function ShippingAddressScreen(props) {
    //Check if user sign in before enter shipping info 
  const userSignin = useSelector((state)=>state.userSignin);
  const {userInfo} =userSignin;


  if (!userInfo) {
      props.history.push('/signin');
  }

  //get info
  const cart = useSelector(state => state.cart);
  const {shippingAddress}= cart;


  const [fullName, setFullName] = useState(shippingAddress.fullName);
  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);

  const dispatch = useDispatch();
  const submitHandler = (e) => {
      e.preventDefault();   // to prevent freshing screen when user click this button
        dispatch(saveShippingAddress({fullName, address, city, postalCode, country}));
        props.history.push('payment'); //after save shipping address, direct to Payment
  };
  return (
    <div>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <form className="form containerForm" onSubmit={submitHandler}>
        <div>
          <h1 className="centerText">Nhập địa chỉ giao hàng</h1>
        </div>  
        <div>
          <label htmlFor="fullName">Họ và tên</label>
          <input
            type="text"
            id="fullName"
            placeholder="Nhập họ và tên"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="address">Địa chỉ</label>
          <input
            type="text"
            id="address"
            placeholder="Nhập địa chỉ"
            value={address}
            onChange={e => setAddress(e.target.value)}
            required
          ></input>
        </div>

        <div>
          <label htmlFor="city">Thành phố</label>
          <input
            type="text"
            id="city"
            placeholder="Nhập thành phố"
            value={city}
            onChange={e => setCity(e.target.value)}
            required
          ></input>
        </div>

        <div>
          <label htmlFor="postalCode">Postal Code</label>
          <input
            type="text"
            id="postalCode"
            placeholder="Nhập Postal Code"
            value={postalCode}
            onChange={e => setPostalCode(e.target.value)}
            required
          ></input>
        </div>

        <div>
          <label htmlFor="country">Quốc gia</label>
          <input
            type="text"
            id="country"
            placeholder="Nhập quốc gia"
            value={country}
            onChange={e => setCountry(e.target.value)}
            required
          ></input>
        </div>
        <div>
            <label/>
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
export default ShippingAddressScreen;
