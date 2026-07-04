import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const { account, updateProfile, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: account?.fullName || "",
    phone: account?.phone || "",
    address: account?.address || "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [saving, setSaving] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: "", message: "" });
    try {
      await updateProfile(form);
      setStatus({ type: "success", message: "Profile updated" });
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || "Update failed" });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/user/login");
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete your account permanently? This cannot be undone.")) return;
    try {
      await deleteAccount();
      navigate("/user/register");
    } catch {
      setStatus({ type: "error", message: "Could not delete account" });
    }
  };

  return (
    <main className="min-h-screen bg-ink px-4 py-6 pb-24 text-white">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <Link to="/" className="text-white/70 hover:text-white">←</Link>
          <h1 className="text-xl font-bold">Profile & settings</h1>
        </div>

        {/* identity */}
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/15 text-xl text-brand">
            <FaUser />
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold">{account?.fullName || "User"}</p>
            <p className="truncate text-sm text-white/50">{account?.email}</p>
          </div>
        </div>

        {/* edit form */}
        <form onSubmit={save} className="space-y-4 rounded-2xl bg-surface p-5">
          <Field label="Full name">
            <input name="fullName" value={form.fullName} onChange={onChange} className="input" required />
          </Field>
          <Field label="Phone number">
            <input name="phone" value={form.phone} onChange={onChange} className="input" placeholder="Add your phone" />
          </Field>
          <Field label="Delivery address">
            <textarea name="address" value={form.address} onChange={onChange} rows="2" className="input resize-none" placeholder="Add your address" />
          </Field>

          {status.message && (
            <p className={status.type === "error" ? "text-sm text-red-400" : "text-sm text-green-400"}>
              {status.message}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-brand py-3 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>

        {/* account actions */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full rounded-full border border-white/15 py-3 font-medium text-white transition hover:bg-white/5"
          >
            Logout
          </button>
          <button
            onClick={handleDelete}
            className="w-full rounded-full py-3 font-medium text-red-400 transition hover:bg-red-500/10"
          >
            Delete account
          </button>
        </div>
      </div>
    </main>
  );
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-medium text-white/80">{label}</span>
    {children}
  </label>
);

export default Settings;
