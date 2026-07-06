import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaMagnifyingGlass } from "react-icons/fa6";
import api from "../api/axios";

// Debounced dish search. Results link to that restaurant's reel feed.
const Search = () => {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/api/food/search?q=${encodeURIComponent(q.trim())}`);
        setResults(data.foodItems || []);
        setSearched(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => timer.current && clearTimeout(timer.current);
  }, [q]);

  return (
    <main className="min-h-screen bg-ink px-4 py-6 text-neutral-900">
      <div className="mx-auto max-w-md">
        <div className="mb-5 flex items-center gap-3">
          <Link to="/" className="text-neutral-600 hover:text-neutral-900">←</Link>
          <h1 className="text-xl font-bold">Search</h1>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-white shadow-sm ring-1 ring-black/5 px-4 py-3">
          <FaMagnifyingGlass className="text-neutral-400" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search dishes, cuisines..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
          />
        </div>

        {loading && <p className="mt-6 text-center text-sm text-neutral-500">Searching...</p>}

        {!loading && searched && results.length === 0 && (
          <p className="mt-6 text-center text-sm text-neutral-500">No dishes found for "{q}"</p>
        )}

        <ul className="mt-4 space-y-3">
          {results.map((food) => (
            <li key={food._id}>
              <Link
                to={`/partner/${food.foodPartner?._id || food.foodPartner}`}
                className="flex items-center gap-3 rounded-xl bg-white shadow-sm ring-1 ring-black/5 p-3"
              >
                <video src={food.video} muted className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{food.name}</p>
                  <p className="truncate text-xs text-neutral-500">
                    {food.foodPartner?.name} · {food.category}
                  </p>
                </div>
                <span className="font-semibold">₹{food.price ?? "—"}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default Search;
