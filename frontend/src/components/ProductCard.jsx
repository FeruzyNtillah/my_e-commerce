import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            <Link to={`/product/${product._id}`}>
                <div className="product-image">
                    <img
                        src={product.images[0]?.url || 'https://via.placeholder.com/300'}
                        alt={product.name}
                    />
                    {product.stock === 0 && (
                        <div className="out-of-stock-badge">Out of Stock</div>
                    )}
                </div>
            </Link>

            <div className="product-info">
                <Link to={`/product/${product._id}`}>
                    <h3 className="product-name">{product.name}</h3>
                </Link>

                <Rating
                    value={product.ratings}
                    text={`${product.numReviews} reviews`}
                />

                <div className="product-footer">
                    <span className="product-price">${product.price}</span>
                    {product.stock > 0 && product.stock < 10 && (
                        <span className="stock-warning">Only {product.stock} left!</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;