import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaStore, FaCartPlus, FaHeart, FaBagShopping } from "react-icons/fa6";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

// Public restaurant profile: stats header + all of the restaurant's reels as a
// tappable menu grid (each shows how many times it's been ordered / liked).
const PartnerProfile = () => {
  const { id } = useParams();
  const { role } = useAuth();
  const { addItem } = useCart();
  const [partner, setPartner] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/api/food-partner/${id}`),
      api.get(`/api/food/partner/${id}`),
    ])
      .then(([p, f]) => {
        setPartner(p.data.foodPartner);
        setItems(f.data.foodItems || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <main className="min-h-screen bg-ink px-4 py-6 pb-24 text-white">
      <div className="mx-auto max-w-2xl">
        <div className="mb-5 flex items-center gap-3">
          <Link to="/" className="text-white/70 hover:text-white">←</Link>
          <h1 className="text-lg font-bold">Restaurant</h1>
        </div>

        {/* profile header */}
        <section className="flex items-center gap-4 rounded-2xl bg-surface p-5">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand/15 text-2xl text-brand">
            <FaStore />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-bold">{partner?.name || "Restaurant"}</h2>
            {partner?.address && (
              <p className="truncate text-sm text-white/50">📍 {partner.address}</p>
            )}
            <div className="mt-2 flex gap-4 text-sm">
              <span><b>{partner?.totalReels ?? items.length}</b> <span className="text-white/50">reels</span></span>
              <span><b>{partner?.totalOrders ?? 0}</b> <span className="text-white/50">orders</span></span>
            </div>
          </div>
        </section>

        {/* menu / reels grid */}
        <h3 className="mb-3 mt-8 text-lg font-semibold">Menu</h3>
        {loading && <p className="text-sm text-white/50">Loading...</p>}
        {!loading && items.length === 0 && (
          <p className="text-sm text-white/50">This restaurant has no reels yet.</p>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((food) => (
            <div key={food._id} className="overflow-hidden rounded-xl bg-surface">
              <video
                src={food.video}
                muted
                loop
                playsInline
                autoPlay
                className="aspect-9/16 w-full object-cover"
              />
              <div className="p-3">
                <p className="truncate text-sm font-medium">{food.name}</p>
                <div className="mt-1 flex items-center gap-3 text-xs text-white/50">
                  <span className="flex items-center gap-1"><FaBagShopping /> {food.orderCount ?? 0}</span>
                  <span className="flex items-center gap-1"><FaHeart /> {food.likeCount ?? 0}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold">₹{food.price ?? "—"}</span>
                  {role === "user" && (
                    <button
                      onClick={() => addItem(food)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white"
                      aria-label="Add to cart"
                    >
                      <FaCartPlus className="text-sm" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default PartnerProfile;
