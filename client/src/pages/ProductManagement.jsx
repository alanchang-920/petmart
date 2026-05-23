import { useEffect, useMemo, useState } from "react";
import {
  fetchProducts as fetchProductsApi,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import Pagination from "../components/Pagination";
import { usePagination } from "../hooks/usePagination";
import { getApiErrorMessage } from "../utils/apiError";

const placeholderImage = "/images/placeholder.jpg";
const PRODUCTS_PER_PAGE = 8;

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  image_url: "",
  stock: "",
};

function ProductManagement({ showToast }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fallback to console when no toast callback is wired (e.g. unit tests).
  const notify = (message, type = "success") =>
    showToast ? showToast(message, type) : console.log(`[${type}]`, message);

  const fetchProducts = async () => {
    try {
      setProducts(await fetchProductsApi());
    } catch (error) {
      console.error("Failed to fetch products:", error);
      notify(getApiErrorMessage(error, "Failed to load products"), "error");
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

  const closeModals = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowEditModal(false);
    setShowCreateModal(false);
  };

  const openCreateModal = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowEditModal(false);
    setShowCreateModal(true);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const productData = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      await createProduct(productData);
      notify("Product added successfully");
      closeModals();
      fetchProducts();
    } catch (error) {
      console.error("Failed to add product:", error);
      notify(getApiErrorMessage(error, "Failed to add product"), "error");
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
      await updateProduct(editingId, productData);
      notify("Product updated successfully");
      closeModals();
      fetchProducts();
    } catch (error) {
      console.error("Failed to update product:", error);
      notify(getApiErrorMessage(error, "Failed to update product"), "error");
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

    setShowCreateModal(false);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await deleteProduct(id);
      notify("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      notify(getApiErrorMessage(error, "Failed to delete product"), "error");
    }
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.name, p.description, p.category]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q))
    );
  }, [products, searchQuery]);

  const {
    pageItems: visibleProducts,
    currentPage,
    totalPages,
    setCurrentPage,
  } = usePagination(filteredProducts, PRODUCTS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, setCurrentPage]);

  const renderProductForm = (onSubmit, submitLabel) => (
    <form onSubmit={onSubmit} className="modal-form">
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
          {submitLabel}
        </button>

        <button
          className="admin-cancel-btn"
          type="button"
          onClick={closeModals}
        >
          Cancel
        </button>
      </div>
    </form>
  );

  return (
    <div className="admin-page">
      <h1 className="admin-title">Product Management</h1>

      <p className="admin-subtitle">
        Manage products, inventory, and store listings.
      </p>

      <div className="admin-toolbar-actions">
        <button
          className="admin-submit-btn"
          type="button"
          onClick={openCreateModal}
        >
          + Create Product
        </button>
      </div>

      <div className="admin-toolbar">
        <input
          className="admin-input admin-search"
          type="search"
          placeholder="Search by name, description or category…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <h2 className="admin-section-title">Product List</h2>

      <div className="admin-product-grid">
        {visibleProducts.map((product) => (
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

      {filteredProducts.length === 0 && (
        <p className="admin-empty">No products match your search.</p>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {showCreateModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create Product</h2>
            {renderProductForm(handleAddProduct, "Create Product")}
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Product</h2>
            {renderProductForm(handleUpdateProduct, "Save Changes")}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;
