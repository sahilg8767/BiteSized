import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPlay,
  FaMagnifyingGlass,
  FaCartShopping,
  FaStore,
  FaArrowRight,
} from "react-icons/fa6";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

// Landing page: entry point with options (watch reels / search) and a list of
// restaurants to visit. The reels feed itself now lives at /reels.
const Home = () => {
  const { isAuthenticated, role, logout } = useAuth();
  const { totalItems } = useCart();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/food-partner")
      .then(({ data }) => setRestaurants(data.restaurants || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-ink text-white">
      <div className="mx-auto max-w-2xl px-4 pb-16">
        {/* top bar */}
        <header className="flex items-center justify-between py-5">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Reel<span className="text-brand">o</span>
          </h1>
          <nav className="flex items-center gap-2 text-sm">
            {role === "food-partner" && (
              <Link to="/partner/dashboard" className="rounded-full bg-white/10 px-3 py-1.5 font-medium">
                Dashboard
              </Link>
            )}
            {role === "user" && (
              <>
                <Link to="/saved" className="rounded-full bg-white/10 px-3 py-1.5 font-medium">Saved</Link>
                <Link to="/orders" className="rounded-full bg-white/10 px-3 py-1.5 font-medium">Orders</Link>
              </>
            )}
            {isAuthenticated ? (
              <button onClick={logout} className="rounded-full bg-white/10 px-3 py-1.5 font-medium">
                Logout
              </button>
            ) : (
              <Link to="/user/login" className="rounded-full bg-brand px-3 py-1.5 font-semibold">
                Login
              </Link>
            )}
          </nav>
        </header>

        {/* hero */}
        <section className="mt-2">
          <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
            Discover food through <span className="text-brand">reels</span>.
          </h2>
          <p className="mt-2 text-white/60">
            Watch short videos from restaurants near you, then order in a tap.
          </p>
        </section>

        {/* primary options */}
        <section className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/reels"
            className="group flex flex-col justify-between rounded-2xl bg-linear-to-br from-brand to-brand-dark p-5 shadow-lg shadow-brand/20"
          >
            <FaPlay className="text-2xl" />
            <div className="mt-8">
              <p className="text-lg font-bold">Watch reels</p>
              <p className="text-sm text-white/80">Scroll the food feed</p>
            </div>
          </Link>

          <Link
            to="/search"
            className="group flex flex-col justify-between rounded-2xl bg-surface p-5"
          >
            <FaMagnifyingGlass className="text-2xl text-brand" />
            <div className="mt-8">
              <p className="text-lg font-bold">Search</p>
              <p className="text-sm text-white/60">Find dishes & restaurants</p>
            </div>
          </Link>
        </section>

        {/* restaurants */}
        <section className="mt-10">
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
                  className="flex items-center gap-3 rounded-xl bg-surface p-3 transition hover:bg-white/10"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/15 text-brand">
                    <FaStore />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{r.name}</p>
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
          className="fixed bottom-6 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/40"
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

export default Home;
