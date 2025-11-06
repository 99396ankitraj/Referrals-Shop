import Hero from '../components/Hero.jsx';
import OfferBanner from '../components/OfferBanner.jsx';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const nav = useNavigate();
  return (
    <div className="space-y-8">
      <Hero />
      <OfferBanner onClick={() => nav('/shop')} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl shadow">
          <h3 className="text-lg font-semibold">Invite & Earn</h3>
          <p className="text-sm text-gray-600 mt-2">Share your referral link. When your friend makes their first purchase, you both earn credits.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow">
          <h3 className="text-lg font-semibold">Curated Digital Goods</h3>
          <p className="text-sm text-gray-600 mt-2">High‑quality templates, icons, and assets for your next project.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow">
          <h3 className="text-lg font-semibold">Fast & Simple</h3>
          <p className="text-sm text-gray-600 mt-2">Add to cart and purchase in seconds. No real payments required in this demo.</p>
        </div>
      </div>
    </div>
  );
}
