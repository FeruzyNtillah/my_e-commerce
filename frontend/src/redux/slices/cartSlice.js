import { createSlice } from '@reduxjs/toolkit';

const cartItemsFromStorage = localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [];

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {};

const paymentMethodFromStorage = localStorage.getItem('paymentMethod')
    ? JSON.parse(localStorage.getItem('paymentMethod'))
    : '';

const initialState = {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
    paymentMethod: paymentMethodFromStorage,
    paymentProvider: localStorage.getItem('paymentProvider') || '',
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x.product === item.product);

            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x.product === existItem.product ? item : x
                );
            } else {
                state.cartItems.push(item);
            }

            // Update prices with proper floating-point precision
            state.itemsPrice = Math.round((state.cartItems.reduce(
                (acc, item) => acc + (item.price * item.quantity * 100),
                0
            ) / 100) * 100) / 100;
            state.shippingPrice = 0; // No shipping costs for local market
            state.taxPrice = Math.round((state.itemsPrice * 0.05) * 100) / 100; // 5% Tax
            state.totalPrice = Math.round(((state.itemsPrice + state.shippingPrice + state.taxPrice) * 100)) / 100;

            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x.product !== action.payload);

            // Update prices
            state.itemsPrice = Math.round((state.cartItems.reduce(
                (acc, item) => acc + (item.price * item.quantity * 100),
                0
            ) / 100) * 100) / 100;
            state.shippingPrice = 0;
            state.taxPrice = Math.round((state.itemsPrice * 0.05) * 100) / 100;
            state.totalPrice = Math.round(((state.itemsPrice + state.shippingPrice + state.taxPrice) * 100)) / 100;

            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload.method;
            state.paymentProvider = action.payload.provider;
            localStorage.setItem('paymentMethod', JSON.stringify(action.payload.method));
            localStorage.setItem('paymentProvider', action.payload.provider);
        },
        clearCart: (state) => {
            state.cartItems = [];
            state.itemsPrice = 0;
            state.shippingPrice = 0;
            state.taxPrice = 0;
            state.totalPrice = 0;
            localStorage.removeItem('cartItems');
        }
    }
});

export const {
    addToCart,
    removeFromCart,
    saveShippingAddress,
    savePaymentMethod,
    clearCart
} = cartSlice.actions;

export default cartSlice.reducer;