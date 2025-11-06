import { motion } from 'framer-motion';

export default function OfferBanner({ title = 'Limited Time Offer', subtitle = 'Get 20% off on your first purchase', cta = 'Shop Now', onClick }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white p-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="text-amber-50">{subtitle}</p>
        </div>
        <button onClick={onClick} className="px-5 py-2 rounded-lg bg-white text-rose-600 font-semibold shadow hover:shadow-md">{cta}</button>
      </div>
      <img src="https://images.unsplash.com/photo-1512978971470-2fdd17d85dc9?q=80&w=1200&auto=format&fit=crop" alt="banner" className="absolute -right-10 -bottom-6 w-64 opacity-20 pointer-events-none select-none"/>
    </motion.div>
  );
}
