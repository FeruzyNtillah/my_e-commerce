import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../redux/slices/orderSlice';
import { clearCart } from '../redux/slices/cartSlice';
import Message from '../components/Message';
import { toast } from 'react-toastify';
import './CheckoutPages.css';

const PlaceOrderPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart);
    const { order, loading, error, success } = useSelector((state) => state.orders);

    useEffect(() => {
        if (success && order) {
            dispatch(clearCart());
            navigate(`/order/${order._id}`);
        }
    }, [success, order, navigate, dispatch]);

    const placeOrderHandler = async () => {
        try {
            await dispatch(
                createOrder({
                    orderItems: cart.cartItems.map(item => ({
                        name: item.name,
                        quantity: item.quantity,
                        image: item.image,
                        price: item.price,
                        product: item.product
                    })),
                    shippingAddress: cart.shippingAddress,
                    paymentMethod: cart.paymentMethod,
                    itemsPrice: cart.itemsPrice,
                    shippingPrice: cart.shippingPrice,
                    taxPrice: cart.taxPrice,
                    totalPrice: cart.totalPrice
                })
            ).unwrap();
        } catch (err) {
            toast.error(err || 'Failed to place order');
        }
    };

    return (
        <div className="checkout-page">
            <div className="container">
                <div className="checkout-steps">
                    <div className="step completed">Shipping</div>
                    <div className="step completed">Payment</div>
                    <div className="step active">Place Order</div>
                </div>

                <div className="place-order-content">
                    <div className="order-review">
                        <div className="order-section">
                            <h2>Shipping</h2>
                            <p>
                                <strong>Address:</strong> {cart.shippingAddress.street},{' '}
                                {cart.shippingAddress.city}, {cart.shippingAddress.state}{' '}
                                {cart.shippingAddress.zipCode}, {cart.shippingAddress.country}
                            </p>
                        </div>

                        <div className="order-section">
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method:</strong> {cart.paymentMethod}
                            </p>
                        </div>

                        <div className="order-section">
                            <h2>Order Items</h2>
                            {cart.cartItems.length === 0 ? (
                                <Message variant="info">Your cart is empty</Message>
                            ) : (
                                <div className="order-items-list">
                                    {cart.cartItems.map((item) => (
                                        <div key={item.product} className="order-item">
                                            <img src={item.image} alt={item.name} />
                                            <div className="order-item-info">
                                                <h4>{item.name}</h4>
                                                <p>
                                                    {item.quantity} x ${item.price} = $
                                                    {(item.quantity * item.price).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="order-summary-card">
                        <h2>Order Summary</h2>

                        <div className="summary-row">
                            <span>Items:</span>
                            <span>${cart.itemsPrice}</span>
                        </div>

                        <div className="summary-row">
                            <span>Shipping:</span>
                            <span>${cart.shippingPrice}</span>
                        </div>

                        <div className="summary-row">
                            <span>Tax:</span>
                            <span>${cart.taxPrice}</span>
                        </div>

                        <div className="summary-total">
                            <span>Total:</span>
                            <span>${cart.totalPrice}</span>
                        </div>

                        {error && <Message variant="danger">{error}</Message>}

                        <button
                            type="button"
                            className="btn btn-primary btn-block"
                            disabled={cart.cartItems.length === 0 || loading}
                            onClick={placeOrderHandler}
                        >
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrderPage;