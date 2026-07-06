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
    <main className="min-h-screen pb-28 text-neutral-900">
      {/* warm gradient header band */}
      <div className="bg-linear-to-b from-orange-50 to-transparent">
        <div className="mx-auto max-w-2xl px-4">
          <header className="flex items-center justify-between py-5">
            <div>
              <p className="flex items-center gap-1 text-xs font-medium text-neutral-500">
                <FaLocationDot className="text-brand" />
                {account?.address ? account.address.slice(0, 28) : "Set your location"}
              </p>
              <h1 className="mt-0.5 text-2xl font-black tracking-tight">
                Hi{displayName ? `, ${displayName.split(" ")[0]}` : ""} 👋
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {role === "food-partner" && (
                <Link to="/partner/dashboard" className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-brand shadow-sm ring-1 ring-black/5">
                  Dashboard
                </Link>
              )}
              {role === "user" ? (
                <Link to="/settings" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-700 shadow-sm ring-1 ring-black/5" aria-label="Profile">
                  <FaGear />
                </Link>
              ) : (
                <button onClick={logout} className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold shadow-sm ring-1 ring-black/5">
                  Logout
                </button>
              )}
            </div>
          </header>

          {/* search */}
          <button
            onClick={() => navigate("/search")}
            className="mb-5 flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3.5 text-left text-neutral-400 shadow-sm ring-1 ring-black/5 transition hover:ring-brand/30"
          >
            <FaMagnifyingGlass className="text-brand" />
            <span className="text-sm">Search dishes & restaurants</span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4">
        {/* categories */}
        <section className="mt-2 animate-fade-up">
          <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4">
            {CATEGORIES.map(({ key, label, icon: Icon, grad }) => (
              <Link key={key} to={`/category/${key}`} className="group flex shrink-0 flex-col items-center gap-2">
                <span className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br ${grad} text-xl text-white shadow-lg shadow-black/10 transition group-hover:-translate-y-0.5 group-active:scale-95`}>
                  <Icon />
                </span>
                <span className="text-xs font-semibold text-neutral-600">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* trending reels */}
        <section className="mt-8 animate-fade-up">
          <div className="mb-3 flex items-center gap-2">
            <FaFire className="text-brand" />
            <h3 className="text-lg font-extrabold">Trending now</h3>
          </div>

          {loading ? (
            <div className="flex gap-3 overflow-hidden">
              {[0, 1, 2].map((i) => (
                <div key={i} className="skeleton aspect-9/16 w-32 shrink-0 rounded-2xl" />
              ))}
            </div>
          ) : trending.length === 0 ? (
            <p className="text-sm text-neutral-500">No reels yet.</p>
          ) : (
            <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
              {trending.slice(0, 10).map((food) => (
                <Link
                  key={food._id}
                  to="/reels"
                  className="group relative aspect-9/16 w-32 shrink-0 overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5"
                >
                  <VideoThumb src={food.video} className="h-full w-full object-cover transition group-hover:scale-105" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-2.5 text-white">
                    <p className="truncate text-xs font-semibold">{food.name}</p>
                    <p className="text-[11px] font-extrabold text-orange-300">₹{food.price ?? "—"}</p>
                  </div>
                  <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur">
                    <FaPlay className="text-[10px]" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* restaurants */}
        <section className="mt-8 animate-fade-up">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-extrabold">Popular restaurants</h3>
            <span className="text-xs font-medium text-neutral-400">{restaurants.length} on Reelo</span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[0, 1].map((i) => (
                <div key={i} className="skeleton h-44 w-full rounded-3xl" />
              ))}
            </div>
          ) : restaurants.length === 0 ? (
            <p className="text-sm text-neutral-500">No restaurants yet.</p>
          ) : (
            <ul className="space-y-4">
              {restaurants.map((r) => (
                <li key={r._id}>
                  <Link to={`/partner/${r._id}`} className="group block overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative h-44 w-full overflow-hidden bg-neutral-100">
                      {r.cover ? (
                        <VideoThumb src={r.cover} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-neutral-300"><FaStore className="text-4xl" /></div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />
                      <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-neutral-800 shadow">
                        {r.totalReels} reel{r.totalReels === 1 ? "" : "s"}
                      </span>
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white">
                        <div className="min-w-0">
                          <p className="truncate text-xl font-extrabold">{r.name}</p>
                          {r.address && (
                            <p className="flex items-center gap-1 truncate text-xs text-white/85">
                              <FaLocationDot /> {r.address}
                            </p>
                          )}
                        </div>
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-lg">
                          <FaArrowRight className="text-sm" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* floating cart */}
      {totalItems > 0 && (
        <Link to="/cart" className="fixed bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-xl shadow-brand/40" aria-label="View cart">
          <FaCartShopping className="text-lg" />
          <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1.5 text-xs font-bold text-brand shadow">
            {totalItems}
          </span>
        </Link>
      )}
    </main>
  );
};

export default Home;
