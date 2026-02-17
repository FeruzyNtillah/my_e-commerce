import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../redux/slices/cartSlice';
import './CheckoutPages.css';

const ShippingPage = () => {
    const { shippingAddress } = useSelector((state) => state.cart);

    const [address, setAddress] = useState({
        street: shippingAddress.street || '',
        city: shippingAddress.city || '',
        state: shippingAddress.state || '',
        zipCode: shippingAddress.zipCode || '',
        country: shippingAddress.country || ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress(address));
        navigate('/payment');
    };

    return (
        <div className="checkout-page">
            <div className="container">
                <div className="checkout-steps">
                    <div className="step active">Shipping</div>
                    <div className="step">Payment</div>
                    <div className="step">Place Order</div>
                </div>

                <div className="checkout-card">
                    <h1>Shipping Address</h1>

                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label>Street Address</label>
                            <input
                                type="text"
                                placeholder="Enter street address"
                                value={address.street}
                                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>City</label>
                            <input
                                type="text"
                                placeholder="Enter city"
                                value={address.city}
                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>State</label>
                                <input
                                    type="text"
                                    placeholder="Enter state"
                                    value={address.state}
                                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Zip Code</label>
                                <input
                                    type="text"
                                    placeholder="Enter zip code"
                                    value={address.zipCode}
                                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                                    className="form-control"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Country</label>
                            <input
                                type="text"
                                placeholder="Enter country"
                                value={address.country}
                                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                                className="form-control"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block">
                            Continue to Payment
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ShippingPage;