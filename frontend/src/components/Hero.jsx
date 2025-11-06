import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 text-white">
      <img
        src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2000&auto=format&fit=crop"
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="relative p-8 md:p-16 lg:p-24 flex flex-col md:flex-row items-center gap-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
            Use referrals to earn rewards, shop, and invite your friends!
          </h1>
          <p className="mt-4 text-lg text-indigo-50">
            Share your unique link, earn credits on your friends' first purchase, and explore premium digital products.
          </p>
          <div className="mt-6 flex gap-4">
            <Link to="/register" className="px-5 py-3 rounded-lg bg-white text-indigo-700 font-semibold shadow hover:shadow-md">Get Started</Link>
            <Link to="/shop" className="px-5 py-3 rounded-lg bg-indigo-800/60 backdrop-blur font-semibold hover:bg-indigo-800/80">Browse Products</Link>
          </div>
        </motion.div>
        <motion.img
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          src="https://plus.unsplash.com/premium_photo-1674718916323-757579ba588b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjM3fHxkcmVzc2VzfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600"
          alt="Featured"
          className="rounded-xl shadow-2xl w-full max-w-md"
        />
      </div>
    </section>
  );
}
