import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderById, payOrder } from '../redux/slices/orderSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { formatCurrency } from '../utils/currency';
import { toast } from 'react-toastify';
import './OrderPage.css';

const OrderPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    const { order, loading, error } = useSelector((state) => state.orders);
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!order || order._id !== id) {
            dispatch(getOrderById(id));
        }
    }, [dispatch, id, order]);

    const handlePayment = async () => {
        setPaymentProcessing(true);

        // Simulate payment processing
        setTimeout(async () => {
            try {
                await dispatch(
                    payOrder({
                        orderId: id,
                        paymentResult: {
                            id: `PAY-${Date.now()}`,
                            status: 'COMPLETED',
                            update_time: new Date().toISOString(),
                            email_address: userInfo.user.email
                        }
                    })
                ).unwrap();

                toast.success('Payment successful!');
                dispatch(getOrderById(id)); // Refresh order
            } catch (err) {
                toast.error(err || 'Payment failed');
            } finally {
                setPaymentProcessing(false);
            }
        }, 2000);
    };

    if (loading) return <Loader />;
    if (error) return <Message variant="danger">{error}</Message>;
    if (!order) return null;

    return (
        <div className="order-page">
            <div className="container">
                <h1>Order {order._id}</h1>

                <div className="order-content">
                    <div className="order-details">
                        <div className="order-section">
                            <h2>Shipping</h2>
                            <p>
                                <strong>Name:</strong> {order.user.name}
                            </p>
                            <p>
                                <strong>Email:</strong> {order.user.email}
                            </p>
                            <p>
                                <strong>Address:</strong> {order.shippingAddress.street},{' '}
                                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                                {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? (
                                <Message variant="success">
                                    Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                                </Message>
                            ) : (
                                <Message variant="info">Not Delivered</Message>
                            )}
                        </div>

                        <div className="order-section">
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method:</strong> {order.paymentMethod}
                            </p>
                            {order.isPaid ? (
                                <Message variant="success">
                                    Paid on {new Date(order.paidAt).toLocaleDateString()}
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
                                                {item.quantity} x {formatCurrency(item.price)} = {formatCurrency(item.quantity * item.price)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="order-section">
                            <h2>Order Status</h2>
                            <div className="status-badge status-badge-processing">
                                {order.orderStatus}
                            </div>
                        </div>
                    </div>

                    <div className="order-summary-sidebar">
                        <div className="order-summary-card">
                            <h2>Order Summary</h2>

                            <div className="summary-row">
                                <span>Items:</span>
                                <span>{formatCurrency(order.itemsPrice)}</span>
                            </div>

                            <div className="summary-row">
                                <span>Shipping:</span>
                                <span>{formatCurrency(order.shippingPrice)}</span>
                            </div>

                            <div className="summary-row">
                                <span>Tax:</span>
                                <span>{formatCurrency(order.taxPrice)}</span>
                            </div>

                            <div className="summary-total">
                                <span>Total:</span>
                                <span>{formatCurrency(order.totalPrice)}</span>
                            </div>

                            {!order.isPaid && (
                                <button
                                    onClick={handlePayment}
                                    className="btn btn-primary btn-block"
                                    disabled={paymentProcessing}
                                >
                                    {paymentProcessing ? 'Processing...' : 'Pay Now'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;