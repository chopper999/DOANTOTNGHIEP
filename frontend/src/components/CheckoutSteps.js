import {React} from 'react';

function CheckoutSteps(props) {
    return <div className="row checkout-steps">
        <div className={props.step1 ? 'activeCK' : ''}>Đăng nhập</div>
        <div className={props.step2 ? 'activeCK' : ''}>Nhập địa chỉ</div>
        <div className={props.step3 ? 'activeCK' : ''}>Thanh toán</div>
        <div className={props.step4 ? 'activeCK' : ''}>Đặt hàng</div>
    </div>
}
export default CheckoutSteps;