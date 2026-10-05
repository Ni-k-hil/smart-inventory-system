import { useEffect, useState } from "react";
import {
  getProducts,
  getStockMovements,
  stockIn,
  stockOut,
} from "../../services/api";
import "./StockMovement.css";

function StockMovement() {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [type, setType] = useState("IN");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [quantity, setQuantity] = useState("");
  const [productId, setProductId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [productsResponse, movementsResponse] = await Promise.all([
        getProducts(),
        getStockMovements(),
      ]);

      setProducts(productsResponse.data);
      setMovements(movementsResponse.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load stock movement data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!productId || !quantity) {
      setError("Please select a product and enter quantity");
      return;
    }

    const numericQuantity = Number(quantity);

    if (!Number.isInteger(numericQuantity) || numericQuantity <= 0) {
      setError("Quantity must be a positive whole number");
      return;
    }

    const data = {
      product_id: Number(productId),
      quantity: numericQuantity,
    };

    try {
      if (type === "IN") {
        await stockIn(data);
      } else {
        await stockOut(data);
      }

      setMessage(`Stock ${type === "IN" ? "added" : "removed"} successfully`);

      setQuantity("");
      setProductId("");

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to process stock movement",
      );
    }
  };

  const filteredMovements = movements.filter((movement) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      movement.product_name?.toLowerCase().includes(searchValue) ||
      movement.sku?.toLowerCase().includes(searchValue);

    const matchesType = filterType === "All" || movement.type === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="page-container stock-page">
      <div className="page-header">
        <div>
          <h2>Stock Movement</h2>
          <p>Manage stock IN and OUT transactions</p>
        </div>
      </div>

      {message && <div className="stock-success">{message}</div>}

      {error && <div className="stock-error">{error}</div>}

      <section className="stock-form-card">
        <div className="stock-card-header">
          <div>
            <h3>Record Stock Movement</h3>
            <p>Add or remove inventory stock</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="stock-form-grid">
            <div className="stock-form-group">
              <label>Movement Type</label>

              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setError("");
                  setMessage("");
                }}
              >
                <option value="IN">Stock IN</option>
                <option value="OUT">Stock OUT</option>
              </select>
            </div>

            <div className="stock-form-group">
              <label>Product</label>

              <select
                value={productId}
                onChange={(e) => {
                  setProductId(e.target.value);
                  setError("");
                  setMessage("");
                }}
                required
              >
                <option value="">Select Product</option>

                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.sku}) — Stock: {product.quantity}
                  </option>
                ))}
              </select>
            </div>

            <div className="stock-form-group">
              <label>Quantity</label>

              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                required
              />
            </div>

            <div className="stock-form-action">
              <button
                type="submit"
                className={
                  type === "IN" ? "stock-in-button" : "stock-out-button"
                }
              >
                {type === "IN" ? "Add Stock" : "Remove Stock"}
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className="stock-card">
        <div className="stock-card-header stock-toolbar">
          <div>
            <h3>Movement History</h3>
            <p>{filteredMovements.length} movements found</p>
          </div>

          <div className="stock-filters">
            <input
              type="text"
              placeholder="Search product or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="IN">Stock IN</option>
              <option value="OUT">Stock OUT</option>
            </select>
          </div>
        </div>

        {filteredMovements.length === 0 ? (
          <div className="stock-empty">No stock movements found.</div>
        ) : (
          <div className="stock-table-container">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Previous Stock</th>
                  <th>New Stock</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredMovements.map((movement) => (
                  <tr key={movement.id}>
                    <td>
                      <strong>{movement.product_name}</strong>
                    </td>

                    <td>
                      <span className="stock-sku">{movement.sku}</span>
                    </td>

                    <td>
                      <span
                        className={
                          movement.type === "IN"
                            ? "stock-badge stock-badge-in"
                            : "stock-badge stock-badge-out"
                        }
                      >
                        {movement.type}
                      </span>
                    </td>

                    <td>
                      <strong>{movement.quantity}</strong>
                    </td>

                    <td>{movement.previous_quantity}</td>

                    <td>
                      <strong>{movement.new_quantity}</strong>
                    </td>

                    <td>{new Date(movement.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default StockMovement;
