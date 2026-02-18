import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';
import Message from '../components/Message';
import './CartPage.css';

const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = useSelector(
        (state) => state.cart
    );

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const updateQuantityHandler = (item, qty) => {
        dispatch(addToCart({ ...item, quantity: qty }));
    };

    const checkoutHandler = () => {
        navigate('/login?redirect=shipping');
    };

    return (
        <div className="cart-page">
            <div className="container">
                <h1>Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <Message variant="info">
                        Your cart is empty. <a href="/">Go Shopping</a>
                    </Message>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items">
                            {cartItems.map((item) => (
                                <div key={item.product} className="cart-item">
                                    <img src={item.image} alt={item.name} className="cart-item-image" />

                                    <div className="cart-item-details">
                                        <h3>{item.name}</h3>
                                        <p className="cart-item-price">TZS {Number(item.price).toLocaleString()}</p>
                                    </div>

                                    <select
                                        value={item.quantity}
                                        onChange={(e) => updateQuantityHandler(item, Number(e.target.value))}
                                        className="quantity-select"
                                    >
                                        {[...Array(Math.min(item.stock, 10)).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>
                                                {x + 1}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        onClick={() => removeFromCartHandler(item.product)}
                                        className="remove-btn"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <h2>Order Summary</h2>

                            <div className="summary-item">
                                <span>Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)}):</span>
                                <span>TZS {Number(itemsPrice).toLocaleString()}</span>
                            </div>

                            <div className="summary-item">
                                <span>Shipping:</span>
                                <span>TZS {Number(shippingPrice).toLocaleString()}</span>
                            </div>

                            <div className="summary-item">
                                <span>Tax (18% VAT):</span>
                                <span>TZS {Number(taxPrice).toLocaleString()}</span>
                            </div>

                            <div className="summary-total">
                                <span>Total:</span>
                                <span>TZS {Number(totalPrice).toLocaleString()}</span>
                            </div>

                            <button onClick={checkoutHandler} className="btn btn-primary btn-block">
                                Proceed to Checkout
                            </button>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;