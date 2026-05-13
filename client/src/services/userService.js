import storage from "../utils/storage";

const API_BASE = "http://127.0.0.1:8000";

function getAuthHeaders() {
  const token = storage.getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function loginUser(username, password) {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const response = await fetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
}

export async function registerUser(username, email, password) {
  const response = await fetch(`${API_BASE}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
      role: "user",
    }),
  });

  if (!response.ok) {
    throw new Error("Register failed");
  }

  return response.json();
}

export async function getCurrentUser() {
  const response = await fetch(`${API_BASE}/users/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to get current user");
  }

  return response.json();
}

export async function getUsers() {
  const response = await fetch(`${API_BASE}/users/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to get users");
  }

  return response.json();
}

export async function updateUser(userId, userData) {
  const response = await fetch(`${API_BASE}/users/${userId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return response.json();
}

export async function createUser(userData) {
  const response = await fetch(`${API_BASE}/users/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return response.json();
}

export async function deleteUser(userId) {
  const response = await fetch(`${API_BASE}/users/${userId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }

  return response.json();
}