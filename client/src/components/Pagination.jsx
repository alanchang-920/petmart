import styles from "./Pagination.module.css";

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const goTo = (page) => {
    const clamped = Math.min(Math.max(page, 1), totalPages);
    if (clamped !== currentPage) onPageChange(clamped);
  };

  const pageNumbers = buildPageNumbers(currentPage, totalPages);

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button
        type="button"
        className={styles.pageBtn}
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ‹
      </button>

      {pageNumbers.map((item, idx) =>
        item === "…" ? (
          <span key={`gap-${idx}`} className={styles.gap}>
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={`${styles.pageBtn} ${
              item === currentPage ? styles.active : ""
            }`}
            onClick={() => goTo(item)}
            aria-current={item === currentPage ? "page" : undefined}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        className={styles.pageBtn}
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  );
}

// Compact window: 1 … (c-1) c (c+1) … total
function buildPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const withGaps = [];
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) withGaps.push("…");
    withGaps.push(page);
  });
  return withGaps;
}

export default Pagination;
