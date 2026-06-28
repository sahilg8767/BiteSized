import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ReelCard from "./ReelCard";
import CommentSheet from "./CommentSheet";

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
  const [commentFood, setCommentFood] = useState(null);

  const { isAuthenticated, role } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (food) => {
    if (!requireUser()) return;
    addItem(food);
  };

  const patchReel = (id, patch) =>
    setReels((prev) => prev.map((r) => (r._id === id ? { ...r, ...patch } : r)));

  // only users (not partners) can engage; send guests to login
  const requireUser = () => {
    if (!isAuthenticated || role !== "user") {
      navigate("/user/login");
      return false;
    }
    return true;
  };

  // optimistic toggle, then persist; revert on failure
  const handleLike = async (food) => {
    if (!requireUser()) return;
    const optimistic = {
      isLiked: !food.isLiked,
      likeCount: (food.likeCount || 0) + (food.isLiked ? -1 : 1),
    };
    patchReel(food._id, optimistic);
    try {
      const { data } = await api.post(`/api/food/${food._id}/like`);
      patchReel(food._id, { isLiked: data.liked, likeCount: data.likeCount });
    } catch {
      patchReel(food._id, { isLiked: food.isLiked, likeCount: food.likeCount });
    }
  };

  const handleSave = async (food) => {
    if (!requireUser()) return;
    const optimistic = {
      isSaved: !food.isSaved,
      savesCount: (food.savesCount || 0) + (food.isSaved ? -1 : 1),
    };
    patchReel(food._id, optimistic);
    try {
      const { data } = await api.post(`/api/food/${food._id}/save`);
      patchReel(food._id, { isSaved: data.saved, savesCount: data.savesCount });
    } catch {
      patchReel(food._id, { isSaved: food.isSaved, savesCount: food.savesCount });
    }
  };

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
          onComment={setCommentFood}
          onAddToCart={handleAddToCart}
        />
      ))}

      {commentFood && (
        <CommentSheet
          food={commentFood}
          onClose={() => setCommentFood(null)}
          onAdded={() =>
            patchReel(commentFood._id, {
              commentsCount: (commentFood.commentsCount || 0) + 1,
            })
          }
        />
      )}

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
