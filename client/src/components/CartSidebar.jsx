function CartSidebar({ cartItems, productMap, totalPrice, onUpdateQuantity, onRemoveCartItem , onOrder }) {
  return (
    <aside className="cart-sidebar">
      <h2>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p className="cart-empty">Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => {
            const product = productMap[item.product_id];

            return (
              <div className="mini-cart-item" key={item.id}>
                <h3>{product ? product.name : "Unknown Product"}</h3>

                <div className="mini-qty-controls">
                  <button
                    className="mini-qty-btn"
                    onClick={() => onUpdateQuantity(item.product_id, -1)}
                  >
                    -
                  </button>

                  <span className="mini-qty-value">{item.quantity}</span>

                  <button
                    className="mini-qty-btn"
                    onClick={() => onUpdateQuantity(item.product_id, 1)}
                  >
                    +
                  </button>
                </div>

                <p className="mini-subtotal">
                  Subtotal: $
                  {product
                    ? (Number(product.price) * item.quantity).toFixed(2)
                    : "0.00"}
                </p>

                <button
                  className="mini-remove-btn"
                  onClick={() => onRemoveCartItem(item.product_id)}
                >
                  Remove
                </button>
              </div>
            );
          })}

          <div className="mini-cart-total">
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
            <button className="mini-order-btn" onClick={onOrder}>
              Order
            </button>
          </div>
        </>
      )}
    </aside>
  );
}

export default CartSidebar;