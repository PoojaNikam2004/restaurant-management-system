"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { MenuItem } from "@/types/menu";

export interface CartLine {
  item: MenuItem;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  setQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  function addItem(item: MenuItem) {
    setLines((prev) => {
      const existing = prev.find((line) => line.item.id === item.id);
      if (existing) {
        return prev.map((line) =>
          line.item.id === item.id
            ? { ...line, quantity: line.quantity + 1 }
            : line
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  }

  function removeItem(itemId: string) {
    setLines((prev) => prev.filter((line) => line.item.id !== itemId));
  }

  function setQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setLines((prev) =>
      prev.map((line) =>
        line.item.id === itemId ? { ...line, quantity } : line
      )
    );
  }

  function clearCart() {
    setLines([]);
  }

  const totalItems = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines]
  );

  const totalPrice = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity * line.item.price, 0),
    [lines]
  );

  return (
    <CartContext.Provider
      value={{
        lines,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        setQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}