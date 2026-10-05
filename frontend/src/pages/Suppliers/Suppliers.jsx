import { useEffect, useState } from "react";
import { getSuppliers, createSupplier } from "../../services/api";
import "./Suppliers.css";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const loadSuppliers = async () => {
    try {
      const response = await getSuppliers();
      setSuppliers(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load suppliers");
    }
  };

  useEffect(() => {
    loadSuppliers();
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
      await createSupplier(form);

      setMessage("Supplier added successfully");

      setForm({
        name: "",
        phone: "",
        email: "",
        address: "",
      });

      setShowForm(false);
      await loadSuppliers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add supplier");
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    const value = search.toLowerCase();

    return (
      supplier.name?.toLowerCase().includes(value) ||
      supplier.phone?.toLowerCase().includes(value) ||
      supplier.email?.toLowerCase().includes(value)
    );
  });

  return (
    <div className="page-container suppliers-page">
      <div className="page-header">
        <div>
          <h2>Suppliers</h2>
          <p>Manage your suppliers and vendor information</p>
        </div>

        <button
          className="suppliers-primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "+ Add Supplier"}
        </button>
      </div>

      {message && <div className="suppliers-success">{message}</div>}

      {error && <div className="suppliers-error">{error}</div>}

      {showForm && (
        <section className="suppliers-form-card">
          <div className="suppliers-card-header">
            <div>
              <h3>Add New Supplier</h3>
              <p>Enter supplier information</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="suppliers-form-grid">
              <div className="suppliers-form-group">
                <label>Supplier Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter supplier name"
                  required
                />
              </div>

              <div className="suppliers-form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="suppliers-form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />
              </div>

              <div className="suppliers-form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                />
              </div>
            </div>

            <div className="suppliers-form-actions">
              <button type="submit" className="suppliers-primary-button">
                Add Supplier
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="suppliers-card">
        <div className="suppliers-card-header suppliers-toolbar">
          <div>
            <h3>Supplier Directory</h3>
            <p>{filteredSuppliers.length} suppliers found</p>
          </div>

          <input
            className="suppliers-search"
            type="text"
            placeholder="Search supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredSuppliers.length === 0 ? (
          <div className="suppliers-empty">No suppliers found.</div>
        ) : (
          <div className="suppliers-table-container">
            <table>
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                </tr>
              </thead>

              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id}>
                    <td>
                      <strong>{supplier.name}</strong>
                    </td>

                    <td>{supplier.phone || "—"}</td>

                    <td>{supplier.email || "—"}</td>

                    <td>{supplier.address || "—"}</td>
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

export default Suppliers;
