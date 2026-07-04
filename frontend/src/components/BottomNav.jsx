import { Link, useLocation } from "react-router-dom";
import { FaHouse, FaMagnifyingGlass, FaPlay, FaBagShopping, FaUser } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";

// App-style bottom navigation for logged-in users. Hidden on the full-screen
// reels page and on flows where it would get in the way (cart/checkout/auth).
const HIDE_ON = ["/reels", "/cart", "/checkout", "/food/create", "/partner/dashboard"];

const ITEMS = [
  { to: "/", label: "Home", icon: FaHouse },
  { to: "/search", label: "Search", icon: FaMagnifyingGlass },
  { to: "/reels", label: "Reels", icon: FaPlay },
  { to: "/orders", label: "Orders", icon: FaBagShopping },
  { to: "/settings", label: "Profile", icon: FaUser },
];

const BottomNav = () => {
  const { role } = useAuth();
  const { pathname } = useLocation();

  // only for users, and not on auth pages or hidden routes
  if (role !== "user") return null;
  if (pathname.startsWith("/user/") || pathname.startsWith("/food-partner/")) return null;
  if (HIDE_ON.includes(pathname)) return null;

  return (
    <nav className="fixed inset-x-0 bottom-4 z-40 mx-auto flex max-w-sm items-center justify-around rounded-full border border-white/10 bg-white/[0.06] px-2 py-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
      {ITEMS.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-full py-1.5 text-[10px] font-medium transition ${
              active ? "text-white" : "text-white/45 hover:text-white/70"
            }`}
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                active ? "bg-brand shadow-lg shadow-brand/40" : ""
              }`}
            >
              <Icon className="text-base" />
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
