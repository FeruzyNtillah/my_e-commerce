import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const initialState = {
    order: null,
    orders: [],
    loading: false,
    error: null,
    success: false
};

// Create order
export const createOrder = createAsyncThunk(
    'orders/create',
    async (order, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.userInfo.token}`
                }
            };
            const { data } = await axios.post(`${API_URL}/orders`, order, config);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to create order'
            );
        }
    }
);

// Get order by ID
export const getOrderById = createAsyncThunk(
    'orders/getById',
    async (id, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${auth.userInfo.token}`
                }
            };
            const { data } = await axios.get(`${API_URL}/orders/${id}`, config);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Order not found'
            );
        }
    }
);

// Get my orders
export const getMyOrders = createAsyncThunk(
    'orders/getMyOrders',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${auth.userInfo.token}`
                }
            };
            const { data } = await axios.get(`${API_URL}/orders/myorders`, config);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch orders'
            );
        }
    }
);

// Pay order
export const payOrder = createAsyncThunk(
    'orders/pay',
    async ({ orderId, paymentResult }, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.userInfo.token}`
                }
            };
            const { data } = await axios.put(
                `${API_URL}/orders/${orderId}/pay`,
                paymentResult,
                config
            );
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Payment failed'
            );
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        resetOrderState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        // Create order
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload.order;
                state.success = true;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get order by ID
        builder
            .addCase(getOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload.order;
            })
            .addCase(getOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get my orders
        builder
            .addCase(getMyOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
            })
            .addCase(getMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Pay order
        builder
            .addCase(payOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(payOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload.order;
                state.success = true;
            })
            .addCase(payOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;