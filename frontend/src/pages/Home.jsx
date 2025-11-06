import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productsSlice.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Home() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.products);

  useEffect(() => { dispatch(fetchProducts()); }, [dispatch]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  );
}
