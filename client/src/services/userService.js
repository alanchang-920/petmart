import api from "./api";

/**
 * REST wrappers for the /users resource.
 *
 * The shared `api` axios instance handles base URL + JWT header injection,
 * so callers don't need to think about auth on a per-request basis.
 */

export function loginUser(username, password) {
  // /users/login expects OAuth2 password form, not JSON.
  const body = new URLSearchParams({ username, password });
  return api
    .post("/users/login", body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
    .then((res) => res.data);
}

export function registerUser(username, email, password) {
  return api
    .post("/users/register", { username, email, password, role: "user" })
    .then((res) => res.data);
}

export function getCurrentUser() {
  return api.get("/users/me").then((res) => res.data);
}

export function getUsers() {
  return api.get("/users/").then((res) => res.data);
}

export function createUser(userData) {
  return api.post("/users/", userData).then((res) => res.data);
}

export function updateUser(userId, userData) {
  return api.put(`/users/${userId}`, userData).then((res) => res.data);
}

export function deleteUser(userId) {
  return api.delete(`/users/${userId}`).then((res) => res.data);
}
