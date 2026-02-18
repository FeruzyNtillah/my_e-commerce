import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../redux/slices/cartSlice';
import './CheckoutPages.css';

const ShippingPage = () => {
    const { shippingAddress } = useSelector((state) => state.cart);

    const [address, setAddress] = useState({
        residence: shippingAddress.residence || '',
        district: shippingAddress.district || '',
        region: shippingAddress.region || '',
        country: shippingAddress.country || 'Tanzania',
        mobileNumber: shippingAddress.mobileNumber || ''
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
                    <h1>Delivery Details</h1>

                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label>Residence (Street/House Address)</label>
                            <input
                                type="text"
                                placeholder="Enter your street/house address"
                                value={address.residence}
                                onChange={(e) => setAddress({ ...address, residence: e.target.value })}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>District</label>
                            <input
                                type="text"
                                placeholder="Enter your district"
                                value={address.district}
                                onChange={(e) => setAddress({ ...address, district: e.target.value })}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Region</label>
                            <input
                                type="text"
                                placeholder="Enter your region"
                                value={address.region}
                                onChange={(e) => setAddress({ ...address, region: e.target.value })}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Country</label>
                            <input
                                type="text"
                                placeholder="Country"
                                value={address.country}
                                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                                className="form-control"
                                disabled
                            />
                        </div>

                        <div className="form-group">
                            <label>Mobile Number</label>
                            <input
                                type="tel"
                                placeholder="Enter your mobile number"
                                value={address.mobileNumber}
                                onChange={(e) => setAddress({ ...address, mobileNumber: e.target.value })}
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