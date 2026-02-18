import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, adminOnly = false }) => {
    const { userInfo } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!userInfo) {
        return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
    }

    if (adminOnly && userInfo.user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;