import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile, updatePassword as updatePasswordAction, logout } from '../redux/slices/authSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { toast } from 'react-toastify';
import './ProfilePage.css';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo, loading, error } = useSelector((state) => state.auth);

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
        }
    }, [userInfo, navigate]);

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
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
