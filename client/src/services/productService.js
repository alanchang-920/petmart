import api from "./api";

/** REST wrappers for the /products resource. */

export function fetchProducts() {
  return api.get("/products/").then((res) => res.data);
}

export function createProduct(product) {
  return api.post("/products/", product).then((res) => res.data);
}

export function updateProduct(productId, product) {
  return api.put(`/products/${productId}`, product).then((res) => res.data);
}

export function deleteProduct(productId) {
  return api.delete(`/products/${productId}`).then((res) => res.data);
}
