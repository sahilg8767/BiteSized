import { Link, useNavigate } from "react-router-dom";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa6";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { items, totalAmount, setQty, removeItem } = useCart();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-ink px-4 py-6 text-neutral-900">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <Link to="/" className="text-neutral-600 hover:text-neutral-900">←</Link>
          <h1 className="text-xl font-bold">Your cart</h1>
        </div>

        {items.length === 0 ? (
          <div className="mt-20 text-center text-neutral-500">
            <p>Your cart is empty.</p>
            <Link to="/reels" className="mt-3 inline-block text-brand">Browse reels →</Link>
          </div>
        ) : (
          <>
            <ul className="space-y-3">
              {items.map(({ food, quantity }) => (
                <li key={food._id} className="flex items-center gap-3 rounded-xl bg-white shadow-sm ring-1 ring-black/5 p-3">
                  <video
                    src={food.video}
                    muted
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{food.name}</p>
                    <p className="text-sm text-neutral-500">₹{food.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQty(food._id, quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-black/5"
                      aria-label="Decrease"
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    <span className="w-5 text-center text-sm">{quantity}</span>
                    <button
                      onClick={() => setQty(food._id, quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-black/5"
                      aria-label="Increase"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(food._id)}
                    className="ml-1 text-neutral-500 hover:text-red-400"
                    aria-label="Remove"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-4">
              <span className="text-neutral-600">Total</span>
              <span className="text-xl font-extrabold">₹{totalAmount}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="mt-4 w-full rounded-full bg-brand py-3 font-semibold text-white transition hover:bg-brand-dark"
            >
              Proceed to checkout
            </button>
          </>
        )}
      </div>
    </main>
  );
};

export default Cart;
