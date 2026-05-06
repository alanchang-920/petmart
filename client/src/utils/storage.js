const storage = {

  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  getItem(key) {
    const item = localStorage.getItem(key);

    if (!item || item === "undefined" || item === "null") {
      return null;
    }

    try {
      return JSON.parse(item);
    } catch (error) {
      return item;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  // Save login information
  saveAuth(data) {
    this.setItem("token", data.access_token);
    this.setItem("user", data.user);
  },

  // Get token
  getToken() {
    return this.getItem("token");
  },

  // Get user
  getUser() {
    return this.getItem("user");
  },

  // Determine if it is admin
  isAdmin() {
    const user = this.getUser();
    return user?.role === "admin";
  },

  // Logout
  logout() {
    this.remove("token");
    this.remove("user");
  }
};

export default storage;