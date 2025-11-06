import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSummary, fetchReferralLink, fetchMyPurchases } from '../store/slices/dashboardSlice.js';
import SectionCard from '../components/SectionCard.jsx';
import OfferBanner from '../components/OfferBanner.jsx';
import PurchaseItemCard from '../components/PurchaseItemCard.jsx';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { summary, ref, purchases } = useSelector((s) => s.dashboard);
  const user = useSelector((s) => s.auth.user);

  useEffect(() => {
    dispatch(fetchSummary());
    dispatch(fetchReferralLink());
    dispatch(fetchMyPurchases());
  }, [dispatch]);

  const copyLink = async () => {
    if (ref?.link) {
      await navigator.clipboard.writeText(ref.link);
      alert('Referral link copied!');
    }
  };

  return (
    <div className="space-y-8">
      <OfferBanner title={`Welcome, ${user?.username}!`} subtitle="Invite friends and both of you earn credits on the first purchase." cta="Copy Link" onClick={copyLink} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SectionCard title="Referral Stats" subtitle="Your performance at a glance">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-100">
              <div className="text-sm text-indigo-700">Total Referred</div>
              <div className="text-2xl font-bold text-indigo-900">{summary?.totalReferred ?? 0}</div>
            </div>
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
              <div className="text-sm text-emerald-700">Converted</div>
              <div className="text-2xl font-bold text-emerald-900">{summary?.converted ?? 0}</div>
            </div>
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
              <div className="text-sm text-amber-700">Credits</div>
              <div className="text-2xl font-bold text-amber-900">{summary?.credits ?? 0}</div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Your Referral Link"
          subtitle="Share this link. You both earn 2 credits on their first purchase."
          right={<button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={copyLink}>Copy</button>}
        >
          <input className="w-full border rounded p-2" readOnly value={ref?.link || ''} />
          <p className="text-xs text-gray-500 mt-2">Code: {ref?.referralCode} | Username: {ref?.username}</p>
        </SectionCard>

        <SectionCard title="Cart Summary" subtitle="Quick look at your cart" right={<Link to="/cart" className="text-indigo-600 hover:underline">Open Cart</Link>}>
          <CartSummary />
        </SectionCard>
      </div>

      <SectionCard title="Featured Products" subtitle="Hand-picked for you" right={<Link to="/shop" className="text-indigo-600 hover:underline">Browse all</Link>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FeatureCard title="Digital Hoodie" img="https://picsum.photos/seed/digital-hoodie/800/600"/>
          <FeatureCard title="Portfolio Template" img="https://picsum.photos/seed/portfolio-template/800/600"/>
          <FeatureCard title="Icon Pack" img="https://picsum.photos/seed/icon-pack/800/600"/>
          <FeatureCard title="UI Kit" img="https://picsum.photos/seed/ui-kit/800/600"/>
        </div>
      </SectionCard>

      <SectionCard title="Purchase History" subtitle="Your latest orders">
        <div className="space-y-3">
          {purchases.length === 0 && <p className="text-gray-600">No purchases yet.</p>}
          {purchases.map((p) => (
            <div key={p._id} className="border rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Order Total: ${p.total.toFixed(2)}</div>
                <div className="text-sm text-gray-600">{new Date(p.createdAt).toLocaleString()}</div>
              </div>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {p.items.map((it, idx) => (
                  <PurchaseItemCard key={idx} item={it} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function FeatureCard({ title, img }) {
  const fallback = `https://picsum.photos/seed/${encodeURIComponent(title)}/800/600`;
  const onImgError = (e) => {
    if (e.target.dataset.fallbackApplied) return;
    e.target.src = fallback;
    e.target.dataset.fallbackApplied = '1';
  };
  return (
    <Link to="/shop" className="block group rounded-xl overflow-hidden border">
      <img src={img} onError={onImgError} alt={title} className="h-40 w-full object-cover group-hover:scale-[1.02] transition" />
      <div className="p-3 font-medium">{title}</div>
    </Link>
  );
}

function CartSummary() {
  const items = useSelector((s) => s.cart.items);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  if (items.length === 0) return <p className="text-gray-600">Your cart is empty.</p>;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-gray-700">
        <span>Items</span>
        <span>{items.length}</span>
      </div>
      <div className="flex items-center justify-between font-semibold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
