import { useEffect, useState } from "react";
import { getWarehouses, createWarehouse } from "../../services/api";
import "./Warehouses.css";

function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    location: "",
    capacity: "",
  });

  const loadWarehouses = async () => {
    try {
      const response = await getWarehouses();
      setWarehouses(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load warehouses");
    }
  };

  useEffect(() => {
    loadWarehouses();
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
      await createWarehouse({
        name: form.name,
        location: form.location,
        capacity: Number(form.capacity),
      });

      setMessage("Warehouse added successfully");

      setForm({
        name: "",
        location: "",
        capacity: "",
      });

      setShowForm(false);
      await loadWarehouses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add warehouse");
    }
  };

  return (
    <div className="page-container warehouses-page">
      <div className="page-header">
        <div>
          <h2>Warehouses</h2>
          <p>Manage warehouse locations and stock capacity</p>
        </div>

        <button
          className="warehouses-primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "+ Add Warehouse"}
        </button>
      </div>

      {message && <div className="warehouses-success">{message}</div>}

      {error && <div className="warehouses-error">{error}</div>}

      {showForm && (
        <section className="warehouses-form-card">
          <div className="warehouses-card-header">
            <div>
              <h3>Add New Warehouse</h3>
              <p>Enter warehouse information</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="warehouses-form-grid">
              <div className="warehouses-form-group">
                <label>Warehouse Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter warehouse name"
                  required
                />
              </div>

              <div className="warehouses-form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                  required
                />
              </div>

              <div className="warehouses-form-group">
                <label>Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  min="0"
                  value={form.capacity}
                  onChange={handleChange}
                  placeholder="Enter capacity"
                  required
                />
              </div>
            </div>

            <div className="warehouses-form-actions">
              <button type="submit" className="warehouses-primary-button">
                Add Warehouse
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="warehouses-card">
        <div className="warehouses-card-header">
          <div>
            <h3>Warehouse Overview</h3>
            <p>{warehouses.length} warehouses available</p>
          </div>
        </div>

        {warehouses.length === 0 ? (
          <div className="warehouses-empty">No warehouses found.</div>
        ) : (
          <div className="warehouses-table-container">
            <table>
              <thead>
                <tr>
                  <th>Warehouse</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Products</th>
                  <th>Total Stock</th>
                  <th>Utilization</th>
                </tr>
              </thead>

              <tbody>
                {warehouses.map((warehouse) => {
                  const utilization =
                    warehouse.capacity > 0
                      ? Math.min(
                          100,
                          Math.round(
                            (warehouse.total_stock / warehouse.capacity) * 100,
                          ),
                        )
                      : 0;

                  return (
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

                      <td>
                        <div className="warehouse-utilization">
                          <div className="utilization-bar">
                            <div
                              className="utilization-fill"
                              style={{
                                width: `${utilization}%`,
                              }}
                            />
                          </div>

                          <span>{utilization}%</span>
                        </div>
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

export default Warehouses;
