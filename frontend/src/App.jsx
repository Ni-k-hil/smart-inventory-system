import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Products from "./pages/Products/Products";
import StockMovement from "./pages/StockMovement/StockMovement";
import Suppliers from "./pages/Suppliers/Suppliers";
import PurchaseOrders from "./pages/PurchaseOrders/PurchaseOrders";
import Reports from "./pages/Reports/Reports";
import Warehouses from "./pages/Warehouses/Warehouses";
import "./App.css";

function App() {
  const [role, setRole] = useState(localStorage.getItem("userRole") || "Admin");

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar role={role} />

        <div className="main-area">
          <Navbar
            role={role}
            setRole={(newRole) => {
              setRole(newRole);
              localStorage.setItem("userRole", newRole);
            }}
          />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/stock" element={<StockMovement />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/purchase-orders" element={<PurchaseOrders />} />
              <Route path="/warehouses" element={<Warehouses />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
