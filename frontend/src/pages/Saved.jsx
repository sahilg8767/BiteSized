import { Link } from "react-router-dom";
import api from "../api/axios";
import ReelFeed from "../components/ReelFeed";

// The logged-in user's saved reels, shown as a feed.
const fetchSavedReels = () => api.get("/api/food/saved");

const Saved = () => {
  return (
    <main className="relative">
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 mx-auto flex max-w-md items-center justify-between p-4">
        <Link
          to="/"
          className="pointer-events-auto rounded-full bg-white/15 px-3.5 py-1.5 font-bold text-xs text-white backdrop-blur transition hover:bg-white/25 active:scale-95"
        >
          ← Home
        </Link>
        <span className="pointer-events-auto text-xs font-extrabold text-white drop-shadow-sm tracking-wide bg-black/25 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/15">
          Saved Reels
        </span>
      </header>
      <ReelFeed fetcher={fetchSavedReels} emptyText="No saved reels yet — tap the bookmark on any reel" />
    </main>
  );
};

export default Saved;
