import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const STATUS_STYLES = {
  placed: "bg-blue-100 text-blue-700",
  preparing: "bg-amber-100 text-amber-700",
  "out-for-delivery": "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const formatDate = (iso) =>
  new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/orders/mine")
      .then(({ data }) => setOrders(data.orders || []))
      .catch((err) => setError(err.response?.data?.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-ink px-4 py-6 text-neutral-900">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <Link to="/" className="text-neutral-600 hover:text-neutral-900">←</Link>
          <h1 className="text-xl font-bold">My orders</h1>
        </div>

        {loading && <p className="text-neutral-500">Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && orders.length === 0 && (
          <div className="mt-20 text-center text-neutral-500">
            <p>No orders yet.</p>
            <Link to="/reels" className="mt-3 inline-block text-brand">Order something →</Link>
          </div>
        )}

        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order._id} className="rounded-xl bg-white shadow-sm ring-1 ring-black/5 p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{order.foodPartner?.name || "Restaurant"}</span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                    STATUS_STYLES[order.status] || "bg-black/5 text-neutral-600"
                  }`}
                >
                  {order.status.replace(/-/g, " ")}
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-400">{formatDate(order.createdAt)}</p>

              <ul className="mt-3 space-y-1 text-sm text-neutral-700">
                {order.items.map((it, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{it.name} × {it.quantity}</span>
                    <span>₹{it.price * it.quantity}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex justify-between border-t border-black/10 pt-2 text-sm font-bold">
                <span>Total</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default Orders;
