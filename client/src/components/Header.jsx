import { FaShoppingCart } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

/**
 * Top navigation bar. Receives the current view and a setter from App,
 * then renders the appropriate links based on auth + role.
 *
 * @param {object} props
 * @param {string} props.view - active view key from App's state-based nav
 * @param {(view: string) => void} props.onNavigate
 * @param {() => void} props.onToggleCart - opens/closes the cart sidebar
 * @param {() => void} props.onGoLogin - takes the user to the login page
 * @param {() => void} props.onLogout
 */
function Header({ view, onNavigate, onToggleCart, onGoLogin, onLogout }) {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";

  const linkClass = (key) => (view === key ? "nav-active" : "");

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">PetMart</div>

        <nav className="nav-links">
          <span className={linkClass("shop")} onClick={() => onNavigate("shop")}>
            Shop
          </span>

          {isAdmin && (
            <>
              <span
                className={linkClass("product-admin")}
                onClick={() => onNavigate("product-admin")}
              >
                Product Admin
              </span>
              <span
                className={linkClass("cart-admin")}
                onClick={() => onNavigate("cart-admin")}
              >
                Admin Cart
              </span>
              <span
                className={linkClass("user-admin")}
                onClick={() => onNavigate("user-admin")}
              >
                User Admin
              </span>
            </>
          )}

          {!currentUser ? (
            <span onClick={onGoLogin}>Login</span>
          ) : (
            <>
              <span>{currentUser.username}</span>
              <span onClick={onLogout}>Logout</span>
            </>
          )}

          {/* Cart icon is always available — guests can build a cart and are
              prompted to log in only at checkout. */}
          <button className="cart-icon-btn" onClick={onToggleCart}>
            <FaShoppingCart size={20} />
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
