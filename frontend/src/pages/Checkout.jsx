import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const { items, totalAmount, clear } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-ink text-neutral-900">
        <p className="text-neutral-500">Your cart is empty.</p>
        <Link to="/reels" className="text-brand">Browse reels →</Link>
      </main>
    );
  }

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setError("Please enter a delivery address");
      return;
    }
    setPlacing(true);
    setError("");
    try {
      await api.post("/api/orders", {
        items: items.map((i) => ({ food: i.food._id, quantity: i.quantity })),
        deliveryAddress: address.trim(),
      });
      clear();
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <main className="min-h-screen bg-ink px-4 py-6 text-neutral-900">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <Link to="/cart" className="text-neutral-600 hover:text-neutral-900">←</Link>
          <h1 className="text-xl font-bold">Checkout</h1>
        </div>

        <section className="rounded-xl bg-white shadow-sm ring-1 ring-black/5 p-4">
          <h2 className="mb-3 text-sm font-semibold text-neutral-600">Order summary</h2>
          <ul className="space-y-2">
            {items.map(({ food, quantity }) => (
              <li key={food._id} className="flex justify-between text-sm">
                <span className="text-neutral-700">{food.name} × {quantity}</span>
                <span>₹{food.price * quantity}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-black/10 pt-3 font-bold">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
        </section>

        <form onSubmit={placeOrder} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-neutral-700">Delivery address</span>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows="3"
              placeholder="House no, street, area, city"
              className="input resize-none"
            />
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={placing}
            className="w-full rounded-full bg-brand py-3 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {placing ? "Placing order..." : `Place order · ₹${totalAmount}`}
          </button>
          <p className="text-center text-xs text-neutral-400">Cash on delivery · demo checkout</p>
        </form>
      </div>
    </main>
  );
};

export default Checkout;
