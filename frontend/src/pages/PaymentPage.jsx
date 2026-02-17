import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../redux/slices/cartSlice';
import './CheckoutPages.css';

const PaymentPage = () => {
    const { shippingAddress } = useSelector((state) => state.cart);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [paymentMethod, setPaymentMethod] = useState('Credit Card');

    // Redirect if no shipping address
    if (!shippingAddress.street) {
        navigate('/shipping');
    }

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    };

    return (
        <div className="checkout-page">
            <div className="container">
                <div className="checkout-steps">
                    <div className="step completed">Shipping</div>
                    <div className="step active">Payment</div>
                    <div className="step">Place Order</div>
                </div>

                <div className="checkout-card">
                    <h1>Payment Method</h1>

                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    value="Credit Card"
                                    checked={paymentMethod === 'Credit Card'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span>Credit Card</span>
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    value="PayPal"
                                    checked={paymentMethod === 'PayPal'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span>PayPal</span>
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    value="Cash on Delivery"
                                    checked={paymentMethod === 'Cash on Delivery'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span>Cash on Delivery</span>
                            </label>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block">
                            Continue
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;