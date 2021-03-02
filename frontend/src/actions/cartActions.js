import Axios from "axios";
import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_PAYMENT_METHOD } from "../constants/cartConstants";
import { CART_SAVE_SHIPPING_ADDRESS } from './../constants/cartConstants';


const addToCart = (productId, qty) => async (dispatch, getState) => {
    try {
        const {data} = await Axios.get("/api/products/" + productId);   
        dispatch({
            type: CART_ADD_ITEM, payload:{
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            qty
        }
    });
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
    } catch (error) {
    
    }
};
const removeFromCart = (productId) => (dispatch, getState) => {
    dispatch ({type: CART_REMOVE_ITEM, payload: productId});
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

const saveShippingAddress = (data) => (dispatch) => {
    dispatch({type: CART_SAVE_SHIPPING_ADDRESS, payload: data});
    localStorage.setItem('shippingAddress', JSON.stringify(data));
}
const savePaymentMethod = (data) => (dispatch) => {
    dispatch({type: CART_SAVE_PAYMENT_METHOD, payload: data});
}

export { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod }