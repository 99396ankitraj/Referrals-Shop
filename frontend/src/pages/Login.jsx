import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/authSlice.js';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { loading, error } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginUser(form));
    if (res.type.endsWith('fulfilled')) nav('/shop');
  };

  return (
    <div className="grid md:grid-cols-2 gap-10 items-center">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="order-2 md:order-1">
        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-2xl rounded-3xl" aria-hidden="true"></div>
          <img
            src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHJlc3Nlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600"
            alt="Login"
            className="relative mx-auto rounded-3xl shadow-2xl ring-1 ring-black/5 object-cover w-full max-w-xl"
          />
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="order-1 md:order-2 max-w-md mx-auto w-full">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-1">Welcome back</h2>
          <p className="text-sm text-gray-600 mb-4">Sign in to continue shopping and sharing.</p>
          {error && <p className="text-red-600 text-sm mb-2">{error.message || 'Error'}</p>}
          <form onSubmit={submit} className="space-y-3">
            <input className="w-full border rounded p-2" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input className="w-full border rounded p-2" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <button disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Login</button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
