import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { getProductById, createReview } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { formatCurrency } from '../utils/currency';
import { toast } from 'react-toastify';
import './ProductPage.css';

const ProductPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [quantity, setQuantity] = useState(1);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const { product, loading, error } = useSelector((state) => state.products);
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getProductById(id));
    }, [dispatch, id]);

    const addToCartHandler = () => {
        dispatch(
            addToCart({
                product: product._id,
                name: product.name,
                image: product.images[0]?.url,
                price: product.price,
                stock: product.stock,
                quantity
            })
        );
        toast.success('Product added to cart!');
    };

    const submitReviewHandler = async (e) => {
        e.preventDefault();

        if (!userInfo) {
            navigate('/login');
            return;
        }

        try {
            await dispatch(
                createReview({
                    productId: id,
                    review: { rating, comment }
                })
            ).unwrap();

            toast.success('Review submitted successfully!');
            setRating(5);
            setComment('');
            dispatch(getProductById(id)); // Refresh product data
        } catch (error) {
            toast.error(error || 'Failed to submit review');
        }
    };

    if (loading) return <Loader />;
    if (error) return <Message variant="danger">{error}</Message>;
    if (!product) return null;

    return (
        <div className="product-page">
            <div className="container">
                <button onClick={() => navigate(-1)} className="back-button">
                    <FaArrowLeft /> Back
                </button>

                <div className="product-details">
                    <div className="product-image-section">
                        <img
                            src={product.images[0]?.url || 'https://via.placeholder.com/500'}
                            alt={product.name}
                            className="product-detail-image"
                        />
                    </div>

                    <div className="product-info-section">
                        <h1>{product.name}</h1>
                        <Rating value={product.ratings} text={`${product.numReviews} reviews`} />

                        <div className="product-price-section">
                            <h2 className="price">{formatCurrency(product.price)}</h2>
                            <div className="stock-status">
                                {product.stock > 0 ? (
                                    <span className="in-stock">In Stock ({product.stock} available)</span>
                                ) : (
                                    <span className="out-of-stock">Out of Stock</span>
                                )}
                            </div>
                        </div>

                        <div className="product-meta">
                            <p><strong>Brand:</strong> {product.brand}</p>
                            <p><strong>Category:</strong> {product.category}</p>
                        </div>

                        <div className="product-description">
                            <h3>Description</h3>
                            <p>{product.description}</p>
                        </div>

                        {product.stock > 0 && (
                            <div className="add-to-cart-section">
                                <div className="quantity-selector">
                                    <label>Quantity:</label>
                                    <select
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        className="form-control"
                                    >
                                        {[...Array(Math.min(product.stock, 10)).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>
                                                {x + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button onClick={addToCartHandler} className="btn btn-primary btn-block">
                                    <FaShoppingCart /> Add to Cart
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="reviews-section">
                    <h2>Customer Reviews</h2>

                    {product.reviews.length === 0 ? (
                        <Message variant="info">No reviews yet</Message>
                    ) : (
                        <div className="reviews-list">
                            {product.reviews.map((review) => (
                                <div key={review._id} className="review-item">
                                    <div className="review-header">
                                        <strong>{review.name}</strong>
                                        <span className="review-date">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <Rating value={review.rating} />
                                    <p className="review-comment">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Write Review */}
                    {userInfo ? (
                        <div className="write-review">
                            <h3>Write a Review</h3>
                            <form onSubmit={submitReviewHandler}>
                                <div className="form-group">
                                    <label>Rating</label>
                                    <select
                                        value={rating}
                                        onChange={(e) => setRating(Number(e.target.value))}
                                        className="form-control"
                                    >
                                        <option value="5">5 - Excellent</option>
                                        <option value="4">4 - Very Good</option>
                                        <option value="3">3 - Good</option>
                                        <option value="2">2 - Fair</option>
                                        <option value="1">1 - Poor</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Comment</label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        rows="4"
                                        className="form-control"
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    Submit Review
                                </button>
                            </form>
                        </div>
                    ) : (
                        <Message variant="info">
                            Please <a href="/login">sign in</a> to write a review
                        </Message>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductPage;