import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const initialState = {
    products: [],
    product: null,
    loading: false,
    error: null,
    page: 1,
    pages: 1,
    total: 0
};

// Get all products
export const getProducts = createAsyncThunk(
    'products/getAll',
    async (queryParams = {}, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams(queryParams).toString();
            const { data } = await axios.get(`${API_URL}/products?${params}`);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch products'
            );
        }
    }
);

// Get single product
export const getProductById = createAsyncThunk(
    'products/getById',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/products/${id}`);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Product not found'
            );
        }
    }
);

// Create product review
export const createReview = createAsyncThunk(
    'products/createReview',
    async ({ productId, review }, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.userInfo.token}`
                }
            };
            const { data } = await axios.post(
                `${API_URL}/products/${productId}/reviews`,
                review,
                config
            );
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to create review'
            );
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        resetProductState: (state) => {
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Get all products
        builder
            .addCase(getProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
                state.page = action.payload.page;
                state.pages = action.payload.pages;
                state.total = action.payload.total;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get single product
        builder
            .addCase(getProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload.product;
            })
            .addCase(getProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Create review
        builder
            .addCase(createReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createReview.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;