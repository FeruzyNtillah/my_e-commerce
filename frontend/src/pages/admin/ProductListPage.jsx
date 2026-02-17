import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';
import './AdminPages.css';

const API_URL = process.env.REACT_APP_API_URL;

const ProductListPage = () => {
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userInfo || userInfo.user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchProducts();
    }, [userInfo, navigate]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_URL}/products?limit=100`);
            setProducts(data.products);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                };
                await axios.delete(`${API_URL}/products/${id}`, config);
                toast.success('Product deleted successfully');
                fetchProducts();
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to delete product');
            }
        }
    };

    const createProductHandler = () => {
        navigate('/admin/product/create');
    };

    if (loading) return <Loader />;
    if (error) return <Message variant="danger">{error}</Message>;

    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-header">
                    <h1>Products Management</h1>
                    <button onClick={createProductHandler} className="btn btn-primary">
                        <FaPlus /> Create Product
                    </button>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Brand</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product._id.substring(0, 8)}...</td>
                                    <td>
                                        <img
                                            src={product.images[0]?.url || 'https://via.placeholder.com/50'}
                                            alt={product.name}
                                            className="table-image"
                                        />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        <span className={product.stock > 0 ? 'stock-in' : 'stock-out'}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                                                className="btn-icon btn-edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => deleteHandler(product._id)}
                                                className="btn-icon btn-delete"
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

export default ProductListPage;