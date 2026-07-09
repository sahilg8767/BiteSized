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
    <dialog
      open
      className="fixed inset-0 z-50 flex items-end justify-center bg-transparent border-none p-0 m-0 max-w-none max-h-none h-full w-full outline-none"
      aria-labelledby="dialog-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 w-full h-full border-none outline-none cursor-default"
        onClick={onClose}
        tabIndex={-1}
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-[70vh] w-full max-w-md flex-col rounded-t-3xl border-t border-zinc-800/60 bg-zinc-950/95 backdrop-blur-xl animate-fade-up">
        <div className="flex items-center justify-between border-b border-zinc-800/40 p-4">
          <h3 id="dialog-title" className="text-base font-bold text-zinc-100">
            Comments {comments.length > 0 && `(${comments.length})`}
          </h3>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full bg-zinc-900/60 p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition duration-200">
            <FaXmark className="text-base" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4 no-scrollbar">
          {loading && <p className="text-center text-sm text-zinc-500">Loading...</p>}
          {!loading && comments.length === 0 && (
            <p className="text-center text-sm text-zinc-500 py-10">Be the first to comment on this dish</p>
          )}
          {comments.map((c) => (
            <div key={c._id} className="flex gap-3 animate-fade-up">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand ring-1 ring-brand/20">
                {(c.user?.fullName || "?").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <p className="text-xs font-bold text-zinc-200">
                    {c.user?.fullName || "User"}
                  </p>
                </div>
                <p className="mt-0.5 text-sm text-zinc-300 leading-relaxed break-words">{c.text}</p>
              </div>
            </div>
          ))}
        </div>

        {canComment ? (
          <form onSubmit={submit} className="flex items-center gap-2 border-t border-zinc-800/40 p-4 bg-zinc-950">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full rounded-xl border border-zinc-850 bg-zinc-900/80 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-brand focus:ring-1 focus:ring-brand/35 transition"
            />
            <button
              type="submit"
              disabled={posting || !text.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white disabled:opacity-40 disabled:hover:scale-100 hover:scale-105 active:scale-95 transition duration-200"
              aria-label="Post comment"
            >
              <FaPaperPlane className="text-sm" />
            </button>
          </form>
        ) : (
          <div className="border-t border-zinc-850 p-4 text-center text-sm text-zinc-400 bg-zinc-950">
            <button type="button" onClick={() => navigate("/user/login")} className="font-semibold text-brand hover:underline">
              Login as a user
            </button>{" "}
            to join the conversation
          </div>
        )}
      </div>
    </dialog>
  );
};

export default CommentSheet;
