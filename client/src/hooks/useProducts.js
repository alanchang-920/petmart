import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchProducts as fetchProductsApi } from "../services/productService";

/**
 * useProducts — catalog data + client-side search/filter/sort.
 *
 * Owns the products array so multiple components (e.g. shop grid + cart
 * sidebar) can read derived state (categories, filtered list, productMap).
 *
 * @param {(message: string, type?: "success" | "error") => void} [onNotify]
 *   Optional toast callback used when a fetch fails.
 */
export default function useProducts(onNotify) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("default");

  const refresh = useCallback(async () => {
    try {
      const data = await fetchProductsApi();
      setProducts(data);
      return data;
    } catch (err) {
      console.error("Failed to fetch products:", err);
      onNotify?.("Failed to load products", "error");
      return [];
    }
  }, [onNotify]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Lookup table for fast product-by-id access (used by the cart sidebar).
  const productMap = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, [products]);

  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category));
    return ["All", ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const search = searchTerm.toLowerCase();
    let result = products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search);
      const matchCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      return matchSearch && matchCategory;
    });

    switch (sortOption) {
      case "price-low-high":
        return [...result].sort((a, b) => Number(a.price) - Number(b.price));
      case "price-high-low":
        return [...result].sort((a, b) => Number(b.price) - Number(a.price));
      case "name-a-z":
        return [...result].sort((a, b) => a.name.localeCompare(b.name));
      case "name-z-a":
        return [...result].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return result;
    }
  }, [products, searchTerm, selectedCategory, sortOption]);

  return {
    products,
    setProducts,
    productMap,
    categories,
    filteredProducts,
    refresh,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
  };
}
