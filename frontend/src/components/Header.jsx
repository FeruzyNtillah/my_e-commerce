import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaUserShield, FaBars, FaTimes } from 'react-icons/fa';
import { logout } from '../redux/slices/authSlice';
import './Header.css';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        setMenuOpen(false);
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
                        <h1>ShopHub</h1>
                    </Link>

                    <button className="hamburger-menu" onClick={toggleMenu} aria-label="Toggle menu">
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>

                    <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
                        <Link to="/cart" className="nav-link" onClick={() => setMenuOpen(false)}>
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
                                    <Link to="/" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                                        Home
                                    </Link>
                                    <Link to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                                        Profile
                                    </Link>
                                    <Link to="/orders" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                                        My Orders
                                    </Link>
                                    {userInfo.user.role === 'admin' && (
                                        <>
                                            <div className="dropdown-divider"></div>
                                            <Link to="/admin/products" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                                                <FaUserShield /> Products
                                            </Link>
                                            <Link to="/admin/orders" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                                                <FaUserShield /> Orders
                                            </Link>
                                            <Link to="/admin/users" className="dropdown-item" onClick={() => setMenuOpen(false)}>
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
                            <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
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