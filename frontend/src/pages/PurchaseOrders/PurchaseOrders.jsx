import { useEffect, useState } from "react";
import {
  getSuppliers,
  getProducts,
  getPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrderStatus,
} from "../../services/api";
import "./PurchaseOrders.css";

function PurchaseOrders() {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    supplier_id: "",
    product_id: "",
    quantity: "",
  });

  const loadData = async () => {
    try {
      const [suppliersResponse, productsResponse, ordersResponse] =
        await Promise.all([getSuppliers(), getProducts(), getPurchaseOrders()]);

      setSuppliers(suppliersResponse.data);
      setProducts(productsResponse.data);
      setOrders(ordersResponse.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load purchase order data");
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
      await createPurchaseOrder({
        supplier_id: Number(form.supplier_id),
        product_id: Number(form.product_id),
        quantity: Number(form.quantity),
      });

      setMessage("Purchase order created successfully");

      setForm({
        supplier_id: "",
        product_id: "",
        quantity: "",
      });

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create purchase order",
      );
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setMessage("");
    setError("");

    try {
      const response = await updatePurchaseOrderStatus(id, status);

      setMessage(response.data.message);
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update purchase order",
      );
    }
  };

  return (
    <div className="page-container purchase-orders-page">
      <div className="page-header">
        <div>
          <h2>Purchase Orders</h2>
          <p>Create and manage supplier purchase orders</p>
        </div>
      </div>

      {message && <div className="purchase-success">{message}</div>}

      {error && <div className="purchase-error">{error}</div>}

      <section className="purchase-form-card">
        <div className="purchase-card-header">
          <div>
            <h3>Create Purchase Order</h3>
            <p>Order stock from a supplier</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="purchase-form-grid">
            <div className="purchase-form-group">
              <label>Supplier</label>

              <select
                name="supplier_id"
                value={form.supplier_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Supplier</option>

                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="purchase-form-group">
              <label>Product</label>

              <select
                name="product_id"
                value={form.product_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Product</option>

                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </option>
                ))}
              </select>
            </div>

            <div className="purchase-form-group">
              <label>Quantity</label>

              <input
                type="number"
                name="quantity"
                min="1"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                required
              />
            </div>

            <div className="purchase-form-action">
              <button type="submit" className="purchase-primary-button">
                Create Order
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className="purchase-card">
        <div className="purchase-card-header">
          <div>
            <h3>Purchase Order History</h3>
            <p>{orders.length} orders found</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="purchase-empty">No purchase orders found.</div>
        ) : (
          <div className="purchase-table-container">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Supplier</th>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>#{order.id}</strong>
                    </td>

                    <td>{order.supplier_name}</td>

                    <td>{order.product_name}</td>

                    <td>
                      <span className="purchase-sku">{order.sku}</span>
                    </td>

                    <td>
                      <strong>{order.quantity}</strong>
                    </td>

                    <td>
                      <span
                        className={
                          order.status === "Pending"
                            ? "purchase-badge badge-pending"
                            : order.status === "Received"
                              ? "purchase-badge badge-received"
                              : "purchase-badge badge-cancelled"
                        }
                      >
                        {order.status}
                      </span>
                    </td>

                    <td>{new Date(order.order_date).toLocaleDateString()}</td>

                    <td>
                      {order.status === "Pending" ? (
                        <div className="purchase-actions">
                          <button
                            className="purchase-receive-button"
                            onClick={() =>
                              handleStatusUpdate(order.id, "Received")
                            }
                          >
                            Receive
                          </button>

                          <button
                            className="purchase-cancel-button"
                            onClick={() =>
                              handleStatusUpdate(order.id, "Cancelled")
                            }
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className="purchase-muted">No actions</span>
                      )}
                    </td>
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

export default PurchaseOrders;
