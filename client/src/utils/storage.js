// Tiny wrapper around localStorage that JSON-encodes values and
// safely decodes them back (treating "undefined"/"null" strings as null).
const storage = {
  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  getItem(key) {
    const item = localStorage.getItem(key);
    if (!item || item === "undefined" || item === "null") return null;
    try {
      return JSON.parse(item);
    } catch {
      // Stored value was not JSON — return the raw string.
      return item;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  getToken() {
    return this.getItem("token");
  },

  getUser() {
    return this.getItem("user");
  },

  logout() {
    this.remove("token");
    this.remove("user");
  },
};

export default storage;
