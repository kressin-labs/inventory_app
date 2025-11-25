import { createContext, useContext, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  quantity: number; // quantity the user wants (1–5)
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  function addToCart(item: CartItem) {
    setCart(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        // max 5 units
        return prev.map(p =>
          p.id === item.id
            ? { ...p, quantity: Math.min(p.quantity + item.quantity, 5) }
            : p
        );
      }
      return [...prev, item];
    });
  }

  function removeFromCart(id: number) {
    setCart(prev => prev.filter(p => p.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
