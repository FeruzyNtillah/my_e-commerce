import React from 'react';
import './Paginate.css';

const Paginate = ({ pages, page, setPage }) => {
    if (pages <= 1) return null;

    const pageNumbers = [];
    for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="pagination">
            <button
                className="page-btn"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
            >
                Previous
            </button>

            {pageNumbers.map((number) => (
                <button
                    key={number}
                    className={`page-btn ${number === page ? 'active' : ''}`}
                    onClick={() => setPage(number)}
                >
                    {number}
                </button>
            ))}

            <button
                className="page-btn"
                onClick={() => setPage(page + 1)}
                disabled={page === pages}
            >
                Next
            </button>
        </div>
    );
};

export default Paginate;