import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaXmark, FaPaperPlane } from "react-icons/fa6";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

// Bottom-sheet comments panel for a reel. Lists comments and lets logged-in
// users post. Calls onAdded() so the feed can bump the comment count.
const CommentSheet = ({ food, onClose, onAdded }) => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .get(`/api/food/${food._id}/comments`)
      .then(({ data }) => active && setComments(data.comments || []))
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [food._id]);

  const canComment = isAuthenticated && role === "user";

  const submit = async (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setPosting(true);
    try {
      const { data } = await api.post(`/api/food/${food._id}/comments`, { text: value });
      setComments((prev) => [data.comment, ...prev]);
      setText("");
      onAdded?.();
    } catch {
      // keep the text so the user can retry
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative z-10 flex h-[70vh] w-full max-w-md flex-col rounded-t-2xl bg-surface">
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <h3 className="font-semibold text-white">
            Comments {comments.length > 0 && `(${comments.length})`}
          </h3>
          <button onClick={onClose} aria-label="Close" className="text-white/70 hover:text-white">
            <FaXmark className="text-lg" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4 no-scrollbar">
          {loading && <p className="text-center text-sm text-white/50">Loading...</p>}
          {!loading && comments.length === 0 && (
            <p className="text-center text-sm text-white/50">Be the first to comment</p>
          )}
          {comments.map((c) => (
            <div key={c._id} className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/20 text-sm font-bold text-brand">
                {(c.user?.fullName || "?").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-white/90">
                  {c.user?.fullName || "User"}
                </p>
                <p className="text-sm text-white/70">{c.text}</p>
              </div>
            </div>
          ))}
        </div>

        {canComment ? (
          <form onSubmit={submit} className="flex items-center gap-2 border-t border-white/10 p-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a comment..."
              className="input"
            />
            <button
              type="submit"
              disabled={posting || !text.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white disabled:opacity-50"
              aria-label="Post comment"
            >
              <FaPaperPlane />
            </button>
          </form>
        ) : (
          <div className="border-t border-white/10 p-3 text-center text-sm text-white/60">
            <button onClick={() => navigate("/user/login")} className="text-brand">
              Login as a user
            </button>{" "}
            to comment
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSheet;
