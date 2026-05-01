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
    this.cartItems = this.cartItems.map(item => {
      if (item.product_id === productId) {
        return { ...item, quantity: item.quantity + newQuantity };
      }
      return item;
    });
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

    sendOrder() {
        this.api.post("/orders/", { cart: this.cartItems })
            .then(response => {
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