export default function PurchaseItemCard({ item }) {
  const fallback = `https://picsum.photos/seed/${encodeURIComponent(item.name)}/160/160`;
  const onImgError = (e) => {
    if (e.target.dataset.fallbackApplied) return;
    e.target.src = fallback;
    e.target.dataset.fallbackApplied = '1';
  };
  return (
    <div className="flex items-center gap-4 p-3 border rounded-lg">
      <img src={item.imageUrl || fallback} onError={onImgError} alt={item.name} className="w-16 h-16 rounded object-cover" />
      <div className="flex-1">
        <div className="font-medium">{item.name}</div>
        <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
      </div>
      <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
    </div>
  );
}
