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
    <nav className="fixed bottom-0 inset-x-0 z-40 mx-auto flex max-w-md items-center justify-around border-t border-neutral-100 bg-white/95 backdrop-blur-md px-2 py-2.5 pb-3 shadow-md">
      {ITEMS.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center gap-1 py-0.5 text-[9px] font-black tracking-wider uppercase transition duration-200 active:scale-90 ${
              active ? "text-brand" : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            <Icon className={`text-xl transition duration-200 ${active ? "scale-110 text-brand" : "text-neutral-400"}`} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
