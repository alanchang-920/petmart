import { useCallback, useMemo, useState } from "react";
import storage from "../utils/storage";
import { placeOrder } from "../services/cartService";

const CART_STORAGE_KEY = "cartItems";

/**
 * useShopCart — customer-facing shopping cart state.
 *
 * Items live in localStorage (so they survive a refresh) and are mirrored to
 * React state. This hook is the *only* source of truth for cart contents;
 * callers compute "displayed stock" as `rawStock - cartQuantity` at render
 * time rather than mutating the product list.
 *
 * @param {object} options
 * @param {(message: string, type?: "success" | "error") => void} options.onNotify
 *        Toast callback used to surface success/error feedback to the user.
 */
export default function useShopCart({ onNotify, onOrderSuccess } = {}) {
  const [cartItems, setCartItems] = useState(
    () => storage.getItem(CART_STORAGE_KEY) || []
  );

  const persist = useCallback((items) => {
    setCartItems(items);
    storage.setItem(CART_STORAGE_KEY, items);
  }, []);

  const reload = useCallback(() => {
    setCartItems(storage.getItem(CART_STORAGE_KEY) || []);
  }, []);

  const clear = useCallback(() => {
    storage.remove(CART_STORAGE_KEY);
    setCartItems([]);
  }, []);

  // Fast lookup: product_id -> quantity in cart.
  const quantityById = useMemo(() => {
    const map = {};
    cartItems.forEach((i) => {
      map[i.product_id] = i.quantity;
    });
    return map;
  }, [cartItems]);

  /** Returns a product list with stock decreased by the quantity in cart. */
  const applyCartToProducts = useCallback(
    (products) =>
      products.map((product) => {
        const inCartQty = quantityById[product.id] || 0;
        return inCartQty > 0
          ? { ...product, stock: product.stock - inCartQty }
          : product;
      }),
    [quantityById]
  );

  const addToCart = useCallback(
    (productId) => {
      setCartItems((prev) => {
        const existing = prev.find((i) => i.product_id === productId);
        const next = existing
          ? prev.map((i) =>
              i.product_id === productId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          : [...prev, { product_id: productId, quantity: 1 }];
        storage.setItem(CART_STORAGE_KEY, next);
        return next;
      });
      onNotify?.("Added to cart!", "success");
    },
    [onNotify]
  );

  const updateQuantity = useCallback(
    (productId, newQuantity) => {
      setCartItems((prev) => {
        const next = prev.map((i) =>
          i.product_id === productId ? { ...i, quantity: newQuantity } : i
        );
        storage.setItem(CART_STORAGE_KEY, next);
        return next;
      });
      onNotify?.("Cart updated!", "success");
    },
    [onNotify]
  );

  const removeFromCart = useCallback(
    (productId) => {
      setCartItems((prev) => {
        const next = prev.filter((i) => i.product_id !== productId);
        storage.setItem(CART_STORAGE_KEY, next);
        return next;
      });
      onNotify?.("Removed from cart!", "success");
    },
    [onNotify]
  );

  const submitOrder = useCallback(
    async (shipping = {}) => {
      if (cartItems.length === 0) {
        onNotify?.("Your cart is empty", "error");
        return;
      }
      if (
        !shipping.recipient_name ||
        !shipping.phone ||
        !shipping.shipping_address
      ) {
        onNotify?.("Please fill in name, phone and address", "error");
        return;
      }
      const payload = {
        items: cartItems.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
        })),
        recipient_name: shipping.recipient_name,
        phone: shipping.phone,
        shipping_address: shipping.shipping_address,
        note: shipping.note || null,
      };
      try {
        await placeOrder(payload);
        onNotify?.("Order placed successfully!", "success");
        clear();
        // Stock on the server changed — let the caller refresh the catalog.
        onOrderSuccess?.();
      } catch (err) {
        console.error("Failed to place order:", err);
        onNotify?.("Failed to place order", "error");
      }
    },
    [cartItems, clear, onNotify, onOrderSuccess]
  );

  const itemCount = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.quantity, 0),
    [cartItems]
  );

  const getCartQuantity = useCallback(
    (productId) => quantityById[productId] || 0,
    [quantityById]
  );

  return {
    cartItems,
    itemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    submitOrder,
    clear,
    reload,
    applyCartToProducts,
    getCartQuantity,
  };
}
