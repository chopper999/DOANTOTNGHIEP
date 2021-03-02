import { createStore,compose, combineReducers, applyMiddleware  } from 'redux';
import thunk from 'redux-thunk'; 
import { productListReducer, productDetailReducer, productCreateReducer, productUpdateReducer, productDeleteReducer, productCategoryListReducer } from './reducers/productReducers';
import {cartReducer} from './reducers/cartReducers';
import { userSigninReducer, userRegisterReducer, userDetailsReducer, userUpdateProfileReducer, userListReducer, userDeleteReducer, userUpdateReducer } from './reducers/userReducers';
import { orderCreateReducer, orderDetailsReducer, orderPayReducer, orderMineListReducer, orderListReducer, orderDeleteReducer, orderDeliverReducer } from './reducers/orderReducer';



const initialState = {
    userSignin: {
        userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null,
    },
    cart: {
        cartItems: localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [], 
        shippingAddress: localStorage.getItem('shippingAddress') 
        ? JSON.parse(localStorage.getItem('shippingAddress') )
        : {},
        paymentMethod: 'PayPal',
    },
    
};
const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailReducer,
    cart: cartReducer,
    userSignin: userSigninReducer,
    userRegister: userRegisterReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderMineList: orderMineListReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    productCreate: productCreateReducer,
    productUpdate: productUpdateReducer,
    productDelete: productDeleteReducer,
    orderList: orderListReducer,
    orderDelete: orderDeleteReducer,
    orderDeliver: orderDeliverReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userUpdate: userUpdateReducer,
    productCategoryList: productCategoryListReducer,
});
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;    //khai báo redux-dev-tool,
const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)));  //áp dụng middleware
export default store;