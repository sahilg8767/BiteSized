import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "reelo_cart";

// Cart lives client-side (localStorage) until checkout, where it's sent to the
// API. Carts are single-restaurant: adding a dish from another partner asks to
// replace the cart, matching Swiggy/Zomato behaviour.
export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [notice, setNotice] = useState(null); // transient toast text

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const partnerId = items[0]?.food?.foodPartner?._id || items[0]?.food?.foodPartner || null;

  const flash = (text) => setNotice({ text, id: Date.now() });

  const addItem = (food) => {
    const itemPartner = food.foodPartner?._id || food.foodPartner;

    setItems((prev) => {
      const currentPartner = prev[0]?.food?.foodPartner?._id || prev[0]?.food?.foodPartner;
      if (currentPartner && String(currentPartner) !== String(itemPartner)) {
        const ok = window.confirm(
          "Your cart has items from another restaurant. Clear it and add this item?"
        );
        if (!ok) return prev;
        return [{ food, quantity: 1 }];
      }

      const existing = prev.find((i) => i.food._id === food._id);
      if (existing) {
        return prev.map((i) =>
          i.food._id === food._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { food, quantity: 1 }];
    });
    flash(`${food.name} added to cart`);
  };

  const setQty = (foodId, quantity) => {
    if (quantity < 1) return removeItem(foodId);
    setItems((prev) =>
      prev.map((i) => (i.food._id === foodId ? { ...i, quantity } : i))
    );
  };

  const removeItem = (foodId) =>
    setItems((prev) => prev.filter((i) => i.food._id !== foodId));

  const clear = () => setItems([]);

  const { totalItems, totalAmount } = useMemo(() => {
    return items.reduce(
      (acc, i) => {
        acc.totalItems += i.quantity;
        acc.totalAmount += i.quantity * i.food.price;
        return acc;
      },
      { totalItems: 0, totalAmount: 0 }
    );
  }, [items]);

  const value = {
    items,
    partnerId,
    totalItems,
    totalAmount,
    addItem,
    setQty,
    removeItem,
    clear,
    notice,
    clearNotice: () => setNotice(null),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
