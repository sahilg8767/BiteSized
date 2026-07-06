import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaCartPlus } from "react-icons/fa6";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

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
    <main className="min-h-screen bg-ink px-4 py-6 pb-24 text-neutral-900">
      <div className="mx-auto max-w-2xl">
        <div className="mb-5 flex items-center gap-3">
          <Link to="/" className="text-neutral-600 hover:text-neutral-900">←</Link>
          <h1 className="text-xl font-bold">{LABELS[category] || category}</h1>
        </div>

        {loading && <p className="text-sm text-neutral-500">Loading...</p>}
        {!loading && items.length === 0 && (
          <p className="mt-10 text-center text-sm text-neutral-500">No dishes in this category yet.</p>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((food) => (
            <div key={food._id} className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
              <Link to={`/partner/${food.foodPartner?._id || food.foodPartner}`}>
                <video src={food.video} muted className="aspect-9/16 w-full object-cover" />
              </Link>
              <div className="p-3">
                <p className="truncate text-sm font-medium">{food.name}</p>
                <p className="truncate text-xs text-neutral-500">{food.foodPartner?.name}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold">₹{food.price ?? "—"}</span>
                  {role === "user" && (
                    <button
                      onClick={() => addItem(food)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white"
                      aria-label="Add to cart"
                    >
                      <FaCartPlus className="text-sm" />
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
