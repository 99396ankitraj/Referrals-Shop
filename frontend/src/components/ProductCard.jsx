import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice.js';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const fallback = `https://picsum.photos/seed/${encodeURIComponent(product.name)}/800/600`;
  const onImgError = (e) => {
    if (e.target.dataset.fallbackApplied) return;
    e.target.src = fallback;
    e.target.dataset.fallbackApplied = '1';
  };
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-sm overflow-hidden">
      <img src={product.imageUrl} onError={onImgError} alt={product.name} className="h-48 w-full object-cover" />
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="font-bold">${product.price.toFixed(2)}</span>
          <button
            onClick={() => dispatch(addToCart(product))}
            className="px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >Add to Cart</button>
        </div>
      </div>
    </motion.div>
  );
}
