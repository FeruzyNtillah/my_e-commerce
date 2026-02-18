import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from '../redux/slices/orderSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import './ProfilePage.css';

const MyOrdersPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo } = useSelector((state) => state.auth);
    const { orders, loading } = useSelector((state) => state.orders);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            dispatch(getMyOrders());
        }
    }, [userInfo, navigate, dispatch]);

    return (
        <div className="profile-page">
            <div className="container">
                <h1>My Orders</h1>

                <div className="orders-section">
                    {loading ? (
                        <Loader />
                    ) : orders && orders.length === 0 ? (
                        <Message variant="info">No orders yet</Message>
                    ) : (
                        <div className="orders-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Date</th>
                                        <th>Total</th>
                                        <th>Paid</th>
                                        <th>Delivered</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders?.map((order) => (
                                        <tr key={order._id}>
                                            <td>{order._id.substring(0, 8)}...</td>
                                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td>TZS {order.totalPrice}</td>
                                            <td>
                                                {order.isPaid ? (
                                                    <span className="badge badge-success">Paid</span>
                                                ) : (
                                                    <span className="badge badge-danger">Not Paid</span>
                                                )}
                                            </td>
                                            <td>
                                                {order.isDelivered ? (
                                                    <span className="badge badge-success">Delivered</span>
                                                ) : (
                                                    <span className="badge badge-warning">Pending</span>
                                                )}
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => navigate(`/order/${order._id}`)}
                                                    className="btn btn-sm"
                                                >
                                                    Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyOrdersPage;
