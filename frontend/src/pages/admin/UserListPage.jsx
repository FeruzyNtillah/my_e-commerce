import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaTrash, FaUserShield, FaUser } from 'react-icons/fa';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';
import './AdminPages.css';

const API_URL = process.env.REACT_APP_API_URL;

const UserListPage = () => {
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            };
            const { data } = await axios.get(`${API_URL}/users`, config);
            setUsers(data.users);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    }, [userInfo.token]);

    useEffect(() => {
        if (!userInfo || userInfo.user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchUsers();
    }, [userInfo, navigate, fetchUsers]);

    const toggleAdminRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';

        if (window.confirm(`Change user role to ${newRole}?`)) {
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${userInfo.token}`
                    }
                };
                await axios.put(
                    `${API_URL}/users/${userId}/role`,
                    { role: newRole },
                    config
                );
                toast.success(`User role updated to ${newRole}`);
                fetchUsers();
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to update role');
            }
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                };
                await axios.delete(`${API_URL}/users/${id}`, config);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to delete user');
            }
        }
    };

    if (loading) return <Loader />;
    if (error) return <Message variant="danger">{error}</Message>;

    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-header">
                    <h1>Users Management</h1>
                    <div className="stats-cards">
                        <div className="stat-card">
                            <h3>{users.length}</h3>
                            <p>Total Users</p>
                        </div>
                        <div className="stat-card">
                            <h3>{users.filter(u => u.role === 'admin').length}</h3>
                            <p>Admins</p>
                        </div>
                        <div className="stat-card">
                            <h3>{users.filter(u => u.role === 'user').length}</h3>
                            <p>Regular Users</p>
                        </div>
                    </div>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user._id.substring(0, 8)}...</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`role-badge role-${user.role}`}>
                                            {user.role === 'admin' ? <FaUserShield /> : <FaUser />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                onClick={() => toggleAdminRole(user._id, user.role)}
                                                className="btn-icon btn-role"
                                                title={user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                                            >
                                                {user.role === 'admin' ? <FaUser /> : <FaUserShield />}
                                            </button>
                                            <button
                                                onClick={() => deleteHandler(user._id)}
                                                className="btn-icon btn-delete"
                                                disabled={user._id === userInfo.user._id}
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

export default UserListPage;