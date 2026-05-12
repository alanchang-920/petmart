import { useCallback, useEffect, useRef, useState } from "react";
import api from "../services/api";

// How many carts the admin table shows per page (matches the API `limit`).
const PAGE_SIZE = 10;

/**
 * useCarts — data layer for the admin "Cart Management" screen.
 *
 * Responsibilities:
 *  - fetch carts one page at a time from `GET /cart/`
 *  - re-fetch automatically when the page changes
 *  - expose actions to update / delete a cart and keep local state in sync
 *  - expose pagination state + navigation helpers
 *
 * @param {(message: string, type?: "success" | "error") => void} [onNotify]
 *        Optional toast callback. It is stored in a ref so that passing a new
 *        function each render does NOT cause an extra fetch.
 *
 * @returns {{
 *   carts: any[],            // carts currently displayed
 *   page: number,            // 1-based current page
 *   loading: boolean,        // a request is in flight
 *   hasNextPage: boolean,    // true while a next page might exist
 *   pageSize: number,        // PAGE_SIZE constant
 *   refresh: () => Promise<void>,   // re-fetch the current page
 *   updateCart: (cartId: number, body: object) => Promise<void>,
 *   deleteCart: (cartId: number) => Promise<void>,
 *   goToPrevPage: () => void,
 *   goToNextPage: () => void,
 * }}
 */
export default function useCarts(onNotify) {
  const [carts, setCarts] = useState([]);   // current page of carts
  const [page, setPage] = useState(1);      // 1-based page index
  const [loading, setLoading] = useState(false);

  // Keep the latest onNotify in a ref. Effects/callbacks below depend on
  // `notify` (stable) instead of `onNotify` (new identity each render),
  // so the cart list isn't re-fetched just because the parent re-rendered.
  const notifyRef = useRef(onNotify);
  useEffect(() => {
    notifyRef.current = onNotify;
  }, [onNotify]);

  // Stable wrapper around the notify callback; safe to use as a dep.
  const notify = useCallback((message, type = "success") => {
    notifyRef.current?.(message, type);
  }, []);

  // Fetch the current page of carts. Re-created only when `page` changes.
  const fetchCarts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/cart/", {
        params: { page, limit: PAGE_SIZE },
      });
      setCarts(data);
    } catch (error) {
      console.error("Failed to fetch carts:", error);
      notify("Failed to load carts", "error");
    } finally {
      setLoading(false);
    }
  }, [page, notify]);

  // Initial load + reload whenever the page (and thus fetchCarts) changes.
  useEffect(() => {
    fetchCarts();
  }, [fetchCarts]);

  /**
   * Persist an edit to one cart, then patch it into local state so the table
   * updates without a full refetch.
   * @param {number} cartId
   * @param {object} body  fields to update (e.g. { status, recipient_name, ... })
   */
  const updateCart = useCallback(
    async (cartId, body) => {
      await api.put(`/cart/${cartId}`, body);
      setCarts((prev) =>
        prev.map((cart) => (cart.id === cartId ? { ...cart, ...body } : cart))
      );
      notify("Cart updated", "success");
    },
    [notify]
  );

  /**
   * Delete a cart. If it was the only row left on a non-first page, step back
   * one page (which triggers a fetch); otherwise just refetch the current page.
   * @param {number} cartId
   */
  const deleteCart = useCallback(
    async (cartId) => {
      await api.delete(`/cart/${cartId}`);
      notify("Cart deleted", "success");
      if (carts.length === 1 && page > 1) {
        setPage((p) => p - 1); // last item on this page -> step back
      } else {
        fetchCarts();
      }
    },
    [carts.length, page, fetchCarts, notify]
  );

  // We don't get a total count from the API, so we assume another page exists
  // as long as the current page came back full.
  const hasNextPage = carts.length === PAGE_SIZE;

  // Pagination controls. goToPrevPage clamps at page 1.
  const goToPrevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const goToNextPage = useCallback(() => setPage((p) => p + 1), []);

  return {
    carts,
    page,
    loading,
    hasNextPage,
    pageSize: PAGE_SIZE,
    refresh: fetchCarts,
    updateCart,
    deleteCart,
    goToPrevPage,
    goToNextPage,
  };
}
