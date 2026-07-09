import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const STATUS_STYLES = {
  placed: "bg-blue-50 text-blue-600 border border-blue-100",
  preparing: "bg-amber-50 text-amber-600 border border-amber-100",
  "out-for-delivery": "bg-purple-50 text-purple-600 border border-purple-100",
  delivered: "bg-green-50 text-green-600 border border-green-100",
  cancelled: "bg-red-50 text-red-600 border border-red-100",
};

const formatDate = (iso) =>
  new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/orders/mine")
      .then(({ data }) => setOrders(data.orders || []))
      .catch((err) => setError(err.response?.data?.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (filter === "all") return true;
    if (filter === "placed") return o.status === "placed";
    if (filter === "preparing") return o.status === "preparing";
    if (filter === "delivered") return o.status === "delivered";
    return true;
  });

  return (
    <main className="min-h-screen bg-ink px-4 py-8 text-neutral-900 pb-28 animate-scale-up">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex items-center gap-3.5">
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-neutral-200/60 shadow-xs hover:text-brand hover:scale-105 active:scale-95 transition duration-200 cursor-pointer">
            ←
          </Link>
          <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">My Orders</h1>
        </div>

        {/* Tab filters bar */}
        {!loading && !error && orders.length > 0 && (
          <div className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1">
            {[
              { id: "all", label: "All" },
              { id: "placed", label: "Placed" },
              { id: "preparing", label: "Preparing" },
              { id: "delivered", label: "Delivered" },
            ].map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => setFilter(t.id)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold border transition duration-200 cursor-pointer ${
                  filter === t.id
                    ? "bg-brand border-brand text-white shadow-xs"
                    : "bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {loading && <p className="text-sm text-neutral-500 font-medium py-10 text-center animate-pulse">Fetching your order history...</p>}
        {error && <p className="text-sm font-bold text-red-500 py-6 text-center">{error}</p>}

        {!loading && !error && filteredOrders.length === 0 && (
          <div className="mt-24 text-center animate-fade-up">
            <p className="text-neutral-450 font-semibold text-base">No orders match this status.</p>
            <Link to="/" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand hover:underline">Order something delicious →</Link>
          </div>
        )}

        <ul className="space-y-4">
          {filteredOrders.map((order) => (
            <li key={order._id} className="rounded-2xl bg-white border border-black/5 p-5 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between gap-3">
                <span className="font-extrabold text-neutral-900 truncate tracking-tight">{order.foodPartner?.name || "Restaurant"}</span>
                <span
                  className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    STATUS_STYLES[order.status] || "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {order.status.replace(/-/g, " ")}
                </span>
              </div>
              <p className="mt-1 text-[10px] font-bold text-neutral-400">{formatDate(order.createdAt)}</p>

              <ul className="mt-4 space-y-2 border-t border-b border-neutral-50 py-3 text-sm text-neutral-600">
                {order.items.map((it) => (
                  <li key={it.food} className="flex justify-between items-center">
                    <span className="font-medium">{it.name} <span className="text-xs font-bold text-neutral-400">×{it.quantity}</span></span>
                    <span className="font-bold text-neutral-800">₹{it.price * it.quantity}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex justify-between items-center text-sm font-black text-neutral-900">
                <span>Amount Paid</span>
                <span className="text-base text-brand">₹{order.totalAmount}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default Orders;
