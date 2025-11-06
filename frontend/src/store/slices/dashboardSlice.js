import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

export const fetchSummary = createAsyncThunk('dashboard/summary', async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const res = await api.get('/dashboard/summary', { headers: { Authorization: `Bearer ${token}` } });
    return res.data;
  } catch (e) {
    return rejectWithValue(e.response?.data || { message: 'Summary failed' });
  }
});

export const fetchReferralLink = createAsyncThunk('dashboard/refLink', async (_, { getState }) => {
  const token = getState().auth.token;
  const res = await api.get('/dashboard/referral-link', { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
});

export const fetchMyPurchases = createAsyncThunk('dashboard/purchases', async (_, { getState }) => {
  const token = getState().auth.token;
  const res = await api.get('/purchases/mine', { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
});

const slice = createSlice({
  name: 'dashboard',
  initialState: { summary: null, ref: null, purchases: [], loading: false },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchSummary.pending, (s) => { s.loading = true; })
      .addCase(fetchSummary.fulfilled, (s, a) => { s.loading = false; s.summary = a.payload; })
      .addCase(fetchReferralLink.fulfilled, (s, a) => { s.ref = a.payload; })
      .addCase(fetchMyPurchases.fulfilled, (s, a) => { s.purchases = a.payload; });
  }
});

export default slice.reducer;
