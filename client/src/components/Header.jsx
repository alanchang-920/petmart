import { FaShoppingCart } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

const ADMIN_VIEWS = ["product-admin", "cart-admin", "user-admin"];

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

  const navClass = (isActive) => `nav-link ${isActive ? "nav-active" : ""}`;

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">PetMart</div>

        <nav className="nav-links">
          <button
            type="button"
            className={navClass(view === "shop")}
            onClick={() => onNavigate("shop")}
          >
            Shop
          </button>

          {isAdmin && (
            <button
              type="button"
              className={navClass(ADMIN_VIEWS.includes(view))}
              onClick={() => onNavigate("user-admin")}
            >
              Admin
            </button>
          )}

          {!currentUser ? (
            <button type="button" className="nav-link" onClick={onGoLogin}>
              Login
            </button>
          ) : (
            <>
              <span className="nav-username">{currentUser.username}</span>
              <button type="button" className="nav-link" onClick={onLogout}>
                Logout
              </button>
            </>
          )}

          {/* Cart icon is always available — guests can build a cart and are
              prompted to log in only at checkout. */}
          <button
            type="button"
            className="cart-icon-btn"
            onClick={onToggleCart}
            aria-label="Toggle shopping cart"
          >
            <FaShoppingCart size={20} />
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
