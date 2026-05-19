import { useEffect, useState } from "react";
import {
  EMPTY_SHIPPING,
  getShippingErrors,
  toShippingPayload,
} from "../utils/shipping";
import styles from "./CartSidebar.module.css";

const REQUIRED_FIELDS = ["recipient_name", "phone", "shipping_address"];

function CartSidebar({
  cartItems,
  productMap,
  totalPrice,
  isLoggedIn = true,
  onUpdateQuantity,
  onRemoveCartItem,
  onOrder,
  onRequireLogin,
}) {
  const [step, setStep] = useState("cart");
  const [shipping, setShipping] = useState(EMPTY_SHIPPING);
  const [touched, setTouched] = useState({});

  const errors = getShippingErrors(shipping);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (event) => {
    setTouched((prev) => ({ ...prev, [event.target.name]: true }));
  };

  const handleSubmit = () => {
    if (!isValid) {
      setTouched(Object.fromEntries(REQUIRED_FIELDS.map((name) => [name, true])));
      return;
    }
    onOrder(toShippingPayload(shipping));
  };

  const fieldError = (name) => (touched[name] ? errors[name] : null);
  const fieldClass = (name) => (fieldError(name) ? styles.inputError : "");

  // Back to the cart step whenever the cart empties (e.g. after an order).
  useEffect(() => {
    if (cartItems.length === 0) setStep("cart");
  }, [cartItems.length]);

  return (
    <aside className={styles.cartSidebar}>
      <h2>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p className={styles.cartEmpty}>Your cart is empty.</p>
      ) : (
        <>
          {step === "cart" && (
            <>
              {cartItems.map((item) => {
                const product = productMap[item.product_id];
                // product.stock is the raw server stock; we can take at most
                // that many regardless of what is already in the cart.
                const atMaxStock = product
                  ? item.quantity >= product.stock
                  : false;

                return (
                  <div className={styles.miniCartItem} key={item.id}>
                    <h3>{product ? product.name : "Unknown Product"}</h3>

                    <div className={styles.miniQtyControls}>
                      <button
                        className={styles.miniQtyBtn}
                        onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
                      >
                        -
                      </button>

                      <span className={styles.miniQtyValue}>{item.quantity}</span>

                      <button
                        className={styles.miniQtyBtn}
                        onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                        disabled={atMaxStock}
                        title={atMaxStock ? "No more stock available" : undefined}
                      >
                        +
                      </button>
                    </div>

                    <p className={styles.miniSubtotal}>
                      Subtotal: $
                      {product
                        ? (Number(product.price) * item.quantity).toFixed(2)
                        : "0.00"}
                    </p>

                    <button
                      className={styles.miniRemoveBtn}
                      onClick={() => onRemoveCartItem(item.product_id)}
                    >
                      Remove
                    </button>
                  </div>
                );
              })}

              <div className={styles.miniCartTotal}>
                <h3>Total: ${totalPrice.toFixed(2)}</h3>
                {isLoggedIn ? (
                  <button
                    className={styles.miniOrderBtn}
                    onClick={() => setStep("shipping")}
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    className={styles.miniOrderBtn}
                    onClick={onRequireLogin}
                  >
                    Login to checkout
                  </button>
                )}
              </div>
            </>
          )}

          {step === "shipping" && (
            <>
              <div className={styles.shippingForm}>
                <div className={styles.shippingHeader}>
                  <h3>Shipping details</h3>
                  <p className={styles.shippingSubtitle}>
                    Where should we send your order?
                  </p>
                </div>

                <div className={styles.shippingField}>
                  <label htmlFor="recipient_name">
                    Recipient name <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="recipient_name"
                    type="text"
                    name="recipient_name"
                    placeholder="Jane Doe"
                    value={shipping.recipient_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldClass("recipient_name")}
                  />
                  {fieldError("recipient_name") && (
                    <span className={styles.fieldError}>
                      {errors.recipient_name}
                    </span>
                  )}
                </div>

                <div className={styles.shippingField}>
                  <label htmlFor="phone">
                    Phone <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="+61 400 000 000"
                    value={shipping.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldClass("phone")}
                  />
                  {fieldError("phone") && (
                    <span className={styles.fieldError}>{errors.phone}</span>
                  )}
                </div>

                <div className={styles.shippingField}>
                  <label htmlFor="shipping_address">
                    Shipping address <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    id="shipping_address"
                    name="shipping_address"
                    placeholder="Street, suburb, postcode"
                    rows={2}
                    value={shipping.shipping_address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldClass("shipping_address")}
                  />
                  {fieldError("shipping_address") && (
                    <span className={styles.fieldError}>
                      {errors.shipping_address}
                    </span>
                  )}
                </div>

                <div className={styles.shippingField}>
                  <label htmlFor="note">
                    Note <span className={styles.optional}>(optional)</span>
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    placeholder="Delivery instructions, gate code, etc."
                    rows={2}
                    value={shipping.note}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.shippingFooter}>
                <div className={styles.shippingTotalRow}>
                  <span className={styles.shippingTotalLabel}>Total</span>
                  <span className={styles.shippingTotalValue}>
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className={styles.shippingActions}>
                  <button
                    className={styles.miniBackBtn}
                    onClick={() => setStep("cart")}
                  >
                    ← Back
                  </button>
                  <button
                    className={styles.miniOrderBtn}
                    onClick={handleSubmit}
                    disabled={!isValid}
                  >
                    Place order
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </aside>
  );
}

export default CartSidebar;
