import { useEffect } from "react";
import { useCart } from "../context/CartContext";

// Small transient toast shown when an item is added to the cart.
const CartToast = () => {
  const { notice, clearNotice } = useCart();

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(clearNotice, 2000);
    return () => clearTimeout(t);
  }, [notice, clearNotice]);

  if (!notice) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
      <div className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-lg">
        {notice.text}
      </div>
    </div>
  );
};

export default CartToast;
