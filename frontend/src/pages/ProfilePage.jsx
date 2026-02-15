import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../redux/slices/authSlice';
import { getMyOrders } from '../redux/slices/orderSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { toast } from 'react-toastify';
import './ProfilePage.css';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo, loading, error } = useSelector((state) => state.auth);
    const { orders, loading: ordersLoading } = useSelector((state) => state.orders);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            setName(userInfo.user.name);
            setEmail(userInfo.user.email);
            dispatch(getMyOrders());
        }
    }, [userInfo, navigate, dispatch]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            const updateData = { name, email };
            if (password) {
                updateData.password = password;
            }

            await dispatch(updateUserProfile(updateData)).unwrap();
            toast.success('Profile updated successfully!');
            setPassword('');
            setConfirmPassword('');
            setMessage('');
        } catch (err) {
            toast.error(err || 'Failed to update profile');
        }
    };

    return (
        <div className="profile-page">
            <div className="container">
                <h1>My Profile</h1>

                <div className="profile-content">
                    <div className="profile-form-section">
                        <h2>User Information</h2>

                        {message && <Message variant="danger">{message}</Message>}
                        {error && <Message variant="danger">{error}</Message>}
                        {loading && <Loader />}

                        <form onSubmit={submitHandler}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter new password (leave blank to keep current)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="form-control"
                                />
                            </div>

                            <button type="submit" className="btn btn-primary">
                                Update Profile
                            </button>
                        </form>
                    </div>

                    <div className="orders-section">
                        <h2>My Orders</h2>

                        {ordersLoading ? (
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
                                                <td>${order.totalPrice}</td>
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
        </div>
    );
};

export default ProfilePage;