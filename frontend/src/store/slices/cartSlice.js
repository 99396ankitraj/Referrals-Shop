import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

const saved = JSON.parse(localStorage.getItem('cart') || '[]');

export const makePurchase = createAsyncThunk('cart/purchase', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth, cart } = getState();
    const token = auth.token;
    const items = cart.items.map((i) => ({ productId: i._id, quantity: i.quantity }));
    const res = await api.post('/purchases', { items }, { headers: { Authorization: `Bearer ${token}` } });
    return res.data;
  } catch (e) {
    return rejectWithValue(e.response?.data || { message: 'Purchase failed' });
  }
});

const slice = createSlice({
  name: 'cart',
  initialState: { items: saved, purchasing: false, error: null },
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const exist = state.items.find((i) => i._id === item._id);
      if (exist) exist.quantity += 1; else state.items.push({ ...item, quantity: 1 });
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i._id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    decQty(state, action) {
      const it = state.items.find((i) => i._id === action.payload);
      if (it) { it.quantity = Math.max(1, it.quantity - 1); localStorage.setItem('cart', JSON.stringify(state.items)); }
    },
    incQty(state, action) {
      const it = state.items.find((i) => i._id === action.payload);
      if (it) { it.quantity += 1; localStorage.setItem('cart', JSON.stringify(state.items)); }
    },
    clearCart(state) {
      state.items = [];
      localStorage.setItem('cart', JSON.stringify(state.items));
    }
  },
  extraReducers: (b) => {
    b.addCase(makePurchase.pending, (s) => { s.purchasing = true; s.error = null; })
      .addCase(makePurchase.fulfilled, (s) => { s.purchasing = false; s.items = []; localStorage.setItem('cart', JSON.stringify([])); })
      .addCase(makePurchase.rejected, (s, a) => { s.purchasing = false; s.error = a.payload; });
  }
});

export const { addToCart, removeFromCart, decQty, incQty, clearCart } = slice.actions;
export default slice.reducer;
