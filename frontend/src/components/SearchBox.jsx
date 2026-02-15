import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './SearchBox.css';

const SearchBox = () => {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/?keyword=${keyword}`);
        } else {
            navigate('/');
        }
    };

    return (
        <form onSubmit={submitHandler} className="search-box">
            <input
                type="text"
                placeholder="Search products..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="search-input"
            />
            <button type="submit" className="search-button">
                <FaSearch />
            </button>
        </form>
    );
};

export default SearchBox;