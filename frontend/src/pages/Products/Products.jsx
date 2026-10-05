import { useEffect, useState } from "react";
import { getProducts, createProduct, getWarehouses } from "../../services/api";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    quantity: 0,
    minimum_stock: 0,
    warehouse_id: "",
  });

  const loadData = async () => {
    try {
      const [productsResponse, warehousesResponse] = await Promise.all([
        getProducts(),
        getWarehouses(),
      ]);

      setProducts(productsResponse.data);
      setWarehouses(warehousesResponse.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await createProduct({
        ...form,
        quantity: Number(form.quantity),
        minimum_stock: Number(form.minimum_stock),
        warehouse_id: form.warehouse_id ? Number(form.warehouse_id) : null,
      });

      setMessage("Product added successfully");

      setForm({
        name: "",
        sku: "",
        category: "",
        quantity: 0,
        minimum_stock: 0,
        warehouse_id: "",
      });

      setShowForm(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
    }
  };

  const categories = [...new Set(products.map((product) => product.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-container products-page">
      <div className="page-header">
        <div>
          <h2>Products</h2>
          <p>Manage products and inventory stock levels</p>
        </div>

        <button
          className="products-primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "+ Add Product"}
        </button>
      </div>

      {message && <div className="products-success">{message}</div>}

      {error && <div className="products-error">{error}</div>}

      {showForm && (
        <section className="products-form-card">
          <div className="products-card-header">
            <div>
              <h3>Add New Product</h3>
              <p>Enter product information</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="products-form-grid">
              <div className="products-form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="products-form-group">
                <label>SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  placeholder="Enter SKU"
                  required
                />
              </div>

              <div className="products-form-group">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Enter category"
                  required
                />
              </div>

              <div className="products-form-group">
                <label>Initial Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  min="0"
                  value={form.quantity}
                  onChange={handleChange}
                />
              </div>

              <div className="products-form-group">
                <label>Minimum Stock</label>
                <input
                  type="number"
                  name="minimum_stock"
                  min="0"
                  value={form.minimum_stock}
                  onChange={handleChange}
                />
              </div>

              <div className="products-form-group">
                <label>Warehouse</label>
                <select
                  name="warehouse_id"
                  value={form.warehouse_id}
                  onChange={handleChange}
                >
                  <option value="">Select Warehouse</option>

                  {warehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="products-form-actions">
              <button type="submit" className="products-primary-button">
                Add Product
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="products-card">
        <div className="products-card-header products-toolbar">
          <div>
            <h3>Product Inventory</h3>
            <p>{filteredProducts.length} products found</p>
          </div>

          <div className="products-filters">
            <input
              type="text"
              placeholder="Search name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All Categories</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="products-empty">No products found.</div>
        ) : (
          <div className="products-table-container">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Minimum</th>
                  <th>Warehouse</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => {
                  const isLow = product.quantity <= product.minimum_stock;

                  return (
                    <tr key={product.id}>
                      <td>
                        <strong>{product.name}</strong>
                      </td>

                      <td>
                        <span className="products-sku">{product.sku}</span>
                      </td>

                      <td>{product.category}</td>

                      <td>
                        <strong>{product.quantity}</strong>
                      </td>

                      <td>{product.minimum_stock}</td>

                      <td>{product.warehouse_name || "Unassigned"}</td>

                      <td>
                        <span
                          className={
                            isLow
                              ? "product-status status-low"
                              : "product-status status-good"
                          }
                        >
                          {isLow ? "Low Stock" : "In Stock"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Products;
