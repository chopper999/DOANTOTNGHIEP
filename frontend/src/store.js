import { createStore,compose, combineReducers, applyMiddleware  } from 'redux';
import thunk from 'redux-thunk'; 
import { productListReducer, productDetailReducer, productCreateReducer, productUpdateReducer, productDeleteReducer, productCategoryListReducer, productTopListReducer, productReviewCreateReducer } from './reducers/productReducers';
import {cartReducer} from './reducers/cartReducers';
import { userSigninReducer, userRegisterReducer, userDetailsReducer, userUpdateProfileReducer, userListReducer, userDeleteReducer, userUpdateReducer, authReducer, userAddressMapReducer } from './reducers/userReducers';
import { orderCreateReducer, orderDetailsReducer, orderPayReducer, orderMineListReducer, orderListReducer, orderDeleteReducer, orderDeliverReducer } from './reducers/orderReducer';
import { qandaCreateReducer, qandaListReducer, qandaDeleterReducer, qandaUpdateReducer, qandaDetailReducer, messReplyReducer, textToSpeechReducer, createNewQuestionReducer, listNewQuestionReducer, trainQuestionReducer } from './reducers/qandaReducers';



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
    userAuth: authReducer,
    productTopList: productTopListReducer,
    productReviewCreate: productReviewCreateReducer,
    userAddressMap: userAddressMapReducer,
    qandaList: qandaListReducer,
    qandaCreate: qandaCreateReducer,
    qandaUpdate: qandaUpdateReducer,
    qandaDelete: qandaDeleterReducer,
    qandaDetail: qandaDetailReducer,
    messReply: messReplyReducer,
    textToSpeechResult: textToSpeechReducer,
    newQuestion: createNewQuestionReducer,
    listQuestion: listNewQuestionReducer,
    questionTrain: trainQuestionReducer,
});
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;    //khai báo redux-dev-tool,
const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)));  //áp dụng middleware
export default store;