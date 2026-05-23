import { useEffect, useMemo, useState } from "react";

// Slice an array into pages and clamp the current page when the data shrinks
// (e.g. after a search filter narrows results past the current page).
export function usePagination(items, pageSize) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  return { pageItems, currentPage, totalPages, setCurrentPage };
}
