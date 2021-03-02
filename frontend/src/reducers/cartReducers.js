import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_PAYMENT_METHOD } from "../constants/cartConstants";
import { CART_SAVE_SHIPPING_ADDRESS, CART_EMPTY } from './../constants/cartConstants';

export const cartReducer = (state = { cartItems: [] }, action) => {
    switch (action.type) {
      case CART_ADD_ITEM:
        const item = action.payload;
        const existItem = state.cartItems.find((x) => x.product === item.product);  
        if (existItem) {  //nếu mặt hàng đã có trong giỏ hàng, thay thế item mới cho item cũ
          return {
            ...state,
            cartItems: state.cartItems.map((x) => //sử dụng map để tìm item cần thay đổi, các item khác giữ nguyên
              x.product === existItem.product ? item : x // item là cái mới, x là cái cũ
            ),
            
          };
        } else {  // nếu item chưa tồn tại trong giỏ hàng
          return { ...state, cartItems: [...state.cartItems, item] }; // [...state.cartItems, item]: thêm item vào cartItem (concat)
        }
      case CART_REMOVE_ITEM:
        return {
          ...state,
          error: '',
          cartItems: state.cartItems.filter((x) => x.product !== action.payload), //giữ lại những item khác với payload(id) truyền vào
        };
      case CART_SAVE_SHIPPING_ADDRESS:
        return { ...state, shippingAddress: action.payload };
      case CART_SAVE_PAYMENT_METHOD:
        return { ...state, paymentMethod: action.payload };
      case CART_EMPTY:
        return {...state, cartItems: []};
      default:
        return state;
    }
  };