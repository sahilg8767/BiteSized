import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaCartPlus, FaArrowLeft } from "react-icons/fa6";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import VideoThumb from "../components/VideoThumb";

const LABELS = {
  veg: "Vegetarian",
  "non-veg": "Non-veg",
  dessert: "Desserts",
  beverage: "Drinks",
  other: "Other",
};

const Category = () => {
  const { category } = useParams();
  const { role } = useAuth();
  const { addItem } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/api/food/category/${category}`)
      .then(({ data }) => setItems(data.foodItems || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <main className="min-h-screen bg-ink px-4 py-8 pb-28 text-neutral-900 animate-scale-up">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex items-center gap-3.5">
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-neutral-200/60 shadow-xs hover:text-brand hover:scale-105 active:scale-95 transition duration-200 cursor-pointer">
            <FaArrowLeft className="text-xs" />
          </Link>
          <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">{LABELS[category] || category}</h1>
        </div>

        {loading && <p className="text-sm text-neutral-500 font-medium py-10 text-center animate-pulse">Loading culinary options...</p>}
        {!loading && items.length === 0 && (
          <p className="mt-20 text-center text-sm text-neutral-500 font-semibold">No dishes in this category yet. Check back soon!</p>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map((food) => (
            <div key={food._id} className="group overflow-hidden rounded-2xl bg-white border border-black/5 shadow-sm hover:shadow-lg transition-all duration-300">
              <Link to={`/partner/${food.foodPartner?._id || food.foodPartner}`} className="block relative aspect-[9/16] w-full overflow-hidden bg-neutral-100">
                <VideoThumb src={food.video} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
              </Link>
              <div className="p-3.5">
                <p className="font-bold text-neutral-900 truncate tracking-tight text-sm leading-snug">{food.name}</p>
                <p className="truncate text-xs font-semibold text-neutral-450 mt-0.5">{food.foodPartner?.name}</p>
                <div className="mt-3.5 flex items-center justify-between">
                  <span className="font-extrabold text-neutral-900 text-base">₹{food.price ?? "—"}</span>
                  {role === "user" && (
                    <button
                      type="button"
                      onClick={() => addItem(food)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-brand to-brand-dark text-white shadow-sm shadow-brand/35 hover:scale-110 active:scale-95 transition duration-200 cursor-pointer"
                      aria-label="Add to cart"
                    >
                      <FaCartPlus className="text-xs" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Category;
