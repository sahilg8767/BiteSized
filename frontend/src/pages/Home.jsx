import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaPlay,
  FaMagnifyingGlass,
  FaCartShopping,
  FaStore,
  FaArrowRight,
  FaBagShopping,
  FaBookmark,
  FaGear,
  FaLeaf,
  FaDrumstickBite,
  FaIceCream,
  FaMugHot,
} from "react-icons/fa6";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const CATEGORIES = [
  { key: "veg", label: "Veg", icon: FaLeaf, grad: "from-emerald-400 to-emerald-600" },
  { key: "non-veg", label: "Non-veg", icon: FaDrumstickBite, grad: "from-rose-400 to-red-600" },
  { key: "dessert", label: "Dessert", icon: FaIceCream, grad: "from-fuchsia-400 to-purple-600" },
  { key: "beverage", label: "Drinks", icon: FaMugHot, grad: "from-amber-400 to-orange-600" },
];

// deterministic gradient for a restaurant avatar based on its name
const AVATAR_GRADS = [
  "from-rose-500 to-orange-500",
  "from-violet-500 to-fuchsia-500",
  "from-cyan-500 to-blue-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-red-500",
];
const gradForName = (name = "") =>
  AVATAR_GRADS[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_GRADS.length];

// Landing / home dashboard. For users: greeting, search, categories, quick
// actions and restaurants. For partners: a shortcut to their dashboard.
const Home = () => {
  const { account, role, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const displayName = role === "food-partner" ? account?.name : account?.fullName;

  useEffect(() => {
    api
      .get("/api/food-partner")
      .then(({ data }) => setRestaurants(data.restaurants || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-ink pb-24 text-white">
      <div className="mx-auto max-w-2xl px-4">
        {/* top bar */}
        <header className="flex items-center justify-between py-5">
          <div>
            <p className="text-xs text-white/50">Hi{displayName ? `, ${displayName}` : ""} 👋</p>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Reel<span className="text-brand">o</span>
            </h1>
          </div>
          <nav className="flex items-center gap-2 text-sm">
            {role === "food-partner" && (
              <Link to="/partner/dashboard" className="rounded-full bg-white/10 px-3 py-1.5 font-medium">
                Dashboard
              </Link>
            )}
            {role === "user" && (
              <Link to="/settings" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10" aria-label="Profile">
                <FaGear />
              </Link>
            )}
            {role === "food-partner" && (
              <button onClick={logout} className="rounded-full bg-white/10 px-3 py-1.5 font-medium">
                Logout
              </button>
            )}
          </nav>
        </header>

        {/* search (tap to go to search page) */}
        <button
          onClick={() => navigate("/search")}
          className="flex w-full items-center gap-2 rounded-full bg-surface px-4 py-3 text-left text-white/40"
        >
          <FaMagnifyingGlass />
          <span className="text-sm">Search dishes & restaurants</span>
        </button>

        {/* categories */}
        <section className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-white/70">Browse by category</h3>
          <div className="grid grid-cols-4 gap-3">
            {CATEGORIES.map(({ key, label, icon: Icon, grad }) => (
              <Link key={key} to={`/category/${key}`} className="group flex flex-col items-center gap-2">
                <span
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br ${grad} text-xl text-white shadow-lg shadow-black/30 transition group-hover:-translate-y-0.5 group-active:scale-95`}
                >
                  <Icon />
                </span>
                <span className="text-xs font-medium text-white/70">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* quick actions */}
        <section className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/reels"
            className="flex flex-col justify-between rounded-2xl bg-linear-to-br from-brand to-brand-dark p-5 shadow-lg shadow-brand/20"
          >
            <FaPlay className="text-2xl" />
            <div className="mt-8">
              <p className="text-lg font-bold">Watch reels</p>
              <p className="text-sm text-white/80">Scroll the food feed</p>
            </div>
          </Link>

          <div className="grid grid-cols-2 gap-3">
            {role === "user" && (
              <>
                <QuickTile to="/orders" icon={<FaBagShopping />} label="Orders" />
                <QuickTile to="/saved" icon={<FaBookmark />} label="Saved" />
                <QuickTile to="/cart" icon={<FaCartShopping />} label="Cart" badge={totalItems} />
                <QuickTile to="/settings" icon={<FaGear />} label="Settings" />
              </>
            )}
            {role === "food-partner" && (
              <>
                <QuickTile to="/partner/dashboard" icon={<FaStore />} label="Dashboard" />
                <QuickTile to="/food/create" icon={<FaPlay />} label="Upload" />
              </>
            )}
          </div>
        </section>

        {/* restaurants */}
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Restaurants</h3>
            <span className="text-xs text-white/40">{restaurants.length} on Reelo</span>
          </div>

          {loading && <p className="text-sm text-white/50">Loading...</p>}
          {!loading && restaurants.length === 0 && (
            <p className="text-sm text-white/50">No restaurants yet.</p>
          )}

          <ul className="space-y-2">
            {restaurants.map((r) => (
              <li key={r._id}>
                <Link
                  to={`/partner/${r._id}`}
                  className="card flex items-center gap-3 p-3 transition hover:-translate-y-0.5 hover:border-white/20"
                >
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${gradForName(r.name)} text-lg font-bold text-white shadow-lg shadow-black/30`}
                  >
                    {r.name?.[0]?.toUpperCase() || "R"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{r.name}</p>
                    <p className="truncate text-xs text-white/50">
                      {r.totalReels} reel{r.totalReels === 1 ? "" : "s"}
                      {r.address ? ` · ${r.address}` : ""}
                    </p>
                  </div>
                  <FaArrowRight className="text-white/30" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* floating cart button */}
      {totalItems > 0 && (
        <Link
          to="/cart"
          className="fixed bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/40"
          aria-label="View cart"
        >
          <FaCartShopping className="text-lg" />
          <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1.5 text-xs font-bold text-brand">
            {totalItems}
          </span>
        </Link>
      )}
    </main>
  );
};

const QuickTile = ({ to, icon, label, badge }) => (
  <Link
    to={to}
    className="relative flex flex-col justify-between rounded-2xl bg-surface p-4 transition hover:bg-white/10"
  >
    <span className="text-xl text-brand">{icon}</span>
    <span className="mt-4 text-sm font-medium">{label}</span>
    {badge > 0 && (
      <span className="absolute right-3 top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-xs font-bold text-white">
        {badge}
      </span>
    )}
  </Link>
);

export default Home;
