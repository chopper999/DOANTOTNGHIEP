import {React} from 'react';

function CheckoutSteps(props) {
    return <div className="row checkout-steps">
        <div className={props.step1 ? 'activeCK' : ''}>Sign In</div>
        <div className={props.step2 ? 'activeCK' : ''}>Shipping</div>
        <div className={props.step3 ? 'activeCK' : ''}>Payment</div>
        <div className={props.step4 ? 'activeCK' : ''}>Place Order</div>
    </div>
}
export default CheckoutSteps;