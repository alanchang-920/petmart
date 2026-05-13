  import storage from "../utils/storage";
  class CartService {
    cartItems = storage.getItem("cartItems") ? storage.getItem("cartItems") : [];
    currentProducts = [];
    constructor(api, showToast, setCartItems , setProducts) {
    this.api = api;
    this.showToast = showToast;
    this.setCartItems = setCartItems;
    this.setProducts = setProducts;
    }

    updateAndPersistCart() {
        this.setCartItems(this.cartItems);
        storage.setItem("cartItems", this.cartItems);
    }
    
   addToCart (productId) {
      const existing = this.cartItems.find(item => item.product_id === productId);
    if (existing) {
        this.cartItems = this.cartItems.map(item => {
        if (item.product_id === productId) {
            return { ...item, quantity: item.quantity + 1};
        }
        return item;
     });
    } else {
    this.cartItems.push({
      product_id: productId,
      quantity: 1,
    });
    }

    // Decrement displayed product stock by 1
    this.currentProducts = this.currentProducts.map(product => {
      if (product.id === productId) {
        return { ...product, stock: product.stock - 1 };
      }
      return product;
    });
    this.setProducts(this.currentProducts);

    this.showToast("Added to cart!", "success");
    this.updateAndPersistCart();
  };

  

   removeCartItem(productId , products) {
    this.currentProducts = products
    this.currentProducts = this.currentProducts.map(product => {
        if (product.id === productId) {
            return { ...product, stock: product.stock + this.cartItems.find(item => item.product_id === productId)?.quantity };
        }
        return product;
    });
    this.setProducts(this.currentProducts);
    this.cartItems = this.cartItems.filter(item => item.product_id !== productId);

    this.showToast("Removed from cart!", "success");
    this.updateAndPersistCart();
  };

   updateCartQuantity(productId, newQuantity) {
    const oldQuantity = this.cartItems.find(item => item.product_id === productId)?.quantity || 0;
    const delta = oldQuantity - newQuantity; // positive = stock increases, negative = stock decreases

    this.cartItems = this.cartItems.map(item => {
      if (item.product_id === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    // Update displayed product stock
    this.currentProducts = this.currentProducts.map(product => {
      if (product.id === productId) {
        return { ...product, stock: product.stock + delta };
      }
      return product;
    });
    this.setProducts(this.currentProducts);

    this.showToast("Cart updated!", "success");
    this.updateAndPersistCart();
  }

    getAllCartItems() {
        this.cartItems = storage.getItem("cartItems") ? storage.getItem("cartItems") : [];
        this.setCartItems(this.cartItems);
        return this.cartItems;
    }

    clearCart() {
        this.cartItems = [];
        storage.remove("cartItems");
        this.setCartItems([]);
    }
    getCurrentProducts(products) {
        this.currentProducts = products.map(product => {
            const cartItem = this.cartItems.find(item => item.product_id === product.id);
            
            if (cartItem) {
            return { ...product, stock: product.stock - cartItem.quantity };
            }
            
            return product;
        });
        this.setProducts(this.currentProducts);
        return this.currentProducts;
    }
    getCurrentQuantityInCart(productId) {
        const cartItem = this.cartItems.find(item => item.product_id === productId);
        return cartItem ? cartItem.quantity : 0;
    }

    sendOrder(shipping = {}) {
        if (this.cartItems.length === 0) {
            this.showToast("Your cart is empty", "error");
            return;
        }
        if (!shipping.recipient_name || !shipping.phone || !shipping.shipping_address) {
            this.showToast("Please fill in name, phone and address", "error");
            return;
        }
        const payload = {
            items: this.cartItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
            })),
            recipient_name: shipping.recipient_name,
            phone: shipping.phone,
            shipping_address: shipping.shipping_address,
            note: shipping.note || null,
        };
        this.api.post("/cart/", payload)
            .then(() => {
                this.showToast("Order placed successfully!", "success");
                this.clearCart();
            })
            .catch(error => {
                console.error("Failed to place order:", error);
                this.showToast("Failed to place order", "error");
            });
    }

  }
  export default CartService;