import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../redux/slices/orderSlice';
import { clearCart } from '../redux/slices/cartSlice';
import { getProviderDetails } from '../utils/paymentSimulator';
import PaymentModal from '../components/PaymentModal';
import Message from '../components/Message';
import { toast } from 'react-toastify';
import './CheckoutPages.css';

const PlaceOrderPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart);
    const { order, loading, error, success } = useSelector((state) => state.orders);

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [orderCreated, setOrderCreated] = useState(null);

    const providerDetails = getProviderDetails(cart.paymentProvider);

    useEffect(() => {
        if (success && order && orderCreated) {
            // Order created and paid successfully
            dispatch(clearCart());
            navigate(`/order/${order._id}`);
        }
    }, [success, order, navigate, dispatch, orderCreated]);

    const placeOrderHandler = async () => {
        try {
            // Create order first
            const result = await dispatch(
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

            setOrderCreated(result.order);

            // Show payment modal
            setShowPaymentModal(true);
        } catch (err) {
            toast.error(err || 'Failed to create order');
        }
    };

    const handlePaymentSuccess = async (paymentResult) => {
        toast.success('Payment successful!');
        setShowPaymentModal(false);

        // The order is already created, just redirect
        // In a real app, you would update the order payment status here
        setTimeout(() => {
            dispatch(clearCart());
            navigate(`/order/${orderCreated._id}`);
        }, 1000);
    };

    const handlePaymentClose = () => {
        setShowPaymentModal(false);
        // Optionally, you could delete the created order here if payment was cancelled
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
                            <h2>Shipping Details</h2>
                            <p>
                                <strong>Address:</strong> {cart.shippingAddress.street},{' '}
                                {cart.shippingAddress.city}, {cart.shippingAddress.state}{' '}
                                {cart.shippingAddress.zipCode}, {cart.shippingAddress.country}
                            </p>
                        </div>

                        <div className="order-section">
                            <h2>Payment Method</h2>
                            <div className="payment-method-display">
                                <span className="provider-logo">{providerDetails?.logo}</span>
                                <div>
                                    <p><strong>Method:</strong> {cart.paymentMethod}</p>
                                    <p><strong>Provider:</strong> {providerDetails?.name}</p>
                                </div>
                            </div>
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
                                                    {item.quantity} x TZS {Number(item.price).toLocaleString()} = TZS{' '}
                                                    {(item.quantity * item.price).toLocaleString()}
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
                            <span>TZS {Number(cart.itemsPrice).toLocaleString()}</span>
                        </div>

                        <div className="summary-row">
                            <span>Shipping:</span>
                            <span>TZS {Number(cart.shippingPrice).toLocaleString()}</span>
                        </div>

                        <div className="summary-row">
                            <span>Tax (18% VAT):</span>
                            <span>TZS {Number(cart.taxPrice).toLocaleString()}</span>
                        </div>

                        <div className="summary-total">
                            <span>Total:</span>
                            <span>TZS {Number(cart.totalPrice).toLocaleString()}</span>
                        </div>

                        {error && <Message variant="danger">{error}</Message>}

                        <button
                            type="button"
                            className="btn btn-primary btn-block"
                            disabled={cart.cartItems.length === 0 || loading}
                            onClick={placeOrderHandler}
                        >
                            {loading ? 'Creating Order...' : 'Place Order & Pay'}
                        </button>

                        <div className="payment-security-note">
                            <p>🔒 Secure payment processing</p>
                            <p className="small-text">Your payment information is encrypted and secure</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={handlePaymentClose}
                onSuccess={handlePaymentSuccess}
                provider={cart.paymentProvider}
                amount={cart.totalPrice} // TZS amount
            />
        </div>
    );
};

export default PlaceOrderPage;