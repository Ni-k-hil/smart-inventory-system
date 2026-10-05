import { useEffect, useState } from "react";
import StatCard from "../../components/StatCard/StatCard";
import { getDashboardSummary, getWarehouses } from "../../services/api";
import "./Dashboard.css";

function Dashboard() {
  const [data, setData] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [dashboardResponse, warehouseResponse] = await Promise.all([
        getDashboardSummary(),
        getWarehouses(),
      ]);

      setData(dashboardResponse.data);
      setWarehouses(warehouseResponse.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="page-container dashboard-page">
        <div className="dashboard-loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container dashboard-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  const stats = data.statistics;

  return (
    <div className="page-container dashboard-page">
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Overview of your warehouse inventory</p>
        </div>

        <button className="dashboard-refresh-button" onClick={loadDashboard}>
          ↻ Refresh
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon="📦"
        />

        <StatCard title="Total Stock" value={stats.totalStock} icon="📊" />

        <StatCard title="Low Stock" value={stats.lowStockProducts} icon="⚠️" />

        <StatCard
          title="Out of Stock"
          value={stats.outOfStockProducts}
          icon="🚫"
        />
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Recent Stock Movements</h3>
              <p>Latest inventory changes</p>
            </div>
          </div>

          {data.recentMovements.length === 0 ? (
            <div className="empty-state">No stock movements found.</div>
          ) : (
            <div className="dashboard-table-container">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>New Stock</th>
                  </tr>
                </thead>

                <tbody>
                  {data.recentMovements.map((movement) => (
                    <tr key={movement.id}>
                      <td>
                        <strong>{movement.product_name}</strong>
                        <small>{movement.sku}</small>
                      </td>

                      <td>
                        <span
                          className={
                            movement.type === "IN"
                              ? "movement-badge movement-in"
                              : "movement-badge movement-out"
                          }
                        >
                          {movement.type}
                        </span>
                      </td>

                      <td>{movement.quantity}</td>
                      <td>{movement.new_quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Low Stock Alerts</h3>
              <p>Products requiring attention</p>
            </div>
          </div>

          {data.lowStockItems.length === 0 ? (
            <div className="success-state">✓ No low-stock products</div>
          ) : (
            <div className="low-stock-list">
              {data.lowStockItems.map((product) => (
                <div className="low-stock-item" key={product.id}>
                  <div>
                    <strong>{product.name}</strong>
                    <small>{product.sku}</small>
                  </div>

                  <div className="stock-warning">
                    <strong>{product.quantity}</strong>
                    <span>Min: {product.minimum_stock}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="dashboard-card warehouse-card">
        <div className="card-header">
          <div>
            <h3>Warehouse Stock Overview</h3>
            <p>Stock distribution across warehouses</p>
          </div>
        </div>

        {warehouses.length === 0 ? (
          <div className="empty-state">No warehouses found.</div>
        ) : (
          <div className="dashboard-table-container">
            <table>
              <thead>
                <tr>
                  <th>Warehouse</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Products</th>
                  <th>Total Stock</th>
                </tr>
              </thead>

              <tbody>
                {warehouses.map((warehouse) => (
                  <tr key={warehouse.id}>
                    <td>
                      <strong>{warehouse.name}</strong>
                    </td>
                    <td>{warehouse.location}</td>
                    <td>{warehouse.capacity}</td>
                    <td>{warehouse.product_count}</td>
                    <td>
                      <strong>{warehouse.total_stock}</strong>
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

export default Dashboard;
