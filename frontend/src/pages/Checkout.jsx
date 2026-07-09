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
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink text-neutral-900 animate-scale-up">
        <p className="text-neutral-400 font-semibold text-base">Your cart is empty.</p>
        <Link to="/reels" className="text-brand font-bold text-sm hover:underline">Browse reels →</Link>
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
    <main className="min-h-screen bg-ink px-4 py-8 text-neutral-900 pb-28 animate-scale-up">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex items-center gap-3.5">
          <Link to="/cart" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-neutral-200/60 shadow-xs hover:text-brand hover:scale-105 active:scale-95 transition duration-200 cursor-pointer">
            ←
          </Link>
          <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">Checkout</h1>
        </div>

        <section className="rounded-2xl bg-white border border-black/5 p-5 shadow-sm">
          <h2 className="mb-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">Order Summary</h2>
          <ul className="space-y-3">
            {items.map(({ food, quantity }) => (
              <li key={food._id} className="flex justify-between text-sm items-center">
                <span className="font-semibold text-neutral-700">{food.name} <span className="text-xs font-bold text-neutral-400">×{quantity}</span></span>
                <span className="font-bold text-neutral-800">₹{food.price * quantity}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-black/5 pt-4 font-black text-neutral-900">
            <span>To Pay</span>
            <span className="text-lg text-brand">₹{totalAmount}</span>
          </div>
        </section>

        <form onSubmit={placeOrder} className="mt-6 space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs font-bold text-neutral-500 uppercase tracking-wider">Delivery Address</span>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows="3"
              placeholder="House/Flat number, Street, Landmark, City..."
              className="input-premium resize-none text-sm"
              required
            />
          </label>

          {error && <p className="text-sm font-bold text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={placing}
            className="w-full btn-brand-premium py-3.5 text-sm cursor-pointer"
          >
            {placing ? "Confirming Order..." : `Place Order · ₹${totalAmount}`}
          </button>
          <p className="text-center text-xs font-bold text-neutral-400">Cash on Delivery · Secure Demo Checkout</p>
        </form>
      </div>
    </main>
  );
};

export default Checkout;
