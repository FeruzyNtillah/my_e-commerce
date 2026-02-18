import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderById, payOrder } from '../redux/slices/orderSlice';
import { getProviderDetails } from '../utils/paymentSimulator';
import PaymentModal from '../components/PaymentModal';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { toast } from 'react-toastify';
import './OrderPage.css';

const OrderPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const { order, loading, error } = useSelector((state) => state.orders);
    const { userInfo } = useSelector((state) => state.auth);

    // Extract provider from payment method if stored
    const paymentProvider = order?.paymentMethod?.toLowerCase().replace(/\s+/g, '_') || 'mpesa';
    const providerDetails = getProviderDetails(paymentProvider);

    useEffect(() => {
        if (!order || order._id !== id) {
            dispatch(getOrderById(id));
        }
    }, [dispatch, id, order]);

    const handlePayment = () => {
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = async (paymentResult) => {
        try {
            await dispatch(
                payOrder({
                    orderId: id,
                    paymentResult: {
                        id: paymentResult.transactionId,
                        status: 'COMPLETED',
                        update_time: paymentResult.timestamp,
                        email_address: userInfo.user.email,
                        provider: paymentResult.provider,
                        phone_number: paymentResult.phoneNumber
                    }
                })
            ).unwrap();

            toast.success('Payment successful!');
            setShowPaymentModal(false);
            dispatch(getOrderById(id)); // Refresh order
        } catch (err) {
            toast.error(err || 'Payment update failed');
            setShowPaymentModal(false);
        }
    };

    if (loading) return <Loader />;
    if (error) return <Message variant="danger">{error}</Message>;
    if (!order) return null;

    return (
        <div className="order-page">
            <div className="container">
                <h1>Order #{order._id.substring(0, 8).toUpperCase()}</h1>
                <p className="order-date">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-GB')} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString('en-GB')}
                </p>

                <div className="order-content">
                    <div className="order-details">
                        <div className="order-section">
                            <h2>Customer Information</h2>
                            <p>
                                <strong>Name:</strong> {order.user.name}
                            </p>
                            <p>
                                <strong>Email:</strong> {order.user.email}
                            </p>
                        </div>

                        <div className="order-section">
                            <h2>Delivery Details</h2>
                            <p>
                                <strong>Residence:</strong> {order.shippingAddress.residence}<br />
                                <strong>District:</strong> {order.shippingAddress.district}<br />
                                <strong>Region:</strong> {order.shippingAddress.region}<br />
                                <strong>Country:</strong> {order.shippingAddress.country}<br />
                                <strong>Mobile Number:</strong> {order.shippingAddress.mobileNumber}
                            </p>
                            {order.isDelivered ? (
                                <Message variant="success">
                                    Delivered on {new Date(order.deliveredAt).toLocaleDateString('en-GB')}
                                </Message>
                            ) : (
                                <Message variant="info">Not Delivered</Message>
                            )}
                        </div>

                        <div className="order-section">
                            <h2>Payment Method</h2>
                            <div className="payment-info">
                                {providerDetails && (
                                    <span className="provider-logo">{providerDetails.logo}</span>
                                )}
                                <div>
                                    <p><strong>Method:</strong> {order.paymentMethod}</p>
                                    {order.paymentResult?.provider && (
                                        <p><strong>Provider:</strong> {getProviderDetails(order.paymentResult.provider)?.name}</p>
                                    )}
                                </div>
                            </div>
                            {order.isPaid ? (
                                <Message variant="success">
                                    Paid on {new Date(order.paidAt).toLocaleDateString('en-GB')} at{' '}
                                    {new Date(order.paidAt).toLocaleTimeString('en-GB')}
                                    {order.paymentResult?.id && (
                                        <p className="transaction-id">
                                            Transaction ID: {order.paymentResult.id}
                                        </p>
                                    )}
                                </Message>
                            ) : (
                                <Message variant="warning">Not Paid</Message>
                            )}
                        </div>

                        <div className="order-section">
                            <h2>Order Items</h2>
                            <div className="order-items-list">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="order-item">
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
                        </div>

                        <div className="order-section">
                            <h2>Order Status</h2>
                            <div className={`status-badge status-badge-${order.orderStatus.toLowerCase()}`}>
                                {order.orderStatus}
                            </div>
                            {order.orderStatus === 'Processing' && !order.isPaid && (
                                <p className="status-note">Waiting for payment confirmation</p>
                            )}
                            {order.orderStatus === 'Processing' && order.isPaid && (
                                <p className="status-note">Your order is being prepared</p>
                            )}
                            {order.orderStatus === 'Shipped' && (
                                <p className="status-note">Your order is on the way</p>
                            )}
                            {order.orderStatus === 'Delivered' && (
                                <p className="status-note">Your order has been delivered</p>
                            )}
                        </div>
                    </div>

                    <div className="order-summary-sidebar">
                        <div className="order-summary-card">
                            <h2>Order Summary</h2>

                            <div className="summary-row">
                                <span>Items:</span>
                                <span>TZS {Number(order.itemsPrice).toLocaleString()}</span>
                            </div>

                            <div className="summary-row">
                                <span>Tax (5%):</span>
                                <span>TZS {Number(order.taxPrice).toLocaleString()}</span>
                            </div>

                            <div className="summary-total">
                                <span>Total:</span>
                                <span>TZS {Number(order.totalPrice).toLocaleString()}</span>
                            </div>

                            {!order.isPaid && (
                                <>
                                    <button
                                        onClick={handlePayment}
                                        className="btn btn-primary btn-block"
                                    >
                                        Pay Now
                                    </button>
                                    <p className="payment-note">
                                        Complete payment to process your order
                                    </p>
                                </>
                            )}

                            {order.isPaid && !order.isDelivered && (
                                <div className="paid-status">
                                    <div className="success-checkmark">✓</div>
                                    <p>Payment Received</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSuccess={handlePaymentSuccess}
                provider={paymentProvider}
                amount={order.totalPrice}
            />
        </div>
    );
};

export default OrderPage;