import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../redux/slices/cartSlice';
import { PAYMENT_PROVIDERS } from '../utils/paymentSimulator';
import './PaymentPage.css';

const PaymentPage = () => {
    const { shippingAddress } = useSelector((state) => state.cart);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [paymentCategory, setPaymentCategory] = useState('mobile_money');
    const [selectedProvider, setSelectedProvider] = useState('');

    // Redirect if no shipping address
    if (!shippingAddress.residence) {
        navigate('/shipping');
    }

    const submitHandler = (e) => {
        e.preventDefault();

        if (!selectedProvider) {
            alert('Please select a payment method');
            return;
        }

        dispatch(savePaymentMethod({
            method: paymentCategory === 'mobile_money' ? 'Mobile Money' : 'Mobile Banking',
            provider: selectedProvider
        }));

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
                    <h1>Select Payment Method</h1>
                    <p className="payment-subtitle">Choose your preferred payment method</p>

                    <form onSubmit={submitHandler}>
                        {/* Payment Category Selection */}
                        <div className="payment-category">
                            <button
                                type="button"
                                className={`category-btn ${paymentCategory === 'mobile_money' ? 'active' : ''}`}
                                onClick={() => {
                                    setPaymentCategory('mobile_money');
                                    setSelectedProvider('');
                                }}
                            >
                                📱 Mobile Money
                            </button>
                            <button
                                type="button"
                                className={`category-btn ${paymentCategory === 'mobile_banking' ? 'active' : ''}`}
                                onClick={() => {
                                    setPaymentCategory('mobile_banking');
                                    setSelectedProvider('');
                                }}
                            >
                                🏦 Mobile Banking
                            </button>
                        </div>

                        {/* Mobile Money Options */}
                        {paymentCategory === 'mobile_money' && (
                            <div className="payment-options">
                                <h3>Mobile Money Providers</h3>
                                {Object.values(PAYMENT_PROVIDERS.MOBILE_MONEY).map((provider) => (
                                    <label key={provider.code} className="payment-option">
                                        <input
                                            type="radio"
                                            name="provider"
                                            value={provider.code}
                                            checked={selectedProvider === provider.code}
                                            onChange={(e) => setSelectedProvider(e.target.value)}
                                        />
                                        <div className="provider-card">
                                            <div className="provider-logo">{provider.logo}</div>
                                            <div className="provider-info">
                                                <h4>{provider.name}</h4>
                                                <p className="provider-instructions">{provider.instructions}</p>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}

                        {/* Mobile Banking Options */}
                        {paymentCategory === 'mobile_banking' && (
                            <div className="payment-options">
                                <h3>Mobile Banking Providers</h3>
                                {Object.values(PAYMENT_PROVIDERS.MOBILE_BANKING).map((provider) => (
                                    <label key={provider.code} className="payment-option">
                                        <input
                                            type="radio"
                                            name="provider"
                                            value={provider.code}
                                            checked={selectedProvider === provider.code}
                                            onChange={(e) => setSelectedProvider(e.target.value)}
                                        />
                                        <div className="provider-card">
                                            <div className="provider-logo">{provider.logo}</div>
                                            <div className="provider-info">
                                                <h4>{provider.name}</h4>
                                                <p className="provider-instructions">{provider.instructions}</p>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}

                        <div className="payment-notice">
                            <p>
                                <strong>Note:</strong> This is a simulated payment system for educational purposes.
                                No real money will be charged.
                            </p>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block">
                            Continue to Review Order
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;