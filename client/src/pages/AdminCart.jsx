import { useState } from "react";
import { STATUS_OPTIONS } from "../utils/shipping";
import useCarts from "../hooks/useCarts";
import styles from "./AdminCart.module.css";

const COLUMN_COUNT = 6;

// Maps a cart status string to its scoped badge color class.
const STATUS_CLASS = {
  pending: styles.statusPending,
  active: styles.statusActive,
  completed: styles.statusCompleted,
  cancelled: styles.statusCancelled,
};

// Read-only shipping block shown in the "Shipping" column.
function ShippingSummary({ cart }) {
  if (!cart.recipient_name && !cart.phone && !cart.shipping_address) return "—";
  return (
    <div className={styles.adminShipping}>
      {cart.recipient_name && (
        <div>
          <strong>{cart.recipient_name}</strong>
        </div>
      )}
      {cart.phone && <div>{cart.phone}</div>}
      {cart.shipping_address && (
        <div className={styles.adminShippingAddr}>{cart.shipping_address}</div>
      )}
      {cart.note && <div className={styles.adminShippingNote}>Note: {cart.note}</div>}
    </div>
  );
}

// Collapsible list of the cart's line items shown in the "Items" column.
function ItemsSummary({ items }) {
  if (!items || items.length === 0) return "—";
  const units = items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <details className={styles.adminItemsDetails}>
      <summary>
        {items.length} item{items.length > 1 ? "s" : ""} ({units} units)
      </summary>
      <ul className={styles.adminItemList}>
        {items.map((item) => (
          <li key={item.id}>
            {item.product_name} × {item.quantity}
          </li>
        ))}
      </ul>
    </details>
  );
}

// One row of the admin table: shows a cart and lets an admin change its
// status or delete it. Shipping info is read-only here. Owns its own
// edit/save UI state; persistence is delegated up via onUpdate / onDelete.
function CartRow({ cart, onUpdate, onDelete, onNotify }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // Only the status is editable in the admin table.
  const [statusDraft, setStatusDraft] = useState(cart.status || "pending");

  const notify = (message, type) => onNotify?.(message, type);

  const startEdit = () => {
    setStatusDraft(cart.status || "pending");
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setStatusDraft(cart.status || "pending");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(cart.id, { status: statusDraft });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update cart:", err);
      notify("Failed to update cart", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete cart #${cart.id}?`)) return;
    try {
      await onDelete(cart.id);
    } catch (err) {
      console.error("Failed to delete cart:", err);
      notify("Failed to delete cart", "error");
    }
  };

  const status = cart.status || "pending";

  return (
    <tr>
      <td>#{cart.id}</td>
      <td>
        <ItemsSummary items={cart.items} />
      </td>
      <td>
        {/* Shipping is read-only for admins; only the customer sets it. */}
        <ShippingSummary cart={cart} />
      </td>
      <td>${Number(cart.total_price).toFixed(2)}</td>
      <td>
        {isEditing ? (
          <select
            className={styles.adminStatusSelect}
            name="status"
            value={statusDraft}
            disabled={isSaving}
            onChange={(event) => setStatusDraft(event.target.value)}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <span className={`${styles.adminStatusBadge} ${STATUS_CLASS[status] || ""}`}>
            {status}
          </span>
        )}
      </td>
      <td>
        <div className={styles.adminActions}>
          {isEditing ? (
            <>
              <button className={styles.adminSaveBtn} onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button className={styles.adminCancelBtn} onClick={cancelEdit} disabled={isSaving}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button className={styles.adminEditBtn} onClick={startEdit}>
                Edit
              </button>
              <button className={styles.adminDeleteBtn} onClick={handleDelete}>
                Delete
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

// Admin screen: paginated table of all carts with inline edit + delete.
// All data loading / mutation lives in the useCarts hook.
function AdminCart({ showToast }) {
  const {
    carts,
    page,
    loading,
    hasNextPage,
    refresh,
    updateCart,
    deleteCart,
    goToPrevPage,
    goToNextPage,
  } = useCarts(showToast);

  return (
    <section>
      <div className={styles.adminCartHeader}>
        <h1>Cart Management</h1>
        <button className={styles.adminRefreshBtn} onClick={refresh} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className={styles.adminTableWrap}>
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Items</th>
              <th>Shipping</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {carts.length === 0 ? (
              <tr>
                <td colSpan={COLUMN_COUNT} className={styles.adminEmpty}>
                  {loading ? "Loading carts..." : "No carts found."}
                </td>
              </tr>
            ) : (
              carts.map((cart) => (
                <CartRow
                  key={cart.id}
                  cart={cart}
                  onUpdate={updateCart}
                  onDelete={deleteCart}
                  onNotify={showToast}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.adminPagination}>
        <button
          className={styles.adminPageBtn}
          onClick={goToPrevPage}
          disabled={page === 1 || loading}
        >
          ‹ Prev
        </button>
        <span className={styles.adminPageInfo}>Page {page}</span>
        <button
          className={styles.adminPageBtn}
          onClick={goToNextPage}
          disabled={!hasNextPage || loading}
        >
          Next ›
        </button>
      </div>
    </section>
  );
}

export default AdminCart;
