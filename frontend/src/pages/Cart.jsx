import { Link, useNavigate } from "react-router-dom";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa6";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { items, totalAmount, setQty, removeItem } = useCart();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-ink px-4 py-8 text-neutral-900 pb-28 animate-scale-up">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex items-center gap-3.5">
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-neutral-200/60 shadow-xs hover:text-brand hover:scale-105 active:scale-95 transition duration-200 cursor-pointer">
            ←
          </Link>
          <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">Your Cart</h1>
        </div>

        {items.length === 0 ? (
          <div className="mt-24 text-center">
            <p className="text-neutral-400 font-semibold text-base">Your cart is feeling light.</p>
            <Link to="/reels" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand hover:underline">Browse food reels →</Link>
          </div>
        ) : (
          <>
            <ul className="space-y-4">
              {items.map(({ food, quantity }) => (
                <li key={food._id} className="flex items-center gap-4 rounded-2xl bg-white border border-black/5 p-4 shadow-sm">
                  <video
                    src={food.video}
                    muted
                    className="h-16 w-16 shrink-0 rounded-xl object-cover bg-neutral-100 shadow-xs border border-neutral-100"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-neutral-900 truncate tracking-tight text-sm leading-snug">{food.name}</p>
                    <p className="text-xs font-bold text-neutral-400 mt-1">₹{food.price}</p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setQty(food._id, quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 hover:bg-neutral-200 hover:scale-105 active:scale-95 text-neutral-700 transition cursor-pointer"
                      aria-label="Decrease"
                    >
                      <FaMinus className="text-[10px]" />
                    </button>
                    <span className="w-5 text-center text-sm font-extrabold text-neutral-800">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQty(food._id, quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 hover:bg-neutral-200 hover:scale-105 active:scale-95 text-neutral-700 transition cursor-pointer"
                      aria-label="Increase"
                    >
                      <FaPlus className="text-[10px]" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(food._id)}
                    className="ml-1 text-neutral-400 hover:text-red-500 hover:scale-110 active:scale-90 transition p-1.5 cursor-pointer"
                    aria-label="Remove"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </li>
              ))}
            </ul>

            {/* Swiggy/Zomato style Bill Details */}
            <div className="mt-8 rounded-2xl bg-white border border-black/5 p-5 shadow-xs space-y-3">
              <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-wider border-b border-neutral-50 pb-2">Bill Details</h3>
              <div className="flex justify-between items-center text-xs text-neutral-550 font-bold">
                <span>Item Total</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-neutral-550 font-bold">
                <span>Delivery Fee</span>
                <span>₹25</span>
              </div>
              <div className="flex justify-between items-center text-xs text-neutral-550 font-bold">
                <span>Platform Fee</span>
                <span>₹5</span>
              </div>
              <div className="flex justify-between items-center text-sm font-black text-neutral-900 border-t border-neutral-50 pt-3">
                <span>Total Amount</span>
                <span className="text-base text-brand">₹{totalAmount + 30}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="mt-6 w-full btn-brand-premium py-4 text-xs font-black tracking-wider uppercase cursor-pointer"
            >
              Proceed to Pay
            </button>
          </>
        )}
      </div>
    </main>
  );
};

export default Cart;
