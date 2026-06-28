import { Link } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import ReelFeed from "../components/ReelFeed";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Home = () => {
  const { isAuthenticated, role, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <main className="relative">
      {/* floating top bar */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 mx-auto flex max-w-md items-center justify-between p-4">
        <h1 className="pointer-events-auto text-xl font-extrabold tracking-tight text-white drop-shadow">
          Reel<span className="text-brand">o</span>
        </h1>
        <nav className="pointer-events-auto flex items-center gap-2 text-sm">
          {role === "food-partner" && (
            <Link
              to="/food/create"
              className="rounded-full bg-white/15 px-3 py-1.5 font-medium text-white backdrop-blur"
            >
              + Upload
            </Link>
          )}
          {role === "user" && (
            <>
              <Link
                to="/saved"
                className="rounded-full bg-white/15 px-3 py-1.5 font-medium text-white backdrop-blur"
              >
                Saved
              </Link>
              <Link
                to="/orders"
                className="rounded-full bg-white/15 px-3 py-1.5 font-medium text-white backdrop-blur"
              >
                Orders
              </Link>
            </>
          )}
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="rounded-full bg-white/15 px-3 py-1.5 font-medium text-white backdrop-blur"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/user/login"
              className="rounded-full bg-brand px-3 py-1.5 font-semibold text-white"
            >
              Login
            </Link>
          )}
        </nav>
      </header>

      <ReelFeed emptyText="No reels yet — check back soon!" />

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
