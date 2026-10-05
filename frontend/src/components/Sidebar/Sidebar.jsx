import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ role }) {
  const canManageSuppliers = role === "Admin" || role === "Warehouse Manager";

  const canManagePurchaseOrders =
    role === "Admin" || role === "Warehouse Manager";

  const canManageWarehouses = role === "Admin" || role === "Warehouse Manager";

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">📦</div>

        <div>
          <h2>SmartStock</h2>
          <p>Warehouse System</p>
        </div>
      </div>

      <div className="sidebar-section">
        <span>MAIN MENU</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end>
          <span className="nav-icon">📊</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/products">
          <span className="nav-icon">📦</span>
          <span>Products</span>
        </NavLink>

        <NavLink to="/stock">
          <span className="nav-icon">🔄</span>
          <span>Stock Movement</span>
        </NavLink>

        {canManageSuppliers && (
          <NavLink to="/suppliers">
            <span className="nav-icon">🚚</span>
            <span>Suppliers</span>
          </NavLink>
        )}

        {canManagePurchaseOrders && (
          <NavLink to="/purchase-orders">
            <span className="nav-icon">🧾</span>
            <span>Purchase Orders</span>
          </NavLink>
        )}

        {canManageWarehouses && (
          <NavLink to="/warehouses">
            <span className="nav-icon">🏭</span>
            <span>Warehouses</span>
          </NavLink>
        )}

        <NavLink to="/reports">
          <span className="nav-icon">📈</span>
          <span>Reports</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="system-status">
          <span className="status-dot"></span>

          <div>
            <strong>System Online</strong>
            <small>All services operational</small>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
