import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../services/userService";
import styles from "./UserManagement.module.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [createForm, setCreateForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Failed to load users");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const startEdit = (user) => {
    setEditingUserId(user.id);
    setEditForm({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
    });
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setCreateForm({
      username: "",
      email: "",
      password: "",
      role: "user",
    });
    setEditingUserId(null);
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditForm({
      username: "",
      email: "",
      password: "",
      role: "user",
    });
  };

  const cancelCreate = () => {
    setIsCreating(false);
    setCreateForm({
      username: "",
      email: "",
      password: "",
      role: "user",
    });
  };

  const handleCreate = async () => {
    try {
      // Validate form
      if (!createForm.username.trim()) {
        setError("Username is required");
        return;
      }
      if (!createForm.email.trim()) {
        setError("Email is required");
        return;
      }
      if (!createForm.password.trim()) {
        setError("Password is required");
        return;
      }

      await createUser(createForm);
      setSuccess("User created successfully");
      await loadUsers();
      cancelCreate();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error(error);
      setError("Failed to create user: " + error.message);
    }
  };

  const handleUpdate = async (userId) => {
    try {
      // Only include fields that have been filled
      const updateData = {};
      if (editForm.username.trim()) updateData.username = editForm.username;
      if (editForm.email.trim()) updateData.email = editForm.email;
      if (editForm.password.trim()) updateData.password = editForm.password;
      if (editForm.role) updateData.role = editForm.role;

      if (Object.keys(updateData).length === 0) {
        setError("Please fill in at least one field to update");
        return;
      }

      await updateUser(userId, updateData);
      setSuccess("User updated successfully");
      await loadUsers();
      cancelEdit();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error(error);
      setError("Failed to update user: " + error.message);
    }
  };

  const handleDelete = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      await deleteUser(userId);
      setSuccess("User deleted successfully");
      await loadUsers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error(error);
      setError("Failed to delete user: " + error.message);
    }
  };

  return (
    <div className={styles["user-management"]}>
      <div className={styles["user-management-header"]}>
        <h2>User Management</h2>
        <button className={styles["btn-create"]} onClick={startCreate} disabled={isCreating}>
          Create New User
        </button>
      </div>

      {error && <div className={`${styles.alert} ${styles["alert-error"]}`}>{error}</div>}
      {success && <div className={`${styles.alert} ${styles["alert-success"]}`}>{success}</div>}

      <p className={styles["admin-description"]}>
        Admin can create, view, update, and delete users.
      </p>

      {/* Create New User Form */}
      {isCreating && (
        <div className={styles["create-form-container"]}>
          <h3>Create New User</h3>
          <div className={styles["form-group"]}>
            <label>Username:</label>
            <input
              type="text"
              value={createForm.username}
              onChange={(e) =>
                setCreateForm({ ...createForm, username: e.target.value })
              }
              placeholder="Enter username"
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Email:</label>
            <input
              type="email"
              value={createForm.email}
              onChange={(e) =>
                setCreateForm({ ...createForm, email: e.target.value })
              }
              placeholder="Enter email"
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Password:</label>
            <input
              type="password"
              value={createForm.password}
              onChange={(e) =>
                setCreateForm({ ...createForm, password: e.target.value })
              }
              placeholder="Enter password"
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Role:</label>
            <select
              value={createForm.role}
              onChange={(e) =>
                setCreateForm({ ...createForm, role: e.target.value })
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className={styles["form-actions"]}>
            <button className={styles["btn-save"]} onClick={handleCreate}>
              Create
            </button>
            <button className={styles["btn-cancel"]} onClick={cancelCreate}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <table className={styles["admin-table"]}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id} className={editingUserId === user.id ? styles["editing"] : ""}>
              <td>{user.id}</td>

              <td>
                {editingUserId === user.id ? (
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) =>
                      setEditForm({ ...editForm, username: e.target.value })
                    }
                    placeholder={user.username}
                  />
                ) : (
                  user.username
                )}
              </td>

              <td>
                {editingUserId === user.id ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    placeholder={user.email}
                  />
                ) : (
                  user.email
                )}
              </td>

              <td>
                {editingUserId === user.id ? (
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role: e.target.value })
                    }
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <span className={`${styles["role-badge"]} ${styles[`role-${user.role}`]}`}>
                    {user.role}
                  </span>
                )}
              </td>

              <td>
                {editingUserId === user.id ? (
                  <>
                    <button className={styles["btn-save"]} onClick={() => handleUpdate(user.id)}>
                      Save
                    </button>
                    <button className={styles["btn-cancel"]} onClick={cancelEdit}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className={styles["btn-edit"]} onClick={() => startEdit(user)}>
                      Edit
                    </button>
                    <button className={styles["btn-delete"]} onClick={() => handleDelete(user.id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && !isCreating && (
        <p className={styles["no-users"]}>No users found.</p>
      )}
    </div>
  );
}

export default UserManagement;