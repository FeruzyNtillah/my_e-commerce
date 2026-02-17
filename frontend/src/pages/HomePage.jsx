import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import SearchBox from '../components/SearchBox';
import Paginate from '../components/Paginate';
import { getProducts } from '../redux/slices/productSlice';
import './HomePage.css';

const HomePage = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    const [filters, setFilters] = useState({
        keyword: searchParams.get('keyword') || '',
        category: searchParams.get('category') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sort: searchParams.get('sort') || 'newest',
        page: parseInt(searchParams.get('page')) || 1
    });

    const { products, loading, error, pages, page } = useSelector(
        (state) => state.products
    );

    useEffect(() => {
        const queryParams = {};
        if (filters.keyword) queryParams.keyword = filters.keyword;
        if (filters.category) queryParams.category = filters.category;
        if (filters.minPrice) queryParams.minPrice = filters.minPrice;
        if (filters.maxPrice) queryParams.maxPrice = filters.maxPrice;
        if (filters.sort) queryParams.sort = filters.sort;
        queryParams.page = filters.page;
        queryParams.limit = 12;

        dispatch(getProducts(queryParams));
    }, [dispatch, filters]);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value, page: 1 };
        setFilters(newFilters);

        // Update URL
        const params = new URLSearchParams();
        Object.keys(newFilters).forEach(k => {
            if (newFilters[k]) params.set(k, newFilters[k]);
        });
        setSearchParams(params);
    };

    const handlePageChange = (newPage) => {
        setFilters({ ...filters, page: newPage });
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage);
        setSearchParams(params);
        window.scrollTo(0, 0);
    };

    const clearFilters = () => {
        setFilters({
            keyword: '',
            category: '',
            minPrice: '',
            maxPrice: '',
            sort: 'newest',
            page: 1
        });
        setSearchParams({});
    };

    return (
        <div className="home-page">
            <div className="container">
                <h1 className="page-title">Latest Products</h1>

                <SearchBox />

                <div className="filters-section">
                    <div className="filter-group">
                        <label>Category</label>
                        <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="form-control"
                        >
                            <option value="">All Categories</option>
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

                    <div className="filter-group">
                        <label>Min Price</label>
                        <input
                            type="number"
                            value={filters.minPrice}
                            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                            placeholder="TZS 0"
                            className="form-control"
                        />
                    </div>

                    <div className="filter-group">
                        <label>Max Price</label>
                        <input
                            type="number"
                            value={filters.maxPrice}
                            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                            placeholder="TZS 10,000,000"
                            className="form-control"
                        />
                    </div>

                    <div className="filter-group">
                        <label>Sort By</label>
                        <select
                            value={filters.sort}
                            onChange={(e) => handleFilterChange('sort', e.target.value)}
                            className="form-control"
                        >
                            <option value="newest">Newest First</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="rating">Top Rated</option>
                        </select>
                    </div>

                    <button onClick={clearFilters} className="btn btn-secondary">
                        Clear Filters
                    </button>
                </div>

                {loading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="danger">{error}</Message>
                ) : (
                    <>
                        <div className="products-grid">
                            {products.length === 0 ? (
                                <Message variant="info">No products found</Message>
                            ) : (
                                products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))
                            )}
                        </div>

                        <Paginate
                            pages={pages}
                            page={page}
                            setPage={handlePageChange}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default HomePage;