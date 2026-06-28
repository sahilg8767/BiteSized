import { Link } from "react-router-dom";
import api from "../api/axios";
import ReelFeed from "../components/ReelFeed";

// The logged-in user's saved reels, shown as a feed.
const Saved = () => {
  const fetcher = () => api.get("/api/food/saved");

  return (
    <main className="relative">
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 mx-auto flex max-w-md items-center justify-between p-4">
        <Link
          to="/"
          className="pointer-events-auto rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium text-white backdrop-blur"
        >
          ← Home
        </Link>
        <span className="pointer-events-auto text-sm font-semibold text-white drop-shadow">
          Saved
        </span>
      </header>
      <ReelFeed fetcher={fetcher} emptyText="No saved reels yet — tap the bookmark on any reel" />
    </main>
  );
};

export default Saved;
