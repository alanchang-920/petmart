import ProductCard from "./ProductCard";

/**
 * Storefront catalog: header (title/sort), filter row (search/category),
 * and the responsive grid of product cards.
 *
 * All state is owned by the page (via the useProducts hook) and passed in.
 */
function ProductGrid({
  products,
  categories,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortOption,
  onSortChange,
  onAddToCart,
}) {
  return (
    <section className="catalog-section">
      <div className="catalog-header">
        <div className="catalog-left">
          <p className="breadcrumb">Home / Products</p>
          <h1>Products</h1>
          <p className="catalog-subtitle">
            Discover pet essentials your companions will love.
          </p>
        </div>

        <div className="catalog-right">
          <label htmlFor="sort">Sort by</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="default">Featured</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="name-a-z">Name: A to Z</option>
            <option value="name-z-a">Name: Z to A</option>
          </select>
        </div>
      </div>

      <div className="filter-row">
        <div className="filter-left">
          <span className="filter-title">Filter</span>
        </div>

        <div className="filter-controls">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="store-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
}

export default ProductGrid;
