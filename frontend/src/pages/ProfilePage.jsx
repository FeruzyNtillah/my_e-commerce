import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile, updatePassword as updatePasswordAction, logout } from '../redux/slices/authSlice';
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

    // Profile fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profileMessage, setProfileMessage] = useState('');

    // Password fields
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            setName(userInfo.user.name);
            setEmail(userInfo.user.email);
            dispatch(getMyOrders());
        }
    }, [userInfo, navigate, dispatch]);

    // ── Profile update (name only) ─────────────────────────────────────────
    const profileSubmitHandler = async (e) => {
        e.preventDefault();
        setProfileMessage('');

        try {
            await dispatch(updateUserProfile({ name })).unwrap();
            toast.success('Profile updated successfully!');
        } catch (err) {
            const msg = typeof err === 'string' ? err : err?.message || 'Failed to update profile';
            setProfileMessage(msg);
            toast.error(msg);
        }
    };

    // ── Password change (separate form) ───────────────────────────────────
    const passwordSubmitHandler = async (e) => {
        e.preventDefault();
        setPasswordMessage('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordMessage('Please fill in all three password fields');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordMessage('New passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            setPasswordMessage('New password must be at least 6 characters');
            return;
        }

        try {
            await dispatch(
                updatePasswordAction({ currentPassword, newPassword })
            ).unwrap();

            toast.success('Password updated! Please log in again.');
            dispatch(logout());
            navigate('/login');
        } catch (err) {
            const msg = typeof err === 'string' ? err : err?.message || 'Failed to update password';
            setPasswordMessage(msg);
            toast.error(msg);
        }
    };

    return (
        <div className="profile-page">
            <div className="container">
                <h1>My Profile</h1>

                <div className="profile-content">
                    <div className="profile-form-section">

                        {/* ── Profile Info Form ── */}
                        <h2>User Information</h2>
                        {profileMessage && <Message variant="danger">{profileMessage}</Message>}
                        {error && <Message variant="danger">{error}</Message>}
                        {loading && <Loader />}

                        <form onSubmit={profileSubmitHandler}>
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
                                    className="form-control"
                                    disabled
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Updating...' : 'Update Profile'}
                            </button>
                        </form>

                        {/* ── Change Password Form ── */}
                        <h2 style={{ marginTop: '2rem' }}>Change Password</h2>
                        {passwordMessage && <Message variant="danger">{passwordMessage}</Message>}

                        <form onSubmit={passwordSubmitHandler}>
                            <div className="form-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter current password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="form-control"
                                    autoComplete="current-password"
                                />
                            </div>

                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="form-control"
                                    autoComplete="new-password"
                                />
                            </div>

                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="form-control"
                                    autoComplete="new-password"
                                />
                            </div>

                            <button type="submit" className="btn btn-secondary" disabled={loading}>
                                {loading ? 'Updating...' : 'Change Password'}
                            </button>
                        </form>
                    </div>

                    {/* ── Orders Section ── */}
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
