import { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaMagnifyingGlass, FaArrowLeft, FaStore } from "react-icons/fa6";
import api from "../api/axios";

// helper calculators for mock Swiggy details
const getRating = (name) => parseFloat((3.8 + (name.length % 12) / 10).toFixed(1));
const getDistance = (name) => parseFloat(((name.length % 5) + 1.2).toFixed(1));

// Swiggy/Zomato style search page with tabs and sorting filters
const Search = () => {
  const [q, setQ] = useState("");
  const [results, setResults] = useState({ foodItems: [], partners: [] });
  const [filter, setFilter] = useState("default");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (!q.trim()) {
      setResults({ foodItems: [], partners: [] });
      setSearched(false);
      return;
    }
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/api/food/search?q=${q.trim()}`);
        setResults({
          foodItems: data.foodItems || [],
          partners: data.partners || [],
        });
        setSearched(true);
      } catch {
        setResults({ foodItems: [], partners: [] });
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => timer.current && clearTimeout(timer.current);
  }, [q]);

  // Compute sorted items on-the-fly
  const sortedData = useMemo(() => {
    let foodItems = [...(results.foodItems || [])];
    let partners = [...(results.partners || [])];

    if (filter === "price-low") {
      foodItems.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (filter === "price-high") {
      foodItems.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (filter === "rating") {
      foodItems.sort((a, b) => getRating(b.foodPartner?.name || b.name) - getRating(a.foodPartner?.name || a.name));
      partners.sort((a, b) => getRating(b.name) - getRating(a.name));
    } else if (filter === "nearest") {
      foodItems.sort((a, b) => getDistance(a.foodPartner?.name || a.name) - getDistance(b.foodPartner?.name || b.name));
      partners.sort((a, b) => getDistance(a.name) - getDistance(b.name));
    }

    return { foodItems, partners };
  }, [results, filter]);

  const hasResults = sortedData.foodItems.length > 0 || sortedData.partners.length > 0;

  return (
    <main className="min-h-screen bg-ink px-4 py-8 text-neutral-900 pb-28 animate-scale-up">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex items-center gap-3.5">
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-neutral-200/60 shadow-xs hover:text-brand hover:scale-105 active:scale-95 transition duration-200 cursor-pointer">
            <FaArrowLeft className="text-xs" />
          </Link>
          <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">Search</h1>
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white px-4 py-3.5 shadow-sm focus-within:border-brand/40 focus-within:ring-2 focus-within:ring-brand/10 transition-all duration-300">
          <FaMagnifyingGlass className="text-brand text-base shrink-0" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setFilter("default"); // reset filter on type
            }}
            placeholder="Search hotels, dishes, cuisines..."
            className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-neutral-400 text-neutral-800"
          />
        </div>

        {/* Filters bar */}
        {searched && hasResults && (
          <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
            {[
              { id: "default", label: "Default" },
              { id: "price-low", label: "Price: Low to High" },
              { id: "price-high", label: "Price: High to Low" },
              { id: "rating", label: "Top Rated" },
              { id: "nearest", label: "Nearest First" },
            ].map((f) => (
              <button
                type="button"
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold border transition duration-200 cursor-pointer ${
                  filter === f.id
                    ? "bg-brand border-brand text-white shadow-xs"
                    : "bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {loading && <p className="mt-8 text-center text-sm text-neutral-500 animate-pulse font-semibold">Searching our kitchens...</p>}

        {!loading && searched && !hasResults && (
          <p className="mt-8 text-center text-sm text-neutral-500 font-semibold">No results match "{q}"</p>
        )}

        {/* Search Results Sections */}
        {!loading && searched && hasResults && (
          <div className="mt-6 space-y-6">
            
            {/* 1. Restaurants (Hotels) matching */}
            {sortedData.partners.length > 0 && (
              <div className="animate-fade-up">
                <h3 className="mb-3 text-[10px] font-extrabold text-neutral-450 uppercase tracking-wider">Restaurants</h3>
                <ul className="space-y-3">
                  {sortedData.partners.map((partner) => {
                    const rating = getRating(partner.name);
                    const distance = getDistance(partner.name);
                    return (
                      <li key={partner._id}>
                        <Link
                          to={`/partner/${partner._id}`}
                          className="flex items-center gap-4 rounded-2xl bg-white border border-black/5 p-3.5 shadow-sm hover:shadow-md transition duration-200 cursor-pointer"
                        >
                          <div className="h-12 w-12 shrink-0 rounded-xl bg-orange-50/50 border border-orange-100 flex items-center justify-center text-brand">
                            <FaStore className="text-xl" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-extrabold text-neutral-900 truncate tracking-tight">{partner.name}</p>
                            <p className="truncate text-[10px] font-bold text-neutral-400 mt-0.5">
                              📍 {partner.address}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5 text-[9px] font-black text-neutral-500">
                              <span className="bg-green-50 text-green-700 px-1.5 py-0.5 rounded-md border border-green-100/50">★ {rating}</span>
                              <span>•</span>
                              <span>{distance} km away</span>
                            </div>
                          </div>
                          <span className="text-brand font-extrabold text-[10px] uppercase shrink-0">View Menu →</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* 2. Dishes matching */}
            {sortedData.foodItems.length > 0 && (
              <div className="animate-fade-up">
                <h3 className="mb-3 text-[10px] font-extrabold text-neutral-450 uppercase tracking-wider">Dishes</h3>
                <ul className="space-y-3">
                  {sortedData.foodItems.map((food) => {
                    const rating = getRating(food.foodPartner?.name || food.name);
                    const distance = getDistance(food.foodPartner?.name || food.name);
                    return (
                      <li key={food._id}>
                        <Link
                          to={`/partner/${food.foodPartner?._id || food.foodPartner}`}
                          className="flex items-center gap-4 rounded-2xl bg-white border border-black/5 p-3.5 shadow-sm hover:shadow-md transition duration-200 cursor-pointer"
                        >
                          <video src={food.video} muted className="h-16 w-16 shrink-0 rounded-xl object-cover bg-neutral-100 shadow-xs border border-neutral-200" />
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-neutral-950 truncate tracking-tight">{food.name}</p>
                            <p className="truncate text-xs font-semibold text-neutral-400 mt-0.5">
                              {food.foodPartner?.name || "Restaurant"} · <span className="capitalize text-brand/80 font-bold">{food.category}</span>
                            </p>
                            <div className="flex items-center gap-2 mt-1.5 text-[9px] font-black text-neutral-500">
                              <span className="bg-green-50 text-green-700 px-1.5 py-0.5 rounded-md border border-green-100/50">★ {rating}</span>
                              <span>•</span>
                              <span>{distance} km away</span>
                            </div>
                          </div>
                          <span className="font-extrabold text-neutral-900 shrink-0">₹{food.price ?? "—"}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

          </div>
        )}
      </div>
    </main>
  );
};

export default Search;
