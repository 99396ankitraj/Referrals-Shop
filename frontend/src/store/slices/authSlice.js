import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

const saved = JSON.parse(localStorage.getItem('auth') || 'null');

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', data);
    return res.data;
  } catch (e) {
    return rejectWithValue(e.response?.data || { message: 'Register failed' });
  }
});

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', data);
    return res.data;
  } catch (e) {
    return rejectWithValue(e.response?.data || { message: 'Login failed' });
  }
});

export const fetchMe = createAsyncThunk('auth/me', async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const res = await api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
    return res.data;
  } catch (e) {
    return rejectWithValue(e.response?.data || { message: 'Me failed' });
  }
});

const slice = createSlice({
  name: 'auth',
  initialState: saved || { token: null, user: null, loading: false, error: null },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('auth');
    },
  },
  extraReducers: (b) => {
    b.addCase(registerUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(registerUser.fulfilled, (s, a) => { s.loading = false; s.token = a.payload.token; s.user = a.payload.user; localStorage.setItem('auth', JSON.stringify({ token: s.token, user: s.user })); })
      .addCase(registerUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(loginUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(loginUser.fulfilled, (s, a) => { s.loading = false; s.token = a.payload.token; s.user = a.payload.user; localStorage.setItem('auth', JSON.stringify({ token: s.token, user: s.user })); })
      .addCase(loginUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchMe.fulfilled, (s, a) => { s.user = a.payload.user; localStorage.setItem('auth', JSON.stringify({ token: s.token, user: s.user })); });
  }
});

export const { logout } = slice.actions;
export default slice.reducer;
