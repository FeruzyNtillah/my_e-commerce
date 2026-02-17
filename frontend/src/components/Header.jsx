import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import { logout } from '../redux/slices/authSlice';
import './Header.css';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <Link to="/" className="logo">
                        <h1>ShopHub</h1>
                    </Link>

                    <nav className="nav">
                        <Link to="/cart" className="nav-link">
                            <FaShoppingCart />
                            <span>Cart</span>
                            {cartItems.length > 0 && (
                                <span className="badge">{cartItems.length}</span>
                            )}
                        </Link>

                        {userInfo ? (
                            <div className="dropdown">
                                <button className="nav-link dropdown-toggle">
                                    <FaUser />
                                    <span>{userInfo.user.name}</span>
                                </button>
                                <div className="dropdown-menu">
                                    <Link to="/profile" className="dropdown-item">
                                        Profile
                                    </Link>
                                    <Link to="/orders" className="dropdown-item">
                                        My Orders
                                    </Link>
                                    {userInfo.user.role === 'admin' && (
                                        <>
                                            <div className="dropdown-divider"></div>
                                            <Link to="/admin/products" className="dropdown-item">
                                                <FaUserShield /> Products
                                            </Link>
                                            <Link to="/admin/orders" className="dropdown-item">
                                                <FaUserShield /> Orders
                                            </Link>
                                            <Link to="/admin/users" className="dropdown-item">
                                                <FaUserShield /> Users
                                            </Link>
                                        </>
                                    )}
                                    <div className="dropdown-divider"></div>
                                    <button onClick={handleLogout} className="dropdown-item">
                                        <FaSignOutAlt /> Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="nav-link">
                                <FaUser />
                                <span>Sign In</span>
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;