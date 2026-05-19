import { useCallback, useEffect, useRef, useState } from "react";
import api from "../services/api";

// Page-size options surfaced to the admin via a dropdown.
export const PAGE_SIZE_OPTIONS = [10, 50, 100];
const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[0];
// Debounce search input so we don't fire a request per keystroke.
const SEARCH_DEBOUNCE_MS = 300;

/**
 * useCarts — data layer for the admin "Cart Management" screen.
 *
 * Responsibilities:
 *  - fetch a page of carts from `GET /cart/` with optional search + status filter
 *  - debounce search input (300ms) so typing doesn't hammer the API
 *  - reset to page 1 whenever a filter changes
 *  - expose actions to update / delete a cart and keep local state in sync
 *
 * @param {(message: string, type?: "success" | "error") => void} [onNotify]
 *        Optional toast callback. Stored in a ref so a new identity each
 *        render does NOT trigger an extra fetch.
 */
export default function useCarts(onNotify) {
  const [carts, setCarts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  // What we actually send to the API — `search` is debounced into this.
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Keep latest onNotify in a ref (stable callback identity for deps).
  const notifyRef = useRef(onNotify);
  useEffect(() => {
    notifyRef.current = onNotify;
  }, [onNotify]);
  const notify = useCallback((message, type = "success") => {
    notifyRef.current?.(message, type);
  }, []);

  // Debounce: copy `search` into `debouncedSearch` after the user pauses.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  // Any change to a filter (search/status) or to page size starts the
  // listing over from page 1 — otherwise the user could land on an empty
  // page after narrowing results.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, pageSize]);

  const fetchCarts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: pageSize };
      if (debouncedSearch) params.search = debouncedSearch;
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get("/cart/", { params });
      setCarts(data);
    } catch (error) {
      console.error("Failed to fetch carts:", error);
      notify("Failed to load carts", "error");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, statusFilter, notify]);

  useEffect(() => {
    fetchCarts();
  }, [fetchCarts]);

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

  const deleteCart = useCallback(
    async (cartId) => {
      await api.delete(`/cart/${cartId}`);
      notify("Cart deleted", "success");
      if (carts.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        fetchCarts();
      }
    },
    [carts.length, page, fetchCarts, notify]
  );

  // No total-count from API — assume another page exists while the current
  // one came back full.
  const hasNextPage = carts.length === pageSize;

  const goToPrevPage = useCallback(
    () => setPage((p) => Math.max(1, p - 1)),
    []
  );
  const goToNextPage = useCallback(() => setPage((p) => p + 1), []);

  return {
    carts,
    page,
    loading,
    hasNextPage,
    pageSize,
    setPageSize,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    refresh: fetchCarts,
    updateCart,
    deleteCart,
    goToPrevPage,
    goToNextPage,
  };
}
