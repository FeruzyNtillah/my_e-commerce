import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Get user from localStorage
const userFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

const initialState = {
    userInfo: userFromStorage,
    loading: false,
    error: null,
    success: false
};

// Register user
export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${API_URL}/auth/register`, userData);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Registration failed'
            );
        }
    }
);

// Login user
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${API_URL}/auth/login`, credentials);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Login failed'
            );
        }
    }
);

// Get user profile
export const getUserProfile = createAsyncThunk(
    'auth/getProfile',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${auth.userInfo.token}`
                }
            };
            const { data } = await axios.get(`${API_URL}/auth/me`, config);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to get profile'
            );
        }
    }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
    'auth/updateProfile',
    async (userData, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.userInfo.token}`
                }
            };
            const { data } = await axios.put(
                `${API_URL}/auth/updateprofile`,
                userData,
                config
            );

            // Update localStorage
            const updatedUserInfo = {
                ...auth.userInfo,
                user: data.user
            };
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Update failed'
            );
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.userInfo = null;
            state.loading = false;
            state.error = null;
            state.success = false;
            localStorage.removeItem('userInfo');
            localStorage.removeItem('cartItems');
            localStorage.removeItem('shippingAddress');
            localStorage.removeItem('paymentMethod');
        },
        resetAuthState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        // Register
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
                state.success = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Login
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
                state.success = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get Profile
        builder
            .addCase(getUserProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = {
                    ...state.userInfo,
                    user: action.payload.user
                };
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Update Profile
        builder
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = {
                    ...state.userInfo,
                    user: action.payload.user
                };
                state.success = true;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout, resetAuthState } = authSlice.actions;
export default authSlice.reducer;