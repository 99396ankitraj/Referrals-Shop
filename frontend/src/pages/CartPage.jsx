import { useDispatch, useSelector } from 'react-redux';
import { decQty, incQty, removeFromCart, makePurchase } from '../store/slices/cartSlice.js';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { items, purchasing, error } = useSelector((s) => s.cart);
  const { token } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const buy = async () => {
    if (!token) { nav('/login'); return; }
    const res = await dispatch(makePurchase());
    if (res.type.endsWith('fulfilled')) nav('/dashboard');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {items.length === 0 && <p>Your cart is empty.</p>}
      <div className="space-y-4">
        {items.map((i) => (
          <div key={i._id} className="bg-white p-4 rounded shadow flex items-center justify-between">
            <div>
              <div className="font-semibold">{i.name}</div>
              <div className="text-sm text-gray-600">${i.price.toFixed(2)}</div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-2 py-1 border rounded" onClick={() => dispatch(decQty(i._id))}>-</button>
              <span>{i.quantity}</span>
              <button className="px-2 py-1 border rounded" onClick={() => dispatch(incQty(i._id))}>+</button>
              <button className="px-2 py-1 border rounded" onClick={() => dispatch(removeFromCart(i._id))}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="text-xl font-semibold">Total: ${total.toFixed(2)}</div>
        <button disabled={purchasing || items.length===0} className="bg-green-600 text-white px-4 py-2 rounded" onClick={buy}>
          {purchasing ? 'Processing...' : 'Buy Product'}
        </button>
      </div>
      {error && <p className="text-red-600 text-sm mt-2">{error.message || 'Error'}</p>}
    </div>
  );
}
