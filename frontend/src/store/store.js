import { configureStore } from '@reduxjs/toolkit';
import auth from './slices/authSlice.js';
import cart from './slices/cartSlice.js';
import products from './slices/productsSlice.js';
import dashboard from './slices/dashboardSlice.js';

const store = configureStore({
  reducer: { auth, cart, products, dashboard },
});

export default store;
