import { useCallback, useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Header from "./components/Header";
import Toast from "./components/Toast";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProductManagement from "./pages/ProductManagement";
import UserManagement from "./pages/UserManagement";
import AdminCart from "./pages/AdminCart";
import "./App.css";

/**
 * Inner shell — must live below <AuthProvider> so it can call useAuth().
 *
 * State-based navigation: `page` distinguishes login vs everything else;
 * `view` chooses which "page" to show inside the home shell. Kept
 * deliberately simple instead of pulling in react-router for an SPA
 * with five screens.
 */
function AppShell() {
  const { logout } = useAuth();
  const [page, setPage] = useState("home");
  const [view, setView] = useState("shop");
  const [toast, setToast] = useState(null);
  const [showCart, setShowCart] = useState(false);
  // Bumped by the "Shop" nav click to ask HomePage to re-fetch products.
  const [shopRefreshKey, setShopRefreshKey] = useState(0);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  }, []);

  const handleNavigate = useCallback((nextView) => {
    setPage("home");
    setView(nextView);
    if (nextView === "shop") {
      setShopRefreshKey((k) => k + 1);
    }
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setShowCart(false);
    setPage("home");
    setView("shop");
    showToast("Logged out");
  }, [logout, showToast]);

  return (
    <div className="app">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <Header
        view={view}
        onNavigate={handleNavigate}
        onToggleCart={() => setShowCart((s) => !s)}
        onGoLogin={() => setPage("login")}
        onLogout={handleLogout}
      />

      {page === "login" && (
        <LoginPage
          showToast={showToast}
          onLoginSuccess={(user) => {
            setPage("home");
            if (user?.role === "admin") {
              setView("user-admin");
            } else {
              setView("shop");
            }
          }}
        />
      )}

      {page === "home" && view === "shop" && (
        <HomePage
          showToast={showToast}
          showCart={showCart}
          refreshKey={shopRefreshKey}
          onOpenCart={() => setShowCart(true)}
          onRequireLogin={() => {
            // Guest reached the checkout step — bounce them to the login form.
            // Cart state persists in localStorage, so it's still there afterwards.
            setShowCart(false);
            setPage("login");
          }}
        />
      )}

      {page === "home" &&
        ["user-admin", "cart-admin", "product-admin"].includes(view) && (
          <div className="admin-tabs">
            <button
              className={view === "user-admin" ? "admin-tab-active" : ""}
              onClick={() => setView("user-admin")}
            >
              User Management
            </button>

            <button
              className={view === "cart-admin" ? "admin-tab-active" : ""}
              onClick={() => setView("cart-admin")}
            >
              Cart Management
            </button>

            <button
              className={view === "product-admin" ? "admin-tab-active" : ""}
              onClick={() => setView("product-admin")}
            >
              Product Management
            </button>
          </div>
        )}

      {page === "home" && view === "product-admin" && (
        <main className="admin-layout">
          <ProductManagement />
        </main>
      )}

      {page === "home" && view === "cart-admin" && (
        <main className="admin-layout">
          <AdminCart showToast={showToast} />
        </main>
      )}

      {page === "home" && view === "user-admin" && (
        <main className="admin-layout">
          <UserManagement />
        </main>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;
