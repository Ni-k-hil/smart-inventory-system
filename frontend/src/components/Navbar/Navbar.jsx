import "./Navbar.css";

function Navbar({ role, setRole }) {
  return (
    <header className="navbar">
      <div className="navbar-title">
        <h1>Inventory Management</h1>
        <p>Smart Inventory & Warehouse Management System</p>
      </div>

      <div className="navbar-user">
        <div className="navbar-avatar">{role.charAt(0)}</div>

        <div className="navbar-user-details">
          <strong>{role}</strong>

          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Admin">Admin</option>
            <option value="Warehouse Manager">Warehouse Manager</option>
            <option value="Staff">Staff</option>
          </select>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
