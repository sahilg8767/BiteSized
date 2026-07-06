import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const STATUS_FLOW = ["placed", "preparing", "out-for-delivery", "delivered", "cancelled"];

const formatDate = (iso) =>
  new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

const PartnerDashboard = () => {
  const { account } = useAuth();
  const [reels, setReels] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get("/api/food/partner/mine"), api.get("/api/orders/partner")])
      .then(([r, o]) => {
        setReels(r.data.foodItems || []);
        setOrders(o.data.orders || []);
      })
      .catch((err) => setError(err.response?.data?.message || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.totalAmount, 0);
    return { reels: reels.length, orders: orders.length, revenue };
  }, [reels, orders]);

  const updateStatus = async (orderId, status) => {
    const prev = orders;
    setOrders((os) => os.map((o) => (o._id === orderId ? { ...o, status } : o)));
    try {
      await api.patch(`/api/orders/${orderId}/status`, { status });
    } catch {
      setOrders(prev); // revert on failure
    }
  };

  return (
    <main className="min-h-screen bg-ink px-4 py-6 text-neutral-900">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-brand">{account?.name || "Restaurant"}</p>
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="rounded-full bg-black/5 px-4 py-2 text-sm">View feed</Link>
            <Link to="/food/create" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">
              + Upload reel
            </Link>
          </div>
        </div>

        {loading && <p className="text-neutral-500">Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && (
          <>
            {/* stats */}
            <div className="grid grid-cols-3 gap-3">
              <StatCard label="Reels" value={stats.reels} />
              <StatCard label="Orders" value={stats.orders} />
              <StatCard label="Revenue" value={`₹${stats.revenue}`} />
            </div>

            {/* incoming orders */}
            <section className="mt-8">
              <h2 className="mb-3 text-lg font-semibold">Incoming orders</h2>
              {orders.length === 0 ? (
                <p className="text-sm text-neutral-500">No orders yet.</p>
              ) : (
                <ul className="space-y-3">
                  {orders.map((order) => (
                    <li key={order._id} className="rounded-xl bg-white shadow-sm ring-1 ring-black/5 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium">{order.user?.fullName || "Customer"}</p>
                          <p className="text-xs text-neutral-400">{formatDate(order.createdAt)}</p>
                          <p className="mt-2 text-sm text-neutral-600">
                            {order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                          </p>
                          <p className="mt-1 text-xs text-neutral-500">📍 {order.deliveryAddress}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{order.totalAmount}</p>
                          <select
                            value={order.status}
                            onChange={(e) => updateStatus(order._id, e.target.value)}
                            className="input mt-2 !w-auto !py-1.5 text-sm capitalize"
                          >
                            {STATUS_FLOW.map((s) => (
                              <option key={s} value={s}>{s.replace(/-/g, " ")}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* my reels */}
            <section className="mt-8">
              <h2 className="mb-3 text-lg font-semibold">My reels</h2>
              {reels.length === 0 ? (
                <p className="text-sm text-neutral-500">No reels uploaded yet.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {reels.map((food) => (
                    <div key={food._id} className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5">
                      <video src={food.video} muted className="aspect-9/16 w-full object-cover" />
                      <div className="p-2">
                        <p className="truncate text-xs font-medium">{food.name}</p>
                        <p className="text-xs text-neutral-500">₹{food.price ?? "—"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
};

const StatCard = ({ label, value }) => (
  <div className="rounded-xl bg-white shadow-sm ring-1 ring-black/5 p-4 text-center">
    <p className="text-2xl font-extrabold">{value}</p>
    <p className="text-xs text-neutral-500">{label}</p>
  </div>
);

export default PartnerDashboard;
