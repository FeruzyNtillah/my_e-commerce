import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';
import './AdminPages.css';

const API_URL = process.env.REACT_APP_API_URL;

const ProductEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        category: 'Electronics',
        brand: '',
        stock: 0,
        imageUrl: '',
        isFeatured: false
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isCreateMode = id === 'create';

    const fetchProduct = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_URL}/products/${id}`);
            const product = data.product;

            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                brand: product.brand,
                stock: product.stock,
                imageUrl: product.images[0]?.url || '',
                isFeatured: product.isFeatured
            });
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch product');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (!userInfo || userInfo.user.role !== 'admin') {
            navigate('/');
            return;
        }

        if (!isCreateMode) {
            fetchProduct();
        }
    }, [userInfo, navigate, id, isCreateMode, fetchProduct]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`
                }
            };

            const productData = {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                category: formData.category,
                brand: formData.brand,
                stock: Number(formData.stock),
                images: [{ url: formData.imageUrl }],
                isFeatured: formData.isFeatured
            };

            if (isCreateMode) {
                await axios.post(`${API_URL}/products`, productData, config);
                toast.success('Product created successfully');
            } else {
                await axios.put(`${API_URL}/products/${id}`, productData, config);
                toast.success('Product updated successfully');
            }

            navigate('/admin/products');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !isCreateMode) return <Loader />;
    if (error) return <Message variant="danger">{error}</Message>;

    return (
        <div className="admin-page">
            <div className="container">
                <button onClick={() => navigate('/admin/products')} className="back-button">
                    <FaArrowLeft /> Back to Products
                </button>

                <div className="admin-form-card">
                    <h1>{isCreateMode ? 'Create Product' : 'Edit Product'}</h1>

                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label>Product Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="form-control"
                                rows="5"
                                required
                            ></textarea>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Price *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="form-control"
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Stock *</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className="form-control"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                >
                                    <option value="Electronics">Electronics</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Books">Books</option>
                                    <option value="Home & Garden">Home & Garden</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Toys">Toys</option>
                                    <option value="Beauty">Beauty</option>
                                    <option value="Food">Food</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Brand *</label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Image URL *</label>
                            <input
                                type="url"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="https://example.com/image.jpg"
                                required
                            />
                            {formData.imageUrl && (
                                <div className="image-preview">
                                    <img src={formData.imageUrl} alt="Preview" />
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={handleChange}
                                />
                                <span>Featured Product</span>
                            </label>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/products')}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Saving...' : isCreateMode ? 'Create' : 'Update'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductEditPage;