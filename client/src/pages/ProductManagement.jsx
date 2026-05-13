import { useEffect, useState } from "react";
import api from "../services/api";

const placeholderImage = "/images/placeholder.jpg";

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image_url: "",
    stock: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products/");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      image_url: "",
      stock: "",
    });
    setEditingId(null);
    setShowEditModal(false);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const productData = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      await api.post("/products/", productData);
      alert("Product added successfully");
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed to add product. Admin login may be required.");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    const productData = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      await api.put(`/products/${editingId}`, productData);
      alert("Product updated successfully");
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product. Admin login may be required.");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "",
      image_url: product.image_url || "",
      stock: product.stock || "",
    });

    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);
      alert("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product. Admin login may be required.");
    }
  };

  return (
    <div className="admin-page">
      <h1 className="admin-title">Product Management</h1>

      <p className="admin-subtitle">
        Manage products, inventory, and store listings.
      </p>

      {/* Add Product Form */}
      <form onSubmit={handleAddProduct} className="admin-form">
        <h2>Add Product</h2>

        <div className="admin-form-grid">
          <input
            className="admin-input"
            name="name"
            placeholder="Product name"
            value={!showEditModal ? form.name : ""}
            onChange={handleChange}
            required
          />

          <input
            className="admin-input"
            name="description"
            placeholder="Description"
            value={!showEditModal ? form.description : ""}
            onChange={handleChange}
          />

          <input
            className="admin-input"
            name="price"
            type="number"
            step="0.01"
            placeholder="Price"
            value={!showEditModal ? form.price : ""}
            onChange={handleChange}
            required
          />

          <input
            className="admin-input"
            name="category"
            placeholder="Category"
            value={!showEditModal ? form.category : ""}
            onChange={handleChange}
          />

          <input
            className="admin-input"
            name="image_url"
            placeholder="Image URL"
            value={!showEditModal ? form.image_url : ""}
            onChange={handleChange}
          />

          <input
            className="admin-input"
            name="stock"
            type="number"
            placeholder="Stock"
            value={!showEditModal ? form.stock : ""}
            onChange={handleChange}
            required
          />

          <button className="admin-submit-btn" type="submit">
            Add Product
          </button>
        </div>
      </form>

      <h2 className="admin-section-title">Product List</h2>

      <div className="admin-product-grid">
        {products.map((product) => (
          <div key={product.id} className="admin-product-card">
            <img
              src={product.image_url || placeholderImage}
              alt={product.name}
              className="admin-product-image"
              onError={(e) => {
                e.target.src = placeholderImage;
              }}
            />

            <div className="admin-product-content">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Price: ${Number(product.price).toFixed(2)}</p>
              <p>Category: {product.category}</p>
              <p>Stock: {product.stock}</p>

              <div className="admin-product-actions">
                <button
                  className="admin-edit-btn"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </button>

                <button
                  className="admin-delete-btn"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Popup Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h2>Edit Product</h2>

            <form onSubmit={handleUpdateProduct} className="modal-form">
              <input
                className="admin-input"
                name="name"
                placeholder="Product name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <input
                className="admin-input"
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
              />

              <input
                className="admin-input"
                name="price"
                type="number"
                step="0.01"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                required
              />

              <input
                className="admin-input"
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
              />

              <input
                className="admin-input"
                name="image_url"
                placeholder="Image URL"
                value={form.image_url}
                onChange={handleChange}
              />

              <input
                className="admin-input"
                name="stock"
                type="number"
                placeholder="Stock"
                value={form.stock}
                onChange={handleChange}
                required
              />

              <div className="modal-actions">
                <button className="admin-submit-btn" type="submit">
                  Save Changes
                </button>

                <button
                  className="admin-cancel-btn"
                  type="button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;