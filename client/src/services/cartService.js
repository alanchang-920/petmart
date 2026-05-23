import api from "./api";

/**
 * REST wrappers for the /cart resource.
 *
 * Note: the shopping-cart state (items in localStorage) lives in the
 * `useShopCart` hook. This module is just the API surface.
 */

export function placeOrder(payload) {
  return api.post("/cart/", payload).then((res) => res.data);
}

export function getAllCarts({ page = 1, limit = 10 } = {}) {
  return api.get("/cart/", { params: { page, limit } }).then((res) => res.data);
}

export function updateCart(cartId, body) {
  return api.put(`/cart/${cartId}`, body).then((res) => res.data);
}

export function deleteCart(cartId) {
  return api.delete(`/cart/${cartId}`).then((res) => res.data);
}

export function restockCart(cartId) {
  return api.post(`/cart/${cartId}/restock`).then((res) => res.data);
}
