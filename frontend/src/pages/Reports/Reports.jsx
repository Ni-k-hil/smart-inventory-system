import { useEffect, useState } from "react";
import { getDashboardSummary } from "../../services/api";
import "./Reports.css";

function Reports() {
  const [data, setData] = useState({
    statistics: {},
    recentMovements: [],
    lowStockItems: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = async () => {
    try {
      setLoading(true);
      const response = await getDashboardSummary();
      setData(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  if (loading) {
    return (
      <div className="page-container reports-page">
        <div className="reports-loading">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="page-container reports-page">
      <div className="page-header">
        <div>
          <h2>Reports</h2>
          <p>Inventory and warehouse performance overview</p>
        </div>

        <button className="reports-refresh-button" onClick={loadReport}>
          Refresh Report
        </button>
      </div>

      {error && <div className="reports-error">{error}</div>}

      <section className="reports-summary-grid">
        <div className="reports-summary-card">
          <span>Total Products</span>
          <strong>{data.statistics.totalProducts || 0}</strong>
        </div>

        <div className="reports-summary-card">
          <span>Total Stock</span>
          <strong>{data.statistics.totalStock || 0}</strong>
        </div>

        <div className="reports-summary-card">
          <span>Low Stock Items</span>
          <strong>{data.statistics.lowStockItems || 0}</strong>
        </div>

        <div className="reports-summary-card">
          <span>Stock Movements</span>
          <strong>{data.statistics.totalMovements || 0}</strong>
        </div>
      </section>

      <div className="reports-grid">
        <section className="reports-card">
          <div className="reports-card-header">
            <div>
              <h3>Low Stock Report</h3>
              <p>Products requiring attention</p>
            </div>
          </div>

          {data.lowStockItems.length === 0 ? (
            <div className="reports-empty">No low stock products.</div>
          ) : (
            <div className="reports-table-container">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Current Stock</th>
                    <th>Minimum Stock</th>
                  </tr>
                </thead>

                <tbody>
                  {data.lowStockItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.name}</strong>
                      </td>
                      <td>{item.sku}</td>
                      <td>
                        <span className="reports-low-stock">
                          {item.quantity}
                        </span>
                      </td>
                      <td>{item.minimum_stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="reports-card">
          <div className="reports-card-header">
            <div>
              <h3>Recent Movements</h3>
              <p>Latest inventory activity</p>
            </div>
          </div>

          {data.recentMovements.length === 0 ? (
            <div className="reports-empty">No stock movements found.</div>
          ) : (
            <div className="reports-movement-list">
              {data.recentMovements.map((movement) => (
                <div className="reports-movement-item" key={movement.id}>
                  <div
                    className={`reports-movement-icon ${
                      movement.type === "IN" ? "movement-in" : "movement-out"
                    }`}
                  >
                    {movement.type === "IN" ? "↓" : "↑"}
                  </div>

                  <div className="reports-movement-details">
                    <strong>{movement.product_name}</strong>
                    <span>
                      {movement.type === "IN" ? "Stock In" : "Stock Out"}
                    </span>
                  </div>

                  <div
                    className={`reports-movement-quantity ${
                      movement.type === "IN" ? "quantity-in" : "quantity-out"
                    }`}
                  >
                    {movement.type === "IN" ? "+" : "-"}
                    {movement.quantity}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Reports;
