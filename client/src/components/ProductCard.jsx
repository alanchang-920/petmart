const PLACEHOLDER_IMAGE = "/images/placeholder.jpg";

/** Storefront card for a single product. Used inside <ProductGrid>. */
function ProductCard({ product, onAddToCart }) {
  // `product.stock` here is already cart-adjusted (see HomePage) — zero
  // means the customer's cart already holds every unit on hand.
  const outOfStock = product.stock < 1;
  return (
    <div className="store-card">
      <div className="store-image-wrap">
        <img
          src={product.image_url || PLACEHOLDER_IMAGE}
          alt={product.name}
          className="store-image"
          onError={(e) => {
            e.target.src = PLACEHOLDER_IMAGE;
          }}
        />
      </div>

      <div className="store-info">
        <h3>{product.name}</h3>
        <p className="store-description">{product.description}</p>

        <div className="store-meta">
          <p>{product.category}</p>
          <p>Stock: {product.stock}</p>
        </div>

        <div className="store-bottom">
          <div className="store-price">${Number(product.price).toFixed(2)}</div>
          <button
            className="store-add-btn"
            onClick={() => onAddToCart(product.id)}
            disabled={outOfStock}
          >
            {outOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
