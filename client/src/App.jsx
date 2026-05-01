import { useEffect, useMemo, useState } from "react";
import api from "./services/api";
import "./App.css";
import CartService from "./services/cartService";
import CartSidebar from "./components/CartSidebar";

const placeholderImage = "/images/placeholder.jpg";


function App() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 2000);
  };

const cartService = new CartService(api, showToast, setCartItems , setProducts);
  useEffect(() => {
    cartService.getAllCartItems();
    fetchProducts();
  }, []);


  const fetchProducts = async () => {
    try {
      const response = await api.get("/products/");
      setProducts(cartService.getCurrentProducts(response.data));
    } catch (error) {
      console.error("Failed to fetch products:", error);
      showToast("Failed to load products", "error");
    }
  };

const updateCartQuantity = (productId, newQuantity) => {
    if (cartService.getCurrentQuantityInCart(productId) < 1) {
     // cartService.removeCartItem(productId);
      cartService.removeCartItem(productId, products);
    } else {
      if (newQuantity > products.find(p => p.id === productId)?.stock && newQuantity > 0) {
        showToast("Not enough stock available", "error");
      } else {
        products.find(p => p.id === productId).stock -= newQuantity; 
        cartService.updateCartQuantity(productId, newQuantity);

      }
    }
  }
  
const removeFromCart = (productId) => {
    cartService.removeCartItem(productId, products);
  }

const handleOrder = () => {
    cartService.sendOrder();
  }

const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product.stock < 1) {
      showToast("Out of stock", "error");
    } else {
      product.stock -= 1; 
      cartService.addToCart(productId);
    }
  }

  const productMap = useMemo(() => {
    const map = {};
    products.forEach((product) => {
      map[product.id] = product;
    });
    return map;
  }, [products]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const product = productMap[item.product_id];
      if (!product) return total;
      return total + Number(product.price) * item.quantity;
    }, 0);
  }, [cartItems, productMap]);

  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category));
    return ["All", ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      return matchSearch && matchCategory;
    });

    if (sortOption === "price-low-high") {
      result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortOption === "price-high-low") {
      result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortOption === "name-a-z") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "name-z-a") {
      result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [products, searchTerm, selectedCategory, sortOption]);

  return (
    <div className="app">
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span className="toast-icon">
            {toast.type === "success" ? "✓" : "⚠"}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">PetMart</div>
          <nav className="nav-links">
            <span>Home</span>
            <span>Products</span>
            <span>Cart</span>
          </nav>
        </div>
      </header>

      <main className="shop-layout">
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
                onChange={(e) => setSortOption(e.target.value)}
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
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
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
            {filteredProducts.map((product) => (
              <div key={product.id} className="store-card">
                <div className="store-image-wrap">
                  <img
                    src={product.image_url || placeholderImage}
                    alt={product.name}
                    className="store-image"
                    onError={(e) => {
                      e.target.src = placeholderImage;
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
                    <div className="store-price">
                      ${Number(product.price).toFixed(2)}
                    </div>

                    <button
                      className="store-add-btn"
                      onClick={() => addToCart(product.id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <CartSidebar
          cartItems={cartItems}
          productMap={productMap}
          totalPrice={totalPrice}
          onUpdateQuantity={updateCartQuantity}
          onRemoveCartItem={removeFromCart}
          onOrder={handleOrder}
        />
      </main>
    </div>
  );
}

export default App;