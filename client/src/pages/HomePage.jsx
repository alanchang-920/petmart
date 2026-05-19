import { useEffect, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import useProducts from "../hooks/useProducts";
import useShopCart from "../hooks/useShopCart";
import ProductGrid from "../components/ProductGrid";
import CartSidebar from "../components/CartSidebar";

/**
 * Storefront page: the product catalog plus a slide-out cart sidebar for
 * logged-in customers.
 *
 * Stock model: `useProducts` holds the raw catalog from the server (immutable
 * w.r.t. cart actions). `useShopCart` owns the cart. The *displayed* stock on
 * each card is computed at render time as `rawStock - cartQuantity` — this
 * keeps a single source of truth and avoids the double-decrement that
 * happens when both sides mutate stock independently.
 */
function HomePage({ showToast, showCart, refreshKey, onRequireLogin }) {
  const { currentUser } = useAuth();

  const {
    productMap: rawProductMap,
    categories,
    filteredProducts,
    refresh: refreshProducts,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
  } = useProducts(showToast);

  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    submitOrder,
    reload: reloadCart,
    applyCartToProducts,
    getCartQuantity,
  } = useShopCart({ onNotify: showToast });

  // After a login the cart stored in localStorage is the source of truth —
  // pull it back in. We deliberately do NOT clear on logout: a guest can keep
  // their cart, and prompting for login is deferred to the checkout step.
  useEffect(() => {
    if (currentUser) reloadCart();
  }, [currentUser, reloadCart]);

  // Allow the header's "Shop" click to force a re-fetch.
  useEffect(() => {
    if (refreshKey > 0) refreshProducts();
  }, [refreshKey, refreshProducts]);

  // Storefront grid: filter/sort happens on raw data, then cart is subtracted
  // from displayed stock. Both sources update → cards always show fresh values.
  const displayedProducts = useMemo(
    () => applyCartToProducts(filteredProducts),
    [filteredProducts, applyCartToProducts]
  );

  // Cart sidebar shows the cart-adjusted price/name — use the raw map so we
  // know each product's true price regardless of stock.
  const totalPrice = useMemo(
    () =>
      cartItems.reduce((total, item) => {
        const product = rawProductMap[item.product_id];
        return product ? total + Number(product.price) * item.quantity : total;
      }, 0),
    [cartItems, rawProductMap]
  );

  /** Stock-aware add: refuse when the in-cart quantity already covers stock. */
  const handleAddToCart = (productId) => {
    const product = rawProductMap[productId];
    if (!product) return;
    const remaining = product.stock - getCartQuantity(productId);
    if (remaining < 1) {
      showToast("Out of stock", "error");
      return;
    }
    addToCart(productId);
  };

  /** Stock-aware quantity change: removes the item if newQuantity < 1. */
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    const product = rawProductMap[productId];
    if (product && newQuantity > product.stock) {
      showToast("Not enough stock available", "error");
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  return (
    <main className="shop-layout">
      <ProductGrid
        products={displayedProducts}
        categories={categories}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onAddToCart={handleAddToCart}
      />

      {showCart && (
        <CartSidebar
          cartItems={cartItems}
          productMap={rawProductMap}
          totalPrice={totalPrice}
          isLoggedIn={!!currentUser}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveCartItem={removeFromCart}
          onOrder={submitOrder}
          onRequireLogin={onRequireLogin}
        />
      )}
    </main>
  );
}

export default HomePage;
