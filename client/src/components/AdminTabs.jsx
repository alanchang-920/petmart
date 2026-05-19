import { FaBoxOpen, FaShoppingBag, FaUsers } from "react-icons/fa";
import styles from "./AdminTabs.module.css";

const TABS = [
  { key: "user-admin", label: "Users", icon: FaUsers },
  { key: "cart-admin", label: "Orders", icon: FaShoppingBag },
  { key: "product-admin", label: "Products", icon: FaBoxOpen },
];

/**
 * Tab-panel shell for the admin section. Renders a sticky tab bar with the
 * three management screens and a single content area below; `children` is
 * the currently selected page. Keeps a consistent page header so every
 * admin screen feels part of one console.
 *
 * @param {object} props
 * @param {string} props.activeView - key of the currently selected tab
 * @param {(view: string) => void} props.onSelect - tab-click handler
 */
function AdminTabs({ activeView, onSelect, children }) {
  const activeTab = TABS.find((t) => t.key === activeView);

  return (
    <div className={styles.tabPanel}>
      <header className={styles.tabHeader}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Admin Console</h1>
          <span className={styles.subtitle}>
            Manage {activeTab?.label.toLowerCase() || "your store"}
          </span>
        </div>

        <div role="tablist" className={styles.tabList}>
          {TABS.map(({ key, label, icon: Icon }) => {
            const isActive = key === activeView;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
                onClick={() => onSelect(key)}
              >
                <Icon className={styles.tabIcon} size={14} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </header>

      <section
        role="tabpanel"
        aria-labelledby={activeView}
        className={styles.tabContent}
      >
        {children}
      </section>
    </div>
  );
}

export default AdminTabs;
