import { Link } from "react-router-dom";
import ReelFeed from "../components/ReelFeed";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated, role, logout } = useAuth();

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
    </main>
  );
};

export default Home;
