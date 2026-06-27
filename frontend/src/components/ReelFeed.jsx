import { useCallback, useEffect, useRef, useState } from "react";
import api from "../api/axios";
import ReelCard from "./ReelCard";

// Vertical, scroll-snapping reels feed with infinite scroll (paginated API).
// `fetcher` lets callers reuse this for the main feed, a partner's reels, or
// saved reels; defaults to the global feed.
const defaultFetcher = (page) => api.get(`/api/food?page=${page}`);

const ReelFeed = ({ fetcher = defaultFetcher, emptyText = "No reels yet", actions = {} }) => {
  const [reels, setReels] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const sentinelRef = useRef(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await fetcher(page);
      const items = data.foodItems || [];
      setReels((prev) => [...prev, ...items]);
      setHasMore(data.hasMore ?? false);
      setPage((p) => p + 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reels");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, hasMore, loading, fetcher]);

  // initial load
  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // infinite scroll via a sentinel at the bottom
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "400px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  // global mute state shared across all reels
  const [muted, setMuted] = useState(true);

  // optimistic local toggles for like/save (API wiring lands in Phase 2)
  const patchReel = (id, patch) =>
    setReels((prev) => prev.map((r) => (r._id === id ? { ...r, ...patch } : r)));

  const handleLike = actions.onLike || ((food) =>
    patchReel(food._id, {
      isLiked: !food.isLiked,
      likeCount: (food.likeCount || 0) + (food.isLiked ? -1 : 1),
    }));

  const handleSave = actions.onSave || ((food) =>
    patchReel(food._id, {
      isSaved: !food.isSaved,
      savesCount: (food.savesCount || 0) + (food.isSaved ? -1 : 1),
    }));

  return (
    <div className="mx-auto h-[100dvh] max-w-md overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black">
      {reels.map((food) => (
        <ReelCard
          key={food._id}
          food={food}
          muted={muted}
          onToggleMute={() => setMuted((m) => !m)}
          onLike={handleLike}
          onSave={handleSave}
          onComment={actions.onComment}
          onAddToCart={actions.onAddToCart}
        />
      ))}

      {!loading && reels.length === 0 && (
        <div className="flex h-[100dvh] flex-col items-center justify-center gap-2 text-white/70">
          <p>{emptyText}</p>
        </div>
      )}

      {error && (
        <div className="flex h-24 items-center justify-center text-sm text-red-400">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex h-24 items-center justify-center text-white/60">
          Loading...
        </div>
      )}

      <div ref={sentinelRef} className="h-1" />
    </div>
  );
};

export default ReelFeed;
