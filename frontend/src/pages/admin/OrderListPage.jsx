import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaEye, FaTrash } from 'react-icons/fa';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { formatCurrency } from '../../utils/currency';
import { toast } from 'react-toastify';
import './AdminPages.css';

const API_URL = process.env.REACT_APP_API_URL;

const OrderListPage = () => {
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            };
            const { data } = await axios.get(`${API_URL}/orders`, config);
            setOrders(data.orders);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    }, [userInfo.token]);

    useEffect(() => {
        if (!userInfo || userInfo.user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchOrders();
    }, [userInfo, navigate, fetchOrders]);

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`
                }
            };
            await axios.put(
                `${API_URL}/orders/${orderId}/status`,
                { orderStatus: newStatus },
                config
            );
            toast.success('Order status updated');
            fetchOrders();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update order');
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                };
                await axios.delete(`${API_URL}/orders/${id}`, config);
                toast.success('Order deleted successfully');
                fetchOrders();
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to delete order');
            }
        }
    };

    if (loading) return <Loader />;
    if (error) return <Message variant="danger">{error}</Message>;

    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-header">
                    <h1>Orders Management</h1>
                    <div className="stats-cards">
                        <div className="stat-card">
                            <h3>{orders.length}</h3>
                            <p>Total Orders</p>
                        </div>
                        <div className="stat-card">
                            <h3>{orders.filter(o => o.isPaid).length}</h3>
                            <p>Paid Orders</p>
                        </div>
                        <div className="stat-card">
                            <h3>{orders.filter(o => o.isDelivered).length}</h3>
                            <p>Delivered</p>
                        </div>
                    </div>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id.substring(0, 8)}...</td>
                                    <td>{order.user?.name || 'N/A'}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>{formatCurrency(order.totalPrice)}</td>
                                    <td>
                                        {order.isPaid ? (
                                            <span className="status-icon paid">✓</span>
                                        ) : (
                                            <span className="status-icon unpaid">✗</span>
                                        )}
                                    </td>
                                    <td>
                                        <select
                                            value={order.orderStatus}
                                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                            className="status-select"
                                        >
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                onClick={() => navigate(`/order/${order._id}`)}
                                                className="btn-icon btn-view"
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                onClick={() => deleteHandler(order._id)}
                                                className="btn-icon btn-delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderListPage;