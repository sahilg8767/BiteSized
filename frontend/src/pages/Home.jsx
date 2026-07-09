import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaPlay,
  FaMagnifyingGlass,
  FaCartShopping,
  FaArrowRight,
  FaStore,
  FaGear,
  FaLeaf,
  FaDrumstickBite,
  FaIceCream,
  FaMugHot,
  FaLocationDot,
  FaFire,
} from "react-icons/fa6";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import VideoThumb from "../components/VideoThumb";

const CATEGORIES = [
  { key: "veg", label: "Veg", icon: FaLeaf, grad: "from-emerald-400 to-emerald-600" },
  { key: "non-veg", label: "Non-veg", icon: FaDrumstickBite, grad: "from-rose-400 to-red-600" },
  { key: "dessert", label: "Dessert", icon: FaIceCream, grad: "from-fuchsia-400 to-purple-600" },
  { key: "beverage", label: "Drinks", icon: FaMugHot, grad: "from-amber-400 to-orange-600" },
];

const Home = () => {
  const { account, role, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  const displayName = role === "food-partner" ? account?.name : account?.fullName;

  useEffect(() => {
    Promise.all([api.get("/api/food-partner"), api.get("/api/food?page=1")])
      .then(([r, f]) => {
        setRestaurants(r.data.restaurants || []);
        setTrending(f.data.foodItems || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen pb-28 text-neutral-900 bg-ink animate-scale-up">
      <div className="mx-auto max-w-md px-4">
        {/* Modern Location & Profile Bar */}
        <header className="flex items-center justify-between pt-6 pb-2">
          <div className="min-w-0 flex-1 pr-4">
            <p className="flex items-center gap-1 font-black text-xs text-neutral-800 cursor-pointer hover:text-brand transition">
              <FaLocationDot className="text-brand shrink-0 text-[10px]" />
              <span className="truncate">{account?.address ? account.address.split(",")[0] : "Noida, India"}</span>
              <span className="text-[8px] text-brand">▼</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {role === "food-partner" && (
              <Link to="/partner/dashboard" className="rounded-xl bg-brand-light px-3 py-1.5 text-xs font-bold text-brand shadow-xs hover:scale-105 active:scale-95 transition">
                Dash
              </Link>
            )}
            {role === "user" && (
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-neutral-100 text-neutral-400 hover:text-brand transition cursor-pointer text-xs">
                  🔔
                </span>
                <Link to="/settings" className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-white font-extrabold text-xs shadow-sm hover:scale-105 active:scale-95 transition" aria-label="Profile">
                  {account?.fullName ? account.fullName.slice(0, 2).toUpperCase() : "U"}
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Swiggy/Zomato style bold greeting */}
        <div className="mb-5 mt-2">
          <p className="text-xs font-semibold text-neutral-405 tracking-wide">
            Good evening,
          </p>
          <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight leading-tight mt-0.5">
            What's on your <span className="text-brand">reels</span> today? 🍕
          </h1>
        </div>

        {/* Welcome Banner Card (Promo Swiggy/Zomato style) */}
        <section className="mb-5 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-rose-600 p-5 text-white shadow-lg shadow-brand/20 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-white/10 blur-xl animate-pulse" />
          <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-black/15 blur-lg" />
          <span className="bg-white/20 text-white font-bold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider relative z-10">
            Reelo Special
          </span>
          <h2 className="mt-3 text-lg font-black leading-tight tracking-tight relative z-10">
            Craving something delicious?
          </h2>
          <p className="mt-1 text-xs text-white/85 font-medium relative z-10">
            Browse active restaurant reels & order instantly!
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 bg-white text-brand font-black text-[10px] px-3 py-1.5 rounded-xl shadow-xs relative z-10">
            🎉 Use code BITESIZED50 for 50% Off
          </div>
        </section>

        {/* search */}
        <button
          type="button"
          onClick={() => navigate("/search")}
          className="mb-6 flex w-full items-center gap-3 rounded-2xl border border-black/5 bg-white px-4 py-3.5 text-left text-neutral-400 shadow-xs transition duration-300 hover:border-brand/40 hover:shadow-md cursor-pointer"
        >
          <FaMagnifyingGlass className="text-brand text-sm" />
          <span className="text-xs font-bold text-neutral-400">Search food, dishes, restaurants...</span>
        </button>

        {/* categories styled like Instagram Stories */}
        <section className="mb-6">
          <h3 className="mb-3 text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">What's on your mind?</h3>
          <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4">
            {CATEGORIES.map(({ key, label, icon: Icon, grad }) => (
              <Link key={key} to={`/category/${key}`} className="group flex shrink-0 flex-col items-center gap-1.5 cursor-pointer">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white p-0.5 ring-2 ring-brand/30 group-hover:ring-brand shadow-sm transition duration-300 group-hover:scale-105 active:scale-95">
                  <span className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br ${grad} text-xl text-white`}>
                    <Icon />
                  </span>
                </span>
                <span className="text-[10px] font-extrabold text-neutral-500 group-hover:text-brand transition duration-200">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* trending reels */}
        <section className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <FaFire className="text-brand text-base animate-pulse" />
            <h3 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">Trending food reels</h3>
          </div>

          {loading ? (
            <div className="flex gap-3 overflow-hidden">
              {[0, 1, 2].map((i) => (
                <div key={i} className="skeleton aspect-[9/16] w-36 shrink-0 rounded-2xl" />
              ))}
            </div>
          ) : trending.length === 0 ? (
            <p className="text-sm text-neutral-500 py-4 font-semibold">No food reels available.</p>
          ) : (
            <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
              {trending.slice(0, 10).map((food) => (
                <Link
                  key={food._id}
                  to="/reels"
                  className="group relative aspect-[9/16] w-36 shrink-0 overflow-hidden rounded-2xl shadow-lg border border-black/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <VideoThumb src={food.video} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                    <p className="truncate text-xs font-bold text-white/95">{food.name}</p>
                    <p className="text-xs font-black text-brand">₹{food.price ?? "—"}</p>
                  </div>
                  <span className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-md border border-white/10 shadow-sm opacity-90 group-hover:scale-110 transition duration-300">
                    <FaPlay className="text-[9px] translate-x-[0.5px]" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* restaurants */}
        <section className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">Popular restaurants</h3>
            <span className="text-[10px] font-bold text-neutral-450 bg-neutral-250/20 px-2.5 py-1 rounded-lg">{restaurants.length} nearby</span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[0, 1].map((i) => (
                <div key={i} className="skeleton h-48 w-full rounded-2xl" />
              ))}
            </div>
          ) : restaurants.length === 0 ? (
            <p className="text-sm text-neutral-500 py-6 font-semibold">No restaurants online currently.</p>
          ) : (
            <ul className="space-y-5">
              {restaurants.map((r) => {
                const rating = (3.8 + (r.name.length % 12) / 10).toFixed(1);
                const deliveryTime = 20 + (r.name.length % 20);
                const priceForTwo = 200 + (r.name.length % 6) * 50;

                return (
                  <li key={r._id} className="animate-fade-up">
                    <Link to={`/partner/${r._id}`} className="group block overflow-hidden rounded-2xl bg-white border border-black/5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
                      <div className="relative h-44 w-full overflow-hidden bg-neutral-100">
                        {r.cover ? (
                          <VideoThumb src={r.cover} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 text-neutral-300"><FaStore className="text-4xl" /></div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                        <span className="absolute right-3.5 top-3.5 rounded-lg bg-brand px-2.5 py-1 text-[9px] font-black text-white uppercase tracking-wider shadow-sm animate-pulse">
                          🎬 Live Reel
                        </span>
                        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                          <p className="text-base font-extrabold tracking-tight truncate leading-tight">{r.name}</p>
                          {r.address && (
                            <p className="flex items-center gap-1 truncate text-[10px] text-white/70 mt-1 font-bold">
                              <FaLocationDot className="text-brand text-[9px]" /> {r.address}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Swiggy/Zomato style stats row */}
                      <div className="p-3.5 border-t border-neutral-50 flex items-center justify-between text-[11px] font-bold text-neutral-500">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-0.5 bg-green-50 text-green-700 px-1.5 py-0.5 rounded-md border border-green-100/50">
                            ★ {rating}
                          </span>
                          <span>•</span>
                          <span>{deliveryTime} mins</span>
                          <span>•</span>
                          <span>₹{priceForTwo} for two</span>
                        </div>
                        <span className="text-[9px] text-brand uppercase tracking-wider font-extrabold flex items-center gap-0.5">
                          View {r.totalReels} reel{r.totalReels === 1 ? "" : "s"} →
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* floating cart */}
      {totalItems > 0 && (
        <Link 
          to="/cart" 
          className="fixed bottom-24 right-5 z-30 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-dark px-4 py-3 text-white shadow-2xl shadow-brand/45 border border-white/10 hover:scale-105 active:scale-95 transition duration-200 cursor-pointer"
          aria-label="View cart"
        >
          <FaCartShopping className="text-base" />
          <span className="text-xs font-black bg-white text-brand rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center shadow-sm">
            {totalItems}
          </span>
        </Link>
      )}
    </main>
  );
};

export default Home;
