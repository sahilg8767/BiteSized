import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import VideoThumb from "../components/VideoThumb";
import { FaGear, FaTrash } from "react-icons/fa6";

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

  const handleDeleteReel = async (reelId) => {
    if (!window.confirm("Are you sure you want to delete this reel? This action cannot be undone.")) return;
    try {
      await api.delete(`/api/food/${reelId}`);
      setReels((prev) => prev.filter((r) => r._id !== reelId));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete reel");
    }
  };

  return (
    <main className="min-h-screen bg-ink px-4 py-8 text-neutral-900 pb-28 animate-scale-up">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-brand uppercase tracking-wider">{account?.name || "Restaurant Partner"}</p>
            <h1 className="text-2xl font-black text-neutral-950 tracking-tight mt-1">Partner Dashboard</h1>
          </div>
          <div className="flex items-center gap-2.5">
            <Link to="/settings" className="flex h-9.5 w-9.5 items-center justify-center rounded-xl bg-white border border-neutral-200/60 shadow-xs text-neutral-500 hover:text-brand hover:scale-105 active:scale-95 transition duration-200 cursor-pointer" aria-label="Settings">
              <FaGear className="text-sm" />
            </Link>
            <Link to="/" className="btn-secondary-premium px-4 py-2.5 text-xs cursor-pointer">View Feed</Link>
            <Link to="/food/create" className="btn-brand-premium px-4 py-2.5 text-xs cursor-pointer">
              + Upload Reel
            </Link>
          </div>
        </div>

        {loading && <p className="text-neutral-500 font-medium text-center py-10 animate-pulse">Loading dashboard metrics...</p>}
        {error && <p className="text-red-500 font-bold text-center py-6">{error}</p>}

        {!loading && !error && (
          <>
            {/* stats */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Active Reels" value={stats.reels} emoji="🎬" />
              <StatCard label="Total Orders" value={stats.orders} emoji="🛍️" />
              <StatCard label="Gross Earnings" value={`₹${stats.revenue}`} emoji="💰" highlight />
            </div>

            {/* incoming orders */}
            <section className="mt-10">
              <h2 className="mb-4 text-base font-extrabold text-neutral-900 tracking-tight">Incoming Orders</h2>
              {orders.length === 0 ? (
                <p className="text-sm text-neutral-500 font-medium py-10 text-center bg-white border border-black/5 rounded-2xl shadow-xs">No orders received yet.</p>
              ) : (
                <ul className="space-y-4">
                  {orders.map((order) => (
                    <li key={order._id} className="rounded-2xl bg-white border border-black/5 p-5 shadow-xs hover:shadow-md transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="font-extrabold text-neutral-950 text-base">{order.user?.fullName || "Customer"}</p>
                          <p className="text-[10px] font-bold text-neutral-400 mt-0.5">{formatDate(order.createdAt)}</p>
                          <p className="mt-3 text-sm font-semibold text-neutral-700 bg-neutral-50 p-3 rounded-xl border border-neutral-100/50">
                            {order.items.map((i) => `${i.name} × ${i.quantity}`).join(", ")}
                          </p>
                          <p className="mt-2 text-xs font-semibold text-neutral-500 flex items-center gap-1">📍 {order.deliveryAddress}</p>
                        </div>
                        <div className="sm:text-right shrink-0 flex sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-2.5">
                          <div>
                            <p className="text-xs font-bold text-neutral-400">Order Value</p>
                            <p className="font-black text-neutral-900 text-lg sm:mt-0.5">₹{order.totalAmount}</p>
                          </div>
                          <select
                            value={order.status}
                            onChange={(e) => updateStatus(order._id, e.target.value)}
                            className="input-premium !w-auto !py-1.5 !px-3 text-xs capitalize font-bold bg-white text-neutral-800 border-neutral-200"
                            aria-label="Update order status"
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
            <section className="mt-10">
              <h2 className="mb-4 text-base font-extrabold text-neutral-900 tracking-tight">My Uploaded Reels</h2>
              {reels.length === 0 ? (
                <p className="text-sm text-neutral-500 font-medium py-10 text-center bg-white border border-black/5 rounded-2xl shadow-xs">No reels uploaded yet.</p>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {reels.map((food) => (
                    <div key={food._id} className="group overflow-hidden rounded-2xl bg-white border border-black/5 shadow-xs hover:shadow-md transition-all duration-300">
                      <div className="relative aspect-[9/16] w-full overflow-hidden bg-neutral-100">
                        <VideoThumb src={food.video} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                        <button
                          type="button"
                          onClick={() => handleDeleteReel(food._id)}
                          className="absolute top-2.5 right-2.5 z-10 flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-black/40 text-white backdrop-blur border border-white/10 shadow-xs hover:bg-red-500 hover:text-white transition duration-200 cursor-pointer"
                          aria-label="Delete Reel"
                        >
                          <FaTrash className="text-[10px]" />
                        </button>
                      </div>
                      <div className="p-3">
                        <p className="font-bold text-neutral-950 truncate tracking-tight text-xs">{food.name}</p>
                        <p className="text-xs font-black text-brand mt-0.5">₹{food.price ?? "—"}</p>
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

const StatCard = ({ label, value, emoji, highlight }) => (
  <div className={`rounded-2xl border p-5 text-center shadow-xs transition duration-300 ${
    highlight 
      ? "bg-gradient-to-br from-brand-light to-orange-100/30 border-brand/20 text-brand" 
      : "bg-white border-black/5 text-neutral-900"
  }`}>
    <span className="text-xl block mb-2">{emoji}</span>
    <p className="text-2xl font-black tracking-tight">{value}</p>
    <p className={`text-[10px] font-bold mt-1 uppercase tracking-wider ${highlight ? "text-brand/80" : "text-neutral-450"}`}>{label}</p>
  </div>
);

export default PartnerDashboard;
