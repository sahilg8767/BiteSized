import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaBookmark, FaArrowLeft, FaStore } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

// Modular Settings Header
const SettingsHeader = ({ isPartner }) => (
  <div className="mb-6 flex items-center gap-3.5">
    <Link
      to={isPartner ? "/partner/dashboard" : "/"}
      className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-neutral-200/60 shadow-xs hover:text-brand hover:scale-105 active:scale-95 transition duration-200 cursor-pointer"
    >
      <FaArrowLeft className="text-xs" />
    </Link>
    <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">Settings</h1>
  </div>
);

// Modular User Identity Info Card
const IdentityCard = ({ isPartner, account }) => (
  <div className="mb-5 flex items-center gap-4 rounded-2xl bg-white border border-black/5 p-4 shadow-xs">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-100 border border-neutral-200 text-lg text-neutral-500 font-extrabold shadow-inner">
      {isPartner
        ? (account?.name ? account.name.slice(0, 2).toUpperCase() : "R")
        : (account?.fullName ? account.fullName.slice(0, 2).toUpperCase() : "U")}
    </div>
    <div className="min-w-0">
      <p className="truncate font-black text-neutral-900 leading-tight">
        {isPartner ? account?.name : account?.fullName}
      </p>
      <p className="truncate text-xs font-semibold text-neutral-400 mt-1">{account?.email}</p>
    </div>
  </div>
);

// Modular Shortcut Link card depending on role
const ShortcutCard = ({ isPartner }) => {
  if (isPartner) {
    return (
      <Link
        to="/partner/dashboard"
        className="mb-5 flex items-center justify-between rounded-2xl bg-white border border-black/5 p-4 shadow-sm hover:shadow-md transition duration-200 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-brand border border-orange-100/50 shadow-xs">
            <FaStore className="text-xs" />
          </span>
          <div className="text-left">
            <span className="block text-xs font-black text-neutral-850">Partner Dashboard</span>
            <span className="block text-[9px] font-bold text-neutral-400 mt-0.5">Manage your restaurant orders & reels</span>
          </div>
        </div>
        <span className="text-neutral-400 font-bold text-sm">→</span>
      </Link>
    );
  }
  return (
    <Link
      to="/saved"
      className="mb-5 flex items-center justify-between rounded-2xl bg-white border border-black/5 p-4 shadow-sm hover:shadow-md transition duration-200 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-500 border border-amber-100/50 shadow-xs">
          <FaBookmark className="text-xs" />
        </span>
        <div className="text-left">
          <span className="block text-xs font-black text-neutral-850">Saved Reels</span>
          <span className="block text-[9px] font-bold text-neutral-400 mt-0.5">Your favorite food reels</span>
        </div>
      </div>
      <span className="text-neutral-400 font-bold text-sm">→</span>
    </Link>
  );
};

// Modular settings list row
const MenuRow = ({ icon, label, rightText }) => (
  <div className="flex items-center justify-between p-4 hover:bg-neutral-50 transition cursor-pointer border-t border-neutral-100 first:border-t-0">
    <div className="flex items-center gap-3">
      <span className="text-neutral-500 text-sm">{icon}</span>
      <span className="text-xs font-extrabold text-neutral-800">{label}</span>
    </div>
    {rightText ? (
      <span className="text-[10px] font-extrabold text-neutral-400 flex items-center gap-1">
        {rightText} <span className="text-xs">→</span>
      </span>
    ) : (
      <span className="text-neutral-400 font-bold text-xs">→</span>
    )}
  </div>
);

// Modular toggle switch list row
const ToggleRow = ({ icon, label, checked, onChange, ariaLabel }) => (
  <div className="flex items-center justify-between p-4 border-t border-neutral-100">
    <div className="flex items-center gap-3">
      <span className="text-neutral-500 text-sm">{icon}</span>
      <span className="text-xs font-extrabold text-neutral-800">{label}</span>
    </div>
    <label className="toggle-switch">
      <input type="checkbox" checked={checked} aria-label={ariaLabel} onChange={onChange} />
      <span className="toggle-slider" />
    </label>
  </div>
);

// Modular Edit profile / Restaurant Details Form
const EditDetailsForm = ({ isPartner, form, onChange, save, saving, status }) => (
  <form onSubmit={save} className="space-y-4">
    {isPartner ? (
      <>
        <Field label="Restaurant Name">
          <input name="name" value={form.name} onChange={onChange} className="input-premium text-xs bg-white py-2" required />
        </Field>
        <Field label="Contact Person">
          <input name="contactName" value={form.contactName} onChange={onChange} className="input-premium text-xs bg-white py-2" required />
        </Field>
        <Field label="Phone Number">
          <input name="phone" value={form.phone} onChange={onChange} className="input-premium text-xs bg-white py-2" required />
        </Field>
        <Field label="Restaurant Address">
          <textarea name="address" value={form.address} onChange={onChange} rows="2" className="input-premium resize-none text-xs bg-white py-2" required />
        </Field>
      </>
    ) : (
      <>
        <Field label="Full Name">
          <input name="fullName" value={form.fullName} onChange={onChange} className="input-premium text-xs bg-white py-2" required />
        </Field>
        <Field label="Phone Number">
          <input name="phone" value={form.phone} onChange={onChange} className="input-premium text-xs bg-white py-2" placeholder="e.g. +91 98765 43210" />
        </Field>
        <Field label="Delivery Address">
          <textarea name="address" value={form.address} onChange={onChange} rows="2" className="input-premium resize-none text-xs bg-white py-2" placeholder="Enter default delivery address..." />
        </Field>
      </>
    )}
    
    {status.message && (
      <p className={status.type === "error" ? "text-[10px] font-bold text-red-500 animate-pulse" : "text-[10px] font-bold text-green-500"}>
        {status.message}
      </p>
    )}
    <button type="submit" disabled={saving} className="w-full btn-brand-premium py-2.5 text-xs cursor-pointer">
      {saving ? "Saving..." : "Save Changes"}
    </button>
  </form>
);

const Settings = () => {
  const { account, role, updateProfile, logout, deleteAccount, setSession } = useAuth();
  const navigate = useNavigate();

  const isPartner = role === "food-partner";

  const [form, setForm] = useState({
    fullName: account?.fullName || "",
    name: account?.name || "",
    contactName: account?.contactName || "",
    phone: account?.phone || "",
    address: account?.address || "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark") || localStorage.getItem("theme") === "dark";
  });
  const [notif, setNotif] = useState(true);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: "", message: "" });
    try {
      if (isPartner) {
        const { data } = await api.patch("/api/auth/food-partner/profile", {
          name: form.name,
          contactName: form.contactName,
          phone: form.phone,
          address: form.address,
        });
        setSession("food-partner", data.foodPartner);
        setStatus({ type: "success", message: "Restaurant profile updated successfully" });
      } else {
        await updateProfile({
          fullName: form.fullName,
          phone: form.phone,
          address: form.address,
        });
        setStatus({ type: "success", message: "Profile updated successfully" });
      }
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || "Update failed" });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate(isPartner ? "/food-partner/login" : "/user/login");
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
    <main className="min-h-screen bg-ink px-4 py-8 text-neutral-900 pb-28 animate-scale-up">
      <div className="mx-auto max-w-md">
        <SettingsHeader isPartner={isPartner} />
        
        <IdentityCard isPartner={isPartner} account={account} />
        
        <ShortcutCard isPartner={isPartner} />

        {/* 3. Settings options list (Collapsible edit profile + support rows) */}
        <div className="space-y-1 bg-white border border-black/5 rounded-2xl overflow-hidden shadow-xs">
          
          {/* Edit Profile / Addresses Row */}
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition duration-200 cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-neutral-500 text-sm">📍</span>
              <span className="text-xs font-extrabold text-neutral-800">
                {isPartner ? "Restaurant Details" : "Addresses"}
              </span>
            </div>
            <span className="text-neutral-400 text-xs font-bold">{showForm ? "▲" : "▼"}</span>
          </button>

          {/* Collapsible Edit Address form */}
          {showForm && (
            <div className="border-t border-neutral-100 p-4 bg-neutral-50/50 animate-fade-up">
              <EditDetailsForm
                isPartner={isPartner}
                form={form}
                onChange={onChange}
                save={save}
                saving={saving}
                status={status}
              />
            </div>
          )}

          <MenuRow icon="💳" label="Payment Methods" />
          <MenuRow icon="🎧" label="Help & Support" />
        </div>

        {/* 4. Preferences Section */}
        <div className="mt-5 space-y-1 bg-white border border-black/5 rounded-2xl overflow-hidden shadow-xs">
          <ToggleRow
            icon="🌙"
            label="Dark Mode"
            checked={darkMode}
            ariaLabel="Toggle Dark Mode"
            onChange={(e) => {
              const val = e.target.checked;
              setDarkMode(val);
              if (val) {
                document.documentElement.classList.add("dark");
                localStorage.setItem("theme", "dark");
              } else {
                document.documentElement.classList.remove("dark");
                localStorage.setItem("theme", "light");
              }
            }}
          />
          <ToggleRow
            icon="🔔"
            label="Notifications"
            checked={notif}
            ariaLabel="Toggle Notifications"
            onChange={(e) => setNotif(e.target.checked)}
          />
          <MenuRow icon="🌐" label="Location" rightText={account?.address ? account.address.split(",")[0] : "Noida, India"} />
          <MenuRow icon="🗣️" label="Language" rightText="English" />
        </div>

        {/* 5. Legal Section */}
        <div className="mt-5 space-y-1 bg-white border border-black/5 rounded-2xl overflow-hidden shadow-xs">
          <MenuRow icon="📄" label="About Us" />
          <MenuRow icon="🔒" label="Privacy Policy" />
          <MenuRow icon="⚖️" label="Terms & Conditions" />
        </div>

        {/* 6. Account actions */}
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-2xl border border-black/5 bg-white py-3.5 text-xs font-extrabold text-red-500 hover:bg-red-50 hover:text-red-650 transition duration-200 cursor-pointer shadow-xs"
          >
            Logout
          </button>
          {!isPartner && (
            <button
              type="button"
              onClick={handleDelete}
              className="w-full py-2.5 text-[10px] font-extrabold text-neutral-400 hover:text-red-500 hover:underline transition duration-200 cursor-pointer"
            >
              Delete account permanently
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-[10px] font-black text-neutral-455 uppercase tracking-wider">{label}</span>
    {children}
  </label>
);

export default Settings;
