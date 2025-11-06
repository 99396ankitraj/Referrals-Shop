import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice.js';
import { useState } from 'react';

export default function Navbar() {
  const { token, user } = useSelector((s) => s.auth);
  const cartCount = useSelector((s) => s.cart.items.reduce((a, b) => a + b.quantity, 0));
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const hideLinksOnPublic = !token && ['/', '/login', '/register'].includes(location.pathname);

  return (
    <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="border-b border-gray-200/70">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="inline-block h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600"></span>
              <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">Referrals Shop</span>
            </Link>
            {!hideLinksOnPublic && (
              <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                {!token && <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>}
                <Link to="/shop" className="text-gray-700 hover:text-gray-900">Shop</Link>
                {token && <Link to="/dashboard" className="text-gray-700 hover:text-gray-900">Dashboard</Link>}
                <Link to="/cart" className="relative text-gray-700 hover:text-gray-900">
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span className="absolute -right-3 -top-2 text-[11px] leading-none px-1.5 py-0.5 rounded-full bg-indigo-600 text-white">{cartCount}</span>
                  )}
                </Link>
              </div>
            )}
            <div className="hidden md:flex items-center gap-3">
              {token ? (
                <>
                  <span className="text-sm text-gray-700">Hi, <span className="font-semibold">{user?.username}</span></span>
                  <button
                    className="px-4 py-2 rounded-xl bg-gray-900 text-white shadow-sm hover:shadow-md hover:opacity-95"
                    onClick={() => { dispatch(logout()); nav('/'); }}
                  >Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 rounded-xl border border-gray-300 text-gray-800 hover:bg-gray-50">Login</Link>
                  <Link to="/register" className="px-4 py-2 rounded-xl bg-indigo-600 text-white shadow-sm hover:bg-indigo-700">Register</Link>
                </>
              )}
            </div>
            {!hideLinksOnPublic && (
            <button className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-gray-300 text-gray-800" onClick={() => setOpen((v) => !v)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                {open ? (
                  <path fillRule="evenodd" d="M6.225 4.811a1 1 0 0 1 1.414 0L12 9.172l4.361-4.361a1 1 0 1 1 1.414 1.414L13.414 10.586l4.361 4.361a1 1 0 0 1-1.414 1.414L12 12l-4.361 4.361a1 1 0  1 1 0-1.414z" clipRule="evenodd"/>
                ) : (
                  <path fillRule="evenodd" d="M3.75 5.25h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1 0-1.5zm0 6h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1 0-1.5zm0 6h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1 0-1.5z" clipRule="evenodd"/>
                )}
              </svg>
            </button>
            )}
          </div>
        </div>
      </div>
      {open && !hideLinksOnPublic && (
        <div className="md:hidden border-b border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-3 space-y-3">
            {!token && <Link to="/" className="block text-gray-700" onClick={() => setOpen(false)}>Home</Link>}
            <Link to="/shop" className="block text-gray-700" onClick={() => setOpen(false)}>Shop</Link>
            {token && <Link to="/dashboard" className="block text-gray-700" onClick={() => setOpen(false)}>Dashboard</Link>}
            <Link to="/cart" className="block text-gray-700" onClick={() => setOpen(false)}>Cart{cartCount > 0 ? ` (${cartCount})` : ''}</Link>
            <div className="pt-2 flex items-center gap-2">
              {token ? (
                <button
                  className="px-4 py-2 rounded-xl bg-gray-900 text-white w-full"
                  onClick={() => { setOpen(false); dispatch(logout()); nav('/'); }}
                >Logout</button>
              ) : (
                <>
                  <Link to="/login" className="flex-1 text-center px-4 py-2 rounded-xl border border-gray-300 text-gray-800" onClick={() => setOpen(false)}>Login</Link>
                  <Link to="/register" className="flex-1 text-center px-4 py-2 rounded-xl bg-indigo-600 text-white" onClick={() => setOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
