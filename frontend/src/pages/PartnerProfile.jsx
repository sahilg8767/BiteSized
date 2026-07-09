import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaStore, FaCartPlus, FaHeart, FaBagShopping, FaArrowLeft } from "react-icons/fa6";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import VideoThumb from "../components/VideoThumb";

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
    <main className="min-h-screen bg-ink px-4 py-8 pb-28 text-neutral-900 animate-scale-up">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex items-center gap-3.5">
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-neutral-200/60 shadow-xs hover:text-brand hover:scale-105 active:scale-95 transition duration-200 cursor-pointer">
            <FaArrowLeft className="text-xs" />
          </Link>
          <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">Restaurant Profile</h1>
        </div>

        {/* profile header */}
        <section className="flex items-center gap-5 rounded-3xl bg-white border border-black/5 p-6 shadow-sm">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-light text-3xl text-brand shadow-xs">
            <FaStore />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-black text-neutral-900 leading-tight">{partner?.name || "Restaurant"}</h2>
            {partner?.address && (
              <p className="truncate text-xs font-semibold text-neutral-400 mt-1 flex items-center gap-1">📍 {partner.address}</p>
            )}
            <div className="mt-3 flex gap-4 text-xs font-bold">
              <span className="bg-neutral-55 px-2.5 py-1 rounded-lg text-neutral-700">🎬 <b>{partner?.totalReels ?? items.length}</b> Reels</span>
              <span className="bg-neutral-55 px-2.5 py-1 rounded-lg text-neutral-700">⭐ <b>{partner?.totalOrders ?? 0}</b> Orders</span>
            </div>
          </div>
        </section>

        {/* menu / reels grid */}
        <h3 className="mb-4 mt-8 text-base font-extrabold text-neutral-900">Featured Dishes</h3>
        {loading && <p className="text-sm text-neutral-500 font-medium py-10 text-center animate-pulse">Gathering fresh reels...</p>}
        {!loading && items.length === 0 && (
          <p className="text-sm text-neutral-500 font-medium py-10 text-center bg-white border border-black/5 rounded-2xl">This restaurant has no food reels yet.</p>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map((food) => (
            <div key={food._id} className="group overflow-hidden rounded-2xl bg-white border border-black/5 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="relative aspect-[9/16] w-full overflow-hidden bg-neutral-100">
                <VideoThumb src={food.video} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-3.5">
                <p className="font-bold text-neutral-900 truncate tracking-tight text-sm leading-snug">{food.name}</p>
                <div className="mt-1 flex items-center gap-3 text-[10px] font-bold text-neutral-400">
                  <span className="flex items-center gap-1"><FaBagShopping className="text-[10px]" /> {food.orderCount ?? 0}</span>
                  <span className="flex items-center gap-1"><FaHeart className="text-[10px]" /> {food.likeCount ?? 0}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-extrabold text-neutral-900 text-base">₹{food.price ?? "—"}</span>
                  {role === "user" && (
                    <button
                      type="button"
                      onClick={() => addItem(food)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-brand to-brand-dark text-white shadow-sm shadow-brand/35 hover:scale-110 active:scale-95 transition duration-200 cursor-pointer"
                      aria-label="Add to cart"
                    >
                      <FaCartPlus className="text-xs" />
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
