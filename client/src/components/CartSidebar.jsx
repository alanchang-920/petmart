import { useEffect, useState } from "react";
import {
  EMPTY_SHIPPING,
  getShippingErrors,
  toShippingPayload,
} from "../utils/shipping";
import styles from "./CartSidebar.module.css";

const REQUIRED_FIELDS = ["recipient_name", "phone", "shipping_address"];

function CartSidebar({ cartItems, productMap, totalPrice, onUpdateQuantity, onRemoveCartItem , onOrder }) {
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

                return (
                  <div className={styles.miniCartItem} key={item.id}>
                    <h3>{product ? product.name : "Unknown Product"}</h3>

                    <div className={styles.miniQtyControls}>
                      <button
                        className={styles.miniQtyBtn}
                        onClick={() => onUpdateQuantity(item.product_id, -1)}
                      >
                        -
                      </button>

                      <span className={styles.miniQtyValue}>{item.quantity}</span>

                      <button
                        className={styles.miniQtyBtn}
                        onClick={() => onUpdateQuantity(item.product_id, 1)}
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
                <button
                  className={styles.miniOrderBtn}
                  onClick={() => setStep("shipping")}
                >
                  Next →
                </button>
              </div>
            </>
          )}

          {step === "shipping" && (
            <>
              <div className={styles.shippingForm}>
                <h3>Shipping details</h3>

                <div className={styles.shippingField}>
                  <input
                    type="text"
                    name="recipient_name"
                    placeholder="Recipient name *"
                    value={shipping.recipient_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldClass("recipient_name")}
                  />
                  {fieldError("recipient_name") && (
                    <span className={styles.fieldError}>{errors.recipient_name}</span>
                  )}
                </div>

                <div className={styles.shippingField}>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone number *"
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
                  <textarea
                    name="shipping_address"
                    placeholder="Shipping address *"
                    rows={2}
                    value={shipping.shipping_address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldClass("shipping_address")}
                  />
                  {fieldError("shipping_address") && (
                    <span className={styles.fieldError}>{errors.shipping_address}</span>
                  )}
                </div>

                <div className={styles.shippingField}>
                  <textarea
                    name="note"
                    placeholder="Note (optional)"
                    rows={2}
                    value={shipping.note}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.miniCartTotal}>
                <h3>Total: ${totalPrice.toFixed(2)}</h3>
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
                  Order
                </button>
              </div>
            </>
          )}
        </>
      )}
    </aside>
  );
}

export default CartSidebar;
